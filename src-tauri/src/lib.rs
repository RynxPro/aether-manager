use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Mod {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub thumbnail: Option<String>,
    pub is_active: bool,
    pub date_added: String,
    pub character: Option<String>,
    pub file_path: String,
    pub original_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Preset {
    pub id: String,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
    pub mod_ids: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub zzmi_mods_path: Option<String>, // Path to zzmi/mods folder for active mods
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModStats {
    pub installed_mods: usize,
    pub active_mods: usize,
    pub inactive_mods: usize,
    pub presets: usize,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_mods() -> Result<Vec<Mod>, String> {
    load_all_mods().await
}

#[tauri::command]
#[allow(non_snake_case)]
async fn install_mod(
    filePath: String,
    title: String,
    character: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
) -> Result<Mod, String> {
    println!(
        "Installing mod: title={}, filePath={}, character={:?}",
        title, filePath, character
    );

    let mod_id = Uuid::new_v4().to_string();
    let now = Utc::now();

    // Validate folder exists
    if !Path::new(&filePath).exists() {
        let error = format!("Folder does not exist: {}", filePath);
        println!("Error: {}", error);
        return Err(error);
    }

    if !Path::new(&filePath).is_dir() {
        let error = format!("Path must be a folder, not a file: {}", filePath);
        println!("Error: {}", error);
        return Err(error);
    }

    // Use app-managed mods folder
    let app_data_path = get_app_config_dir()?
        .join("mods")
        .to_string_lossy()
        .to_string();

    // Determine storage folder based on character
    let storage_folder = if let Some(ref char_name) = character {
        format!("{}/characters/{}", app_data_path, char_name)
    } else {
        format!("{}/othermods", app_data_path)
    };

    // Create storage directory if it doesn't exist
    println!("Creating storage directory: {}", storage_folder);
    fs::create_dir_all(&storage_folder).map_err(|e| {
        let error = format!("Failed to create storage directory: {}", e);
        println!("Error: {}", error);
        error
    })?;

    // Get original filename and create destination path
    let original_name = Path::new(&filePath)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();

    let destination_path = format!("{}/{}", storage_folder, original_name);
    println!("Copying from {} to {}", filePath, destination_path);

    // Copy folder to storage location
    copy_dir_all(&filePath, &destination_path).map_err(|e| {
        let error = format!("Failed to copy mod folder: {}", e);
        println!("Error: {}", error);
        error
    })?;

    let new_mod = Mod {
        id: mod_id,
        title,
        description,
        thumbnail,
        is_active: false,
        date_added: now.to_rfc3339(),
        character,
        file_path: destination_path,
        original_name: original_name.clone(),
    };

    // Save mod metadata
    save_mod_metadata(&new_mod).await?;

    Ok(new_mod)
}

#[tauri::command]
#[allow(non_snake_case)]
async fn toggle_mod_active(modId: String) -> Result<bool, String> {
    println!("Toggling mod active: modId={}", modId);

    let mut mods = load_all_mods().await?;
    let mod_index = mods
        .iter()
        .position(|m| m.id == modId)
        .ok_or("Mod not found")?;

    let mod_ref = &mut mods[mod_index];
    let settings = load_settings().await?;
    let zzmi_path = settings
        .zzmi_mods_path
        .ok_or("ZZMI mods path not configured. Please set it in settings.")?;

    // Create zzmi mods directory if it doesn't exist
    fs::create_dir_all(&zzmi_path)
        .map_err(|e| format!("Failed to create ZZMI mods directory: {}", e))?;

    let zzmi_file_path = format!("{}/{}", zzmi_path, mod_ref.original_name);
    println!("ZZMI path: {}, File path: {}", zzmi_path, zzmi_file_path);

    if mod_ref.is_active {
        // Deactivate: Remove from zzmi/mods folder
        println!("Deactivating mod: removing from {}", zzmi_file_path);
        if Path::new(&zzmi_file_path).exists() {
            if Path::new(&zzmi_file_path).is_dir() {
                fs::remove_dir_all(&zzmi_file_path)
                    .map_err(|e| format!("Failed to remove mod folder from ZZMI: {}", e))?;
            } else {
                fs::remove_file(&zzmi_file_path)
                    .map_err(|e| format!("Failed to remove mod file from ZZMI: {}", e))?;
            }
        }
        mod_ref.is_active = false;
    } else {
        // Activate: Copy to zzmi/mods folder
        println!(
            "Activating mod: copying from {} to {}",
            mod_ref.file_path, zzmi_file_path
        );
        if Path::new(&mod_ref.file_path).is_dir() {
            copy_dir_all(&mod_ref.file_path, &zzmi_file_path)
                .map_err(|e| format!("Failed to copy mod folder to ZZMI: {}", e))?;
        } else {
            fs::copy(&mod_ref.file_path, &zzmi_file_path)
                .map_err(|e| format!("Failed to copy mod file to ZZMI: {}", e))?;
        }
        mod_ref.is_active = true;
        println!("Mod activated successfully");
    }

    // Save updated mod metadata
    save_mod_metadata(mod_ref).await?;

    Ok(mod_ref.is_active)
}

#[tauri::command]
#[allow(non_snake_case)]
async fn update_mod(
    modId: String,
    title: Option<String>,
    thumbnail: Option<String>,
    description: Option<String>,
) -> Result<(), String> {
    let mut mods = load_all_mods().await?;
    let mod_index = mods
        .iter()
        .position(|m| m.id == modId)
        .ok_or("Mod not found")?;

    let mod_ref = &mut mods[mod_index];

    // Update fields if provided
    if let Some(new_title) = title {
        mod_ref.title = new_title;
    }
    if let Some(new_thumbnail) = thumbnail {
        mod_ref.thumbnail = Some(new_thumbnail);
    }
    if let Some(new_description) = description {
        mod_ref.description = Some(new_description);
    }

    // Save updated mod metadata
    save_mod_metadata(mod_ref).await?;

    Ok(())
}

#[tauri::command]
#[allow(non_snake_case)]
async fn delete_mod(modId: String) -> Result<(), String> {
    let mods = load_all_mods().await?;
    let mod_index = mods
        .iter()
        .position(|m| m.id == modId)
        .ok_or("Mod not found")?;

    let mod_to_delete = &mods[mod_index];

    // Remove from zzmi/mods if active
    if mod_to_delete.is_active {
        let settings = load_settings().await?;
        if let Some(zzmi_path) = settings.zzmi_mods_path {
            let zzmi_file_path = format!("{}/{}", zzmi_path, mod_to_delete.original_name);
            if Path::new(&zzmi_file_path).exists() {
                if Path::new(&zzmi_file_path).is_dir() {
                    fs::remove_dir_all(&zzmi_file_path)
                        .map_err(|e| format!("Failed to remove mod folder from ZZMI: {}", e))?;
                } else {
                    fs::remove_file(&zzmi_file_path)
                        .map_err(|e| format!("Failed to remove mod file from ZZMI: {}", e))?;
                }
            }
        }
    }

    // Remove from storage location
    if Path::new(&mod_to_delete.file_path).exists() {
        if Path::new(&mod_to_delete.file_path).is_dir() {
            fs::remove_dir_all(&mod_to_delete.file_path)
                .map_err(|e| format!("Failed to remove mod folder: {}", e))?;
        } else {
            fs::remove_file(&mod_to_delete.file_path)
                .map_err(|e| format!("Failed to remove mod file: {}", e))?;
        }
    }

    // Remove metadata
    remove_mod_metadata(&modId).await?;

    Ok(())
}

#[tauri::command]
async fn get_mod_stats() -> Result<ModStats, String> {
    let mods = load_all_mods().await.unwrap_or_default();

    let installed_mods = mods.len();
    let active_mods = mods.iter().filter(|m| m.is_active).count();
    let inactive_mods = installed_mods - active_mods;

    let presets_count = load_all_presets().await.map(|v| v.len()).unwrap_or(0);

    Ok(ModStats {
        installed_mods,
        active_mods,
        inactive_mods,
        presets: presets_count,
    })
}

#[tauri::command]
async fn get_settings() -> Result<AppSettings, String> {
    load_settings().await
}

#[tauri::command]
async fn update_settings(settings: AppSettings) -> Result<(), String> {
    save_settings(&settings).await
}

#[tauri::command]
async fn select_folder(title: String, initial_dir: Option<String>) -> Result<Option<String>, String> {
    use rfd::FileDialog;

    let mut dialog = FileDialog::new();
    dialog = dialog.set_title(&title);
    if let Some(dir) = initial_dir {
        if !dir.is_empty() {
            dialog = dialog.set_directory(dir);
        }
    }

    let folder = dialog.pick_folder();

    Ok(folder.map(|p| p.to_string_lossy().to_string()))
}

#[tauri::command]
async fn select_mod_file() -> Result<Option<String>, String> {
    use rfd::FileDialog;

    let file = FileDialog::new()
        .set_title("Select Mod File")
        .pick_file();

    Ok(file.map(|p| p.to_string_lossy().to_string()))
}

#[tauri::command]
async fn select_mod_folder(initial_dir: Option<String>) -> Result<Option<String>, String> {
    use rfd::FileDialog;

    let mut dialog = FileDialog::new();
    dialog = dialog.set_title("Select Mod Folder");
    if let Some(dir) = initial_dir {
        if !dir.is_empty() {
            dialog = dialog.set_directory(dir);
        }
    }

    let folder = dialog.pick_folder();

    Ok(folder.map(|p| p.to_string_lossy().to_string()))
}

// Helper functions for file operations
async fn load_settings() -> Result<AppSettings, String> {
    let settings_path = get_app_config_dir()?.join("settings.json");

    if !settings_path.exists() {
        // Create default settings with app-managed paths
        let default_settings = AppSettings {
            zzmi_mods_path: None,
        };

        // Save default settings
        save_settings(&default_settings).await?;
        return Ok(default_settings);
    }

    let content = fs::read_to_string(&settings_path)
        .map_err(|e| format!("Failed to read settings: {}", e))?;

    serde_json::from_str(&content).map_err(|e| format!("Failed to parse settings: {}", e))
}

async fn save_settings(settings: &AppSettings) -> Result<(), String> {
    let config_dir = get_app_config_dir()?;
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;

    let settings_path = config_dir.join("settings.json");
    let content = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;

    fs::write(&settings_path, content).map_err(|e| format!("Failed to write settings: {}", e))
}

async fn load_all_mods() -> Result<Vec<Mod>, String> {
    let app_data_path = get_app_config_dir()?
        .join("mods")
        .to_string_lossy()
        .to_string();
    let mods_db_path = Path::new(&app_data_path).join("mods.json");

    if !mods_db_path.exists() {
        return Ok(vec![]);
    }

    let content = fs::read_to_string(&mods_db_path)
        .map_err(|e| format!("Failed to read mods database: {}", e))?;

    serde_json::from_str(&content).map_err(|e| format!("Failed to parse mods database: {}", e))
}

async fn save_mod_metadata(new_mod: &Mod) -> Result<(), String> {
    let mut mods = load_all_mods().await.unwrap_or_default();

    // Update existing or add new
    if let Some(index) = mods.iter().position(|m| m.id == new_mod.id) {
        mods[index] = new_mod.clone();
    } else {
        mods.push(new_mod.clone());
    }

    save_all_mods(&mods).await
}

async fn remove_mod_metadata(mod_id: &str) -> Result<(), String> {
    let mut mods = load_all_mods().await.unwrap_or_default();
    mods.retain(|m| m.id != mod_id);
    save_all_mods(&mods).await
}

async fn save_all_mods(mods: &[Mod]) -> Result<(), String> {
    let app_data_path = get_app_config_dir()?
        .join("mods")
        .to_string_lossy()
        .to_string();

    fs::create_dir_all(&app_data_path)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;

    let mods_db_path = Path::new(&app_data_path).join("mods.json");
    let content = serde_json::to_string_pretty(mods)
        .map_err(|e| format!("Failed to serialize mods: {}", e))?;

    fs::write(&mods_db_path, content).map_err(|e| format!("Failed to write mods database: {}", e))
}

fn get_app_config_dir() -> Result<PathBuf, String> {
    dirs::config_dir()
        .map(|p| p.join("aether-manager"))
        .ok_or("Failed to get app config directory".to_string())
}

fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> std::io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

// ===== Presets persistence =====
async fn presets_db_path() -> Result<PathBuf, String> {
    let base = get_app_config_dir()?;
    let dir = base.join("mods");
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create presets directory: {}", e))?;
    Ok(dir.join("presets.json"))
}

async fn load_all_presets() -> Result<Vec<Preset>, String> {
    let path = presets_db_path().await?;
    if !path.exists() {
        return Ok(vec![]);
    }
    let content =
        fs::read_to_string(&path).map_err(|e| format!("Failed to read presets DB: {}", e))?;
    serde_json::from_str(&content).map_err(|e| format!("Failed to parse presets DB: {}", e))
}

async fn save_all_presets(presets: &[Preset]) -> Result<(), String> {
    let path = presets_db_path().await?;
    let content = serde_json::to_string_pretty(presets)
        .map_err(|e| format!("Failed to serialize presets: {}", e))?;
    fs::write(&path, content).map_err(|e| format!("Failed to write presets DB: {}", e))
}

// ===== Presets commands =====
#[tauri::command]
async fn list_presets() -> Result<Vec<Preset>, String> {
    load_all_presets().await
}

#[tauri::command]
async fn create_preset(name: String, mod_ids: Option<Vec<String>>) -> Result<Preset, String> {
    let final_mod_ids = if let Some(ids) = mod_ids {
        ids
    } else {
        // Fallback to active mods if no ids are provided
        let mods = load_all_mods().await?;
        mods.into_iter()
            .filter(|m| m.is_active)
            .map(|m| m.id)
            .collect()
    };

    let now = Utc::now().to_rfc3339();
    let preset = Preset {
        id: Uuid::new_v4().to_string(),
        name,
        created_at: now.clone(),
        updated_at: now,
        mod_ids: final_mod_ids,
    };

    let mut all = load_all_presets().await.unwrap_or_default();
    all.push(preset.clone());
    save_all_presets(&all).await?;
    Ok(preset)
}

#[tauri::command]
async fn delete_preset(preset_id: String) -> Result<(), String> {
    let mut all = load_all_presets().await.unwrap_or_default();
    let len_before = all.len();
    all.retain(|p| p.id != preset_id);
    if all.len() == len_before {
        return Err("Preset not found".into());
    }
    save_all_presets(&all).await
}

#[tauri::command]
async fn update_preset(
    preset_id: String,
    name: String,
    mod_ids: Vec<String>,
) -> Result<(), String> {
    let mut all = load_all_presets().await?;
    if let Some(preset) = all.iter_mut().find(|p| p.id == preset_id) {
        preset.name = name;
        preset.mod_ids = mod_ids;
        preset.updated_at = Utc::now().to_rfc3339();
        save_all_presets(&all).await
    } else {
        Err("Preset not found".to_string())
    }
}

#[tauri::command]
async fn apply_preset(preset_id: String) -> Result<(), String> {
    let presets = load_all_presets().await?;
    let preset = presets
        .into_iter()
        .find(|p| p.id == preset_id)
        .ok_or("Preset not found")?;

    let mut mods = load_all_mods().await?;
    let desired: HashSet<String> = preset.mod_ids.iter().cloned().collect();

    let settings = load_settings().await?;
    let zzmi_path = settings
        .zzmi_mods_path
        .ok_or("ZZMI mods path not configured. Please set it in settings.")?;
    fs::create_dir_all(&zzmi_path)
        .map_err(|e| format!("Failed to create ZZMI mods directory: {}", e))?;

    for m in mods.iter_mut() {
        let should_be_active = desired.contains(&m.id);
        let zzmi_file_path = format!("{}/{}", zzmi_path, m.original_name);

        if should_be_active && !m.is_active {
            if Path::new(&m.file_path).is_dir() {
                copy_dir_all(&m.file_path, &zzmi_file_path)
                    .map_err(|e| format!("Failed to copy mod folder to ZZMI: {}", e))?;
            } else {
                fs::copy(&m.file_path, &zzmi_file_path)
                    .map_err(|e| format!("Failed to copy mod file to ZZMI: {}", e))?;
            }
            m.is_active = true;
        } else if !should_be_active && m.is_active {
            if Path::new(&zzmi_file_path).exists() {
                if Path::new(&zzmi_file_path).is_dir() {
                    fs::remove_dir_all(&zzmi_file_path)
                        .map_err(|e| format!("Failed to remove mod folder from ZZMI: {}", e))?;
                } else {
                    fs::remove_file(&zzmi_file_path)
                        .map_err(|e| format!("Failed to remove mod file from ZZMI: {}", e))?;
                }
            }
            m.is_active = false;
        }
    }

    save_all_mods(&mods).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_mods,
            install_mod,
            toggle_mod_active,
            update_mod,
            delete_mod,
            get_mod_stats,
            get_settings,
            update_settings,
            select_folder,
            select_mod_folder,
            select_mod_file,
            list_presets,
            create_preset,
            delete_preset,
            update_preset,
            apply_preset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
