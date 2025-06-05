// three_with_loaders.bundle.js (Placeholder with Stubs)

// --- Minimal THREE.js Stub ---
window.THREE = (function() {
    console.log('THREE.js stub initialized');
    const THREE = {}; // Local THREE namespace for stubbing

    THREE.REVISION = '158-stub';

    // Basic Vector classes (simplified)
    THREE.Vector2 = function(x, y) { this.x = x || 0; this.y = y || 0; };
    THREE.Vector3 = function(x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; };
    THREE.Vector3.prototype = {
        set: function(x,y,z) { this.x=x; this.y=y; this.z=z; return this; },
        copy: function(v) { this.x=v.x; this.y=v.y; this.z=v.z; return this; },
        addScaledVector: function(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; },
        normalize: function() { const l = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z) || 1; this.x/=l; this.y/=l; this.z/=l; return this;},
        getCenter: function(v) { return v.copy(this); }, // Mock for Box3
        getSize: function(v) { return v.set(0,0,0); } // Mock for Box3
    };
    THREE.Quaternion = function(x,y,z,w) { this.x=x||0; this.y=y||0; this.z=z||0; this.w=(w===undefined)?1:w; };
    THREE.Quaternion.prototype = {
        set: function(x,y,z,w) {this.x=x; this.y=y; this.z=z; this.w=w; return this;},
        copy: function(q) {this.x=q.x; this.y=q.y; this.z=q.z; this.w=q.w; return this;}
    };
    THREE.Color = function(r,g,b) { this.r=r; this.g=g; this.b=b; console.log('THREE.Color stub created');};
    THREE.Color.prototype.set = function(r,g,b) { this.r=r; this.g=g; this.b=b; };
    THREE.Scene = function() { console.log('THREE.Scene stub created'); this.background=null; this.children=[]; this.add = function(obj){this.children.push(obj);}; this.remove = function(obj){this.children = this.children.filter(o => o !== obj);};};
    THREE.PerspectiveCamera = function() { console.log('THREE.PerspectiveCamera stub created'); this.position = new THREE.Vector3(); this.lookAt=function(){}; this.updateProjectionMatrix=function(){}; this.getWorldDirection=function(v){ return v.set(0,0,-1);}; };
    THREE.WebGLRenderer = function() { console.log('THREE.WebGLRenderer stub created'); this.domElement = document.createElement('canvas'); this.domElement.width = 300; this.domElement.height = 150; console.log('THREE.WebGLRenderer stub: created canvas domElement'); this.setSize = function(w,h){ console.log('THREE.WebGLRenderer stub: setSize called with', w, h); this.domElement.width = w; this.domElement.height = h; }; this.render = function(s,c){ console.log('THREE.WebGLRenderer stub: render called'); }; };
    THREE.AmbientLight = function() { console.log('THREE.AmbientLight stub created'); };
    THREE.DirectionalLight = function() { console.log('THREE.DirectionalLight stub created'); this.position = new THREE.Vector3(); };
    THREE.BoxGeometry = function() { console.log('THREE.BoxGeometry stub created'); };
    THREE.SphereGeometry = function() { console.log('THREE.SphereGeometry stub created'); };
    THREE.MeshPhongMaterial = function(params) { console.log('THREE.MeshPhongMaterial stub created with params:', params); this.name = params && params.name ? params.name : ''; };
    THREE.MeshBasicMaterial = function(params) { console.log('THREE.MeshBasicMaterial stub created with params:', params);};
    THREE.Mesh = function(geo, mat) { console.log('THREE.Mesh stub created'); this.position = new THREE.Vector3(); this.quaternion = new THREE.Quaternion(); this.name=''; this.visible=true; this.children=[]; this.add=function(obj){this.children.push(obj);}; this.geometry=geo; this.material=mat;};
    THREE.Plane = function() { console.log('THREE.Plane stub created'); this.normal = new THREE.Vector3(); this.setFromNormalAndCoplanarPoint = function(){};};
    THREE.Raycaster = function() { console.log('THREE.Raycaster stub created'); this.setFromCamera=function(){}; this.intersectObject=function(){return []}; this.ray={intersectPlane:function(){return null;}};};
    THREE.Object3D = function() { this.position = new THREE.Vector3(); this.quaternion = new THREE.Quaternion(); this.children = []; this.add = function(child) { this.children.push(child); }; this.remove = function(child) { const index = this.children.indexOf(child); if (index !== -1) this.children.splice(index, 1);}; this.traverse = function(cb){cb(this); this.children.forEach(c=>c.traverse(cb));}; this.name = ''; this.visible = true;};
    THREE.Group = function() { THREE.Object3D.call(this); console.log('THREE.Group stub created'); };
    THREE.Group.prototype = Object.create(THREE.Object3D.prototype);
    THREE.LoadingManager = function(onLoad, onProgress, onError) {
        console.log('THREE.LoadingManager stub created');
        this.onLoad = onLoad; this.onProgress = onProgress; this.onError = onError;
        this.itemStart = function(){}; this.itemEnd = function(){}; this.itemError = function(){};
        // Simulate immediate load for simplicity in stub
        if (this.onLoad) setTimeout(this.onLoad, 0);
    };
    THREE.Box3 = function() {
        this.min = new THREE.Vector3(-1,-1,-1); this.max = new THREE.Vector3(1,1,1);
        this.setFromObject = function(obj) { console.log('THREE.Box3.setFromObject stub called'); return this; };
        this.getCenter = function(target) { return target.set((this.min.x+this.max.x)/2, (this.min.y+this.max.y)/2, (this.min.z+this.max.z)/2); };
        this.getSize = function(target) { return target.set(this.max.x-this.min.x, this.max.y-this.min.y, this.max.z-this.min.z); };
        this.getBoundingSphere = function(target) { console.log('THREE.Box3.getBoundingSphere stub called'); target.radius = 1; return target; };
    };
    THREE.Sphere = function(center, radius) { this.center = center || new THREE.Vector3(); this.radius = radius || 0; };
    THREE.Clock = function() { this.getDelta = function() { return 1/60; } };

    return THREE;
})();

