// settings
var world = {}
var chunks = {}
var sets = []
var borders = [
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
	new Object3D(0, 0, 0, 16, 16, 16),
]
var cameraOff = {x: 0, y: 0, z: 0}
var offset = {x: -worldSize.x/2, y: -worldSize.y-0.5, z: -worldSize.z/2}
// var textureLoader = new THREE.TextureLoader()
var texture = new webgl.Texture("assets/blocks.png")
var alphaTexture = new webgl.Texture("assets/alpha.png")
var playerTexture = new webgl.Texture("assets/players.png")
var chunkTickCooldown = 0
var setTickCooldown = 0

var font = new FontFace("font", "url(assets/font.ttf)")
var fontLoaded = false
font.load().then(function(loadedFont) {
	fontLoaded = true
  document.fonts.add(loadedFont)
})

// var rando = []
// for (let i = 0; i < 1000; i++) {
// 	rando.push(Math.round(sRandom(i)*10+1))
// }
// console.log(rando)


// loader.load("assets/font.json", function(font2) {
//   font = font2
// })

var view = mat4.create()
const projection = mat4.create()

// sprites
var rp = {x: 0, y: 0, z: 0}
var indicator = new Box(0, 0, 0, 1.025, 1.025, 1.025, [1, 1, 1])
for (let i = 0; i < 6; i++) {
	indicator.box.uvs.push(
		3*blockSize.x, 2*blockSize.y,
		3*blockSize.x+blockSize.x, 2*blockSize.y+blockSize.y,
		3*blockSize.x+blockSize.x, 2*blockSize.y,
		3*blockSize.x, 2*blockSize.y+blockSize.y,
	)
}
indicator.box.updateBuffers()
indicator.box.useTexture = true
indicator.box.texture = texture
indicator.box.useAlpha = true
indicator.box.alphaTexture = alphaTexture

var thirdPerson = false
var anims = ["idle", "walk", "jump"]
var rDistance = 0
var players = {}
// x: 134.46097076958287, y: 13.250000000003208, z: 46.27446747936711
var player = new Player(0, worldSize.y, 0)
var lastRounded = {}
var cSent = []

// lighting
var time = 0
var aOff = {x: -0.5, y: 0.65, z: 0.25}
var off = {x: -0.5, y: 0.65, z: 0.5}
// var aLight = new THREE.AmbientLight(0xffffff, 1.25)
// scene.add(aLight)
var light = 0
// var light = new THREE.DirectionalLight(0xffffff, 0.75)
// light.position.set(off.x, off.y, off.z)
// light.castShadow = true
// light.shadow.mapSize.width = 4096
// light.shadow.mapSize.height = 4096
// light.shadow.bias = -0.0025
// scene.add(light)
// var target = new THREE.Object3D()
// target.position.set(0, 0, 0)
// scene.add(target)

// light.target = target

var chunkLoader = new Worker("chunkLoader.js")

var worldPos = {x: 0, y: 0, z: 0}
var canTick = true
var canSet = true
var canOrder = true
var order = 0
var crosshair = new Image()
crosshair.src = "assets/target.png"
var crosshairDash = new Image()
crosshairDash.src = "assets/target dash.png"
var inventoryImg = new Image()
inventoryImg.src = "assets/inventory.png"
var itemsImg = new Image()
itemsImg.src = "assets/items.png"

// variables
var collide = []
var meshes = []

