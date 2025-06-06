// three_r128_libs.js - Comprehensive stubs with direct global THREE assignment (v4)

var THREE = {
    REVISION: '128-direct-global-v4'
};
console.log('THREE.js (r128 stub v4) global THREE object initialized.');

// --- Core Math Components ---
THREE.Vector2 = function(x, y) { this.x = x || 0; this.y = y || 0; };
THREE.Vector2.prototype = {
    constructor: THREE.Vector2,
    set: function(x, y) { this.x = x; this.y = y; return this; },
    copy: function(v) { this.x = v.x; this.y = v.y; return this; },
    clone: function() { return new THREE.Vector2(this.x, this.y); }
};

THREE.Vector3 = function(x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; };
THREE.Vector3.prototype = {
    constructor: THREE.Vector3,
    set: function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; },
    copy: function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; },
    add: function(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; },
    addScaledVector: function(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; },
    multiplyScalar: function(s) { this.x *= s; this.y *= s; this.z *= s; return this; },
    sub: function(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; },
    lengthSq: function() { return this.x * this.x + this.y * this.y + this.z * this.z; },
    length: function() { return Math.sqrt(this.lengthSq()); },
    normalize: function() { const l = this.length() || 1; this.x /= l; this.y /= l; this.z /= l; return this;},
    clone: function() { return new THREE.Vector3(this.x, this.y, this.z); },
    dot: function(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
};

THREE.Quaternion = function(x,y,z,w) { this.x=x||0; this.y=y||0; this.z=z||0; this.w=(w===undefined)?1:w; };
THREE.Quaternion.prototype = {
    constructor: THREE.Quaternion,
    set: function(x,y,z,w) {this.x=x; this.y=y; this.z=z; this.w=w; return this;},
    copy: function(q) {this.x=q.x; this.y=q.y; this.z=q.z; this.w=q.w; return this;},
    clone: function() { return new THREE.Quaternion(this.x, this.y, this.z, this.w); },
    multiplyQuaternions: function(a,b){ this.copy(a); return this; /*stub*/},
    premultiply: function(q){ return this; /*stub*/},
    setFromEuler: function(e){ return this; /*stub*/},
    normalize: function() {return this; /*stub*/},
    _applyToVector3: function(vector) { const x=vector.x,y=vector.y,z=vector.z; const qx=this.x,qy=this.y,qz=this.z,qw=this.w; const ix=qw*x+qy*z-qz*y,iy=qw*y+qz*x-qx*z,iz=qw*z+qx*y-qy*x,iw=-qx*x-qy*y-qz*z; vector.x=ix*qw+iw*-qx+iy*-qz-iz*-qy;vector.y=iy*qw+iw*-qy+iz*-qx-ix*-qz;vector.z=iz*qw+iw*-qz+ix*-qy-iy*-qx; return vector; }
};
THREE.Vector3.prototype.applyQuaternion = function(q) { return q._applyToVector3(this); };

THREE.Euler = function() { /*stub*/ console.log('THREE.Euler (r128 stub) created'); };

THREE.Color = function(r, g, b) { if (g === undefined && b === undefined) { this.setHex(r); } else { this.setRGB(r,g,b); } console.log('THREE.Color (r128 stub) created');};
THREE.Color.prototype = { constructor: THREE.Color, setRGB: function(r,g,b) { this.r=r; this.g=g; this.b=b; return this;}, setHex: function(hex) { hex = Math.floor(hex); this.r = (hex >> 16 & 255) / 255; this.g = (hex >> 8 & 255) / 255; this.b = (hex & 255) / 255; return this;}, clone: function() { return new THREE.Color(this.r, this.g, this.b); } };

