
// --- Global Variables ---

// Three.js Core Components
let scene, camera, renderer;
const clock = new THREE.Clock();

// Loaded Model Cache
let loadedModel = null;
let currentModelBasePath = '';

// UI Elements
let statusElement;


// Ammo.js Physics Engine Components
// let Ammo; // Removed global Ammo
let physicsWorld, dispatcher, broadphase, solver, collisionConfiguration;
const rigidBodies = [];
const margin = 0.05;
let tmpTransform;

// Programmatic Robot Arm (Three.js Meshes and Ammo.js Bodies)
let armBase, upperArm, lowerArm;
let ammoArmBase, ammoUpperArm, ammoLowerArm;
let hinge1, hinge2;

// Inverse Kinematics (IK) and User Interaction
let ikTarget;
let ikTargetPos = new THREE.Vector3(1, 1.5, 0.5);
let p2pConstraint = null;

// Mouse/Touch Interaction for Dragging IK Target
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDraggingTarget = false;
let dragPlane;
const dragOffset = new THREE.Vector3();


/**
 * Initializes the core Three.js components: scene, camera, renderer, lights,
 * and sets up event listeners for window resize and mouse/touch interactions.
 * Also initializes UI elements like the status message display.
 */
function initThreeJS() {
    try {
        console.log("initThreeJS: Starting graphics initialization...");
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeeeeee);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 5);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        renderer.domElement.addEventListener('mousemove', onMouseMoveGeneral, false);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        renderer.domElement.addEventListener('touchstart', onTouchStart, false);
        renderer.domElement.addEventListener('touchmove', onTouchMove, false);
        renderer.domElement.addEventListener('touchend', onTouchEnd, false);

        dragPlane = new THREE.Plane();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        window.addEventListener('resize', onWindowResize, false);

        const fileInput = document.getElementById('fileInput');
        if (fileInput) { // Check if fileInput exists before adding listener
            fileInput.addEventListener('change', onFileSelected, false);
            console.log("initThreeJS: Event listener for 'fileInput' attached.");
            showStatus("File input ready.", false, true); // New diagnostic message
        } else {
            console.error("initThreeJS: fileInput element not found!");
            showStatus("Error: File input element missing from page.", true);
        }

        statusElement = document.getElementById('statusMessage');
        if (!statusElement) {
            console.warn('initThreeJS: statusMessage element not found in the DOM. Status messages will use alerts.');
            // showStatus will automatically use alert if statusElement is null.
        }
        console.log("initThreeJS: Graphics initialization complete.");
    } catch (error) {
        console.error("Critical error during graphics initialization (initThreeJS):", error);
        showStatus("Critical error during graphics initialization. Check console for details.", true);
    }
}

/**
 * Initializes the Ammo.js physics world and its components.
 */
function initAmmo(AmmoLib) {
    window.Ammo = AmmoLib; // Explicitly assign to window.Ammo for clarity
    console.log("initAmmo: Initializing physics...");
    tmpTransform = new window.Ammo.btTransform();
    collisionConfiguration = new window.Ammo.btDefaultCollisionConfiguration();
    dispatcher = new window.Ammo.btCollisionDispatcher(collisionConfiguration);
    broadphase = new window.Ammo.btDbvtBroadphase();
    solver = new window.Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new window.Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new window.Ammo.btVector3(0, -9.82, 0));
    createGroundPlane();
    createSimpleArm();
    createIKTargetMarker();
    console.log("initAmmo: Physics initialized.");
    showStatus("Physics engine loaded and initialized.", false, true);
}

/**
 * Main initialization sequence.
 */
function init() {
    console.log("init: Script execution started.");
    // Add pre-emptive checks here:
    if (typeof THREE === 'undefined') {
        console.error("THREE object is undefined! three.min.js might have failed to load. Application cannot start.");
        alert("Critical Error: THREE.js core library not loaded. Application cannot start. Check browser console (F12) for Network errors.");
        return; // Halt execution
    }
    if (typeof URDFLoader === 'undefined') { // Checking the imported binding
        const criticalMessage = "URDFLoader is undefined! The import from URDFLoader.js might have failed. Check Network tab and module paths.";
        console.error(criticalMessage);
        alert(criticalMessage);
        // Decide if to halt or not, similar to before.
    }

    showStatus("Main script running...", false, true); // This message might be overridden by the alert above if URDFLoader is missing.
    initThreeJS();
    console.log("init: Attempting to load Ammo.js...");
    Ammo().then(function (AmmoLib) { // Ammo() is from ammo.wasm.js
        console.log("init: Ammo.js library loaded successfully.");
        initAmmo(AmmoLib);
        animate();
    }).catch(e => {
        console.error("init: Error loading Ammo.js:", e);
        showStatus("Fatal Error: Could not load Physics Engine (Ammo.js). Check console.", true);
        animate(); // Still call animate to render scene, even if physics is off
    });
}

