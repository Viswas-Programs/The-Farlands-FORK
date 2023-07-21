// Vars
var keys = {}
var jKeys = {}
var keysHeld = {}
var locked = false
var rClick = false
var lClick = false
var hasMouse = false
var mouse = {x: 0, y: 0, down: false}

document.addEventListener("mouseleave", () => {
	hasMouse = false
})

document.addEventListener("mouseenter", () => {
	hasMouse = true
})

// Key Manager
addEventListener("keydown", event => {
	if (!keys[event.code]) {
		jKeys[event.code] = true
		if (event.code == "Tab" || event.code == "KeyI" || event.code == "Escape" || event.code == "KeyC" || event.code == "KeyO") {
			if (isMouseLocked()) {
				unlockMouse()
				if (event.code == "KeyI") {
					tab = "backpack"
				}
				if (event.code == "KeyC") {
					tab = "crafting"
				}
				if (event.code == "KeyO") {
					tab = "options"
				}
			} else {
				lockMouse()
			}
		}
	}
	keys[event.code] = true
	if (event.code == "Tab") {
		event.preventDefault()
	}
})

addEventListener("keyup", event => {
	if (keys[event.code]) {
		delete keys[event.code]
		// delete keysHeld[event.code]
	}
})

addEventListener("blur", function() {
  keys = {}
	jKeys = {}
	lClick = false
	rClick = false
	mouse.down = false
	unlockMouse()
})

// Update
function updateUtils() {
	jKeys = {}
	lClick = false
	rClick = false
	// for (let key in keysHeld) {
	// 	keysHeld[key] -= 1
	// 	if (keysHeld[key] <= 0) {
	// 		delete keys[key]
	// 		delete keysHeld[key]
	// 	}
	// }
}

// Mouse manager
function lockMouse() {
  const element = uiCanvas

  if (element.requestPointerLock) {
    element.requestPointerLock()
  }
}

function unlockMouse() {
  if (document.exitPointerLock) {
    document.exitPointerLock()
  }
}

function isMouseLocked() {
  return document.pointerLockElement == uiCanvas ||
         document.mozPointerLockElement == uiCanvas ||
         document.webkitPointerLockElement == uiCanvas
}

uiCanvas.addEventListener("mousedown", (event) => {
	event.preventDefault()
	mouse.down = true
	hasMouse = true
	if (event.button == 0) {
		lClick = true
	} else if (event.button == 2) {
		rClick = true
	}
	if (!(mouse.x < 88*4 && mouse.y < 176*4)) {
		lockMouse()
	}
})

uiCanvas.addEventListener("mouseup", (event) => {
	mouse.down = false
})

addEventListener("contextmenu", function(event) {
  event.preventDefault()
	hasMouse = true
})

uiCanvas.addEventListener("mousemove", (event) => {
	hasMouse = true
	if (isMouseLocked()) {
		camera.rot.x -= event.movementY*0.005
		if (camera.rot.x > Math.PI/2) {
			camera.rot.x = Math.PI/2
		}
		if (camera.rot.x < -Math.PI/2) {
			camera.rot.x = -Math.PI/2
		}
		camera.rot.y -= event.movementX*0.005	
	} else {
		mouse.x = event.clientX
		mouse.y = event.clientY
	}
})