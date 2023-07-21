var canvas = document.getElementById("canvas")
// ui setup
var uiCanvas = document.getElementById("ui-canvas")
var uictx = uiCanvas.getContext("2d")
uictx.imageSmoothingEnabled = false
var camera = {pos: {x: -2, y: 5, z: 5}, rot: {x: 0, y: -Math.PI/2-Math.PI*1000, z: 0}}
// var camera = new THREE.PerspectiveCamera(75, 1, 0.001, 1000)
// var renderer = new THREE.WebGLRenderer({canvas: canvas})
// renderer.setSize(960, 576)

var gl = canvas.getContext("webgl2", { antialias: false })
// renderer.sortObjects = true
// renderer.sortObjects = true
// renderer.autoClear = false
// renderer.premultipliedAlpha = true
// renderer.logarithmicDepthBuffer = true;
// renderer.autoClear = false
// renderer.setClearColor(0x000000, 0)
// renderer.autoClearColor = false;
// renderer.alpha = true;
// renderer.sortObjects = true
// renderer.sortObjects = THREE.SimpleSort
// renderer.setPixelRatio(window.devicePixelRatio);
// camera.rotation.order = "YXZ"
// camera.aspect = 1368/796
// camera.logarithmicDepthBuffer = true
// camera.updateProjectionMatrix()

// THREE.js scene settings
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFShadowMap

// Username setup
var usernameBox = document.getElementById("username")
usernameBox.value = "Unnamed"

// Vars
var frames = 0
var fps = 0
var newFPS = 0
var chunksLoaded = 0
var cps = 0
var newCPS = 0

var vertexShader = `
  varying vec2 vUv;
	varying vec3 vWorldPosition;
 	varying vec3 vColor;
	varying float depth;
 
  void main() {
		vColor = color;
    vUv = uv;
		vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
		
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    depth = -worldPosition.z;

    // Pass the vertex position to the fragment shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

var fragmentShader = `
	uniform sampler2D map;
	uniform sampler2D alphaMap;
 	varying vec3 vWorldPosition;
	varying vec2 vUv;
 	varying vec3 vColor;
 
	void main() {
		float alpha = texture2D( alphaMap, vUv).r;
		vec4 colour = texture2D( map, vUv);
		gl_FragColor = vec4(colour.r*vColor.r, colour.g*vColor.g, colour.b*vColor.b, alpha);
	}
`

// var fragmentShader = `
//   varying vec2 vUv;
// 	varying vec3 vWorldPosition;
//   uniform sampler2D texture;
//   uniform sampler2D alphaMap;
// 	uniform vec3 cameraPos;
//  	uniform float light;
// 	varying vec3 vColor;

// 	float tanh(float x) {
//   	return (exp(2.0 * x) - 1.0) / (exp(2.0 * x) + 1.0);
// 	}
  
//   void main() {
//     vec4 color2 = texture2D(texture, vUv);
//     float alpha = 1.0-texture2D(alphaMap, vUv).r;
// 		float distance2 = floor(distance(vWorldPosition, cameraPos)+1.0)/500.0;
// 		distance2 = tanh(distance2);
// 		if (distance2 > 0.9) {
// 			distance2 = 0.9;
// 		}
// 		distance2 = 1.0-distance2;
// 		float mul = (500.0*distance2);
// 		mul = 500.0;
// 		vec2 uv = vec2(mod(vUv.x, 1.0/4.0)*4.0, mod(vUv.y, 1.0/3.0)*3.0);
// 		if ((mod((uv.x+uv.y)*mul, 1.0*alpha+1.0) < 1.0-alpha) && alpha < 1.0) {
// 	 		discard; 
// 		}
// 		float d = distance(vWorldPosition, cameraPos)/3.0;
// 		if (d > 1.0) {
// 			d = 1.0;
// 		}
// 		float cool = (1.0-d)*2.0;
// 		if (cool < light) {
// 			cool = light;
// 		}
// 		// gl_FragColor = vec4(vColor, 1.0);
// 		gl_FragColor = vec4(color2.r*vColor.r, color2.g*vColor.g, color2.b*vColor.b, 1.0);
// 		// gl_FragColor = vec4(1.0-alpha, 1.0-alpha, 1.0-alpha, 1.0);
// 		// gl_FragColor = vec4(floor(mod(floor(uv.x*10.0+0.5) + floor(uv.y*10.0+0.5), 1.9)), 0.0, 0.0, 1.0);
//   }
// `

/*
-> cool blue effect
var fragmentShader = `
  varying vec2 vUv;
	varying vec3 vWorldPosition;
  uniform sampler2D texture;
  uniform sampler2D alphaMap;
	uniform vec3 cameraPos;
  
  void main() {
    vec4 color = texture2D(texture, vUv);
    float alpha = texture2D(alphaMap, vUv).r;
		float mul = (1.0-alpha)*250.0;
		float distance2 = distance(vWorldPosition, cameraPos)/3.0;
		if (distance2 > 1.0) {
			distance2 = 1.0;
		}
		distance2 = 1.0-distance2;
		vec2 uv = vec2(mod(vUv.x, 1.0/4.0)*4.0, mod(vUv.y, 1.0/3.0)*3.0);
    if (alpha == 0.0 || (mod(floor(uv.x*mul+0.5)+floor(uv.y*mul+0.5), 2.0) != 0.0 && alpha != 1.0)) {
      discard;
    }
    gl_FragColor = color;
		gl_FragColor = vec4(color.r, color.g, color.b+distance2, 1.0);
  }
`
*/