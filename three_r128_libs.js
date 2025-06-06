// three_r128_libs.js - REAL PARTIAL Three.js r128 components - v3 (core stubs added)
var THREE = {
    REVISION: '128-real-partial-v3',

    // --- Core Math and Util Stubs ---
    Clock: function(autoStart) {
        this.autoStart = (autoStart !== undefined) ? autoStart : true;
        this.startTime = 0; this.oldTime = 0; this.elapsedTime = 0; this.running = false;
        if (this.autoStart) this.start();
        console.log('THREE.Clock (r128 stub) created');
    },
    Vector2: function(x, y) { this.x = x || 0; this.y = y || 0; },
    Vector3: function(x,y,z){this.x=x||0;this.y=y||0;this.z=z||0;},
    Quaternion: function(x,y,z,w){this.x=x||0;this.y=y||0;this.z=z||0;this.w=(w===undefined)?1:w;},
    Raycaster: function(origin, direction, near, far){
        this.ray={origin: origin || new THREE.Vector3(), direction: direction || new THREE.Vector3()};
        this.near=near||0; this.far=far||Infinity; this.params = {};
        this.setFromCamera=function(coords, camera){ console.log('Raycaster.setFromCamera (r128 stub) called'); if(this.ray && this.ray.origin && this.ray.direction){this.ray.origin.set(0,0,0); this.ray.direction.set(coords.x, coords.y, -1).normalize();} };
        this.intersectObject=function(object, recursive){ console.log('Raycaster.intersectObject (r128 stub) called on object:', object ? object.name : 'no object'); return[]; };
        this.ray.intersectPlane = function(plane, optionalTarget) { console.log('Raycaster.ray.intersectPlane (r128 stub) called'); if (optionalTarget) { return optionalTarget.set(1,1,0); } return new THREE.Vector3(1,1,0); };
        console.log('THREE.Raycaster (r128 stub) created');
    },
    Plane: function() {this.type='Plane'; this.normal = new THREE.Vector3(0,1,0); this.constant = 0; this.setFromNormalAndCoplanarPoint=function(n,p){this.normal.copy(n); this.constant = -p.dot(this.normal); return this;}; console.log('THREE.Plane (r128 stub) created');},
    EventDispatcher: function () {}, // Keep this minimal

    // --- Core Scene Graph Stubs ---
    Object3D: function() { this.position = new THREE.Vector3(); this.quaternion = new THREE.Quaternion(); this.children = []; this.up = new THREE.Vector3(0,1,0); this.name = ''; this.visible = true; this.parent = null; this.add = function(c){this.children.push(c);if(c){c.parent=this;}}; this.remove = function(c){const i=this.children.indexOf(c);if(i!==-1){if(c){c.parent=null;}this.children.splice(i,1);}}; this.lookAt=function(){console.log('Object3D.lookAt called (stub)');}; this.getWorldDirection=function(t){if(!t)t=new THREE.Vector3(); return t.set(0,0,-1).applyQuaternion(this.quaternion);}; this.traverse=function(cb){cb(this);this.children.forEach(c=>c.traverse(cb));}; },
    Group: function() { THREE.Object3D.call(this); this.type = 'Group'; console.log('THREE.Group (r128 stub) created');},
    Scene: function() { THREE.Object3D.call(this); this.type = 'Scene'; this.background = null; console.log('THREE.Scene (r128 stub) created');},
    Mesh: function(geometry, material) { THREE.Object3D.call(this); this.type = 'Mesh'; this.geometry = geometry; this.material = material; console.log('Mesh (r128 stub) created');},

    // --- Camera Stubs ---
    PerspectiveCamera: function(fov, aspect, near, far) { THREE.Object3D.call(this); this.type='PerspectiveCamera'; this.fov=fov; this.aspect=aspect; this.near=near; this.far=far; this.updateProjectionMatrix = function(){ console.log('PerspectiveCamera.updateProjectionMatrix called (stub)');}; console.log('THREE.PerspectiveCamera (r128 stub) created');},

    // --- Renderer Stubs ---
    WebGLRenderer: function(params) { console.log('THREE.WebGLRenderer (r128 stub) created'); this.domElement = document.createElement('canvas'); this.domElement.width = 300; this.domElement.height = 150; if(params && params.canvas) {this.domElement = params.canvas;} this.setSize = function(width, height) { this.domElement.width = width; this.domElement.height = height; console.log('Renderer.setSize (r128 stub):', width, height); }; this.render = function(scene, camera) { /* console.log('Renderer.render called (stub)'); */ }; this.setAnimationLoop = function(callback) { this.animationLoop = callback; console.log('Renderer.setAnimationLoop set (stub).'); function loop() { if(this.animationLoop) {this.animationLoop();} requestAnimationFrame(loop.bind(this)); } requestAnimationFrame(loop.bind(this)); }.bind(this); },

    // --- Light Stubs ---
    AmbientLight: function(color, intensity) { THREE.Object3D.call(this); this.type = 'AmbientLight'; this.color = new THREE.Color(color); this.intensity = intensity; console.log('THREE.AmbientLight (r128 stub) created');},
    DirectionalLight: function(color, intensity) { THREE_INTERNAL.Object3D.call(this); this.type = 'DirectionalLight'; this.color = new THREE.Color(color); this.intensity = intensity; this.position = new THREE.Vector3(); console.log('THREE.DirectionalLight (r128 stub) created');}, // Corrected to THREE_INTERNAL if it was from an IIFE before, now direct THREE

    // --- Geometry Stubs ---
    BoxGeometry: function(w,h,d) {this.type='BoxGeometry'; console.log('BoxGeometry (r128 stub) created:',w,h,d);},
    SphereGeometry: function(r) {this.type='SphereGeometry'; console.log('SphereGeometry (r128 stub) created:',r);},
    BufferGeometry: function() {this.type='BufferGeometry'; console.log('BufferGeometry (r128 stub) created');},

    // --- Material Stubs ---
    Material: function() { this.name = ''; this.type='Material'; console.log('THREE.Material (r128 stub) created'); },
    MeshPhongMaterial: function(params) { THREE.Material.call(this); this.type = 'MeshPhongMaterial'; this.color = (params && params.color) ? params.color : new THREE.Color(0xffffff); this.wireframe = (params && params.wireframe) || false; if(params && params.name) this.name = params.name; console.log('MeshPhongMaterial (r128 stub) created:', params);},

    // --- Color Stub ---
    Color: function(r, g, b) { if (g === undefined && b === undefined) { this.setHex(r); } else { this.setRGB(r,g,b); } console.log('THREE.Color (r128 stub) created');},

    // --- Math Stubs for BoundingBox ---
    Box3: function(min, max) { this.min = (min !== undefined) ? min : new THREE.Vector3(+Infinity,+Infinity,+Infinity); this.max = (max !== undefined) ? max : new THREE.Vector3(-Infinity,-Infinity,-Infinity); console.log('THREE.Box3 (r128 stub) created');},
    Sphere: function(center, radius){ this.center = (center !== undefined) ? center : new THREE.Vector3(); this.radius = (radius !== undefined) ? radius : -1; console.log('THREE.Sphere (r128 stub) created');},

    // DefaultLoadingManager will be set by LoadingManager code
    DefaultLoadingManager: null,
    XHRLoader: function ( manager ) {
        this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
        this.path = ''; this.responseType = ''; this.mimeType = ''; this.withCredentials = false;
        this.load = function ( url, onLoad, onProgress, onError ) {
            console.log('THREE.XHRLoader (stub) load:', url);
            if (this.manager) this.manager.itemStart(url);
            if (url.endsWith('.urdf')) {
                 if (this.manager) this.manager.itemEnd(url);
                 if (onLoad) onLoad('<robot name=\"test_robot\"><link name=\"link1\"/></robot>');
            } else {
                 if (this.manager) this.manager.itemError(url);
                 if (onError) onError(new Error('XHRLoader stub: File not found/handled: ' + url));
            }
        };
        this.setPath = function ( value ) { this.path = value; return this; };
        this.setResponseType = function ( value ) { this.responseType = value; return this; };
        this.setMimeType = function ( value ) { this.mimeType = value; return this; };
        this.setWithCredentials = function ( value ) { this.withCredentials = value; return this; };
    }
};