function isCollidingWorld(object) {
	var round = {x: Math.round(object.pos.x-0.5), y: Math.round(object.pos.y-0.5), z: Math.round(object.pos.z-0.5)}
	var check = []

	// Center
	if (!none.includes(getBlock(round.x, round.y, round.z))) {
		check.push(new Object3D(round.x+0.5, round.y+0.5, round.z+0.5, 1, 1, 1))
	}

	// X Dir
	if (!none.includes(getBlock(round.x+1, round.y, round.z))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5, round.z+0.5, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x-1, round.y, round.z))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5, round.z+0.5, 1, 1, 1))
	}

	// Z Dir
	if (!none.includes(getBlock(round.x, round.y, round.z+1))) {
		check.push(new Object3D(round.x+0.5, round.y+0.5, round.z+0.5+1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x, round.y, round.z-1))) {
		check.push(new Object3D(round.x+0.5, round.y+0.5, round.z+0.5-1, 1, 1, 1))
	}

	// Y Dir
	if (!none.includes(getBlock(round.x, round.y+1, round.z))) {
		check.push(new Object3D(round.x+0.5, round.y+1+0.5, round.z+0.5, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x, round.y-1, round.z))) {
		check.push(new Object3D(round.x+0.5, round.y-1+0.5, round.z+0.5, 1, 1, 1))
	}

	// Corners - Top
	if (!none.includes(getBlock(round.x+1, round.y+1, round.z+1))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5+1, round.z+0.5+1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x-1, round.y+1, round.z-1))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5+1, round.z+0.5-1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x+1, round.y+1, round.z-1))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5+1, round.z+0.5-1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x-1, round.y+1, round.z+1))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5+1, round.z+0.5+1, 1, 1, 1))
	}

	// Corners - Bottom
	if (!none.includes(getBlock(round.x-1, round.y-1, round.z-1))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5-1, round.z+0.5-1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x+1, round.y-1, round.z+1))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5-1, round.z+0.5+1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x-1, round.y-1, round.z+1))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5-1, round.z+0.5+1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x+1, round.y-1, round.z-1))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5-1, round.z+0.5-1, 1, 1, 1))
	}

	// // Edges - Top
	if (!none.includes(getBlock(round.x+1, round.y+1, round.z))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5+1, round.z+0.5, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x-1, round.y+1, round.z))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5+1, round.z+0.5, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x, round.y+1, round.z-1))) {
		check.push(new Object3D(round.x+0.5, round.y+0.5+1, round.z+0.5-1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x, round.y+1, round.z+1))) {
		check.push(new Object3D(round.x+0.5, round.y+0.5+1, round.z+0.5+1, 1, 1, 1))
	}

	// Edges - Bottom
	if (!none.includes(getBlock(round.x-1, round.y-1, round.z))) {
		check.push(new Object3D(round.x+0.5-1, round.y-1+0.5, round.z+0.5, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x+1, round.y-1, round.z))) {
		check.push(new Object3D(round.x+0.5+1, round.y-1+0.5, round.z+0.5, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x, round.y-1, round.z+1))) {
		check.push(new Object3D(round.x+0.5, round.y+0.5-1, round.z+0.5+1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x, round.y-1, round.z-1))) {
		check.push(new Object3D(round.x+0.5, round.y+0.5-1, round.z+0.5-1, 1, 1, 1))
	}

	// Edges - Sides
	if (!none.includes(getBlock(round.x+1, round.y, round.z+1))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5, round.z+0.5+1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x-1, round.y, round.z-1))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5, round.z+0.5-1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x-1, round.y, round.z+1))) {
		check.push(new Object3D(round.x+0.5-1, round.y+0.5, round.z+0.5+1, 1, 1, 1))
	}
	if (!none.includes(getBlock(round.x+1, round.y, round.z-1))) {
		check.push(new Object3D(round.x+0.5+1, round.y+0.5, round.z+0.5-1, 1, 1, 1))
	}
	for (let block of check) {
		if (block.isColliding([object])) {
			return true
		}
	}
	return false
}

function raycast3D(start, angle, distance) {
	var raycast2 = new Object3D(start.x, start.y, start.z, 0.01, 0.01, 0.01)
	var travel = 0
	while (travel < distance) {
		travel += 0.01
		raycast2.pos.x = start.x + Math.sin(angle.y)*Math.cos(angle.x+Math.PI)*travel
		raycast2.pos.y = start.y - Math.sin(angle.x+Math.PI)*travel
		raycast2.pos.z = start.z + Math.cos(angle.y)*Math.cos(angle.x+Math.PI)*travel
		if (isCollidingWorld(raycast2)) {
			break
		}
	}
	return [travel, raycast2.pos]
}

