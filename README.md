# Muhammad Ibrahim - 3D Portfolio

## What to install (one time)
1. Node.js (LTS version): https://nodejs.org
2. VS Code: https://code.visualstudio.com

## How to run
1. Unzip this folder and open it in VS Code (File > Open Folder).
2. Open the terminal in VS Code (Terminal > New Terminal).
3. Install the packages:   npm install
4. Start the website:      npm run dev
5. Open the link shown in the terminal (usually http://localhost:5173).

## Where to change things
- All your text (bio, skills, projects, links): src/data.js
- 3D scene (neural network, rings, particles): src/Scene.jsx
- Page layout: src/App.jsx
- Colors and fonts: src/index.css (the three colors are at the top)

## Put it online for free
1. npm run build   (creates a "dist" folder)
2. Push the project to GitHub, then import it on https://vercel.com
   (Framework: Vite, Build command: npm run build, Output: dist)
