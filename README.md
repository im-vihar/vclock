# VCLOCK

A sleek, customizable smart display dashboard built with React, TypeScript, and Tailwind CSS. Designed to turn any device—from a secondary monitor to an iPad—into a focused information hub.

![VCLOCK Screenshot](https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?q=80&w=2532&auto=format&fit=crop)

## ✨ Features

*   **Smart Clock**: Multiple styles (Digital, Flip, Stack, Modern) with customizable positioning.
*   **Media Integration**: Real-time Spotify display via [Lanyard](https://github.com/Phineas/lanyard).
    *   *Vinyl Mode*: Rotating record animation.
    *   *Card Mode*: Clean album art display.
    *   *Visualizer*: Microphone-reactive audio bars.
*   **Dashboard Widgets**:
    *   **Weather:** Displays the current weather.
    *   **News:** Shows the latest headlines.
    *   **Device Info:** Provides information about the device running VCLOCK.
    *   **Focus:** A widget to help with focus and productivity.
    *   **Assistant:** A voice assistant widget.
    *   System Health (Battery, etc.)
    *   Focus Timer (Pomodoro)
    *   Todo List
    *   News Ticker
    *   Ambient Sounds Mixer
*   **Customization**:
    *   Liquid Glass Theme
    *   Custom Wallpapers
    *   Font & Accent Color selection
    *   Screensaver mode (Burn-in protection)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/vclock.git
    cd vclock
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

## 🎵 Setting up Music Integration (Lanyard)

To see your Spotify activity on the dashboard, VCLOCK uses the **Lanyard API**.

1.  **Join the Server**: You **must** join the [Lanyard Discord Server](https://discord.gg/lanyard) for the API to be able to read your presence.
2.  **Discord Settings**: Go to **User Settings > Connections** and toggle on **"Display Spotify as your status"**.
3.  **Get your ID**:
    *   Enable **Developer Mode** in Discord (Settings > Advanced).
    *   Right-click your profile and select **Copy User ID**.
4.  **Configure VCLOCK**: Open Settings (top left icon) > Data > Enter your Discord ID.

## 🛠 Deployment

### Vercel (Recommended)

This project is optimized for Vercel.

1.  Push your code to GitHub.
2.  Import the repository in Vercel.
3.  Framework Preset: **Vite**.
4.  Deploy!

## 📱 Mobile & Tablet Support

VCLOCK is fully responsive.
*   **Landscape Mode**: Optimized for dashboard usage on phones and tablets.
*   **Touch Controls**: Large hit targets and swipe navigation.
*   **Wake Lock**: Prevents the device from sleeping while open (configurable).

## 💡 Ideas for the Future

*   **More Widgets:**
    *   **Calendar:** Integrate with Google Calendar or other calendar services.
    *   **Public Transit:** Real-time bus/train tracking.
    *   **Stock Market:** Track stock prices.
*   **Customizable Layouts:** Allow users to drag and drop widgets to create their own layouts.
*   **Themes:** More theme options, including light themes.
*   **Improved Vinyl Animation:**
    *   Make the vinyl record slide out from the sleeve more realistically.
    *   Add a tonearm that moves into position when the music starts.
*   **Desktop App:** Create a standalone desktop app using Electron.

## 📄 License

MIT License. Free to use and modify.