var lastTime = 0
// render
function render(timestamp) {
	if (selectedItem[0] == "none") {
		safeInventory = copyInventory()
	}
	
	requestAnimationFrame(render)
	time = Date.now()/1000
	var oldPos = {...player.pos}
	// time = 30
	// light = (Math.sin(time*Math.PI/60)+1)/2
	// aLight.intensity = light*0.9+0.35
	// console.log(l)
	// scene.background = new THREE.Color(0.529*light, 0.808*light, 0.922*light)
	// console.log(window.innerWidth, window.innerHeight)
	// var asp = 960/576
	// if (player.pos.y > 0) {
	// 	light.intensity = player.pos.y/worldSize.y
	// } else {
	// 	light.intensity = 0
	// }

	
	var w = window.innerWidth
	var h = window.innerHeight
	// renderer.setSize(w, h)
	canvas.width = w
	canvas.height = h
	gl.canvas.width = w
	gl.canvas.height = h
	if (godmode) {
		dashForce = 1
		airSpeed = 0.01
	} else {
		dashForce = 0.35
		airSpeed = 0.003
	}

	inventoryOpen = !isMouseLocked()
	if (!inventoryOpen && selectedItem[0] != "none") {
		inventory = [...safeInventory]
		selectedItem = ["none", 0]
	}
	// var light2 = 1-Math.abs(Math.cos(time*0.01))
	// scene.background = new THREE.Color(135*light2, 206*light2, 235*light2)
	// aLight.intensity = light2
	// time += 1-Math.abs(Math.sin(time*0.01))+0.1
	// off.x = Math.sin(time*0.01)*aOff.x
	// off.z = Math.sin(time*0.01)*aOff.z
	// off.y = Math.abs(Math.cos(time*0.01))/2*aOff.y
	usernameBox.value = usernameBox.value.substring(0, 15)
	// requestAnimationFrame(render)
	frames += 1
	var delta = (timestamp - lastTime) / 1000
	lastTime = timestamp
	if (!delta) { return }
	if (delta > 1) { return }
	player.tick(delta)
	player.wpos.x += player.pos.x-oldPos.x
	player.wpos.y += player.pos.y-oldPos.y
	player.wpos.z += player.pos.z-oldPos.z
	
	player.wcpos = {x: Math.floor(player.wpos.x/cs.x)*cs.x, y: Math.floor(player.wpos.y/cs.y)*cs.y, z: Math.floor(player.wpos.z/cs.z)*cs.z}
	player.pos = {x: player.wpos.x-player.wcpos.x, y: player.wpos.y-player.wcpos.y, z: player.wpos.z-player.wcpos.z}
	
	clickSlow -= delta
	if (lClick || rClick) {
		clickSlow = 0.05
	}

	inInventory -= delta
	if (inventoryOpen) {
		inInventory = 0.1
	}
	
	chunkTickCooldown -= delta
	setTickCooldown -= delta
	showName -= delta
	if (showName < 0) {
		showName = 0
	}

	for (let i = 0; i < 10; i++) {
		var i2 = 0
		if (i < 9) {
			i2 = i+1
		}
		if (jKeys["Digit"+i2]) {
			if (selected == i && showName > 0) {
				showName = 2.75
			} else {
				showName = 3
			}
			selected = i
		}
	}

	if (inventory[selected][0] != lastHeldItem) {
		showName = 3
	}
	lastHeldItem = inventory[selected][0]
	
	if (fps == 0) {
		fps = Math.round(1/delta)
		newFPS = Math.round(1/delta)
	}

	fps += (newFPS-fps)*delta
	cps += (newCPS-cps)*delta

	var chunkPos = {x: player.wcpos.x+cs.x/2, y: player.wcpos.y+cs.y/2, z: player.wcpos.z+cs.z/2}
	var offs = [
		[cs.x, 0, 0],
		[-cs.x, 0, 0],
		[0, cs.y, 0],
		[0, -cs.y, 0],
		[0, 0, cs.z],
		[0, 0, -cs.z]
	]
	for (let i in offs) {
		borders[i].pos = {...chunkPos}
		borders[i].pos.x += offs[i][0]
		borders[i].pos.y += offs[i][1]
		borders[i].pos.z += offs[i][2]
		if (chunks[Math.floor(borders[i].pos.x/cs.x)+","+Math.floor(borders[i].pos.y/cs.y)+","+Math.floor(borders[i].pos.z/cs.z)]) {
			borders[i].pos.y -= 1000
		}
	}
	
	data = {
		x: safe(player.wpos.x), 
		y: safe(player.wpos.y), 
		z: safe(player.wpos.z), 
		rx: safe(camera.rot.x),
		ry: safe(player.rot.y), 
		hr: safe(player.headRot),
		c: player.colouri, 
		a: safe(player.attacking),
		u: usernameBox.value,
		a: anims.indexOf(player.anim),
		p: playerT,
	}
	
	if (keys["Escape"]) {
		unlockMouse()
	}
	
	var ct = {x: player.pos.x+Math.sin(camera.rot.y+Math.PI/2)*1, y: player.pos.y, z: player.pos.z+Math.cos(camera.rot.y+Math.PI/2)*1}

	var r = raycast3D(camera.pos, camera.rot, 10)
	rp = {...r[1]}
	r[1].x += Math.sin(camera.rot.y)*Math.cos(camera.rot.x+Math.PI)*0.025
	r[1].y -= Math.sin(camera.rot.x+Math.PI)*0.025
	r[1].z += Math.cos(camera.rot.y)*Math.cos(camera.rot.x+Math.PI)*0.025
	indicator.pos = {x: Math.round(r[1].x+0.5)-0.5, y: Math.round(r[1].y+0.5)-0.5, z: Math.round(r[1].z+0.5)-0.5}
	indicator.visible = r[0] < 10 && getBlock(indicator.pos.x, indicator.pos.y, indicator.pos.z) != 0
	indicator.update()
	
	// if (raycast3D(ct, camera.rotation, 3)[0] > 0.1) {
	// 	cameraOff.x += (ct.x-cameraOff.x)/5
	// 	cameraOff.y += (ct.y-cameraOff.y)/5
	// 	cameraOff.z += (ct.z-cameraOff.z)/5
	// } else {
	// 	cameraOff.x += (player.pos.x-cameraOff.x)/5
	// 	cameraOff.y += (player.pos.y-cameraOff.y)/5
	// 	cameraOff.z += (player.pos.z-cameraOff.z)/5
	// }

	// var raycast = raycast3D(cameraOff, camera.rotation, 3)
	// while (raycast[0] < 0.25 && distance(cameraOff, player.pos) > 0.1) {
	// 	cameraOff.x += (player.pos.x-cameraOff.x)/5
	// 	cameraOff.y += (player.pos.y-cameraOff.y)/5
	// 	cameraOff.z += (player.pos.z-cameraOff.z)/5
	// 	raycast = raycast3D(cameraOff, camera.rotation, 3)
	// }

	// target.position.set(player.pos.x, player.pos.y, player.pos.z)
	// light.position.set(player.pos.x+off.x, player.pos.y+off.y, player.pos.z+off.z)
	// light.shadow.camera.left = -80
	// light.shadow.camera.right = 80
	// light.shadow.camera.far = 80
	// light.shadow.camera.near = -80
	// light.shadow.camera.top = 80
	// light.shadow.camera.bottom = -80
	// light.shadow.camera.updateProjectionMatrix()
	var gplayer = player
	for (let player in players) {
		if (!playerData[player]) { continue }
		players[player].pos2.x += (playerData[player].x-players[player].pos2.x)/10
		players[player].pos2.y += (playerData[player].y-players[player].pos2.y)/10
		players[player].pos2.z += (playerData[player].z-players[player].pos2.z)/10
		players[player].pos.x = players[player].pos2.x-gplayer.wcpos.x
		players[player].pos.y = players[player].pos2.y-gplayer.wcpos.y
		players[player].pos.z = players[player].pos2.z-gplayer.wcpos.z
		players[player].rotating -= 1
		if (players[player].rotating > 0) {
			players[player].rot.y += 0.25
		} else {
			players[player].rot.y = intAngle(players[player].rot.y, playerData[player].ry, 1/10)
		}

		players[player].headRot += (playerData[player].hr-players[player].headRot)/10
		
		if (playerData[player].c == 0) {
			players[player].colour = [0, 0.5, 1]
		} else {
			players[player].colour = [1, 1, 1]
		}
		players[player].attack.pos = players[player].pos
		players[player].attack.visible = players[player].attacking > 0
		players[player].attack.size.x = (5-Math.abs(5 - players[player].attacking))/2
		players[player].attack.size.y = (5-Math.abs(5 - players[player].attacking))/2
		players[player].attack.size.z = (5-Math.abs(5 - players[player].attacking))/2
		players[player].attack.update()
		players[player].attacking -= 1

		players[player].model[1].rot.x += (playerData[player].rx-players[player].model[1].rot.x)/10
		players[player].anim = anims[playerData[player].a]
		players[player].updateTexture(playerData[player].p)
		for (let model of players[player].model) {
			model.box.updateBuffers()
		}
		players[player].updateModel()
		// players[player].update()
		// if (playerData[player].username != null) {
		// 	players[player].username.text = playerData[player].username
		// 	players[player].username.pos = {...players[player].pos}
		// 	players[player].username.pos.y += 0.5
		// 	players[player].username.lookAtCam()
		// 	players[player].username.update()
		// }
		
	}

	for (let chunk in world) {
		world[chunk].updateShader()
	}

	if (transparent.includes(getBlock(indicator.pos.x, indicator.pos.y, indicator.pos.z))) {
		if (indicator.box.rOrder == 0) {
			indicator.box.rOrder = 2000
			webgl.sortObjs()
		}
		indicator.box.rOrder = 2000
	} else {
		if (indicator.box.rOrder == 2000) {
			indicator.box.rOrder = 0
			webgl.sortObjs()
		}
		indicator.box.rOrder = 0
	}

	if (jKeys["KeyP"]) {
		thirdPerson = !thirdPerson
	}

	player.visible = rDistance > 0.5
	camera.pos = {...player.pos}
	camera.pos.y += 0.75
	test.rot.y += 0.01
	test.box.rotOff.x = -test.size.x/2
	test.box.rotOff.y = -test.size.y/2
	test.box.rotOff.z = -test.size.y/2
	test.visible = false
	test.update()

	player.updateModel()
	
	// camera.position.set(cameraOff.x, cameraOff.y, cameraOff.z)

	if (thirdPerson) {
		rDistance += (4-rDistance)/5
	} else {
		rDistance += (0-rDistance)/5
	}

	if (rDistance > 0.1) {
		var raycast = raycast3D(camera.pos, {x: camera.rot.x+Math.PI, y: camera.rot.y, z: -camera.rot.z}, rDistance)
		camera.pos.x -= Math.sin(camera.rot.y)*Math.cos(camera.rot.x+Math.PI)*(raycast[0])
		camera.pos.y += Math.sin(camera.rot.x+Math.PI)*(raycast[0])
		camera.pos.z -= Math.cos(camera.rot.y)*Math.cos(camera.rot.x+Math.PI)*(raycast[0])
	}

	for (let chunk2 in world) {
		var chunk = world[chunk2]
		var p = {x: chunk.pos.x*cs.x-player.wcpos.x+cs.x/2, y: chunk.pos.y*cs.y-player.wcpos.y+cs.y/2, z: chunk.pos.z*cs.z-player.wcpos.z+cs.z/2}               
		chunk.mesh.rOrder = -1
		chunk.meshT.rOrder = Math.round(2000-distance(camera.pos, p))
		chunk.updatePos()
		var diffy = Math.abs(p.y-camera.pos.y)+(cs.x+cs.z)/2
		let visible = Math.abs(angleDistance(Math.atan2(p.z-camera.pos.z-Math.cos(camera.rot.y)*diffy, p.x-camera.pos.x-Math.sin(camera.rot.y)*diffy), -camera.rot.y-Math.PI/2)) < Math.PI/2
		chunk.mesh.visible = visible
		chunk.meshT.visible = visible
		// chunk.mesh.rOrder = 0
		// console.log(Math.round(2000-distance(camera.pos, p)))
		// chunk.meshT.rOrder = Math.round(2000-distance(camera.pos, p))
	}

	// renderer.clear()
  // renderer.render(scene, camera)

	view = mat4.create()
	mat4.translate(view, view, [camera.pos.x, camera.pos.y, camera.pos.z])
	mat4.rotateY(view, view, camera.rot.y)
	mat4.rotateX(view, view, camera.rot.x)
	mat4.invert(view, view)

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clearColor(0.529, 0.808, 0.922, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST)
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
	mat4.perspective(projection, 60 * Math.PI/180, gl.canvas.width / gl.canvas.height, 0.01, 1000)

	webgl.render()

  renderUI()
	updateUtils()
}

