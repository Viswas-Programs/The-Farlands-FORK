class Object3D {
	pos = {x: 0, y: 0, z: 0}
	size = {x: 0, y: 0, z: 0}
	rot = {x: 0, y: 0, z: 0}
	visible = true
	constructor(x, y, z, width, height, depth) {
		this.pos.x = x
		this.pos.y = y
		this.pos.z = z
		this.size.x = width
		this.size.y = height
		this.size.z = depth
	}
	isColliding(objects) {
		for (let object of objects) {
			if (
				this.pos.x+this.size.x/2 > object.pos.x-object.size.x/2 &&
				this.pos.x-this.size.x/2 < object.pos.x+object.size.x/2 &&
				this.pos.y+this.size.y/2 > object.pos.y-object.size.y/2 &&
				this.pos.y-this.size.y/2 < object.pos.y+object.size.y/2 &&
				this.pos.z+this.size.z/2 > object.pos.z-object.size.z/2 &&
				this.pos.z-this.size.z/2 < object.pos.z+object.size.z/2
			) {
				return true
			}
		}
		return false
	}
}

// SOMETIME IN THE FUTURE
/*
class Text {
	pos = {x: 0, y: 0, z: 0}
	size = 0
	rot = {x: 0, y: 0, z: 0}
	colour = [0, 0, 0]
	depth = 0
	mesh
	geometry
	material
	
	shadows
	visible = true
	lastColour = []
	lastSize
	lastDepth
	lastColour
	text = ""
	lastText = ""
	rendered = false
	center = true
	constructor(x, y, z, text, size, depth, colour) {
		this.pos.x = x
		this.pos.y = y
		this.pos.z = z
		this.size = size
		this.depth = depth
		this.colour = colour
		this.text = text
		this.geometry = new THREE.Geometry()
		this.material = new THREE.MeshLambertMaterial()
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.update()
		scene.add(this.mesh)
	}
	lookAtCam() {
		var diff = {x: camera.pos.x-this.pos.x, y: camera.pos.y-this.pos.y, z:  camera.pos.z-this.pos.z}
		this.mesh.castShadow = true
		this.rot.y = Math.atan2(diff.x, diff.z)
		var l1 = Math.sqrt((diff.x**2) + (diff.z**2))
		this.rot.x = Math.atan2(l1, diff.y)
		this.rot.x -= Math.PI/2
	}
	update() {
		this.mesh.visible = this.visible
		if ((font && !this.rendered) || this.text != this.lastText || JSON.stringify(this.lastSize) != JSON.stringify(this.size) || JSON.stringify(this.lastDepth) != JSON.stringify(this.depth)) {
			if (font) {
				this.rendered = true
				this.geometry = new THREE.TextGeometry(this.text, {
					font: font,
					size: this.size,
					height: this.depth,
					curveSegments: 2
				})
			}
			this.mesh.geometry = this.geometry
		}
		this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
		this.mesh.rotation.set(0, 0, 0)
		var box = new THREE.Box3().setFromObject(this.mesh)
		var euler = new THREE.Euler(this.rot.x, this.rot.y, this.rot.z, "YXZ")
		this.mesh.rotation.copy(euler)
		this.mesh.position.x -= Math.sin(this.rot.y+Math.PI/2)*((box.max.x-box.min.x)/2)
		this.mesh.position.z -= Math.cos(this.rot.y+Math.PI/2)*((box.max.x-box.min.x)/2)
		
		this.lastText = this.text
		this.lastSize = this.size
		this.lastDepth = this.depth
		if (JSON.stringify(this.colour) != JSON.stringify(this.lastColour)) {
			this.material = new THREE.MeshLambertMaterial({color: new THREE.Color(this.colour[0], this.colour[1], this.colour[2])})
			this.mesh.material = this.material
		}
		this.lastColour = [...this.colour]
	}
	delete() {
		scene.remove(this.mesh)
		this.material.dispose()
		this.geometry.dispose()
	}
}
*/

