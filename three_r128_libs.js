// three_r128_libs.js - More comprehensive stubs for Three.js r128 components (v2)

var THREE = (function() {
    console.log('THREE.js (r128 stub) initializing...');
    const THREE_INTERNAL = { REVISION: '128-comprehensive-stub-v2' }; // Version bump

    // --- Core Math Components ---
    THREE_INTERNAL.Vector2 = function(x, y) { this.x = x || 0; this.y = y || 0; };
    THREE_INTERNAL.Vector2.prototype = {
        set: function(x, y) { this.x = x; this.y = y; return this; },
        copy: function(v) { this.x = v.x; this.y = v.y; return this; },
        clone: function() { return new THREE_INTERNAL.Vector2(this.x, this.y); }
    };

    THREE_INTERNAL.Vector3 = function(x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; };
    THREE_INTERNAL.Vector3.prototype = {
        set: function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; },
        copy: function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; },
        add: function(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; },
        addScaledVector: function(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; },
        multiplyScalar: function(s) { this.x *= s; this.y *= s; this.z *= s; return this; },
        sub: function(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; },
        lengthSq: function() { return this.x * this.x + this.y * this.y + this.z * this.z; },
        length: function() { return Math.sqrt(this.lengthSq()); },
        normalize: function() { const l = this.length() || 1; this.x /= l; this.y /= l; this.z /= l; return this;},
        clone: function() { return new THREE_INTERNAL.Vector3(this.x, this.y, this.z); },
        dot: function(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    };

    THREE_INTERNAL.Quaternion = function(x,y,z,w) { this.x=x||0; this.y=y||0; this.z=z||0; this.w=(w===undefined)?1:w; };
    THREE_INTERNAL.Quaternion.prototype = {
        set: function(x,y,z,w) {this.x=x; this.y=y; this.z=z; this.w=w; return this;},
        copy: function(q) {this.x=q.x; this.y=q.y; this.z=q.z; this.w=q.w; return this;},
        clone: function() { return new THREE_INTERNAL.Quaternion(this.x, this.y, this.z, this.w); },
        multiplyQuaternions: function(a,b){ this.copy(a); return this; /*stub*/},
        premultiply: function(q){ return this; /*stub*/},
        setFromEuler: function(e){ return this; /*stub*/},
        normalize: function() {return this; /*stub*/},
        _applyToVector3: function(vector) { const x=vector.x,y=vector.y,z=vector.z; const qx=this.x,qy=this.y,qz=this.z,qw=this.w; const ix=qw*x+qy*z-qz*y,iy=qw*y+qz*x-qx*z,iz=qw*z+qx*y-qy*x,iw=-qx*x-qy*y-qz*z; vector.x=ix*qw+iw*-qx+iy*-qz-iz*-qy;vector.y=iy*qw+iw*-qy+iz*-qx-ix*-qz;vector.z=iz*qw+iw*-qz+ix*-qy-iy*-qx; return vector; }
    };
    THREE_INTERNAL.Vector3.prototype.applyQuaternion = function(q) { return q._applyToVector3(this); };

    THREE_INTERNAL.Euler = function() { /*stub*/ console.log('THREE.Euler (r128 stub) created'); };

    THREE_INTERNAL.Color = function(r, g, b) { if (g === undefined && b === undefined) { this.setHex(r); } else { this.setRGB(r,g,b); } };
    THREE_INTERNAL.Color.prototype = { setRGB: function(r,g,b) { this.r=r; this.g=g; this.b=b; return this;}, setHex: function(hex) { hex = Math.floor(hex); this.r = (hex >> 16 & 255) / 255; this.g = (hex >> 8 & 255) / 255; this.b = (hex & 255) / 255; return this;}, clone: function() { return new THREE_INTERNAL.Color(this.r, this.g, this.b); } };

    THREE_INTERNAL.Object3D = function() {
        this.position = new THREE_INTERNAL.Vector3();
        this.quaternion = new THREE_INTERNAL.Quaternion();
        this.children = [];
        this.up = new THREE_INTERNAL.Vector3(0,1,0);
        this.name = '';
        this.visible = true;
        this.parent = null;
        this.add = function(child) { if (child === this) { console.error('THREE.Object3D.add: Object cannot be child of itself.'); return this;} this.children.push(child); child.parent = this; return this; }; // Corrected string
        this.remove = function(child) { const index = this.children.indexOf(child); if (index !== -1) { child.parent = null; this.children.splice(index, 1);}};
        this.lookAt = function(vector_or_x, y, z) { console.log('Object3D.lookAt called (stub)');};
        this.getWorldDirection = function(target) { if(!target) target=new THREE_INTERNAL.Vector3(); return target.set(0,0,-1).applyQuaternion(this.quaternion);};
        this.traverse = function(callback) { callback(this); for(let i=0; i<this.children.length; i++) { this.children[i].traverse(callback); } };
    };

    THREE_INTERNAL.Group = function() { THREE_INTERNAL.Object3D.call(this); this.type = 'Group'; console.log('THREE.Group (r128 stub) created'); };
    THREE_INTERNAL.Group.prototype = Object.assign(Object.create(THREE_INTERNAL.Object3D.prototype), { constructor: THREE_INTERNAL.Group });

    THREE_INTERNAL.Scene = function() { THREE_INTERNAL.Object3D.call(this); this.type = 'Scene'; this.background = null; console.log('THREE.Scene (r128 stub) created');};
    THREE_INTERNAL.Scene.prototype = Object.assign(Object.create(THREE_INTERNAL.Object3D.prototype), { constructor: THREE_INTERNAL.Scene });

    THREE_INTERNAL.PerspectiveCamera = function(fov, aspect, near, far) { THREE_INTERNAL.Object3D.call(this); this.type='PerspectiveCamera'; this.fov=fov; this.aspect=aspect; this.near=near; this.far=far; this.updateProjectionMatrix = function(){ console.log('PerspectiveCamera.updateProjectionMatrix called (stub)');}; console.log('THREE.PerspectiveCamera (r128 stub) created');};
    THREE_INTERNAL.PerspectiveCamera.prototype = Object.assign(Object.create(THREE_INTERNAL.Object3D.prototype), { constructor: THREE_INTERNAL.PerspectiveCamera });

    THREE_INTERNAL.WebGLRenderer = function(params) { console.log('THREE.WebGLRenderer (r128 stub) created'); this.domElement = document.createElement('canvas'); this.domElement.width = 300; this.domElement.height = 150; if(params && params.canvas) {this.domElement = params.canvas;} this.setSize = function(width, height) { this.domElement.width = width; this.domElement.height = height; console.log('Renderer.setSize (r128 stub):', width, height); }; this.render = function(scene, camera) { /* console.log('Renderer.render called (stub)'); */ }; this.setAnimationLoop = function(callback) { this.animationLoop = callback; console.log('Renderer.setAnimationLoop set (stub).'); function loop() { if(this.animationLoop) {this.animationLoop();} requestAnimationFrame(loop.bind(this)); } requestAnimationFrame(loop.bind(this)); }.bind(this); };

    THREE_INTERNAL.AmbientLight = function(color, intensity) { THREE_INTERNAL.Object3D.call(this); this.type = 'AmbientLight'; this.color = new THREE_INTERNAL.Color(color); this.intensity = intensity; console.log('THREE.AmbientLight (r128 stub) created');};
    THREE_INTERNAL.AmbientLight.prototype = Object.assign(Object.create(THREE_INTERNAL.Object3D.prototype), { constructor: THREE_INTERNAL.AmbientLight });
    THREE_INTERNAL.DirectionalLight = function(color, intensity) { THREE_INTERNAL.Object3D.call(this); this.type = 'DirectionalLight'; this.color = new THREE_INTERNAL.Color(color); this.intensity = intensity; console.log('THREE.DirectionalLight (r128 stub) created');};
    THREE_INTERNAL.DirectionalLight.prototype = Object.assign(Object.create(THREE_INTERNAL.Object3D.prototype), { constructor: THREE_INTERNAL.DirectionalLight });

    THREE_INTERNAL.BoxGeometry = function(w,h,d) {this.type='BoxGeometry'; console.log('BoxGeometry (r128 stub) created:',w,h,d);};
    THREE_INTERNAL.SphereGeometry = function(r) {this.type='SphereGeometry'; console.log('SphereGeometry (r128 stub) created:',r);};
    THREE_INTERNAL.BufferGeometry = function() {this.type='BufferGeometry'; console.log('BufferGeometry (r128 stub) created');};

    THREE_INTERNAL.MeshPhongMaterial = function(params) { this.type='MeshPhongMaterial'; this.color = (params && params.color) ? params.color : new THREE_INTERNAL.Color(0xffffff); this.wireframe = (params && params.wireframe) || false; this.name = (params && params.name) || ''; console.log('MeshPhongMaterial (r128 stub) created:', params);};

    THREE_INTERNAL.Mesh = function(geometry, material) { THREE_INTERNAL.Object3D.call(this); this.type = 'Mesh'; this.geometry = geometry; this.material = material; console.log('Mesh (r128 stub) created');};
    THREE_INTERNAL.Mesh.prototype = Object.assign(Object.create(THREE_INTERNAL.Object3D.prototype), { constructor: THREE_INTERNAL.Mesh });

    THREE_INTERNAL.Plane = function() {this.type='Plane'; this.normal = new THREE_INTERNAL.Vector3(0,1,0); this.constant = 0; this.setFromNormalAndCoplanarPoint=function(n,p){this.normal.copy(n); this.constant = -p.dot(this.normal); return this;}; console.log('THREE.Plane (r128 stub) created');};

    THREE_INTERNAL.Raycaster = function(origin, direction, near, far){ this.ray={origin: origin || new THREE_INTERNAL.Vector3(), direction: direction || new THREE_INTERNAL.Vector3()}; this.near=near||0; this.far=far||Infinity; this.params = {}; this.setFromCamera=function(coords, camera){ console.log('Raycaster.setFromCamera (r128 stub) called'); this.ray.origin.set(0,0,0); this.ray.direction.set(coords.x, coords.y, -1).normalize(); }; this.intersectObject=function(object, recursive){ console.log('Raycaster.intersectObject (r128 stub) called on object:', object ? object.name : 'no object'); return[]; }; this.ray.intersectPlane = function(plane, optionalTarget) { console.log('Raycaster.ray.intersectPlane (r128 stub) called'); if (optionalTarget) { return optionalTarget.set(1,1,0); } return new THREE_INTERNAL.Vector3(1,1,0); }; console.log('THREE.Raycaster (r128 stub) created');};

    THREE_INTERNAL.Clock = function(autoStart) { this.autoStart = (autoStart !== undefined) ? autoStart : true; this.startTime = 0; this.oldTime = 0; this.elapsedTime = 0; this.running = false; if (this.autoStart) this.start(); console.log('THREE.Clock (r128 stub) created');};
    THREE_INTERNAL.Clock.prototype = { start: function() {this.startTime = (typeof performance === 'undefined' ? Date : performance).now(); this.oldTime = this.startTime; this.elapsedTime = 0; this.running = true;}, stop: function(){this.getElapsedTime(); this.running = false; return this;}, getElapsedTime: function(){this.getDelta(); return this.elapsedTime;}, getDelta: function(){ let diff = 0; if (this.running) { const newTime = (typeof performance === 'undefined' ? Date : performance).now(); diff = (newTime - this.oldTime) / 1000; this.oldTime = newTime; this.elapsedTime += diff; } return diff; } };

    THREE_INTERNAL.Box3 = function(min, max) { this.min = (min !== undefined) ? min : new THREE_INTERNAL.Vector3(+Infinity,+Infinity,+Infinity); this.max = (max !== undefined) ? max : new THREE_INTERNAL.Vector3(-Infinity,-Infinity,-Infinity); console.log('THREE.Box3 (r128 stub) created');};
    THREE_INTERNAL.Box3.prototype = { setFromObject: function(object){ console.log('Box3.setFromObject (r128 stub) called for object:', object ? object.name : 'no object'); this.min.set(-0.5, -0.5, -0.5); this.max.set( 0.5,  0.5,  0.5); if (object && object.children && object.children.length === 0 && (!object.geometry && !object.material)) { this.min.set(0,0,0); this.max.set(0,0,0); } return this; }, getCenter: function(target){ if (!target) {target = new THREE_INTERNAL.Vector3();} return target.copy(this.min).add(this.max).multiplyScalar(0.5);}, getSize: function(target){ if (!target) {target = new THREE_INTERNAL.Vector3();} return target.copy(this.max).sub(this.min);}, getBoundingSphere: function(target){ if (!target) {target = new THREE_INTERNAL.Sphere();} this.getCenter(target.center); target.radius = this.getSize(new THREE_INTERNAL.Vector3()).length() * 0.5; console.log('Box3.getBoundingSphere (r128 stub) calculated center:', target.center, 'radius:', target.radius); return target; } };

    THREE_INTERNAL.Sphere = function(center, radius){ this.center = (center !== undefined) ? center : new THREE_INTERNAL.Vector3(); this.radius = (radius !== undefined) ? radius : -1; console.log('THREE.Sphere (r128 stub) created');};

    // End of THREE_INTERNAL definitions
    return THREE_INTERNAL;
})(); // End of THREE IIFE