var test = new Box(-3, 65, 0, 1, 1, 1, [1, 0, 0])

setInterval(chunkTick, 1000/chunksPerSecond)
setInterval(setTick, 1000/setsPerSecond)
// setInterval(orderTick, 1000/ordersPerSecond)
render()
setInterval(() => {
	if (showFPS) {
		console.log(frames)
	}
	newCPS = chunksLoaded
	chunksLoaded = 0
	newFPS = frames
	frames = 0
}, 1000)

function orderTick() {
	if (!canOrder) { return }
	var geometries = {}
	for (let c in world) {
		var chunk = world[c]
		if (chunk.geometryT2.vertices.length > 0 && distance({x: chunk.pos.x*cs.x+cs.x/2, y: chunk.pos.y*cs.y+cs.y/2, z: chunk.pos.z*cs.z+cs.z/2}, camera.position) < 32) {
			geometries[c] = chunk.geometryT2
		}
	}
	if (geometries != {}) {
		canOrder = false
		chunkLoader.postMessage({task: "order", geometries: geometries, pos: camera.position })
	}
}

function setTick() {
	if (!canSet || setTickCooldown > 0) { return }
	var toSet = []
	var nearby = {}
	var toRender = []
	var offs = [
		[1, 0, 0],
		[-1, 0, 0],
		[0, 1, 0],
		[0, -1, 0],
		[0, 0, 1],
		[0, 0, -1]
	]
	var setting = 0
	for (let i = 0; i < sets.length; i++) {
		if (setting >= 5000) {
			break
		}
		setting += 1
		var set = sets[i]
		var p = getPos(set[0], set[1], set[2])
		var chunkPos = p[0]
		var cp = compactChunk(chunkPos)
		if (!toRender.includes(cp) && world[cp]) {
			toRender.push(cp)
			for (let off of offs) {
				var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
				nearby[cp3] = chunks[cp3]
			}
		}
		// X
		if (p[1].x == 0) {
			var cp2 = compactChunk({x:chunkPos.x-1, y:chunkPos.y, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x-1+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		if (p[1].x == cs.x-1) {
			var cp2 = compactChunk({x:chunkPos.x+1, y:chunkPos.y, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+1+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		// Y
		if (p[1].y == 0) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y-1, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y-1+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		if (p[1].y == cs.y-1) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y+1, z:chunkPos.z})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+1+off[1], z:chunkPos.z+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		// Z
		if (p[1].z == 0) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y, z:chunkPos.z-1})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z-1+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		if (p[1].z == cs.z-1) {
			var cp2 = compactChunk({x:chunkPos.x, y:chunkPos.y, z:chunkPos.z+1})
			nearby[cp2] = chunks[cp2]
			if (!toRender.includes(cp2) && world[cp2]) {
				toRender.push(cp2)
				for (let off of offs) {
					var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z+1+off[2]})
					nearby[cp3] = chunks[cp3]
				}
			}
		}
		toSet.push(set)
		sets.splice(i, 1)
		i -= 1
		nearby[cp] = chunks[cp]
		for (let off of offs) {
			var cp3 = compactChunk({x:chunkPos.x+off[0], y:chunkPos.y+off[1], z:chunkPos.z+off[2]})
			nearby[cp3] = chunks[cp3]
		}
	}
	if (toSet.length > 0) {
		canSet = false
		chunkLoader.postMessage({task: "set", sets: toSet, chunks: nearby, toRender: toRender})
	}
}

