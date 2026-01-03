# Roomboy Admin Client

## Project Overview
The Admin UI for Roomboy, facilitating the management of properties, rooms, and dynamic field configurations. It provides a secure interface for administrators and connects to the Roomboy API.

> **Note**: This is the Admin-only application. The public client UI is separate.

## Tech Stack
- **Framework**: React (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Routing**: React Router
- **State/Data**: Axios (with Interceptors)

## Core Features

### Dynamic Property Management
- **Field Configuration UI**: Interface to create and edit Field Definitions (text, number, select, boolean).
- **Dynamic Forms**: Property creation/edit forms are generated at runtime based on the active Field Definitions.

### Theming
- **True Black Dark Mode**: Utilizes strict `#000000` backgrounds (neutral-950) and `neutral-900` surfaces for OLED optimization.
- **Blue-White Day Mode**: High-contrast professional theme for daylight use.

### Features
- **Property Lifecycle**: Create, Edit, Soft Delete, Block/Unblock.
- **Validation**: Real-time form validation mirroring backend rules.

## Running Locally

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Development Server:
   ```bash
   npm run dev
   ```
   Access the Admin Panel at `http://localhost:5173`.

## Folder Structure
```
client/
├── src/
│   ├── components/   # Reusable UI Components (shadcn/ui specific)
│   ├── pages/        # Route Views (PropertyForm, Dashboard, etc.)
│   ├── layouts/      # Application Shells (Sidebar, Header)
│   ├── hooks/        # Custom React Hooks
│   └── services/     # API Integration
└── package.json
```