// --- Prototypes for Core THREE objects ---
THREE.Clock.prototype = { constructor: THREE.Clock, start: function() {this.startTime = (typeof performance === 'undefined' ? Date : performance).now(); this.oldTime = this.startTime; this.elapsedTime = 0; this.running = true;}, stop: function(){this.getElapsedTime(); this.running = false; return this;}, getElapsedTime: function(){this.getDelta(); return this.elapsedTime;}, getDelta: function(){ let diff = 0; if (this.running) { const newTime = (typeof performance === 'undefined' ? Date : performance).now(); diff = (newTime - this.oldTime) / 1000; this.oldTime = newTime; this.elapsedTime += diff; } return diff; } };
THREE.Vector2.prototype = { constructor: THREE.Vector2, set: function(x, y) { this.x = x; this.y = y; return this; }, copy: function(v) { this.x = v.x; this.y = v.y; return this; }, clone: function() { return new THREE.Vector2(this.x, this.y); } };
THREE.Vector3.prototype = { constructor: THREE.Vector3, set: function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }, copy: function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }, add: function(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }, addScaledVector: function(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }, multiplyScalar: function(s) { this.x *= s; this.y *= s; this.z *= s; return this; }, sub: function(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }, lengthSq: function() { return this.x * this.x + this.y * this.y + this.z * this.z; }, length: function() { return Math.sqrt(this.lengthSq()); }, normalize: function() { const l = this.length() || 1; this.x /= l; this.y /= l; this.z /= l; return this;}, clone: function() { return new THREE.Vector3(this.x, this.y, this.z); }, dot: function(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }, applyQuaternion:function(q){const x=this.x,y=this.y,z=this.z;const qx=q.x,qy=q.y,qz=q.z,qw=q.w;const ix=qw*x+qy*z-qz*y,iy=qw*y+qz*x-qx*z,iz=qw*z+qx*y-qy*x,iw=-qx*x-qy*y-qz*z;this.x=ix*qw+iw*-qx+iy*-qz-iz*-qy;this.y=iy*qw+iw*-qy+iz*-qx-ix*-qz;this.z=iz*qw+iw*-qz+ix*-qy-iy*-qx;return this;} };
THREE.Quaternion.prototype = { constructor: THREE.Quaternion, set: function(x,y,z,w) {this.x=x; this.y=y; this.z=z; this.w=w; return this;}, copy: function(q) {this.x=q.x; this.y=q.y; this.z=q.z; this.w=q.w; return this;}, clone: function() { return new THREE.Quaternion(this.x,this.y,this.z,this.w);}, normalize:function(){return this;} };
THREE.Color.prototype = { constructor: THREE.Color, setRGB: function(r,g,b) { this.r=r; this.g=g; this.b=b; return this;}, setHex: function(hex) { hex = Math.floor(hex); this.r = (hex >> 16 & 255) / 255; this.g = (hex >> 8 & 255) / 255; this.b = (hex & 255) / 255; return this;}, clone: function() { return new THREE.Color(this.r, this.g, this.b); } };
THREE.Object3D.prototype.constructor = THREE.Object3D; // Already has methods from direct definition
THREE.Group.prototype = Object.create(THREE.Object3D.prototype); THREE.Group.prototype.constructor = THREE.Group;
THREE.Scene.prototype = Object.create(THREE.Object3D.prototype); THREE.Scene.prototype.constructor = THREE.Scene;
THREE.PerspectiveCamera.prototype = Object.create(THREE.Object3D.prototype); THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera;
THREE.AmbientLight.prototype = Object.create(THREE.Object3D.prototype); THREE.AmbientLight.prototype.constructor = THREE.AmbientLight;
THREE.DirectionalLight.prototype = Object.create(THREE.Object3D.prototype); THREE.DirectionalLight.prototype.constructor = THREE.DirectionalLight; // Corrected here
THREE.Mesh.prototype = Object.create(THREE.Object3D.prototype); THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Material.prototype = {constructor: THREE.Material, needsUpdate: false, dispose: function(){}};
THREE.MeshPhongMaterial.prototype = Object.create(THREE.Material.prototype); THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial;
THREE.Box3.prototype = { constructor: THREE.Box3, setFromObject: function(object){ console.log('Box3.setFromObject (r128 stub) called for object:', object ? object.name : 'no object'); this.min.set(-0.5, -0.5, -0.5); this.max.set( 0.5,  0.5,  0.5); if (object && object.children && object.children.length === 0 && (!object.geometry && !object.material)) { this.min.set(0,0,0); this.max.set(0,0,0); } return this; }, getCenter: function(target){ if (!target) {target = new THREE.Vector3();} return target.copy(this.min).add(this.max).multiplyScalar(0.5);}, getSize: function(target){ if (!target) {target = new THREE.Vector3();} return target.copy(this.max).sub(this.min);}, getBoundingSphere: function(target){ if (!target) {target = new THREE.Sphere();} this.getCenter(target.center); target.radius = this.getSize(new THREE.Vector3()).length() * 0.5; console.log('Box3.getBoundingSphere (r128 stub) calculated center:', target.center, 'radius:', target.radius); return target; } };
THREE.Sphere.prototype = { constructor: THREE.Sphere };
THREE.EventDispatcher.prototype = { addEventListener: function ( type, listener ) {}, hasEventListener: function ( type, listener ) { return false; }, removeEventListener: function ( type, listener ) {}, dispatchEvent: function ( event ) {} };


