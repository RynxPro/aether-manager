use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use uuid::Uuid;
use chrono::Utc;

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
pub struct AppSettings {
    pub zzmi_mods_path: Option<String>, // Path to zzmi/mods folder for active mods
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
async fn install_mod(filePath: String, title: String, character: Option<String>, description: Option<String>) -> Result<Mod, String> {
    println!("Installing mod: title={}, filePath={}, character={:?}", title, filePath, character);
    
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
    let app_data_path = get_app_config_dir()?.join("mods").to_string_lossy().to_string();
    
    // Determine storage folder based on character
    let storage_folder = if let Some(ref char_name) = character {
        format!("{}/characters/{}", app_data_path, char_name)
    } else {
        format!("{}/othermods", app_data_path)
    };
    
    // Create storage directory if it doesn't exist
    println!("Creating storage directory: {}", storage_folder);
    fs::create_dir_all(&storage_folder)
        .map_err(|e| {
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
    copy_dir_all(&filePath, &destination_path)
        .map_err(|e| {
            let error = format!("Failed to copy mod folder: {}", e);
            println!("Error: {}", error);
            error
        })?;
    
    let new_mod = Mod {
        id: mod_id.clone(),
        title,
        description,
        thumbnail: None,
        is_active: false,
        date_added: now.to_rfc3339(),
        character,
        file_path: destination_path,
        original_name,
    };
    
    // Save mod metadata
    save_mod_metadata(&new_mod).await?;
    
    Ok(new_mod)
}

#[tauri::command]
async fn toggle_mod_active(modId: String) -> Result<bool, String> {
    println!("Toggling mod active: modId={}", modId);
    
    let mut mods = load_all_mods().await?;
    let mod_index = mods.iter().position(|m| m.id == modId)
        .ok_or("Mod not found")?;
    
    let mod_ref = &mut mods[mod_index];
    let settings = load_settings().await?;
    let zzmi_path = settings.zzmi_mods_path
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
        println!("Activating mod: copying from {} to {}", mod_ref.file_path, zzmi_file_path);
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
async fn delete_mod(modId: String) -> Result<(), String> {
    let mods = load_all_mods().await?;
    let mod_index = mods.iter().position(|m| m.id == modId)
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
    
    Ok(ModStats {
        installed_mods,
        active_mods,
        inactive_mods,
        presets: 0, // TODO: Implement presets functionality
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
async fn select_folder(title: String) -> Result<Option<String>, String> {
    use rfd::FileDialog;
    
    let folder = FileDialog::new()
        .set_title(&title)
        .pick_folder();
    
    Ok(folder.map(|p| p.to_string_lossy().to_string()))
}

#[tauri::command]
async fn select_mod_folder() -> Result<Option<String>, String> {
    use rfd::FileDialog;
    
    let folder = FileDialog::new()
        .set_title("Select Mod Folder")
        .pick_folder();
    
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
    
    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse settings: {}", e))
}

async fn save_settings(settings: &AppSettings) -> Result<(), String> {
    let config_dir = get_app_config_dir()?;
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;
    
    let settings_path = config_dir.join("settings.json");
    let content = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;
    
    fs::write(&settings_path, content)
        .map_err(|e| format!("Failed to write settings: {}", e))
}

async fn load_all_mods() -> Result<Vec<Mod>, String> {
    let app_data_path = get_app_config_dir()?.join("mods").to_string_lossy().to_string();
    let mods_db_path = Path::new(&app_data_path).join("mods.json");
    
    if !mods_db_path.exists() {
        return Ok(vec![]);
    }
    
    let content = fs::read_to_string(&mods_db_path)
        .map_err(|e| format!("Failed to read mods database: {}", e))?;
    
    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse mods database: {}", e))
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
    let app_data_path = get_app_config_dir()?.join("mods").to_string_lossy().to_string();
    
    fs::create_dir_all(&app_data_path)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    
    let mods_db_path = Path::new(&app_data_path).join("mods.json");
    let content = serde_json::to_string_pretty(mods)
        .map_err(|e| format!("Failed to serialize mods: {}", e))?;
    
    fs::write(&mods_db_path, content)
        .map_err(|e| format!("Failed to write mods database: {}", e))
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_mods,
            install_mod,
            toggle_mod_active,
            delete_mod,
            get_mod_stats,
            get_settings,
            update_settings,
            select_folder,
            select_mod_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
