// three_r128_libs.js - Partial Three.js r128 components
var THREE = { REVISION: '128-partial' };
console.log('Minimal THREE object created (r128-partial)');

// --- Placeholder for LoadingManager.js (r128) ---
THREE.LoadingManager = function ( onLoad, onProgress, onError ) {
    console.log('THREE.LoadingManager (r128) placeholder created.');
    this.onLoad = onLoad; this.onProgress = onProgress; this.onError = onError;
    var scope = this; var isLoading = false; var itemsLoaded = 0; var itemsTotal = 0;
    this.itemStart = function ( url ) { itemsTotal++; isLoading = true; if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); };
    this.itemEnd = function ( url ) { itemsLoaded++; if ( scope.onProgress ) scope.onProgress( url, itemsLoaded, itemsTotal ); if ( itemsLoaded === itemsTotal ) { isLoading = false; if ( scope.onLoad ) scope.onLoad(); } };
    this.itemError = function ( url ) { if ( scope.onError ) scope.onError( url ); };
};
console.log('Placeholder THREE.LoadingManager (r128) defined.');

// --- Placeholder for URDFLoader.js (r128) ---
THREE.URDFLoader = function ( manager ) {
    this.manager = ( manager !== undefined ) ? manager : new THREE.LoadingManager();
    console.log('THREE.URDFLoader (r128) placeholder created.');
    if (!THREE.Group) THREE.Group = function() { this.children = []; this.add = function(c){this.children.push(c);}; this.name=''; };
    this.load = function ( url, onLoad, onProgress, onError ) { console.log('THREE.URDFLoader.load placeholder called for:', url); if (onLoad) { var result = new THREE.Group(); result.name=url; onLoad(result); } };
    this.parse = function ( text ) { console.log('THREE.URDFLoader.parse placeholder called.'); var result = new THREE.Group(); result.name='parsed_urdf'; return result; };
};
console.log('Placeholder THREE.URDFLoader (r128) defined.');

// --- Stubs for other loaders (r128) ---
    if (!THREE.BufferGeometry) THREE.BufferGeometry = function() { this.name=''; };
THREE.STLLoader = function (manager) { this.manager = manager || new THREE.LoadingManager(); console.log('THREE.STLLoader (r128) stub created.'); this.load = function(url, onLoad){ console.log('STLLoader stub load:', url); onLoad(new THREE.BufferGeometry()); }; };
THREE.OBJLoader = function (manager) { this.manager = manager || new THREE.LoadingManager(); console.log('THREE.OBJLoader (r128) stub created.'); this.load = function(url, onLoad){ console.log('OBJLoader stub load:', url); onLoad(new THREE.Group()); }; };
THREE.ColladaLoader = function (manager) { this.manager = manager || new THREE.LoadingManager(); console.log('THREE.ColladaLoader (r128) stub created.'); this.load = function(url, onLoad){ console.log('ColladaLoader stub load:', url); onLoad({ scene: new THREE.Group() }); }; };
console.log('Placeholder STLLoader, OBJLoader, ColladaLoader (r128) defined.');