console.log('THREE r128 (real-partial core v3) defined.');

// --- Full LoadingManager.js (r128) - Placeholder from previous version ---
THREE.LoadingManager = function ( onLoad, onProgress, onError ) {
    console.log('THREE.LoadingManager (r128 - REAL CODE PLACEHOLDER v3) created.');
    var scope = this; var isLoading = false; var itemsLoaded = 0; var itemsTotal = 0;
    this.onLoad = onLoad; this.onProgress = onProgress; this.onError = onError; this.onStart = null; // Added from r128
    this.itemStart = function ( url ) { itemsTotal++; isLoading = true; if ( scope.onStart ) scope.onStart( url, itemsLoaded, itemsTotal ); if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); };
    this.itemEnd = function ( url ) { itemsLoaded++; if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); if ( itemsLoaded === itemsTotal ) { isLoading = false; if ( scope.onLoad ) scope.onLoad(); } };
    this.itemError = function ( url ) { if ( scope.onError ) scope.onError( url ); };
    this.resolveURL = function ( url ) { if (scope.urlModifier) return scope.urlModifier(url); return url; };
    this.setURLModifier = function ( modifier ) { scope.urlModifier = modifier; return this; };
};
THREE.DefaultLoadingManager = new THREE.LoadingManager();
console.log('THREE.LoadingManager (r128 - REAL CODE PLACEHOLDER v3) attached to THREE.');