class Box extends Object3D {
	box
	colour = [0, 0, 0]
	constructor(x, y, z, width, height, depth, colour=[0, 0, 0]) {
		super(x, y, z, width, height, depth)
		this.colour = colour
		this.box = new webgl.Box(x, y, z, width, height, depth, colour)
		this.update()
	}
	update() {
		this.box.visible = this.visible
		this.box.pos = this.pos
		this.box.rot = {...this.rot}
		this.box.size = this.size
		this.box.colour = this.colour
	}
	mapUvs(uvs) {
		// 0, 1, psx*2, 1-psy*2, psx*2, 1, 0, 1-psy*2,
		// psx*2+psx*2, 1, psx*2, 1-psy*2, psx*2, 1, psx*2+psx*2, 1-psy*2,
		// psx*4, 1, psx*4+psx*2, 1-psy*2, psx*4, 1-psy*2, psx*4+psx*2, 1,
		// psx*6, 1, psx*6+psx*2, 1-psy*2, psx*6, 1-psy*2, psx*6+psx*2, 1,
		// psx*8, 1, psx*8+psx*2, 1-psy*2, psx*8, 1-psy*2, psx*8+psx*2, 1,
		
		// psx*10+psx*2, 1, psx*10, 1-psy*2, psx*10+psx*2, 1-psy*2, psx*10, 1,

		// 0 0 1 1
		this.box.uvs = [
			uvs[0], uvs[3], uvs[2], uvs[1], uvs[2], uvs[3], uvs[0], uvs[1],
			uvs[2+1*4], uvs[3+1*4], uvs[0+1*4], uvs[1+1*4], uvs[0+1*4], uvs[3+1*4], uvs[2+1*4], uvs[1+1*4],
			uvs[0+2*4], uvs[3+2*4], uvs[2+2*4], uvs[1+2*4], uvs[0+2*4], uvs[1+2*4], uvs[2+2*4], uvs[3+2*4],
			uvs[0+3*4], uvs[3+3*4], uvs[2+3*4], uvs[1+3*4], uvs[0+3*4], uvs[1+3*4], uvs[2+3*4], uvs[3+3*4],
			uvs[0+4*4], uvs[3+4*4], uvs[2+4*4], uvs[1+4*4], uvs[0+4*4], uvs[1+4*4], uvs[2+4*4], uvs[3+4*4],
			uvs[2+5*4], uvs[3+5*4], uvs[0+5*4], uvs[1+5*4], uvs[2+5*4], uvs[1+5*4], uvs[0+5*4], uvs[3+5*4],
		]
	}
	delete() {
		this.box.delete()
	}
}

class Chunk extends Object3D {
	mesh
	meshT
	collide = []
	blockSize = {x: 1, y: 1, z: 1}
	constructor(x, y, z) {
		super(x, y, z, cs.x, cs.y, cs.z)
		this.mesh = new webgl.Mesh(0, 0, 0, 1, 1, 1, [], [], [])
		this.meshT = new webgl.Mesh(0, 0, 0, 1, 1, 1, [], [], [])
		this.mesh.useTexture = true
		this.mesh.texture = texture
		this.meshT.useTexture = true
		this.meshT.texture = texture
		this.meshT.useAlpha = true
		this.meshT.alphaTexture = alphaTexture
		this.meshT.order = true
		this.mesh.oneSide = true
		this.updatePos()
	}
	render(geometries) {
		var geometry = geometries[0]
		this.mesh.vertices = geometry.vertices
		this.mesh.uvs = geometry.uvs
		this.mesh.colours = geometry.colours
		this.mesh.faces = geometry.faces
		
		var geometryT = geometries[1]
		this.meshT.vertices = geometryT.vertices
		this.meshT.uvs = geometryT.uvs
		this.meshT.colours = geometryT.colours
		this.meshT.faces = geometryT.faces
		
		this.mesh.updateBuffers()
		this.meshT.orderFaces()
	}
	updatePos() {
		this.mesh.pos = {x: this.pos.x*cs.x-player.wcpos.x, y: this.pos.y*cs.y-player.wcpos.y, z: this.pos.z*cs.z-player.wcpos.z}
		this.meshT.pos = {x: this.pos.x*cs.x-player.wcpos.x, y: this.pos.y*cs.y-player.wcpos.y, z: this.pos.z*cs.z-player.wcpos.z}
	}
	order(geometryT) {
		return
		// console.log(JSON.stringify(this.geometryT2) == geometryT)
		// this.geometryT2 = geometryT
		// this.geometryT = new THREE.BufferGeometry()
		// this.geometryT.setAttribute("position", new THREE.BufferAttribute(new Float32Array(geometryT.vertices), 3))
		// this.geometryT.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(geometryT.uvs), 2))
		// this.geometryT.setAttribute("color", new THREE.Float32BufferAttribute(geometryT.colours, 3))
		// this.geometryT.setIndex(geometryT.faces)
		// this.geometryT.computeVertexNormals()
		// this.geometryT.computeFaceNormals()
		// this.meshT.geometry = this.geometryT
		// console.log("ye")
		// this.geometryT.setIndex(order2)
		
		// this.geometryT.computeFaceNormals()
		// this.meshT.geometry = this.geometryT
	}
	updateShader() {
		// this.materialT.uniforms.cameraPos.value = camera.position
		// this.materialT.uniforms.light.value = light
		// this.material.uniforms.light.value = light
	}
	delete() {
		this.mesh.delete()
		this.meshT.delete()
	}
}