/**
 * Displays a status message on the screen.
 */
function showStatus(message, isError = false, isSuccess = false) {
    if (!statusElement) {
        console.error('statusElement not found by showStatus. Fallback alert for message: ' + message);
        alert('Status: ' + message); // Fallback to alert
        return;
    }
    try {
        statusElement.textContent = message;
        statusElement.style.display = 'block';
        statusElement.classList.remove('error', 'success'); // Ensure classes are reset before adding
        if (isError) {
            statusElement.classList.add('error');
        } else if (isSuccess) {
            statusElement.classList.add('success');
        }
        if (!isError) { // Errors shown via statusElement will persist until the next status message
            setTimeout(hideStatus, isSuccess ? 2000 : 4000);
        }
    } catch (e) {
        console.error('Error within showStatus trying to update statusElement:', e);
        console.error('Original message was:', message);
        alert('Status (div update failed): ' + message); // Fallback alert
    }
}

/**
 * Hides the status message.
 */
function hideStatus() {
    if (!statusElement) {
        return; // No fallback needed if statusElement wasn't found for hiding
    }
    try {
        statusElement.style.display = 'none';
    } catch (e) {
        console.error('Error within hideStatus:', e);
    }
}


/**
 * Creates a static ground plane.
 */
function createGroundPlane() {
    if (!window.Ammo) return;
    const groundGeometry = new THREE.BoxGeometry(10, 0.5, 10);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, -0.25, 0);
    scene.add(groundMesh);

    const groundShape = new window.Ammo.btBoxShape(new window.Ammo.btVector3(5, 0.25, 5));
    let transform = new window.Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new window.Ammo.btVector3(0, -0.25, 0));
    const groundBody = createRigidBody(0, transform, groundShape, groundMesh);
    groundBody.setFriction(0.9);
}

/**
 * Creates a simple 2-link programmatic robot arm.
 */
function createSimpleArm() {
    if (!window.Ammo) return;
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });

    const baseGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    armBase = new THREE.Mesh(baseGeometry, baseMaterial);
    armBase.position.set(0, 0.25, 0);
    scene.add(armBase);

    const upperArmGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    upperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
    upperArm.position.set(0, 1, 0);
    scene.add(upperArm);

    const lowerArmGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    lowerArm = new THREE.Mesh(lowerArmGeometry, armMaterial);
    lowerArm.position.set(0, 2, 0);
    scene.add(lowerArm);

    const baseShape = new window.Ammo.btBoxShape(new window.Ammo.btVector3(0.25, 0.25, 0.25));
    const armSegmentShape = new window.Ammo.btBoxShape(new window.Ammo.btVector3(0.1, 0.5, 0.1));

    let transform = new window.Ammo.btTransform();

    transform.setIdentity();
    transform.setOrigin(new window.Ammo.btVector3(0, 0.25, 0));
    ammoArmBase = createRigidBody(0, transform, baseShape, armBase);
    ammoArmBase.setFriction(0.8);

    transform.setIdentity();
    transform.setOrigin(new window.Ammo.btVector3(0, 1, 0));
    ammoUpperArm = createRigidBody(1, transform, armSegmentShape, upperArm);
    ammoUpperArm.setFriction(0.8);
    ammoUpperArm.setRestitution(0.1);

    transform.setIdentity();
    transform.setOrigin(new window.Ammo.btVector3(0, 2, 0));
    ammoLowerArm = createRigidBody(1, transform, armSegmentShape, lowerArm);
    ammoLowerArm.setFriction(0.8);
    ammoLowerArm.setRestitution(0.1);

    const pivotA_H1 = new window.Ammo.btVector3(0, 0.25, 0);
    const pivotB_H1 = new window.Ammo.btVector3(0, -0.5, 0);
    const axis_H1 = new window.Ammo.btVector3(0, 0, 1);
    hinge1 = new window.Ammo.btHingeConstraint(ammoArmBase, ammoUpperArm, pivotA_H1, pivotB_H1, axis_H1, axis_H1, false);
    hinge1.setLimit(-Math.PI / 2, Math.PI / 2, 0.9, 0.3, 1.0);
    physicsWorld.addConstraint(hinge1, true);

    const pivotA_H2 = new window.Ammo.btVector3(0, 0.5, 0);
    const pivotB_H2 = new window.Ammo.btVector3(0, -0.5, 0);
    const axis_H2 = new window.Ammo.btVector3(0, 0, 1);
    hinge2 = new window.Ammo.btHingeConstraint(ammoUpperArm, ammoLowerArm, pivotA_H2, pivotB_H2, axis_H2, axis_H2, false);
    hinge2.setLimit(-Math.PI / 2, Math.PI / 2, 0.9, 0.3, 1.0);
    physicsWorld.addConstraint(hinge2, true);
}