function chunkTick() {
	if (!loadChunks) {
		return
	}
	if (!canTick || chunkTickCooldown > 0) {
		return
	}
	
	player.wpos.x -= cs.x/2
	player.wpos.z -= cs.z/2
	var toRender = []
	for (let x = 0; x < renderSize.x*2+1; x++) {
		for (let y = 0; y < renderSize.y*2+1; y++) {
			for (let z = 0; z < renderSize.z*2+1; z++) {
				toRender.push((x-renderSize.x+Math.round(player.wcpos.x/cs.x))+"," + (y-renderSize.y+Math.round(player.wcpos.y/cs.y)) + ","+(z-renderSize.z+Math.round(player.wcpos.z/cs.z)))
			}
		}
	}
	player.wpos.x += cs.x/2
	player.wpos.z += cs.z/2
	var offPos = {
		x: player.wpos.x-Math.sin(camera.rot.y)*Math.cos(camera.rot.x)*cs.x*2, 
		y: player.wpos.y+Math.sin(camera.rot.x)*cs.y*2, 
		z: player.wpos.z-Math.cos(camera.rot.y)*Math.cos(camera.rot.x)*cs.z*2
	}
	// player.wpos.x += cs.x/2
	// player.wpos.z += cs.z/2
	// test.pos = offPos
	// test.update()
	// for (let x = 0; x < renderSize.x*2; x++) {
	// 	for (let y = 0; y < renderSize.y*2; y++) {
	// 		for (let z = 0; z < renderSize.z*2; z++) {
	// 			toRender2.push((x-renderSize.x+Math.round(offPos.x/cs.x))+"," + (y-renderSize.y+Math.round(offPos.y/cs.y)) + ","+(z-renderSize.z+Math.round(offPos.z/cs.z)))
	// 		}
	// 	}
	// }
	for (let chunk in world) {
		if (!toRender.includes(chunk)) {
			world[chunk].delete()
			delete world[chunk]
		}
	}

	var trSorted = []
	
	for (let i = 0; i < toRender.length; i++) {
		if (!world[toRender[i]]) {
			var pos = toRender[i].split(",")
			var d = distance({x: pos[0]*cs.x, y: pos[1]*cs.y, z: pos[2]*cs.z}, player.wcpos)
			trSorted.push([toRender[i], d])
		}
	}

	trSorted.sort((a, b) => a[1] - b[1])

	var closestArr = []
	for (let i = 0; i < chunkLoadSpeed; i++) {
		if (i >= trSorted.length) {
			break
		}
		closestArr.push(trSorted[i][0])
	}
	
	// var pos = closest.split(",")
	// console.log(closest, {x: pos[0]*cs.x, y: pos[1]*cs.y, z: pos[2]*cs.z}, bd)
	// for (let i = 0; i < toRender2.length; i++) {
	// 	if (ca.includes(toRender2[i])) {
	// 		toRender2.splice(i, 1)
	// 		i -= 1
	// 	} else {
	// 		var pos = toRender2[i].split(",")
	// 		var d = distance({x: pos[0]*cs.x, y: pos[1]*cs.y, z: pos[2]*cs.z}, offPos)
	// 		if (d < bd || bd == 0) {
	// 			bd = d
	// 			closest = toRender2[i]
	// 		}
	// 	}
	// }

	if (closestArr.length > 0) {
		for (let closest of closestArr) {
			canTick = false
			var pos = expandChunk(closest)
			var nearby = {}
			var offs = [
				[0, 0, 0],
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1],
			]
			for (let off of offs) {
				var c = compactChunk({x: pos.x+off[0], y: pos.y+off[1], z: pos.z+off[2]})
				// if (cSent.includes(c)) {continue}
				nearby[c] = chunks[c]
				cSent.push(c)
			}
		}
		chunkLoader.postMessage({task: "render", rChunks: closestArr, chunks: nearby})
	} else {
		chunkTickCooldown = 1
	}
	// for (let chunk of toRender) {
	// 	if (!world[chunk]) {
			
	// 	}
	// }
}