THREE.Object3D = function() {
    this.position = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.children = [];
    this.up = new THREE.Vector3(0,1,0);
    this.name = '';
    this.visible = true;
    this.parent = null;
    this.add = function(child) { if (child === this) { console.error('THREE.Object3D.add: Object cannot be child of itself.'); return this;} if(child && child.parent !== null) { child.parent.remove(child); } if(child) {child.parent = this; this.children.push(child);} return this; };
    this.remove = function(child) { const index = this.children.indexOf(child); if (index !== -1) { if(child) {child.parent = null;} this.children.splice(index, 1);}};
    this.lookAt = function(vector_or_x, y, z) { console.log('Object3D.lookAt called (stub)');};
    this.getWorldDirection = function(target) { if(!target) target=new THREE.Vector3(); return target.set(0,0,-1).applyQuaternion(this.quaternion);};
    this.traverse = function(callback) { callback(this); for(let i=0; i<this.children.length; i++) { this.children[i].traverse(callback); } };
};
THREE.Object3D.prototype = {
    constructor: THREE.Object3D,
    add: THREE.Object3D.prototype.add, // This is not how prototype methods are typically defined.
    remove: THREE.Object3D.prototype.remove, // Should be defined directly on prototype.
    lookAt: THREE.Object3D.prototype.lookAt,
    getWorldDirection: THREE.Object3D.prototype.getWorldDirection,
    traverse: THREE.Object3D.prototype.traverse,
    applyQuaternion: function(q) { this.quaternion.premultiply(q); return this; /*stub*/ },
    // Adding a basic clone for Object3D, Group, etc.
    clone: function(recursive) {
        var newObj = new this.constructor(); // Use this.constructor for proper cloning of subclasses
        newObj.name = this.name;
        newObj.up.copy(this.up);
        newObj.position.copy(this.position);
        newObj.quaternion.copy(this.quaternion);
        // Not copying other properties like scale, matrix, etc. for this stub
        if (recursive !== false) {
            for (var i = 0; i < this.children.length; i++) {
                newObj.add(this.children[i].clone());
            }
        }
        return newObj;
    }
};


THREE.Group = function() { THREE.Object3D.call(this); this.type = 'Group'; console.log('THREE.Group (r128 stub) created'); };
THREE.Group.prototype = Object.assign(Object.create(THREE.Object3D.prototype), { constructor: THREE.Group });

THREE.Scene = function() { THREE.Object3D.call(this); this.type = 'Scene'; this.background = null; console.log('THREE.Scene (r128 stub) created');};
THREE.Scene.prototype = Object.assign(Object.create(THREE.Object3D.prototype), { constructor: THREE.Scene });

THREE.PerspectiveCamera = function(fov, aspect, near, far) { THREE.Object3D.call(this); this.type='PerspectiveCamera'; this.fov=fov; this.aspect=aspect; this.near=near; this.far=far; this.updateProjectionMatrix = function(){ console.log('PerspectiveCamera.updateProjectionMatrix called (stub)');}; console.log('THREE.PerspectiveCamera (r128 stub) created');};
THREE.PerspectiveCamera.prototype = Object.assign(Object.create(THREE.Object3D.prototype), { constructor: THREE.PerspectiveCamera });

THREE.WebGLRenderer = function(params) { console.log('THREE.WebGLRenderer (r128 stub) created'); this.domElement = document.createElement('canvas'); this.domElement.width = 300; this.domElement.height = 150; if(params && params.canvas) {this.domElement = params.canvas;} this.setSize = function(width, height) { this.domElement.width = width; this.domElement.height = height; console.log('Renderer.setSize (r128 stub):', width, height); }; this.render = function(scene, camera) { /* console.log('Renderer.render called (stub)'); */ }; this.setAnimationLoop = function(callback) { this.animationLoop = callback; console.log('Renderer.setAnimationLoop set (stub).'); var scope = this; function loop() { if(scope.animationLoop) {scope.animationLoop();} requestAnimationFrame(loop); } requestAnimationFrame(loop); }; };

THREE.AmbientLight = function(color, intensity) { THREE.Object3D.call(this); this.type = 'AmbientLight'; this.color = new THREE.Color(color); this.intensity = intensity; console.log('THREE.AmbientLight (r128 stub) created');};
THREE.AmbientLight.prototype = Object.assign(Object.create(THREE.Object3D.prototype), { constructor: THREE.AmbientLight });