/**
 * Helper function to create an Ammo.js rigid body.
 */
function createRigidBody(mass, transform, shape, threeObject) {
    if (!window.Ammo) return null; // Should not happen if called after initAmmo
    const localInertia = new window.Ammo.btVector3(0, 0, 0);
    if (mass > 0) {
        shape.calculateLocalInertia(mass, localInertia);
    }
    const motionState = new window.Ammo.btDefaultMotionState(transform);
    const rbInfo = new window.Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new window.Ammo.btRigidBody(rbInfo);

    body.setActivationState(4); // Corresponds to DISABLE_DEACTIVATION
    body.threeObject = threeObject;
    physicsWorld.addRigidBody(body);

    if (mass > 0) {
        rigidBodies.push(body);
    }
    return body;
}

/**
 * Creates a visual marker (a red sphere) for the IK target.
 */
function createIKTargetMarker() {
    const targetGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xcc0000 });
    ikTarget = new THREE.Mesh(targetGeometry, targetMaterial);
    ikTarget.position.copy(ikTargetPos);
    scene.add(ikTarget);
    if (renderer) renderer.domElement.style.cursor = 'grab';
}

/**
 * Sets up the Inverse Kinematics (IK) by creating a Point-to-Point (P2P) constraint
 * in Ammo.js.
 */
function setupIK() {
    if (!window.Ammo || !physicsWorld) return;
    if (p2pConstraint) {
        physicsWorld.removeConstraint(p2pConstraint);
        if (typeof p2pConstraint.destroy === 'function') { // Ammo.js specific way to check if it's destroyable
             window.Ammo.destroy(p2pConstraint);
        } else if (typeof window.Ammo._free === 'function') { // Fallback for some versions
             window.Ammo._free(p2pConstraint);
        }
        p2pConstraint = null;
    }
    if (!ammoLowerArm) return;

    const pivotInLowerArm = new window.Ammo.btVector3(0, 0.5, 0); // Pivot point in the lower arm's local frame
    p2pConstraint = new window.Ammo.btPoint2PointConstraint(ammoLowerArm, pivotInLowerArm);
    physicsWorld.addConstraint(p2pConstraint);
    // The target position is in world space, so setPivotB needs a world space coordinate.
    p2pConstraint.setPivotB(new window.Ammo.btVector3(ikTargetPos.x, ikTargetPos.y, ikTargetPos.z));
}

/**
 * Converts mouse/touch client coordinates to Three.js normalized device coordinates (NDC).
 */
function updateMouseCoords(clientX, clientY, vec) {
    vec.x = (clientX / window.innerWidth) * 2 - 1;
    vec.y = -(clientY / window.innerHeight) * 2 + 1;
}

/**
 * Handles pointer down events (mousedown, touchstart) for IK target dragging.
 */