chunkLoader.onmessage = function(event) {
  var data = event.data
	var task = data.task
	if (task == "render") {
		var rChunks = data.rChunks
		for (let chunk of rChunks) {
			chunksLoaded += 1
			if (!world[chunk]) {
				var pos = expandChunk(chunk)
				let c = new Chunk(pos.x, pos.y, pos.z)
				world[chunk] = c
			}
			world[chunk].render(data.geometries[chunk])
		}
		
		for (let newChunk in data.chunks) {
			chunks[newChunk] = data.chunks[newChunk]
		}
		canTick = true
		sets.push(...data.sets)
	} else if (task == "set") {
		canSet = true
		for (let geometry in data.geometries) {
			if (!world[geometry]) {
				var pos = expandChunk(geometry)
				var chunk = new Chunk(pos.x, pos.y, pos.z)
				world[geometry] = chunk
			}
			world[geometry].render(data.geometries[geometry])
		}
		for (let newChunk in data.chunks) {
			chunks[newChunk] = data.chunks[newChunk]
		}
	} else if (task == "order") {
		canOrder = true
		var newGeometry = data.newGeometry
		for (let chunk in newGeometry) {
			if (world[chunk]) {
				world[chunk].order(newGeometry[chunk])
			}
		}
	}
	// for (let geometry in data.geometries) {
	// 	var chunk = world[geometry]
	// 	// if (!chunk) {continue}
	// 	var pos = expandChunk(geometry)
	// 	if (!chunk) {
	// 		var chunk = new Chunk(pos.x, pos.y, pos.z)
	// 		world[geometry] = chunk
	// 	}
	// 	world[geometry].render(data.geometries[geometry])
	// }
	
}