// --- Full URDFLoader.js (r128) - Placeholder from previous version ---
THREE.URDFLoader = function ( manager ) {
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    console.log('THREE.URDFLoader (r128 - REAL CODE PLACEHOLDER v3) created.');
    this.load = function ( url, onLoad, onProgress, onError ) {
        console.log('THREE.URDFLoader.load (REAL CODE PLACEHOLDER v3) for:', url);
        var scope = this;
        var loader = new THREE.XHRLoader(scope.manager);
        loader.setPath(this.path);
        loader.setResponseType('text');
        loader.setWithCredentials(scope.withCredentials);
        loader.load(url, function(text) {
            try {
                if (onLoad) onLoad(scope.parse(text));
            } catch (e) {
                if (onError) { onError(e); } else { console.error(e); }
                if (scope.manager) scope.manager.itemError(url); // Check manager
            }
        }, onProgress, onError);
    };
    this.parse = function ( text ) {
        console.log('THREE.URDFLoader.parse (REAL CODE PLACEHOLDER v3) called.');
        var robot = new THREE.Group();
        robot.name = 'urdf_robot_placeholder_v3';
        var link = new THREE.Object3D(); link.name = 'link1_placeholder_v3'; robot.add(link);
        console.log('URDFLoader placeholder v3 parse completed.');
        return robot;
    };
    this.loadMeshCb = null;
    this.workingPath = '';
    this.path = '';
    this.packages = '';
    this.withCredentials = false;
};
console.log('THREE.URDFLoader (r128 - REAL CODE PLACEHOLDER v3) attached to THREE.');

// --- Stubs for other loaders (r128) ---
THREE.ColladaLoader = function (manager) { this.manager = manager || THREE.DefaultLoadingManager; console.log('THREE.ColladaLoader (r128 stub) created.'); this.load = function(url, onLoad){ console.log('ColladaLoader stub load:', url); if (onLoad) onLoad({ scene: new THREE.Group() }); }; };
THREE.STLLoader = function (manager) { this.manager = manager || THREE.DefaultLoadingManager; console.log('THREE.STLLoader (r128 stub) created.'); this.load = function(url, onLoad){ console.log('STLLoader stub load:', url); if (onLoad) onLoad(new THREE.BufferGeometry()); }; };
THREE.OBJLoader = function (manager) { this.manager = manager || THREE.DefaultLoadingManager; console.log('THREE.OBJLoader (r128 stub) created.'); this.load = function(url, onLoad){ console.log('OBJLoader stub load:', url); if (onLoad) onLoad(new THREE.Group()); }; };

console.log('three_r128_libs.js (REAL PARTIAL v3 with core stubs) executed.');