function handlePointerDown(clientX, clientY) {
    updateMouseCoords(clientX, clientY, mouse);
    raycaster.setFromCamera(mouse, camera);

    if (ikTarget && ikTarget.visible) {
        const intersects = raycaster.intersectObject(ikTarget);
        if (intersects.length > 0) {
            isDraggingTarget = true;
            camera.getWorldDirection(dragPlane.normal);
            dragPlane.setFromNormalAndCoplanarPoint(dragPlane.normal, ikTarget.position);

            if (raycaster.ray.intersectPlane(dragPlane, dragOffset)) {
                 dragOffset.sub(ikTarget.position);
            } else {
                 dragOffset.set(0,0,0);
            }
            renderer.domElement.style.cursor = 'grabbing';
        }
    }
}

/**
 * Handles pointer move events (mousemove, touchmove) for IK target dragging.
 */
function handlePointerMove(clientX, clientY) {
    if (isDraggingTarget) {
        updateMouseCoords(clientX, clientY, mouse);
        raycaster.setFromCamera(mouse, camera);

        const intersection = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
            ikTargetPos.copy(intersection.sub(dragOffset));
            if (ikTarget) ikTarget.position.copy(ikTargetPos);
        }
    }
}

/**
 * Handles pointer up events (mouseup, touchend) to stop IK target dragging.
 */
function handlePointerUp() {
    isDraggingTarget = false;
    if (ikTarget && ikTarget.visible) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(ikTarget);
        if (intersects.length > 0) {
            renderer.domElement.style.cursor = 'grab';
        } else {
            renderer.domElement.style.cursor = 'default';
        }
    } else {
         renderer.domElement.style.cursor = 'default';
    }
}

function onMouseDown(event) { handlePointerDown(event.clientX, event.clientY); }
function onMouseMoveGeneral(event) {
    if (isDraggingTarget) {
        handlePointerMove(event.clientX, event.clientY);
        return;
    }
    updateMouseCoords(event.clientX, event.clientY, mouse);
    raycaster.setFromCamera(mouse, camera);
    if (ikTarget && ikTarget.visible) {
        const intersects = raycaster.intersectObject(ikTarget);
        if (intersects.length > 0) {
            renderer.domElement.style.cursor = 'grab';
        } else {
            renderer.domElement.style.cursor = 'default';
        }
    } else {
        renderer.domElement.style.cursor = 'default';
    }
}
function onMouseUp(event) { handlePointerUp(); }
function onTouchStart(event) { if (event.touches.length > 0) handlePointerDown(event.touches[0].clientX, event.touches[0].clientY); }
function onTouchMove(event) { if (event.touches.length > 0) handlePointerMove(event.touches[0].clientX, event.touches[0].clientY); }
function onTouchEnd() { handlePointerUp(); }


/**
 * Handles the selection of a file (URDF or OBJ).
 */