chunkLoader.onerror = function(error) {
  console.error('Worker error:', error)
}

function getBlock(x, y, z) {
	x = Math.floor(x)
	y = Math.floor(y)
	z = Math.floor(z)
	x += player.wcpos.x
	y += player.wcpos.y
	z += player.wcpos.z
	var chunkPos = {x: Math.floor(x/cs.x), y: Math.floor(y/cs.y), z: Math.floor(z/cs.z)}
	var blockPos = {x: Math.abs(x % (cs.x)), y: Math.abs(y % (cs.y)), z: Math.abs(z % (cs.z))}
	if (!chunks[chunkPos.x+","+chunkPos.y+","+chunkPos.z]) {
		return 0
	} 
	if (x < 0) {
		blockPos.x = cs.x-1-blockPos.x
		blockPos.x += 1
		if (blockPos.x >= cs.x) {
			blockPos.x = 0
		}
	}
	if (y < 0) {
		blockPos.y = cs.y-1-blockPos.y
		blockPos.y += 1
		if (blockPos.y >= cs.y) {
			blockPos.y = 0
		}
	}
	if (z < 0) {
		blockPos.z = cs.z-1-blockPos.z
		blockPos.z += 1
		if (blockPos.z >= cs.z) {
			blockPos.z = 0
		}
	}
	var chunk = chunks[chunkPos.x+","+chunkPos.y+","+chunkPos.z]
	return chunk[blockPos.z + blockPos.y*cs.z + blockPos.x*cs.y*cs.z]
}