THREE.DirectionalLight = function(color, intensity) { THREE.Object3D.call(this); this.type = 'DirectionalLight'; this.color = new THREE.Color(color); this.intensity = intensity; this.position = new THREE.Vector3(); console.log('THREE.DirectionalLight (r128 stub) created');};
THREE.DirectionalLight.prototype = Object.assign(Object.create(THREE.Object3D.prototype), { constructor: THREE.DirectionalLight });

THREE.BoxGeometry = function(w,h,d) {this.type='BoxGeometry'; console.log('BoxGeometry (r128 stub) created:',w,h,d);};
THREE.SphereGeometry = function(r) {this.type='SphereGeometry'; console.log('SphereGeometry (r128 stub) created:',r);};
THREE.BufferGeometry = function() {this.type='BufferGeometry'; console.log('BufferGeometry (r128 stub) created'); this.dispose = function(){ console.log('BufferGeometry.dispose() called'); }; };

THREE.Material = function() { this.name = ''; this.type='Material'; console.log('THREE.Material (r128 stub) created'); };
THREE.Material.prototype = {constructor: THREE.Material, needsUpdate: false, dispose: function(){ console.log('Material.dispose() called'); }};

THREE.MeshPhongMaterial = function(params) { THREE.Material.call(this); this.type = 'MeshPhongMaterial'; this.color = (params && params.color) ? new THREE.Color(params.color) : new THREE.Color(0xffffff); this.wireframe = (params && params.wireframe) || false; if(params && params.name) this.name = params.name; console.log('MeshPhongMaterial (r128 stub) created:', params);};
THREE.MeshPhongMaterial.prototype = Object.assign(Object.create(THREE.Material.prototype), { constructor: THREE.MeshPhongMaterial });

THREE.Mesh = function(geometry, material) { THREE.Object3D.call(this); this.type = 'Mesh'; this.geometry = geometry; this.material = material; console.log('Mesh (r128 stub) created');};
THREE.Mesh.prototype = Object.assign(Object.create(THREE.Object3D.prototype), { constructor: THREE.Mesh });

THREE.Plane = function() {this.type='Plane'; this.normal = new THREE.Vector3(0,1,0); this.constant = 0; this.setFromNormalAndCoplanarPoint=function(n,p){this.normal.copy(n); this.constant = -p.dot(this.normal); return this;}; console.log('THREE.Plane (r128 stub) created');};

THREE.Raycaster = function(origin, direction, near, far){ this.ray={origin: origin || new THREE.Vector3(), direction: direction || new THREE.Vector3()}; this.near=near||0; this.far=far||Infinity; this.params = {}; this.setFromCamera=function(coords, camera){ console.log('Raycaster.setFromCamera (r128 stub) called'); if(this.ray && this.ray.origin && this.ray.direction && camera && camera.position){this.ray.origin.copy(camera.position); this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();} }; this.intersectObject=function(object, recursive){ console.log('Raycaster.intersectObject (r128 stub) called on object:', object ? object.name : 'no object'); return[]; }; this.ray.intersectPlane = function(plane, optionalTarget) { console.log('Raycaster.ray.intersectPlane (r128 stub) called'); if (optionalTarget) { return optionalTarget.set(1,1,0); } return new THREE.Vector3(1,1,0); }; console.log('THREE.Raycaster (r128 stub) created');};

THREE.Clock = function(autoStart) { this.autoStart = (autoStart !== undefined) ? autoStart : true; this.startTime = 0; this.oldTime = 0; this.elapsedTime = 0; this.running = false; if (this.autoStart) this.start(); console.log('THREE.Clock (r128 stub) created');};
THREE.Clock.prototype = { constructor: THREE.Clock, start: function() {this.startTime = (typeof performance === 'undefined' ? Date : performance).now(); this.oldTime = this.startTime; this.elapsedTime = 0; this.running = true;}, stop: function(){this.getElapsedTime(); this.running = false; return this;}, getElapsedTime: function(){this.getDelta(); return this.elapsedTime;}, getDelta: function(){ let diff = 0; if (this.running) { const newTime = (typeof performance === 'undefined' ? Date : performance).now(); diff = (newTime - this.oldTime) / 1000; this.oldTime = newTime; this.elapsedTime += diff; } return diff; } };