// --- Loader Stubs (r128, attaching to global THREE) ---
THREE.LoadingManager = function ( onLoad, onProgress, onError ) {
    console.log('THREE.LoadingManager (r128 stub) created.');
    this.onLoad = onLoad; this.onProgress = onProgress; this.onError = onError;
    var scope = this; var isLoading = false; var itemsLoaded = 0; var itemsTotal = 0;
    this.itemStart = function ( url ) { itemsTotal++; isLoading = true; if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); };
    this.itemEnd = function ( url ) { itemsLoaded++; if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); if ( itemsLoaded === itemsTotal ) { isLoading = false; if ( scope.onLoad ) scope.onLoad(); } };
    this.itemError = function ( url ) { if ( scope.onError ) scope.onError( url ); };
};
console.log('THREE.LoadingManager (r128 stub) defined.');

THREE.URDFLoader = function ( manager ) {
    this.manager = ( manager !== undefined ) ? manager : new THREE.LoadingManager();
    console.log('THREE.URDFLoader (r128 stub) created.');
    this.load = function ( url, onLoad, onProgress, onError ) { console.log('THREE.URDFLoader.load (r128 stub) called for:', url); if (onLoad) { var result = new THREE.Group(); result.name=url; onLoad(result); } }; // Changed to use THREE.Group from stub
    this.parse = function ( text ) { console.log('THREE.URDFLoader.parse (r128 stub) called.'); var result = new THREE.Group(); result.name='parsed_urdf'; return result; }; // Changed to use THREE.Group from stub
    this.loadMeshCb = null;
    this.workingPath = '';
    this.path = '';
};
console.log('THREE.URDFLoader (r128 stub) defined.');

THREE.STLLoader = function (manager) { this.manager = manager || new THREE.LoadingManager(); console.log('THREE.STLLoader (r128 stub) created.'); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){ console.log('STLLoader (r128 stub) load:', (this.path||'')+url ); onLoad(new THREE.BufferGeometry()); }; };
THREE.OBJLoader = function (manager) { this.manager = manager || new THREE.LoadingManager(); console.log('THREE.OBJLoader (r128 stub) created.'); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){ console.log('OBJLoader (r128 stub) load:', (this.path||'')+url ); onLoad(new THREE.Group()); }; };
THREE.ColladaLoader = function (manager) { this.manager = manager || new THREE.LoadingManager(); console.log('THREE.ColladaLoader (r128 stub) created.'); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){ console.log('ColladaLoader (r128 stub) load:', (this.path||'')+url ); onLoad({ scene: new THREE.Group() }); }; };
console.log('Other loader stubs (r128) defined.');

console.log('three_r128_libs.js (Comprehensive Stubs v2) executed.');