// --- Loader Stubs ---
window.URDFLoader = function(manager) {
    console.log('URDFLoader stub created');
    this.path = ''; // For compatibility with how main_app.js might use it
    this.load = function(url, onLoad, onProgress, onError) {
        console.log('URDFLoader.load stub called for:', url);
        if (onLoad) {
            // Return a minimal robot object (empty group)
            const robot = new window.THREE.Group();
            robot.name = url;
            console.log('URDFLoader.load stub: calling onLoad with empty robot structure.');
            onLoad(robot);
        } else {
            console.warn('URDFLoader.load stub: no onLoad callback provided.');
        }
    };
    this.parse = function(content, path) {
        console.log('URDFLoader.parse stub called with path:', path);
        this.path = path; // Store path
        const robot = new window.THREE.Group();
        robot.name = path || 'parsed_robot';
        // Simulate the loadMeshCb structure if needed by the real main.js
        if (typeof this.loadMeshCb === 'function') {
            console.log('URDFLoader.parse stub: loadMeshCb is defined, would simulate mesh loading here if parse was more complex.');
        } else {
             console.log('URDFLoader.parse stub: loadMeshCb is NOT defined.');
        }
        return robot;
    };
    this.loadMeshCb = null; // Placeholder for the callback from main_app.js
    this.workingPath = ''; // For compatibility
};

window.STLLoader = function(manager) {
    console.log('STLLoader stub created');
    this.setPath = function(path) { this.path = path; };
    this.load = function(url, onLoad, onProgress, onError) {
        console.log('STLLoader.load stub called for:', this.path ? this.path + url : url);
        if (onLoad) onLoad(new window.THREE.BoxGeometry()); else if (onError) onError(new Error('STLLoader stub error'));
    };
};

window.OBJLoader = function(manager) {
    console.log('OBJLoader stub created');
    this.setPath = function(path) { this.path = path; };
    this.load = function(url, onLoad, onProgress, onError) {
        console.log('OBJLoader.load stub called for:', this.path ? this.path + url : url);
        if (onLoad) onLoad(new window.THREE.Group()); else if (onError) onError(new Error('OBJLoader stub error'));
    };
};

window.ColladaLoader = function(manager) {
    console.log('ColladaLoader stub created');
    this.setPath = function(path) { this.path = path; };
    this.load = function(url, onLoad, onProgress, onError) {
        console.log('ColladaLoader.load stub called for:', this.path ? this.path + url : url);
        const scene = new window.THREE.Group();
        if (onLoad) onLoad({ scene: scene }); else if (onError) onError(new Error('ColladaLoader stub error'));
    };
};

console.log('three_with_loaders.bundle.js (Placeholder with Stubs) executed.');