THREE.Box3 = function(min, max) { this.min = (min !== undefined) ? min : new THREE.Vector3(+Infinity,+Infinity,+Infinity); this.max = (max !== undefined) ? max : new THREE.Vector3(-Infinity,-Infinity,-Infinity); console.log('THREE.Box3 (r128 stub) created');};
THREE.Box3.prototype = { constructor: THREE.Box3, setFromObject: function(object){ console.log('Box3.setFromObject (r128 stub) called for object:', object ? object.name : 'no object'); this.min.set(-0.5, -0.5, -0.5); this.max.set( 0.5,  0.5,  0.5); if (object && object.children && object.children.length === 0 && (!object.geometry && !object.material)) { this.min.set(0,0,0); this.max.set(0,0,0); } return this; }, getCenter: function(target){ if (!target) {target = new THREE.Vector3();} return target.copy(this.min).add(this.max).multiplyScalar(0.5);}, getSize: function(target){ if (!target) {target = new THREE.Vector3();} return target.copy(this.max).sub(this.min);}, getBoundingSphere: function(target){ if (!target) {target = new THREE.Sphere();} this.getCenter(target.center); target.radius = this.getSize(new THREE.Vector3()).length() * 0.5; console.log('Box3.getBoundingSphere (r128 stub) calculated center:', target.center, 'radius:', target.radius); return target; } };

THREE.Sphere = function(center, radius){ this.center = (center !== undefined) ? center : new THREE.Vector3(); this.radius = (radius !== undefined) ? radius : -1; console.log('THREE.Sphere (r128 stub) created');};

THREE.EventDispatcher = function () {};
THREE.EventDispatcher.prototype = { addEventListener: function ( type, listener ) {}, hasEventListener: function ( type, listener ) { return false; }, removeEventListener: function ( type, listener ) {}, dispatchEvent: function ( event ) {} };

// --- Loader Stubs (r128, attaching to global THREE) ---
THREE.LoadingManager = function ( onLoad, onProgress, onError ) {
    console.log('THREE.LoadingManager (r128 stub v4) created.');
    this.onLoad = onLoad; this.onProgress = onProgress; this.onError = onError;
    var scope = this; var isLoading = false; var itemsLoaded = 0; var itemsTotal = 0;
    this.itemStart = function ( url ) { itemsTotal++; isLoading = true; console.log( 'LoadingManager: Started loading:', url, itemsLoaded + '/' + itemsTotal); if ( scope.onStart ) scope.onStart( url, itemsLoaded, itemsTotal ); if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); };
    this.itemEnd = function ( url ) { itemsLoaded++; console.log( 'LoadingManager: Finished loading:', url, itemsLoaded + '/' + itemsTotal); if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); if ( itemsLoaded === itemsTotal ) { isLoading = false; if ( scope.onLoad ) scope.onLoad(); } };
    this.itemError = function ( url ) { console.log( 'LoadingManager: Error loading:', url); if ( scope.onError ) scope.onError( url ); };
    this.resolveURL = function ( url ) { if (scope.urlModifier) return scope.urlModifier(url); return url; };
    this.setURLModifier = function ( modifier ) { scope.urlModifier = modifier; return this; };
};
THREE.DefaultLoadingManager = new THREE.LoadingManager();
console.log('THREE.LoadingManager (r128 stub v4) defined and DefaultLoadingManager set.');