function onFileSelected(event) {
    console.log(`onFileSelected: Event triggered. Number of files: ${event.target.files.length}`);
    if (event.target.files.length > 0) {
        console.log(`onFileSelected: File selected - Name: ${event.target.files[0].name}, Size: ${event.target.files[0].size}`);
        showStatus(`File selected: ${event.target.files[0].name}`, false, true);
    }
    const file = event.target.files[0];
    if (!file) return;

    const filename = file.name.toLowerCase();
    const reader = new FileReader();

    currentModelBasePath = '';
    if (window.location.protocol !== 'file:') {
        const pathArray = window.location.pathname.split('/');
        pathArray.pop();
        currentModelBasePath = pathArray.join('/') + '/';
        console.log(`[FileLoad] Serving from HTTP/S. Inferred base path for resources: ${currentModelBasePath}`);
    } else {
        console.warn("[FileLoad] Running from local 'file://'. Mesh paths in URDF must be simple relative paths from the URDF's location or absolute URLs to load correctly without a server.");
        if (filename.endsWith('.urdf')) {
            showStatus("Hint: For best results with URDFs (especially 'package://' or complex mesh paths), serve files via a local HTTP server.", false);
        }
    }

    // Initial status message moved to after file protocol check
    showStatus(`Loading "${filename}"...`);

    if (loadedModel) {
        scene.remove(loadedModel);
        loadedModel = null;
    }
    if (p2pConstraint && physicsWorld && window.Ammo) {
        physicsWorld.removeConstraint(p2pConstraint);
        if (typeof p2pConstraint.destroy === 'function') {
            window.Ammo.destroy(p2pConstraint);
        } else if (typeof window.Ammo._free === 'function') {
            window.Ammo._free(p2pConstraint);
        }
        p2pConstraint = null;
    }
    if (physicsWorld && window.Ammo) {
        for (let i = rigidBodies.length - 1; i >= 0; i--) {
            const body = rigidBodies[i];
            physicsWorld.removeRigidBody(body);
            if (typeof body.destroy === 'function') { // Check if body has destroy method
                window.Ammo.destroy(body);
            } else if (typeof window.Ammo._free === 'function') { // Fallback for some versions
                 window.Ammo._free(body);
            }
        }
    }
    rigidBodies.length = 0;

    const armElements = [armBase, upperArm, lowerArm, ikTarget];
    const shouldShowArm = !(filename.endsWith('.urdf') || filename.endsWith('.obj'));
    armElements.forEach(el => { if (el) el.visible = shouldShowArm; });
    if (shouldShowArm && ammoLowerArm && !p2pConstraint && physicsWorld) setupIK();


    if (filename.endsWith('.urdf')) {
        reader.onload = function (e) {
            showStatus(`Reading URDF file "${filename}"...`);
            try {
                const urdfLoader = new URDFLoader();
                urdfLoader.workingPath = currentModelBasePath;
                console.log(`[URDFLoad] Set URDFLoader.workingPath to: "${urdfLoader.workingPath}"`);

                urdfLoader.loadMeshCb = (path, manager, onComplete, onErrorOriginal) => {
                    const originalPath = path;
                    console.log(`[URDF Resource] Requested mesh: "${originalPath}"`);
                    let resolvedPath = path;

                    if (resolvedPath.startsWith('package://')) {
                        resolvedPath = resolvedPath.replace(/^package:\/\/[^\/]+\//, '');
                        console.log(`[URDF Resource] Attempting to resolve package path "${originalPath}" to relative path: "${resolvedPath}"`);
                    }

                    const ext = resolvedPath.split('.').pop().toLowerCase();
                    let loader;

                    const basePathForSubloader = urdfLoader.path || '';
                    console.log('[URDF Resource] Using base path for sub-loader (from urdfLoader.path): "' + basePathForSubloader + '"');
                    console.log(`[URDF Resource] Trying to load: "${resolvedPath}", Extension: ${ext}, Base for sub-loader: "${basePathForSubloader}"`);

                    const placeholderMaterial = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff, wireframe: true, name: `Placeholder for ${resolvedPath}`});
                    const placeholderGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

                    const meshOnError = (error) => {
                        const errorMsg = error instanceof ErrorEvent ? error.message : (typeof error === 'string' ? error : `Failed to load ${resolvedPath}`);
                        console.error(`[URDF Resource] ERROR loading mesh "${resolvedPath}" (original: "${originalPath}"):`, errorMsg, error);
                        showStatus(`Error loading mesh ${resolvedPath}: ${errorMsg}. Using placeholder.`, true);

                        const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
                        placeholder.name = `Placeholder_Error_${resolvedPath}`;
                        onComplete(placeholder, errorMsg);
                    };

                    const meshOnSuccess = (meshResult, loaderName) => {
                        console.log(`[URDF Resource] Successfully loaded ${loaderName} mesh: "${resolvedPath}" (original: "${originalPath}")`);
                        showStatus(`Loaded mesh: ${resolvedPath}`, false, true);
                        if (meshResult && !meshResult.name && resolvedPath) {
                            meshResult.name = resolvedPath;
                        }
                        onComplete(meshResult);
                    };

                    if (ext === 'stl' || ext === 'stla' || ext === 'stlb') {
                        loader = new STLLoader(manager);
                        if (basePathForSubloader) loader.setPath(basePathForSubloader);
                        loader.load(resolvedPath,
                            geometry => {
                                const material = new THREE.MeshPhongMaterial({ color: 0xbbbbbb, wireframe: false, name: resolvedPath });
                                const mesh = new THREE.Mesh(geometry, material);
                                meshOnSuccess(mesh, "STL");
                            },
                            undefined,
                            meshOnError
                        );
                    } else if (ext === 'obj') {
                        loader = new OBJLoader(manager);
                        if (basePathForSubloader) loader.setPath(basePathForSubloader);
                        loader.load(resolvedPath,
                            obj => { meshOnSuccess(obj, "OBJ"); },
                            undefined,
                            meshOnError
                        );
                    } else if (ext === 'dae') {
                        loader = new ColladaLoader(manager);
                        if (basePathForSubloader) loader.setPath(basePathForSubloader);
                        loader.load(resolvedPath,
                            collada => { meshOnSuccess(collada.scene, "DAE"); },
                            undefined,
                            meshOnError
                        );
                    } else {
                        const unsupportedErrorMsg = `Unsupported mesh type "${ext}" in URDF for "${resolvedPath}" (original: "${originalPath}")`;
                        console.warn(`[URDF Resource] ${unsupportedErrorMsg}`);
                        showStatus(unsupportedErrorMsg + ". Using placeholder.", true);
                        const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
                        placeholder.name = `Placeholder_Unsupported_${resolvedPath}`;
                        onComplete(placeholder, unsupportedErrorMsg);
                    }
                };

                console.log("[URDFLoad] Attempting to parse URDF data for:", file.name);
                let urdfParsePath = file.name;
                if (file.name.toLowerCase() === 'go2_description.urdf') {
                    urdfParsePath = 'URDF/' + file.name;
                    console.log('[URDFLoad] Detected go2_description.urdf, setting parse path to: ' + urdfParsePath);
                }
                loadedModel = urdfLoader.parse(e.target.result, urdfParsePath);

                if (loadedModel) {
                    console.log("[URDFLoad] URDF model parsed successfully:", loadedModel.name || filename);
                    showStatus(`Parsed "${filename}". Loading meshes...`);
                    scene.add(loadedModel);

                    if (file.name.toLowerCase() === 'go2_description.urdf') {
                        const meshLocationMessage = "For 'go2_description.urdf', ensure DAE mesh files (base.dae, hip.dae, etc.) are in 'URDF/dae/' relative to index.html.";
                        showStatus(meshLocationMessage, false); // 'false' for not an error
                        console.log("[URDFLoad] User guidance: " + meshLocationMessage);
                    }

                    fitCameraToObject(loadedModel, 2.5);
                    armElements.forEach(el => { if (el) el.visible = false; });
                    showStatus(`URDF "${filename}" structure loaded. Meshes loading... Check console.`, false, false);
                } else {
                    console.error("[URDFLoad] URDFLoader.parse returned null or undefined for", filename);
                    showStatus(`Failed to parse URDF structure for "${filename}". Displaying simple arm.`, true);
                    armElements.forEach(el => { if (el) el.visible = true; });
                    if (ammoLowerArm && !p2pConstraint && physicsWorld) setupIK();
                }
            } catch (parseError) {
                console.error(`[URDFLoad] Error parsing URDF "${filename}":`, parseError);
                showStatus(`Error parsing URDF "${filename}": ${parseError.message}. Displaying simple arm.`, true);
                armElements.forEach(el => { if (el) el.visible = true; });
                if (ammoLowerArm && !p2pConstraint && physicsWorld) setupIK();
            }
        };
        reader.readAsText(file);
    } else if (filename.endsWith('.obj')) {
        reader.onload = function (e) {
            try {
                const objLoader = new OBJLoader();
                console.log("[OBJLoad] Parsing OBJ content from file:", filename);
                loadedModel = objLoader.parse(e.target.result);
                if (loadedModel) {
                    scene.add(loadedModel);
                    console.log("[OBJLoad] OBJ model added to scene:", loadedModel.name || "unnamed_obj");
                    fitCameraToObject(loadedModel, 1.5);
                    armElements.forEach(el => { if (el) el.visible = false; });
                    showStatus(`Successfully loaded "${filename}"`, false, true);
                } else {
                    console.error("[OBJLoad] OBJLoader.parse returned null or undefined for", filename);
                    showStatus(`Failed to parse OBJ "${filename}". Displaying simple arm.`, true);
                    armElements.forEach(el => { if (el) el.visible = true; });
                    if (ammoLowerArm && !p2pConstraint && physicsWorld) setupIK();
                }
            } catch (parseError) {
                console.error("[OBJLoad] Error parsing OBJ:", filename, parseError);
                showStatus(`Error parsing OBJ "${filename}": ${parseError.message}. Displaying simple arm.`, true);
                armElements.forEach(el => { if (el) el.visible = true; });
                if (ammoLowerArm && !p2pConstraint && physicsWorld) setupIK();
            }
        };
        reader.readAsText(file);
    } else {
        showStatus(`Unsupported file type: "${filename}". Please select URDF or OBJ. Displaying simple arm.`, true);
        armElements.forEach(el => { if (el) el.visible = true; });
        if (ammoLowerArm && !p2pConstraint && physicsWorld) setupIK();
    }
    // URL.revokeObjectURL(fileURL); // Not used directly by file reader, so can be revoked earlier or not at all.
}