class Player extends Object3D {
	vel = {x: 0, y: 0, z: 0}
	falling = 0
	jumpPressed = 0
	dash = 0
	dashDir = {x: 0, y: 0, z: 0}
	speed = 0
	dashes = 0
	colouri = 0
	floor = 0
	attack
	attacking = 0
	cooldown = {}
	rotating = 0
	username
	dashing = false
	dashing2 = false
	lastWater = false
	teleporting = false
	teleport = 0
	model = []
	anim = "idle"
	headRot = 0
	pos2 = {x: 0, y: 0, z: 0}
	wpos = {x: 0, y: 0, z: 0}
	wcpos = {x: 0, y: 0, z: 0}
	set = false
	setPos = {x: 0, y: 0, z: 0}
	constructor(x, y, z) {
		super(x, y, z, 0.5, 1.9, 0.5)
		this.wpos = this.pos
		this.model = [
			new Box(0, 0, 0, 0.5, 0.75, 0.25, [1, 1, 1]),
			new Box(0, 0, 0, 0.5+0.001, 0.5+0.001, 0.5+0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25-0.001, 0.75-0.001, 0.25-0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25-0.001, 0.75-0.001, 0.25-0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25-0.001, 0.75-0.001, 0.25-0.001, [1, 1, 1]),
			new Box(0, 0, 0, 0.25-0.001, 0.75-0.001, 0.25-0.001, [1, 1, 1]),
		]
		this.model[0].offset = {x: 0, y: 0.1+0.075, z: 0, xr: 0, yr: 0, zr: 0}
		this.model[1].offset = {x: 0, y: 0.625+0.1+0.075, z: 0, xr: 0, yr: 0, zr: 0}
		this.model[2].offset = {x: 0.125, y: -0.65+0.075, z: 0, xr: 0, yr: 0, zr: 0}
		this.model[3].offset = {x: -0.125, y: -0.65+0.075, z: 0, xr: 0, yr: 0, zr: 0}
		this.model[4].offset = {x: 0.375, y: 0.1+0.075, z: 0, xr: 0, yr: 0, zr: 0}
		this.model[5].offset = {x: -0.375, y: 0.1+0.075, z: 0, xr: 0, yr: 0, zr: 0}

		this.updateTexture()

		for (let i in this.model) {
			this.model[i].box.updateBuffers()
			this.model[i].box.useTexture = true
			this.model[i].box.texture = playerTexture
		}
		
		// this.username = new Text(0, 0, 0, "Unnamed", 0.25, 0.01, [255, 255, 255])
		this.attack = new Box(x, y, z, 2, 2, 2, [0, 215, 255])
	}
	updateTexture(playerT=[0, 0]) {
		this.model[0].mapUvs([
			(psx*4)*psx2+playerT[0]*psx2, (psy*6)*psy2+playerT[1]*psy2, (psx*4+psx)*psx2+playerT[0]*psx2, (psy*6+psy*3)*psy2+playerT[1]*psy2,
			(psx*5)*psx2+playerT[0]*psx2, (psy*6)*psy2+playerT[1]*psy2, (psx*5+psx)*psx2+playerT[0]*psx2, (psy*6+psy*3)*psy2+playerT[1]*psy2,
			(psx*6)*psx2+playerT[0]*psx2, (psy*8)*psy2+playerT[1]*psy2, (psx*6+psx*2)*psx2+playerT[0]*psx2, (psy*8+psy)*psy2+playerT[1]*psy2,
			(psx*6)*psx2+playerT[0]*psx2, (psy*7)*psy2+playerT[1]*psy2, (psx*6+psx*2)*psx2+playerT[0]*psx2, (psy*7+psy)*psy2+playerT[1]*psy2,
			(0)*psx2+playerT[0]*psx2, (psy*6)*psy2+playerT[1]*psy2, (0+psx*2)*psx2+playerT[0]*psx2, (psy*6+psy*3)*psy2+playerT[1]*psy2,
			(psx*2)*psx2+playerT[0]*psx2, (psy*6)*psy2+playerT[1]*psy2, (psx*2+psx*2)*psx2+playerT[0]*psx2, (psy*6+psy*3)*psy2+playerT[1]*psy2,
		])
		
		this.model[1].mapUvs([
			(0)*psx2+playerT[0]*psx2, (1-psy*2)*psy2+playerT[1]*psy2, (psx*2)*psx2+playerT[0]*psx2, (1)*psy2+playerT[1]*psy2,
			(psx*2)*psx2+playerT[0]*psx2, (1-psy*2)*psy2+playerT[1]*psy2, (psx*2+psx*2)*psx2+playerT[0]*psx2, (1)*psy2+playerT[1]*psy2,
			(psx*4)*psx2+playerT[0]*psx2, (1-psy*2)*psy2+playerT[1]*psy2, (psx*4+psx*2)*psx2+playerT[0]*psx2, (1)*psy2+playerT[1]*psy2,
			(psx*6)*psx2+playerT[0]*psx2, (1-psy*2)*psy2+playerT[1]*psy2, (psx*6+psx*2)*psx2+playerT[0]*psx2, (1)*psy2+playerT[1]*psy2,
			(psx*8)*psx2+playerT[0]*psx2, (1-psy*2)*psy2+playerT[1]*psy2, (psx*8+psx*2)*psx2+playerT[0]*psx2, (1)*psy2+playerT[1]*psy2,
			(psx*10)*psx2+playerT[0]*psx2, (1-psy*2)*psy2+playerT[1]*psy2, (psx*10+psx*2)*psx2+playerT[0]*psx2, (1)*psy2+playerT[1]*psy2,
		])

		this.model[2].mapUvs([
			(psx*2)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx*2+psx)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
			(psx*3)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx*3+psx)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
			(psx*4)*psx2+playerT[0]*psx2, (psy)*psy2+playerT[1]*psy2, (psx*4+psx)*psx2+playerT[0]*psx2, (psy+psy)*psy2+playerT[1]*psy2,
			(psx*4)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx*4+psx)*psx2+playerT[0]*psx2, (0+psy)*psy2+playerT[1]*psy2,
			(0)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (0+psx)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
			(psx)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx+psx)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
		])

		this.model[3].mapUvs([
			(psx*2+psx*5)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx*2+psx+psx*5)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
			(psx*3+psx*5)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx*3+psx+psx*5)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
			(psx*4+psx*5)*psx2+playerT[0]*psx2, (psy)*psy2+playerT[1]*psy2, (psx*4+psx+psx*5)*psx2+playerT[0]*psx2, (psy+psy)*psy2+playerT[1]*psy2,
			(psx*4+psx*5)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx*4+psx+psx*5)*psx2+playerT[0]*psx2, (0+psy)*psy2+playerT[1]*psy2,
			(0+psx*5)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (0+psx+psx*5)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
			(psx+psx*5)*psx2+playerT[0]*psx2, (0)*psy2+playerT[1]*psy2, (psx+psx+psx*5)*psx2+playerT[0]*psx2, (0+psy*3)*psy2+playerT[1]*psy2,
		])

		this.model[4].mapUvs([
			(psx*2)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx*2+psx)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
			(psx*3)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx*3+psx)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
			(psx*4)*psx2+playerT[0]*psx2, (psy*4)*psy2+playerT[1]*psy2, (psx*4+psx)*psx2+playerT[0]*psx2, (psy*4+psy)*psy2+playerT[1]*psy2,
			(psx*4)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx*4+psx)*psx2+playerT[0]*psx2, (psy*3+psy)*psy2+playerT[1]*psy2,
			(0)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (0+psx)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
			(psx)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx+psx)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
		])

		this.model[5].mapUvs([
			(psx*2+psx*5)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx*2+psx+psx*5)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
			(psx*3+psx*5)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx*3+psx+psx*5)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
			(psx*4+psx*5)*psx2+playerT[0]*psx2, (psy*4)*psy2+playerT[1]*psy2, (psx*4+psx+psx*5)*psx2+playerT[0]*psx2, (psy*4+psy)*psy2+playerT[1]*psy2,
			(psx*4+psx*5)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx*4+psx+psx*5)*psx2+playerT[0]*psx2, (psy*3+psy)*psy2+playerT[1]*psy2,
			(0+psx*5)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (0+psx+psx*5)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
			(psx+psx*5)*psx2+playerT[0]*psx2, (psy*3)*psy2+playerT[1]*psy2, (psx+psx+psx*5)*psx2+playerT[0]*psx2, (psy*3+psy*3)*psy2+playerT[1]*psy2,
		])
	}
	tp(x, y, z) {
		this.set = true
		this.setPos = {x: x, y: y, z: z}
	}
	tick(delta) {
		// this.username.visible = false
		if (this.set) {
			this.set = false
			this.wpos = {...this.setPos}
		}
		var cBlock = getBlock(Math.floor(this.pos.x), Math.floor(this.pos.y-0.5), Math.floor(this.pos.z))
		var inWater = cBlock == 6
		this.dash -= 1*60*delta
		this.jumpPressed -= 1*60*delta

		if (jKeys["KeyJ"]) {
			playerT = [0, 0]
			this.updateTexture(playerT)
			for (let model of this.model) {
				model.box.updateBuffers()
			}
		}
		if (jKeys["KeyK"]) {
			playerT = [1, 0]
			this.updateTexture(playerT)
			for (let model of this.model) {
				model.box.updateBuffers()
			}
		}
		
		if (this.teleporting) {
			this.teleport += 1*delta
		}
		if (this.teleport >= 3) {
			this.teleport = 0
			this.teleporting = false
			this.tp(0, worldSize.y, 0)
		}
		var endDash = this.dash <= 0 && this.dashing
		var stopDash = this.dash <= -3 && this.dashing2
		if (jKeys["Space"]) {
			this.jumpPressed = 10
		}
		this.attacking -= 1*60*delta
		if (lClick && !inventoryOpen && inInventory <= 0) {
			var bp = indicator.pos
			if (indicator.visible) {
				var block = getData(getBlock(Math.floor(bp.x), Math.floor(bp.y), Math.floor(bp.z)))
				if (block) {
					if (enoughSpace(blocks[block][7], 1)) {
						var s = [Math.floor(bp.x)+this.wcpos.x, Math.floor(bp.y)+this.wcpos.y, Math.floor(bp.z)+this.wcpos.z, 0]
						if (!sets.includes(s)) {
							sets.push(s)
						}
						if (block != 0) {
							addItem(blocks[block][7], 1)
						}
						setTickCooldown = 0
					}
				}
			}
			// sendMsg({"broadcast": {"attack": id}})
			// this.attacking = 10
		}
		if (rClick && !inventoryOpen && inInventory <= 0) {
			var bp = {...rp}
			bp.x -= Math.sin(camera.rot.y)*Math.cos(camera.rot.x+Math.PI)*0.025
			bp.y += Math.sin(camera.rot.x+Math.PI)*0.025
			bp.z -= Math.cos(camera.rot.y)*Math.cos(camera.rot.x+Math.PI)*0.025
			bp = {x: Math.round(bp.x+0.5)-0.5, y: Math.round(bp.y+0.5)-0.5, z: Math.round(bp.z+0.5)-0.5}
			var bpHitbox = new Object3D(bp.x, bp.y, bp.z, 1, 1, 1)
			if (!this.isColliding([bpHitbox]) && indicator.visible && itemData[inventory[selected][0]][1]) {
				var s = [Math.floor(bp.x)+this.wcpos.x, Math.floor(bp.y)+this.wcpos.y, Math.floor(bp.z)+this.wcpos.z, itemData[inventory[selected][0]][2]]
				removeItem(inventory[selected][0], 1, selected)
				if (!sets.includes(s)) {sets.push(s)}
				setTickCooldown = 0
			}
			
			// sendMsg({"broadcast": {"attack": id}})
			// this.attacking = 10
		}
		if (this.falling < 1 && this.dash < 5) {
			this.dashes = 1
		}
		if (this.jumpPressed > 0 && this.rotating <= 0 && this.falling < 3) {
			this.teleporting = false
			this.teleport = 0
			this.vel.y = 0.11
			this.jumpPressed = 0
			if (this.dash > -3 && this.dashDir.y < 0) {
				this.vel.x += this.dashDir.x*dashForce*2
				this.vel.z += this.dashDir.z*dashForce*2
				this.vel.y /= 1.5
			}
			this.dash = -4
			this.dashing = false
			this.dashing2 = false
			stopDash = false
		}
		
		if (stopDash && !godmode) {
			this.vel.x = this.dashDir.x*this.speed
			this.vel.z = this.dashDir.z*this.speed
		}

		if (this.falling < 1) {
			this.floor += 1
		} else {
			this.floor = 0
		}

		if (this.dash < -3 && this.floor > 3) {
			this.vel.x *= friction
			this.vel.z *= friction
			this.speed = speed
		} else {
			this.vel.x *= airFriction
			this.vel.z *= airFriction
			this.speed = airSpeed
		}
		if (this.dashes > 0) {
			this.colour = [0, 0.5, 1]
			this.colouri = 0
		} else {
			this.colour = [1, 1, 1]
			this.colouri = 1
		}
		if (this.dash > 0) {
			this.colour = [1, 1, 1]
			this.colouri = 1
		}
		this.anim = "idle"
		if (!this.dashing) {
			if (!inWater && !godmode) {
				this.vel.y -= gravity*60*delta
			}
			this.dashDir = {x: 0, y: 0, z: 0}
			if (keys["KeyW"] && this.rotating <= 0) {
				this.anim = "walk"
				this.vel.z -= Math.cos(camera.rot.y)*this.speed
				this.vel.x -= Math.sin(camera.rot.y)*this.speed
				this.dashDir.z -= Math.cos(camera.rot.y)
				this.dashDir.x -= Math.sin(camera.rot.y)
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["KeyS"] && this.rotating <= 0) {
				this.anim = "walk"
				this.vel.z += Math.cos(camera.rot.y)*this.speed
				this.vel.x += Math.sin(camera.rot.y)*this.speed
				this.dashDir.z += Math.cos(camera.rot.y)
				this.dashDir.x += Math.sin(camera.rot.y)
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["KeyA"] && this.rotating <= 0) {
				this.anim = "walk"
				this.vel.z -= Math.cos(camera.rot.y+Math.PI/2)*this.speed
				this.vel.x -= Math.sin(camera.rot.y+Math.PI/2)*this.speed
				this.dashDir.z -= Math.cos(camera.rot.y+Math.PI/2)
				this.dashDir.x -= Math.sin(camera.rot.y+Math.PI/2)
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["KeyD"] && this.rotating <= 0) {
				this.anim = "walk"
				this.vel.z += Math.cos(camera.rot.y+Math.PI/2)*this.speed
				this.vel.x += Math.sin(camera.rot.y+Math.PI/2)*this.speed
				this.dashDir.z += Math.cos(camera.rot.y+Math.PI/2)
				this.dashDir.x += Math.sin(camera.rot.y+Math.PI/2)
				this.teleporting = false
				this.teleport = 0
			}
			if (godmode) {
				this.dashes = 1
				this.vel.y *= 0.9
			}
			if (inWater) {
				this.dashes = 1
				if (!godmode) {
					this.vel.y *= 0.9
					this.vel.y -= 0.0035
				}
				if (keys["KeyE"] || keys["Space"]) {
					this.teleporting = false
					this.teleport = 0
					this.vel.y += 0.01
				}
				if (keys["KeyQ"]) {
					this.teleporting = false
					this.teleport = 0
					this.vel.y -= 0.005
				}
			}
			if (!inWater && this.lastWater && (keys["KeyE"] || keys["Space"])) {
				this.vel.y = 0.08
				this.teleporting = false
				this.teleport = 0
			}
			if (keys["KeyE"]) {
				if (godmode) {
					this.vel.y += 0.025
					this.teleporting = false
					this.teleport = 0
				}
				this.dashDir.y = 1
			}
			if (keys["KeyQ"]) {
				if (godmode) {
					this.vel.y -= 0.025
					this.teleporting = false
					this.teleport = 0
				}
				this.dashDir.y = -1
			} 
			if (jKeys["KeyG"]) {
				this.teleporting = true
				this.teleport = 0
			}
			if (jKeys["ShiftLeft"] && this.rotating <= 0 && this.dashes > 0) {
				this.dashes -= 1
				this.dash = dashCooldown
				this.dashing = true
				this.dashing2 = true
			}
		} else if (!this.teleporting) {
			this.vel.x = this.dashDir.x*dashForce
			this.vel.y = this.dashDir.y*dashForce
			this.vel.z = this.dashDir.z*dashForce
			if (endDash && this.dashDir.y == 1) {
				this.vel.y = 0.11
			}
			// if (this.dash == 1) {
			// 	this.vel.x = this.dashDir.x*this.speed
			// 	this.vel.z = this.dashDir.z*this.speed
			// }
		} else {
			if (!inWater && !godmode) {
				this.vel.y -= gravity*60*delta
			}
		}
		
		this.move(this.vel.x*60*delta, this.vel.y*60*delta, this.vel.z*60*delta, 1/delta)
		// if (this.checkCollide()) {
		// 	this.pos.y += 1
		// }
		// if (this.hitbox.pos.y < -100) {
		// 	this.hitbox.pos.x = 0+cs.x/2
		// 	this.hitbox.pos.z = 0+cs.z/2
		// 	this.hitbox.pos.y = 100
		// }

		for (let player in this.cooldown) {
			this.cooldown[player] -= 1
			if (this.cooldown[player] <= 0) {
				delete this.cooldown[player]
			}
		}
		
		this.attack.size.x = (5-Math.abs(5 - this.attacking))/2
		this.attack.size.y = (5-Math.abs(5 - this.attacking))/2
		this.attack.size.z = (5-Math.abs(5 - this.attacking))/2
		this.attack.visible = this.attacking > 0
		this.attack.pos = this.pos
		this.attack.update()
		this.checkAttack()

		if (this.attacking < 0) {
			this.attacking = 0
		}

		this.rotating -= 1
		if (this.rotating > 0) {
			this.rot.y += 0.25
		} else {
			if (this.dashDir.x != 0 || this.dashDir.z != 0) {
				this.rot.y = intAngle(this.rot.y, Math.atan2(-this.dashDir.x, -this.dashDir.z), 1/10)
			}
			var targetAngle = -angleDistance(camera.rot.y, this.rot.y)
			if (Math.abs(targetAngle) < Math.PI/2) {
				if (targetAngle < -Math.PI/4) {
				targetAngle = -Math.PI/4
				}
				if (targetAngle > Math.PI/4) {
					targetAngle = Math.PI/4
				}
				this.headRot += (targetAngle-this.headRot)/10
			} else {
				this.headRot += (0-this.headRot)/10
			}
			if (this.dashDir.x == 0 && this.dashDir.z == 0) {
				if (targetAngle <= -Math.PI/4) {
					this.rot.y -= 0.05
				}
				if (targetAngle >= Math.PI/4) {
					this.rot.y += 0.05
				}
			}
		}
		if (this.dash <= 0) {
			this.dashing = false
		}
		if (this.dash <= -3) {
			this.dashing2 = false
		}
		// if (this.dashing) {
		// 	this.anim = "dash"
		// }
		this.lastWater = inWater
		// this.pos.x = this.pos.x % 16
		// this.pos.y = this.pos.y % 16
		// this.pos.z = this.pos.z % 16
		// this.rot.y += 0.01
		this.model[1].rot.x = camera.rot.x
		// this.username.text = usernameBox.value
		// this.username.pos = {...this.pos}
		// this.username.pos.y += 0.5
		// this.username.lookAtCam()
		// this.username.update()
		this.updateModel()
	}
	updateModel() {
		var interpolate = 10
		if (this.falling >= 3) {
			interpolate = 100
		}
		if (this.anim == "walk") {
			this.rot.x += (0-this.rot.x)/10
			this.model[2].rot.x += (Math.sin(time*5)-this.model[2].rot.x)/interpolate
			this.model[3].rot.x += (-Math.sin(time*5)-this.model[3].rot.x)/interpolate
			this.model[4].rot.x += (-Math.sin(time*5)-this.model[4].rot.x)/interpolate
			this.model[5].rot.x += (Math.sin(time*5)-this.model[5].rot.x)/interpolate
		} else if (this.anim == "dash") {
			this.rot.x += (Math.atan2(this.dashDir.y, Math.sqrt(this.dashDir.x**2+this.dashDir.z**2))-Math.PI/2-this.rot.x)
			this.model[2].rot.x += (0-this.model[2].rot.x)
			this.model[3].rot.x += (0-this.model[3].rot.x)
			this.model[4].rot.x += (0-this.model[4].rot.x)
			this.model[5].rot.x += (0-this.model[5].rot.x)
		} else {
			this.rot.x += (0-this.rot.x)/10
			this.model[2].rot.x += (0-this.model[2].rot.x)/interpolate
			this.model[3].rot.x += (0-this.model[3].rot.x)/interpolate
			this.model[4].rot.x += (0-this.model[4].rot.x)/interpolate
			this.model[5].rot.x += (0-this.model[5].rot.x)/interpolate
		}
		
		var i = 0
		for (let model of this.model) {
			// model.pos = {...this.pos}
			model.pos.x = this.pos.x
			model.pos.y = this.pos.y
			model.pos.z = this.pos.z
			model.pos.x += model.offset.x*Math.cos(-this.rot.y)+model.offset.z*Math.cos(-this.rot.y+Math.PI/2)
			model.pos.y += model.offset.y
			model.pos.z += model.offset.x*Math.sin(-this.rot.y)+model.offset.z*Math.sin(-this.rot.y+Math.PI/2)
			model.box.rotOff.x = -model.size.x/2
			model.box.rotOff.y = -model.size.y/2
			model.box.rotOff.z = -model.size.z/2
			if (i >= 2) /*is leg or arm*/ {
				model.box.rotOff.y -= 0.375
			}
			model.rot.y = this.rot.y
			if (i == 1) {
				model.box.rotOff.y += 0.25
				model.rot.y += this.headRot
			}
			// if (i != 2) {
			// 	model.colour = this.colour
			// }
			
			model.visible = this.visible
			model.rot.x += this.rot.x
			model.update()
			model.rot.x -= this.rot.x
			i += 1
		}
	}
	delete() {
		for (let model of this.model) {
			model.delete()
		}
	}
	checkAttack() {
		if (this.attacking <= 0) { return }
		for (let player in players) {
			if (!this.cooldown[player] && this.attack.isColliding([players[player]])) {
				this.cooldown[player] = 60
				players[player].rotating = 60
				sendMsg({"send": [player, {"hit": this.pos}]})
			}
		}
	}
	checkCollide() {
		if (godmode) {
			return false
		}
		if (this.isColliding(borders)) {
			return true
		}
		if (isCollidingWorld(this)) {
			return true
		}
		return false
	}
	move(x, y, z, steps) {
		this.falling += 1
		for (let i = 0; i < steps; i++) {
			var lastX = this.pos.x
			this.pos.x += x/steps
			if (this.checkCollide()) {
				this.pos.x = lastX
			}
			var lastZ = this.pos.z
			this.pos.z += z/steps
			if (this.checkCollide()) {
				this.pos.z = lastZ
			}
			var lastY = this.pos.y
			this.pos.y += y/steps
			if (this.checkCollide()) {
				this.pos.y = lastY
				if (this.vel.y < 0) {
					this.falling = 0
				}
				this.vel.y = 0
			}
		}
	}
}