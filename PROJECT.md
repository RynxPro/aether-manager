# ZZZ Mod Manager (Tauri + React + Tailwind)

This is a desktop app for managing Zenless Zone Zero mods.  
It is built with **Tauri (Rust backend)**, **React (Vite)**, and **Tailwind CSS**.  
The app should be lightweight, modern, and responsive, with a clean UI.

---

## Pages

### 1. DashboardPage

- Shows stats (installed mods, active mods, inactive mods, presets).
- Displays all mods as `ModCards`.

### 2. ModPage

- Detailed view of a mod.
- Shows title, date added, and thumbnail (editable by user via link).
- Has activate/deactivate button.

### 3. CharactersPage

- Shows a list of `CharacterCards`.
- Each card displays: character icon, name, number of installed mods, number of active mods.

### 4. CharacterModPage

- Detailed view of a character.
- Shows big `CharacterCard` with icon + description.
- Lists all `ModCards` for that character.
- Includes a button to upload a new mod for that character.

### 5. SettingsPage

- Lets the user set the `zzmi/mods` folder path.

---

## Components

- `StatsCard` → shows one stat (title + value).
- `ModCard` → displays mod info (title, thumbnail, activate/deactivate button).
- `CharacterCard` → displays character info (icon, name, mod counts).

---

## Hooks

Custom hooks for managing state and IPC:

- `useMods` → fetch all mods from Tauri backend.
- `useCharacters` → fetch character data and mods.
- `useSettings` → load and update settings (like mods folder path).
- `useStats` → calculate counts (installed, active, inactive, presets).

---

## Utils

Helper functions:

- `formatDate` → format mod creation date.
- `countActiveMods` → count how many mods are active.
- `filterModsByCharacter` → return mods belonging to a character.
- `validateImageUrl` → check if thumbnail links are valid.

---

## Features

- Activate/deactivate mods.
- Show stats (installed, active, inactive, presets).
- Upload new mods to a character.
- Save user settings (mods folder path).
- All data comes from the filesystem via Tauri backend commands.

---

## Style

- Tailwind CSS for styling.
- Dark-themed UI by default.
- Responsive layout.
- Clean and modern (rounded corners, card-based design).

---

## Goals

1. Build a lightweight desktop app that manages mods.
2. Keep React components clean by separating logic into hooks and helpers into utils.
3. Ensure all filesystem operations go through Tauri commands (Rust backend).