/**
 * Adjusts the camera's position and orientation to fit a given Three.js object
 * within the view.
 */
function fitCameraToObject(object, offset) {
    offset = offset || 1.5;
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    const objectDisplayName = object.name || (object.children.length ? object.children[0].name : (fileInput && fileInput.files[0] ? fileInput.files[0].name : 'unknown object'));
    console.log(`fitCameraToObject: Object name: "${objectDisplayName}", BBox center: {x: ${center.x.toFixed(2)}, y: ${center.y.toFixed(2)}, z: ${center.z.toFixed(2)}}`);
    console.log(`fitCameraToObject: Object BBox size: {x: ${size.x.toFixed(2)}, y: ${size.y.toFixed(2)}, z: ${size.z.toFixed(2)}}`);

    const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());
    let radius = boundingSphere.radius;

    if (radius === 0 || !isFinite(radius) || isNaN(radius)) {
        console.warn(`fitCameraToObject: Object "${objectDisplayName}" has zero, NaN, or non-finite radius (${radius}). Bounding box might be empty or model not loaded correctly. Using fallback camera.`);
        showStatus(`Warning: Model "${objectDisplayName}" loaded but may be empty or scaled incorrectly. Check console.`, true);

        const fallbackCenter = isFinite(center.x) && isFinite(center.y) && isFinite(center.z) ? center : new THREE.Vector3(0,1,0);
        camera.position.set(fallbackCenter.x, fallbackCenter.y + 2, fallbackCenter.z + 5);
        camera.lookAt(fallbackCenter);
        camera.near = 0.1;
        camera.far = 1000;
        camera.updateProjectionMatrix();
        return;
    }

    const fov = camera.fov * (Math.PI / 180);
    let cameraDistance = Math.abs(radius / Math.sin(fov / 2));
    cameraDistance *= offset;
    const direction = new THREE.Vector3(0.5, 0.5, 1).normalize();
    camera.position.copy(center).addScaledVector(direction, cameraDistance);
    camera.lookAt(center);
    camera.near = Math.max(0.1, cameraDistance - radius * 1.1);
    camera.far = cameraDistance + radius * 1.1;
    camera.updateProjectionMatrix();
    console.log(`fitCameraToObject: New camera for "${objectDisplayName}": pos: {x: ${camera.position.x.toFixed(2)}, y: ${camera.position.y.toFixed(2)}, z: ${camera.position.z.toFixed(2)}}, near: ${camera.near.toFixed(2)}, far: ${camera.far.toFixed(2)}`);
}


/**
 * Handles window resize events.
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * The main animation loop.
 */
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();

    if (physicsWorld && window.Ammo && armBase && armBase.visible) {
        if (!p2pConstraint && ammoLowerArm) {
            setupIK();
        }
        if (p2pConstraint) {
             p2pConstraint.setPivotB(new window.Ammo.btVector3(ikTargetPos.x, ikTargetPos.y, ikTargetPos.z));
        }
        physicsWorld.stepSimulation(deltaTime, 10, 1/60);
        for (let i = 0; i < rigidBodies.length; i++) {
            const body = rigidBodies[i];
            if (body.threeObject && body.threeObject.visible) {
                const ms = body.getMotionState();
                if (ms) {
                    ms.getWorldTransform(tmpTransform);
                    const p = tmpTransform.getOrigin();
                    const q = tmpTransform.getRotation();
                    body.threeObject.position.set(p.x(), p.y(), p.z());
                    body.threeObject.quaternion.set(q.x(), q.y(), q.z(), q.w());
                }
            }
        }
    }
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

init();
console.log("main.js: Reached end of script. init() should have been called.");
