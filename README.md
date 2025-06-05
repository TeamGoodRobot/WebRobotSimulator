# Simple Web-based Robot Simulator

This project is a web-based simulator for visualizing robot models (URDF/OBJ) and interacting with them using Inverse Kinematics (IK) powered by a physics engine.

## Features
- Load URDF and OBJ robot model files.
- 3D visualization of the robot in the browser.
- Basic Inverse Kinematics: Drag an end-effector target (red sphere) to see a simple programmatic arm respond.
- Physics simulation using Ammo.js (a port of the Bullet Physics engine).
- Includes a simple ground plane for collision reference.
- Programmatic 2-link arm for demonstrating IK and physics.

## How to Run
1.  Simply open the `index.html` file in a modern web browser that supports WebGL and WebAssembly.
2.  No local server is strictly required for the basic functionality as assets (Three.js, Ammo.js, loaders) are loaded via CDN. However, if you load URDF files that reference local mesh files (e.g., STLs, OBJs), you might need to run a local server in the project's root directory due to browser security restrictions (CORS) when `FileReader` or loaders try to access these files via `file:///` paths or relative paths that the browser sandboxes.
    *   A simple way to start a local server (if you have Python 3): `python -m http.server`
    *   Or with Node.js: `npx http-server`

## How to Use
- **Loading Models**: Use the "Choose File" input button at the top-left to select a `.urdf` or `.obj` file from your local system.
    - The programmatic simple arm will be hidden when a model is loaded.
    - If loading fails or an unsupported file is selected, the simple arm will reappear.
- **Interacting with the Simple Arm**:
    - When no external model is loaded, a simple 2-link arm is displayed.
    - The red sphere is the IK target for the tip of this arm.
    - Click and drag the red sphere with your mouse to move the target. The arm will attempt to follow using IK.
- **Camera Controls**: Basic camera controls are not yet implemented (zoom, pan, orbit). The camera will attempt to frame the loaded object or the simple arm.

## Libraries Used
- **Three.js**: For 3D rendering and scene management.
- **Ammo.js**: For physics simulation (rigid bodies, constraints, joints) and IK.
- **URDFLoader.js, OBJLoader.js, STLLoader.js, LoadingManager.js**: From the Three.js examples, for loading robot models and their assets.

## Notes on URDF Loading
- The current URDF loader setup (`loadMeshCb` in `main.js`) is basic. It attempts to load referenced meshes (STL, OBJ) assuming they are relative to the URDF file's location or accessible via simple paths.
- More complex URDFs using `package://` style paths for mesh resources might not load correctly without further configuration of the `URDFLoader`'s `packages` property or by hosting the files on a server that can resolve these paths.

## Debugging / Viewing Logs

If you encounter issues, such as a model not loading or the screen remaining white:

1.  **Open your browser's Developer Console.** This is where detailed error messages and loading progress are logged.
    *   **Chrome, Edge, Firefox (Windows/Linux):** Press `F12`, or right-click on the page and select "Inspect" or "Inspect Element", then go to the "Console" tab.
    *   **Chrome, Firefox (macOS):** Press `Cmd+Opt+J` (to directly open Console) or `Cmd+Opt+I` (to open Developer Tools, then select Console).
    *   **Safari (macOS):** First, enable the Develop menu (Safari > Preferences > Advanced > "Show Develop menu in menu bar"). Then, you can use `Cmd+Opt+C` or go to Develop > Show JavaScript Console.

2.  **Check the "Console" tab** for error messages. These messages can provide clues about:
    *   Failed attempts to load URDF/OBJ files or their associated meshes (e.g., STL, DAE files).
    *   Incorrect file paths or formats.
    *   JavaScript errors in the simulator code.
    *   Problems with Ammo.js initialization.

The simulator logs information about which files it's trying to load (especially meshes referenced within URDFs) and any errors encountered during that process. This is the primary way to diagnose loading problems.
