// three_with_loaders.bundle.js (More Functional, but still partial, Bundle)
// This simulates replacing stubs with a working, albeit incomplete, library.
// The real bundle would contain the full minified Three.js r158 and loaders.

(function() { // IIFE to encapsulate and manage scope

    console.log('Executing three_with_loaders.bundle.js (Functional Partial Bundle)...');

    // --- Minimal THREE.js Core Simulation ---
    const THREE_CORE = {};
    THREE_CORE.REVISION = '158-partial-bundle';

    THREE_CORE.Vector3 = function(x, y, z) {
        this.x = x || 0; this.y = y || 0; this.z = z || 0;
    };
    THREE_CORE.Vector3.prototype = {
        set: function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; },
        copy: function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; },
        addScaledVector: function(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; },
        normalize: function() { const l = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z) || 1; this.x/=l; this.y/=l; this.z/=l; return this;},
        clone: function() { return new THREE_CORE.Vector3(this.x, this.y, this.z); }
    };
    THREE_CORE.Quaternion = function(x,y,z,w) { this.x=x||0; this.y=y||0; this.z=z||0; this.w=(w===undefined)?1:w; };
    THREE_CORE.Quaternion.prototype = {
        set: function(x,y,z,w) {this.x=x; this.y=y; this.z=z; this.w=w; return this;},
        copy: function(q) {this.x=q.x; this.y=q.y; this.z=q.z; this.w=q.w; return this;},
        clone: function() { return new THREE_CORE.Quaternion(this.x, this.y, this.z, this.w); }
    };
    THREE_CORE.Color = function(r, g, b) {
        if (g === undefined && b === undefined) { this.setHex(r); } else { this.setRGB(r,g,b); }
    };
    THREE_CORE.Color.prototype = {
        setRGB: function(r,g,b) { this.r=r; this.g=g; this.b=b; return this;},
        setHex: function(hex) { hex = Math.floor(hex); this.r = (hex >> 16 & 255) / 255; this.g = (hex >> 8 & 255) / 255; this.b = (hex & 255) / 255; return this;},
        clone: function() { return new THREE_CORE.Color(this.r, this.g, this.b); }
    };
    THREE_CORE.Object3D = function() {
        this.position = new THREE_CORE.Vector3();
        this.quaternion = new THREE_CORE.Quaternion();
        this.children = [];
        this.up = new THREE_CORE.Vector3(0,1,0);
        this.name = '';
        this.visible = true;
        this.add = function(child) { if (child === this) { console.error('THREE.Object3D.add: An object can\'t be added as a child of itself.'); return this;} this.children.push(child); child.parent = this; return this; };
        this.remove = function(child) { const index = this.children.indexOf(child); if (index !== -1) { child.parent = null; this.children.splice(index, 1);}};
        this.lookAt = function(vector) { /* simplified */ console.log('Object3D.lookAt called');};
        this.getWorldDirection = function(target) { return target.set(0,0,-1).applyQuaternion(this.quaternion);}; // Simplified
        this.traverse = function(callback) { callback(this); for(let i=0; i<this.children.length; i++) { this.children[i].traverse(callback); } };
    };
    THREE_CORE.Group = function() { THREE_CORE.Object3D.call(this); this.type = 'Group'; };
    THREE_CORE.Group.prototype = Object.assign(Object.create(THREE_CORE.Object3D.prototype), { constructor: THREE_CORE.Group });
    THREE_CORE.Scene = function() { THREE_CORE.Object3D.call(this); this.type = 'Scene'; this.background = null; };
    THREE_CORE.Scene.prototype = Object.assign(Object.create(THREE_CORE.Object3D.prototype), { constructor: THREE_CORE.Scene });
    THREE_CORE.PerspectiveCamera = function(fov, aspect, near, far) { THREE_CORE.Object3D.call(this); this.type='PerspectiveCamera'; this.fov=fov; this.aspect=aspect; this.near=near; this.far=far; this.updateProjectionMatrix = function(){ console.log('PerspectiveCamera.updateProjectionMatrix called');};};
    THREE_CORE.PerspectiveCamera.prototype = Object.assign(Object.create(THREE_CORE.Object3D.prototype), { constructor: THREE_CORE.PerspectiveCamera });
    THREE_CORE.WebGLRenderer = function(params) {
        console.log('THREE.WebGLRenderer functional stub created');
        this.domElement = document.createElement('canvas');
        this.domElement.width = (params && params.canvas) ? params.canvas.width : 300;
        this.domElement.height = (params && params.canvas) ? params.canvas.height : 150;
        this.setSize = function(width, height) { this.domElement.width = width; this.domElement.height = height; console.log('Renderer.setSize:', width, height); };
        this.render = function(scene, camera) { /* console.log('Renderer.render called'); */ }; // Too noisy
        this.setAnimationLoop = function(callback) { this.animationLoop = callback; console.log('Renderer.setAnimationLoop set.'); function loop() { callback(); requestAnimationFrame(loop); } requestAnimationFrame(loop); };
    };
    THREE_CORE.AmbientLight = function(color, intensity) { THREE_CORE.Object3D.call(this); this.type = 'AmbientLight'; this.color = new THREE_CORE.Color(color); this.intensity = intensity;};
    THREE_CORE.AmbientLight.prototype = Object.assign(Object.create(THREE_CORE.Object3D.prototype), { constructor: THREE_CORE.AmbientLight });
    THREE_CORE.DirectionalLight = function(color, intensity) { THREE_CORE.Object3D.call(this); this.type = 'DirectionalLight'; this.color = new THREE_CORE.Color(color); this.intensity = intensity;};
    THREE_CORE.DirectionalLight.prototype = Object.assign(Object.create(THREE_CORE.Object3D.prototype), { constructor: THREE_CORE.DirectionalLight });
    THREE_CORE.BoxGeometry = function(w,h,d) {this.type='BoxGeometry'; console.log('BoxGeometry created:',w,h,d);};
    THREE_CORE.SphereGeometry = function(r) {this.type='SphereGeometry'; console.log('SphereGeometry created:',r);};
    THREE_CORE.MeshPhongMaterial = function(params) { this.type='MeshPhongMaterial'; this.color = params.color || new THREE_CORE.Color(0xffffff); this.wireframe = params.wireframe || false; this.name = params.name || ''; console.log('MeshPhongMaterial created:', params);};
    THREE_CORE.Mesh = function(geometry, material) { THREE_CORE.Object3D.call(this); this.type = 'Mesh'; this.geometry = geometry; this.material = material; console.log('Mesh created');};
    THREE_CORE.Mesh.prototype = Object.assign(Object.create(THREE_CORE.Object3D.prototype), { constructor: THREE_CORE.Mesh });
    THREE_CORE.Plane = function() {this.type='Plane'; this.normal = new THREE_CORE.Vector3(0,1,0); this.constant = 0; this.setFromNormalAndCoplanarPoint=function(n,p){this.normal.copy(n); this.constant = -p.dot(this.normal); return this;};}; // Simplified Plane
    THREE_CORE.Raycaster = function(o,d,n,f){this.ray={origin:new THREE_CORE.Vector3(),direction:new THREE_CORE.Vector3()}; this.near=n||0; this.far=f||Infinity; this.setFromCamera=function(coords,cam){console.log('Raycaster.setFromCamera');}; this.intersectObject=function(obj,recursive){console.log('Raycaster.intersectObject'); return[];};};
    THREE_CORE.LoadingManager = function(onLoad,onProgress,onError){this.onLoad=onLoad;this.onProgress=onProgress;this.onError=onError; this.itemStart=function(url){console.log('LoadingManager: itemStart',url)};this.itemEnd=function(url){console.log('LoadingManager: itemEnd',url); if(this.onLoad && !this.loading)this.onLoad();};this.itemError=function(url){console.log('LoadingManager: itemError',url); if(this.onError)this.onError(url);}; console.log('LoadingManager created');};
    THREE_CORE.Clock = function(autoStart) { this.autoStart = (autoStart !== undefined) ? autoStart : true; this.startTime = 0; this.oldTime = 0; this.elapsedTime = 0; this.running = false; if (this.autoStart) this.start(); };
    THREE_CORE.Clock.prototype = { start: function() {this.startTime=performance.now(); this.oldTime=this.startTime; this.elapsedTime=0; this.running=true;}, stop:function(){this.getElapsedTime();this.running=false;}, getElapsedTime:function(){this.getDelta();return this.elapsedTime;}, getDelta:function(){let diff=0;if(this.running){const newTime=performance.now();diff=(newTime-this.oldTime)/1000;this.oldTime=newTime;this.elapsedTime+=diff;}return diff;}};
    THREE_CORE.Box3 = function(min, max) { this.min = (min !== undefined) ? min : new THREE_CORE.Vector3(+Infinity,+Infinity,+Infinity); this.max = (max !== undefined) ? max : new THREE_CORE.Vector3(-Infinity,-Infinity,-Infinity);};
    THREE_CORE.Box3.prototype = { setFromObject: function(obj){console.log('Box3.setFromObject (stub)'); return this;}, getCenter: function(target){return target.copy(this.min).add(this.max).multiplyScalar(0.5);}, getSize:function(target){return target.copy(this.max).sub(this.min);}, getBoundingSphere: function(target){console.log('Box3.getBoundingSphere (stub)'); target.radius=this.getSize(new THREE_CORE.Vector3()).length()/2; target.center.copy(this.getCenter(new THREE_CORE.Vector3())); return target;}};
    THREE_CORE.Sphere = function(center, radius){ this.center = (center !== undefined) ? center : new THREE_CORE.Vector3(); this.radius = (radius !== undefined) ? radius : -1;};

    window.THREE = THREE_CORE;

    // --- Loader Implementations (Simplified stubs for brevity in this example) ---
    // In a real scenario, the full minified code for these loaders would be here.
    window.URDFLoader = function(manager) {
        this.manager = manager || new window.THREE.LoadingManager();
        this.path = '';
        this.workingPath = '';
        this.loadMeshCb = function() {}; // Default
        this.parse = function(content, path) {
            console.log('URDFLoader (functional stub): Parsing content. Path:', path);
            this.path = path || '';
            const robot = new window.THREE.Group();
            robot.name = 'robot_from_urdf_stub';
            // Simulate trying to load one mesh
            if (this.loadMeshCb) {
                this.manager.itemStart('stub_mesh.stl');
                this.loadMeshCb('package://pkg/stub_mesh.stl', this.manager, function(mesh_stub){
                    robot.add(mesh_stub || new window.THREE.Mesh(new window.THREE.BoxGeometry(0.1,0.1,0.1), new window.THREE.MeshPhongMaterial({color:0xff0000})));
                    console.log('URDFLoader (functional stub): Mesh loaded and added.');
                    this.manager.itemEnd('stub_mesh.stl');
                }.bind(this), function(err){
                    console.error('URDFLoader (functional stub): Mesh failed to load.', err);
                    this.manager.itemError('stub_mesh.stl');
                }.bind(this));
            }
            // Simulate overall loading complete
            setTimeout(function(){ if(this.manager.onLoad) this.manager.onLoad(); }.bind(this), 100);
            return robot;
        };
        this.load = function(url, onLoad, onProgress, onError) {
            console.log('URDFLoader (functional stub): load called for', url);
            this.manager.itemStart(url);
            // Simulate fetch and parse
            const self = this;
            setTimeout(function() {
                const robot = self.parse('stub urdf content', url.substring(0, url.lastIndexOf('/') + 1));
                if (onLoad) onLoad(robot);
                self.manager.itemEnd(url);
            }, 50);
        };
    };

    window.STLLoader = function(manager) { this.manager = manager || new window.THREE.LoadingManager(); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){console.log('STLLoader (stub) load:', (this.path||'')+url ); this.manager.itemStart(url); const geom = new window.THREE.BoxGeometry(0.2,0.2,0.2); geom.name=url; onLoad(geom); this.manager.itemEnd(url);};};
    window.OBJLoader = function(manager) { this.manager = manager || new window.THREE.LoadingManager(); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){console.log('OBJLoader (stub) load:', (this.path||'')+url ); this.manager.itemStart(url); const group = new window.THREE.Group(); group.name=url; onLoad(group); this.manager.itemEnd(url);};};
    window.ColladaLoader = function(manager) { this.manager = manager || new window.THREE.LoadingManager(); this.setPath = function(p){this.path=p;}; this.load = function(url, onLoad){console.log('ColladaLoader (stub) load:', (this.path||'')+url ); this.manager.itemStart(url); const scene = new window.THREE.Group(); scene.name=url; onLoad({scene: scene}); this.manager.itemEnd(url);};};

    console.log('three_with_loaders.bundle.js (Functional Partial Bundle) has been fully executed and globals set.');

})(); // End IIFE