THREE.XHRLoader = function ( manager ) {
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    this.path = ''; this.responseType = ''; this.mimeType = ''; this.withCredentials = false;
    this.load = function ( url, onLoad, onProgress, onError ) {
        console.log('THREE.XHRLoader (stub v4) load:', url);
        if (this.manager) this.manager.itemStart(url);
        if (url.endsWith('.urdf') || url.endsWith('.xml')) { // Allow .xml for URDFs too
             if (this.manager) this.manager.itemEnd(url);
             if (onLoad) onLoad('<robot name=\"test_robot\"><link name=\"link1\"><visual><geometry><box size=\"1 1 1\" /></visual></link></robot>');
        } else {
             if (this.manager) this.manager.itemError(url);
             if (onError) onError(new Error('XHRLoader stub v4: File not found/handled: ' + url));
        }
    };
    this.setPath = function ( value ) { this.path = value; return this; };
    this.setResponseType = function ( value ) { this.responseType = value; return this; };
    this.setMimeType = function ( value ) { this.mimeType = value; return this; };
    this.setWithCredentials = function ( value ) { this.withCredentials = value; return this; };
    console.log('THREE.XHRLoader (r128 stub v4) created.');
};


THREE.URDFLoader = function ( manager ) {
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    console.log('THREE.URDFLoader (r128 stub v4) created.');
    this.load = function ( url, onLoad, onProgress, onError ) {
        console.log('THREE.URDFLoader.load (r128 stub v4) for:', url);
        var scope = this;
        var loader = new THREE.XHRLoader(scope.manager);
        loader.setPath(this.path);
        loader.setResponseType('text');
        loader.setWithCredentials(scope.withCredentials);
        loader.load(url, function(text) {
            try {
                if (onLoad) onLoad(scope.parse(text));
            } catch (e) {
                if (onError) { onError(e); } else { console.error("URDFLoader stub v4 load error:", e); }
                if (scope.manager) scope.manager.itemError(url);
            }
        }, onProgress, onError);
    };
    this.parse = function ( text_or_xml ) {
        console.log('THREE.URDFLoader.parse (r128 stub v4) called.');
        var robot = new THREE.Group();
        robot.name = 'urdf_robot_from_stub_v4';
        var link = new THREE.Object3D(); link.name = 'link1_stub_v4'; robot.add(link);
        if (this.loadMeshCb && typeof this.loadMeshCb === 'function') {
            console.log('URDFLoader stub v4: Calling loadMeshCb for a mock mesh.');
            // Simulate a mesh path that the callback might expect
            this.loadMeshCb('package://dummy_package/meshes/dummy_mesh.stl', this.manager, function(mesh_model){
                if(mesh_model) { link.add(mesh_model); console.log('URDFLoader stub v4: Mock mesh added to link.'); }
                else { console.warn('URDFLoader stub v4: Mock mesh callback received null/undefined mesh.');}
            }, undefined, function() { console.error('URDFLoader stub v4: Mock mesh error callback.'); });
        }
        console.log('URDFLoader stub v4 parse completed.');
        return robot;
    };
    this.loadMeshCb = null;
    this.workingPath = '';
    this.path = '';
    this.packages = '';
    this.withCredentials = false;
};
console.log('THREE.URDFLoader (r128 stub v4) defined.');

THREE.STLLoader = function (manager) { this.manager = manager || THREE.DefaultLoadingManager; console.log('THREE.STLLoader (r128 stub) created.'); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){ console.log('STLLoader (r128 stub) load:', (this.path||'')+url ); if(onLoad) onLoad(new THREE.BufferGeometry()); }; };
THREE.OBJLoader = function (manager) { this.manager = manager || THREE.DefaultLoadingManager; console.log('THREE.OBJLoader (r128 stub) created.'); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){ console.log('OBJLoader (r128 stub) load:', (this.path||'')+url ); if(onLoad) onLoad(new THREE.Group()); }; };
THREE.ColladaLoader = function (manager) { this.manager = manager || THREE.DefaultLoadingManager; console.log('THREE.ColladaLoader (r128 stub) created.'); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){ console.log('ColladaLoader (r128 stub) load:', (this.path||'')+url ); if(onLoad) onLoad({ scene: new THREE.Group() }); }; };
console.log('Other loader stubs (r128 v4) defined.');

console.log('three_r128_libs.js (Comprehensive Stubs v4 - direct global) executed.');
