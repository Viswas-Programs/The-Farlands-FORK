// +Y -Y X+ X- Z+ Z-
var blocks = {
	/*1*/	"dirt": [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0], true, "dirt"],
	/*2*/	"grass": [[0, 1], [1, 0], [0, 0], [0, 0], [0, 0], [0, 0], true, "grass"],
	/*3*/	"oakLog": [[0, 5], [0, 5], [0, 4], [0, 4], [0, 4], [0, 4], true, "oakLog"],
	/*4*/	"oakLeaves": [[0, 6], [0, 6], [0, 6], [0, 6], [0, 6], [0, 6], false, "oakLeaves"],
	/*5*/	"glass": [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], false, "glass"],
	/*6*/	"water": [[0, 2], [0, 2], [0, 2], [0, 2], [0, 2], [0, 2], false, "water"],
	/*7*/	"stone": [[2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], true, "stone"],
	/*8*/	"oakPlanks": [[0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7], true, "oakPlanks"],
	/*9*/	"sand": [[2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], true, "sand"],
	/*10*/ "coalOre": [[0, 3], [0, 3], [0, 3], [0, 3], [0, 3], [0, 3], true, "coal"],
	/*11*/ "ironOre": [[1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], true, "ironOre"],
	/*12*/ "goldOre": [[2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], true, "goldOre"],
	/*13*/ "diamondOre": [[3, 3], [3, 3], [3, 3], [3, 3], [3, 3], [3, 3], true, "diamond"],
	/*14*/ "lava": [[1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], false, "lava"],
	/*15*/ "iceOre": [[4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], true, "null"],
	/*16*/ "lavaStone": [[5, 3], [5, 3], [5, 3], [5, 3], [5, 3], [5, 3], true, "null"],
	/*17*/ "snowyGrass": [[4, 1], [1, 0], [4, 0], [4, 0], [4, 0], [4, 0], true, "null"],
	/*18*/ "snow": [[4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], true, "null"],
	/*19*/ "ashGrass": [[5, 1], [1, 0], [5, 0], [5, 0], [5, 0], [5, 0], true, "null"],
	/*20*/ "ash": [[5, 2], [5, 2], [5, 2], [5, 2], [5, 2], [5, 2], true, "null"],
	/*21*/ "bricks": [[2, 0], [2, 0], [2, 0], [2, 0], [2, 0], [2, 0], true, "bricks"],
	/*22*/ "cactus": [[3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], true, "null"],
	/*23*/ "birchLog": [[1, 5], [1, 5], [1, 4], [1, 4], [1, 4], [1, 4], true, "birchLog"],
	/*24*/ "birchLeaves": [[1, 6], [1, 6], [1, 6], [1, 6], [1, 6], [1, 6], false, "birchLeaves"],
	/*25*/ "birchPlanks": [[1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], true, "birchPlanks"],
	/*26*/ "swamp_log": [[2, 5], [2, 5], [2, 4], [2, 4], [2, 4], [2, 4], true, "null"],
	/*27*/ "swampLeaves": [[2, 6], [2, 6], [2, 6], [2, 6], [2, 6], [2, 6], false, "null"],
	/*28*/ "swampPlanks": [[2, 7], [2, 7], [2, 7], [2, 7], [2, 7], [2, 7], true, "null"],
	/*29*/ "darkLog": [[3, 5], [3, 5], [3, 4], [3, 4], [3, 4], [3, 4], true, "null"],
	/*30*/ "darkLeaves": [[3, 6], [3, 6], [3, 6], [3, 6], [3, 6], [3, 6], false, "null"],
	/*31*/ "darkPlanks": [[3, 7], [3, 7], [3, 7], [3, 7], [3, 7], [3, 7], true, "null"],
	/*32*/ "taigaLog": [[4, 5], [4, 5], [4, 4], [4, 4], [4, 4], [4, 4], true, "null"],
	/*33*/ "taigaLeaves": [[4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], false, "null"],
	/*34*/ "taigaPlanks": [[4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], true, "null"],
	/*35*/ "ashLog": [[5, 5], [5, 5], [5, 4], [5, 4], [5, 4], [5, 4], true, "null"],
	/*36*/ "null": [[5, 6], [5, 6], [5, 6], [5, 6], [5, 6], [5, 6], false, "null"],
	/*37*/ "ashPlanks": [[5, 7], [5, 7], [5, 7], [5, 7], [5, 7], [5, 7], true, "null"],
	/*38*/ "stoneBricks": [[6, 0], [6, 0], [6, 0], [6, 0], [6, 0], [6, 0], true, "stoneBricks"],
	/*39*/ "ironBlock": [[6, 4], [6, 4], [6, 4], [6, 4], [6, 4], [6, 4], true, "ironBlock"],
	/*40*/ "goldBlock": [[6, 3], [6, 3], [6, 3], [6, 3], [6, 3], [6, 3], true, "goldBlock"],
	/*41*/ "diamondBlock": [[6, 2], [6, 2], [6, 2], [6, 2], [6, 2], [6, 2], true, "diamondBlock"],
	}
	var itemData = {
		"none": [[], false, 0],
		"grass": [[0, 0], true, 2],
		"dirt": [[1, 0], true, 1],
		"stone": [[0, 1], true, 7],
		"sand": [[2, 0], true, 9],
		"glass": [[1, 1], true, 5],
		"sand": [[2, 0], true, 9],
		"bricks": [[2, 1], true, 21],
		"oakLog": [[0, 4], true, 3],
		"oakLeaves": [[2, 4], true, 4],
		"oakPlanks": [[4, 4], true, 8],
		"birchLog": [[1, 4], true, 23],
		"birchLeaves": [[3, 4], true, 24],
		"birchPlanks": [[5, 4], true, 25],
		"coalOre": [[0, 3], true, 10],
		"ironOre": [[1, 3], true, 11],
		"goldOre": [[2, 3], true, 12],
		"diamondOre": [[3, 3], true, 13],
		"stoneBricks": [[4, 2], true, 38],
		"water": [[0, 2], true, 6],
		"lava": [[1, 2], true, 14],
		"brick": [[0, 5], false, 0],
		"coal": [[1, 5], false, 0],
		"iron": [[2, 5], false, 0],
		"gold": [[3, 5], false, 0],
		"diamond": [[4, 5], false, 0],
		"ironBlock": [[5, 0], true, 39],
		"goldBlock": [[5, 1], true, 40],
		"diamondBlock": [[5, 2], true, 41],
		"null": [[2, 2], true, 36],
	}
	var recipes = [
		[["oakPlanks", 4], [["oakLog", 1]]],
		[["birchPlanks", 4], [["birchLog", 1]]],
		[["glass", 1], [["sand", 1], ["coal", 1]]],
		[["stoneBricks", 1], [["stone", 4]]],
		[["water", 1], [["sand", 100]]],
		[["grass", 1], [["dirt", 100]]],
		[["bricks", 1], [["brick", 4], ["coal", 1]]],
		[["brick", 1], [["dirt", 1], ["stone", 1], ["coal", 1]]],
		[["iron", 1], [["ironOre", 1], ["coal", 1]]],
		[["gold", 1], [["goldOre", 1], ["coal", 1]]],
		[["ironBlock", 1], [["iron", 10]]],
		[["goldBlock", 1], [["gold", 10]]],
		[["diamondBlock", 1], [["diamond", 10]]],
	]
	// Blocks with no collision
	var none = [0, 6, 14]
	// Size of tilemap
	var blocksSize = {x: 7, y: 8}
	var playerSize = {x: 12, y: 11}
	var psx = 1/playerSize.x
	var psy = 1/playerSize.y
	
	var playerSize2 = {x: 2, y: 1}
	var psx2 = 1/playerSize2.x
	var psy2 = 1/playerSize2.y
	var playerT = [0, 0]
	
	// World size stuff
	var renderSize = {x: 2, y: 2, z: 2}
	var worldSize = {x: 1, y: 100, z: 1}
	var waterLevel = worldSize.y/2
	var cs = {x: 16, y: 16, z: 16}
	// Speed of loading
	var chunksPerSecond = 10
	var setsPerSecond = 60
	var ordersPerSecond = 60 /* does nothing */
	var chunkLoadSpeed = 1
	
	// Player Settings
	var gravity = 0.005
	var dashCooldown = 9
	var dashForce = 0.35
	var speed = 0.025
	var friction = 0.5	 
	var airFriction = 0.95
	var airSpeed = 0.003
	
	// General Settings
	var godmode = false
	var showFPS = false
	var loadChunks = true
	
	// Setup
	var blockSize = {x: 1/blocksSize.x, y: 1/blocksSize.y}
	
	for (let block in blocks) {
		for (let i = 0; i < 6; i++) {
			blocks[block][i][0] /= blocksSize.x
			blocks[block][i][1] /= blocksSize.y
		}
	}
	
	var i = 0
	var transparent = []
	for (let block in blocks) {
		if (!blocks[block][6]) {
			transparent.push(i+1)
		}
		i++
	}
	
	function getPos(x, y, z) {
		x = Math.round(x)
		y = Math.round(y)
		z = Math.round(z)
		var chunkPos = {x: Math.floor(x/cs.x), y: Math.floor(y/cs.y), z: Math.floor(z/cs.z)}
		var blockPos = {x: Math.abs(x % (cs.x)), y: Math.abs(y % (cs.y)), z: Math.abs(z % (cs.z))}
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
		return [chunkPos, blockPos]
	}
	
	function sRandom(seed) {
		var x = Math.sin(seed*3902+7459)*Math.cos(seed*4092+4829)*10000
		return x - Math.floor(x)
	}
	
	function distance(vec1, vec2) {
		return Math.sqrt((vec2.x-vec1.x)**2 + (vec2.y-vec1.y)**2 + (vec2.z-vec1.z)**2)
	}
	
	function generateStructure(structure, rx, ry, rz) {
		var sets = []
		if (structure == "oak tree") {
			//creating oak trees
			sets.push([rx, ry+1, rz, 3])
			sets.push([rx, ry+2, rz, 3])
			for (let x3 = 0; x3 < 5; x3++) {
				for (let z3 = 0; z3 < 5; z3++) {
					for (let y3 = 0; y3 < 2; y3++) {
						sets.push([rx+x3-2, ry+3+y3, rz+z3-2, 4])
					}
				}
			}
			//leaves
			sets.push([rx, ry+5, rz, 4])
			sets.push([rx-1, ry+5, rz, 4])
			sets.push([rx+1, ry+5, rz, 4])
			sets.push([rx, ry+5, rz-1, 4])
			sets.push([rx, ry+5, rz+1, 4])
			
			sets.push([rx, ry+6, rz, 4])
			sets.push([rx-1, ry+6, rz, 4])
			sets.push([rx+1, ry+6, rz, 4])
			sets.push([rx, ry+6, rz-1, 4])
			sets.push([rx, ry+6, rz+1, 4])
			sets.push([rx, ry+3, rz, 3])
			sets.push([rx, ry+4, rz, 3])
		} else if (structure == "birch tree") {
			//creating birch trees
			sets.push([rx, ry+1, rz, 23])
			sets.push([rx, ry+2, rz, 23])
			for (let x3 = 0; x3 < 5; x3++) {
				for (let z3 = 0; z3 < 5; z3++) {
					for (let y3 = 0; y3 < 2; y3++) {
						sets.push([rx+x3-2, ry+3+y3, rz+z3-2, 24])
					}
				}
			}
			//leaves
			sets.push([rx, ry+5, rz, 24])
			sets.push([rx-1, ry+5, rz, 24])
			sets.push([rx+1, ry+5, rz, 24])
			sets.push([rx, ry+5, rz-1, 24])
			sets.push([rx, ry+5, rz+1, 24])
			
			sets.push([rx, ry+6, rz, 24])
			sets.push([rx-1, ry+6, rz, 24])
			sets.push([rx+1, ry+6, rz, 24])
			sets.push([rx, ry+6, rz-1, 24])
			sets.push([rx, ry+6, rz+1, 24])
			
			sets.push([rx, ry+3, rz, 23])
			sets.push([rx, ry+4, rz, 23])
		
		} else if (structure == "medium_house") {
			//floor
			for (let x = 0; x < 10; x++) {
				for (let z = 0; z < 8; z++) {
					sets.push([rx+x-2, ry, rz-z+2, 7])
				}
			}
			//left wall
			for (let x = 0; x < 8; x++) {
				for (let y = 0; y < 4; y++) {
					sets.push([rx+x-2, ry+1+y, rz-5, 8])
				}
			}
			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 4; y++) {
					sets.push([rx+x-2, ry+1+y, rz-5, 8])
				}
			}
			//right wall
			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 4; y++) {
					sets.push([rx+x-2, ry+1+y, rz+2, 8])
				}
			}
			//back wall
			for (let z = 0; z < 3; z++) {
				for (let y = 0; y < 4; y++) {
					sets.push([rx+2, ry+1+y, rz+z-1, 8])
				}
			}
			//back back wall
			for (let z = 0; z < 6; z++) {
				for (let y = 0; y < 4; y++) {
					sets.push([rx+7, ry+1+y, rz+z-4, 8])
				}
			}
			//front wall
			for (let z = 0; z < 3; z++) {
				for (let y = 0; y < 4; y++) {
					sets.push([rx-2, ry+1+y, rz+z-4, 8])
				}
			}
			//windows
			sets.push([rx, ry+2, rz-5, 5])
			sets.push([rx+1, ry+2, rz-5, 5])
			sets.push([rx, ry+2, rz+2, 5])
			//sets.push([rx+2, ry+2, rz, 5])
			//door
			sets.push([rx-2, ry+4, rz, 8])
			sets.push([rx-2, ry+4, rz-1, 8])
			sets.push([rx-2, ry+4, rz+1, 8])
			sets.push([rx-2, ry+3, rz, 8])
			sets.push([rx-2, ry+3, rz-1, 8])
			sets.push([rx-2, ry+3, rz+1, 8])
			sets.push([rx-2, ry+2, rz+1, 8])
			sets.push([rx-2, ry+1, rz+1, 8])
			sets.push([rx-2, ry+2, rz-1, 8])
			sets.push([rx-2, ry+1, rz-1, 8])
			//roof
			for (let x = 0; x < 8; x++) {
				// for (let y = 0; y < 0; y++) {
				for (let z = 0; z < 6; z++) {
					sets.push([rx+x-1, ry+5, rz+1-z, 8])
				}
				// }
			}
			//      for (let x = 0; x < 9; x++) {
				// // for (let y = 0; y < 0; y++) {
			//        for (let z = 0; z < 3; z++) {
				// 	sets.push([rx+x-2, ry+5, rz-1-z, 8])
				// }
			//        // }
			//      }
			//oak_log supports
			//back right
			sets.push([rx+7, ry+1, rz+2, 3])
			sets.push([rx+7, ry+2, rz+2, 3])
			sets.push([rx+7, ry+3, rz+2, 3])
			sets.push([rx+7, ry+4, rz+2, 3])
			//front left
			sets.push([rx-2, ry+1, rz-5, 3])
			sets.push([rx-2, ry+2, rz-5, 3])
			sets.push([rx-2, ry+3, rz-5, 3])
			sets.push([rx-2, ry+4, rz-5, 3])
			//inside lower
			sets.push([rx+2, ry+1, rz-2, 3])
			sets.push([rx+2, ry+2, rz-2, 3])
			sets.push([rx+2, ry+3, rz-2, 3])
			sets.push([rx+2, ry+4, rz-2, 3])
			//front right
			sets.push([rx-2, ry+1, rz+2, 3])
			sets.push([rx-2, ry+2, rz+2, 3])
			sets.push([rx-2, ry+3, rz+2, 3])
			sets.push([rx-2, ry+4, rz+2, 3])
			//back left
			sets.push([rx+7, ry+1, rz-5, 3])
			sets.push([rx+7, ry+2, rz-5, 3])
			sets.push([rx+7, ry+3, rz-5, 3])
			sets.push([rx+7, ry+4, rz-5, 3])
	
		
		} else if (structure == "spikes") {
			sets.push([rx-1, ry+1, rz, 7])
			sets.push([rx, ry+1, rz+1, 7])
			sets.push([rx, ry+2, rz+2, 7])
			sets.push([rx, ry+3, rz+3, 7])
			sets.push([rx-2, ry+2, rz, 7])
			sets.push([rx, ry+1, rz-1, 7])
	
			
		} else if (structure == "dungeon") {
			var no = ["0,0", "6,6", "0,6", "6,0"]
			for (let x = 0; x < 7; x++) {
				for (let z = 0; z < 7; z++) {
					if (!no.includes([x, z].join(","))) {
						sets.push([rx+x-3, ry, rz+z-3, 38])
					}
				}
			}
			function generateRoom(rx, ry, rz, width, height, depth) {
				for (let x = 0; x < width; x++) {
					for (let y = 0; y < height; y++) {
						for (let z = 0; z < depth; z++) {
							sets.push([rx-Math.floor(width/2)+x, ry-Math.floor(height/2)+y, rz-Math.floor(depth/2)+z, 0])
						}
					}
				}
				width += 2
				height += 2
				depth += 2
				for (let x = 0; x < width; x++) {
					for (let y = 0; y < height; y++) {
						for (let z = 0; z < depth; z++) {
							if (x == 0 || y == 0 || z == 0 ||
							x == width-1 || y == height-1 || z == depth-1) {
								sets.push([rx-Math.floor(width/2)+x, ry-Math.floor(height/2)+y, rz-Math.floor(depth/2)+z, 38])
							}
						}
					}
				}
			}
			var limit = 0
			var maxLimit = 10
			var generated = []
			var roomPos = [0, 0]
			function generateRoom2(x, y, z) {
				var og =  [...roomPos]
				generated.push([...roomPos].join(","))
				if (limit > maxLimit) {
					return
				}
				limit += 1
				var side = Math.floor(srandom(rx*x*ry*y*rz*z*(limit+1))*4)
				if (side == 0 && limit < maxLimit) {
					roomPos[0] += 1
					generateRoom(x+4, y-1, z, 3, 3, 3)
				}
				if (side == 1 && limit < maxLimit) {
					roomPos[0] -= 1
					generateRoom(x-4, y-1, z, 3, 3, 3)
				}
				if (side == 2 && limit < maxLimit) {
					roomPos[1] += 1
					generateRoom(x, y-1, z+4, 3, 3, 3)
				}
				if (side == 3 && limit < maxLimit) {
					roomPos[1] -= 1
					generateRoom(x, y-1, z-4, 3, 3, 3)
				}
				generateRoom(x, y, z, 5, 5, 5)
				var trap = Math.floor(srandom(rx*x*ry*y*rz*z*(limit+1)*2)*3)
				if (trap == 1 && limit < maxLimit) {
					for (let x2 = 0; x2 < 3; x2++) {
						for (let z2 = 0; z2 < 3; z2++) {
							sets.push([x-1+x2, y-3, z-1+z2, 14])
							sets.push([x-1+x2, y-4, z-1+z2, 38])
						}
					}
				}
				// if (trap == 2 && limit < maxLimit) {
				// 	sets.push([x, y-2, z, 38])
				// 	sets.push([x, y-1, z, 38])
				// 	sets.push([x, y, z, 38])
				// 	sets.push([x, y+1, z, 38])
				// 	sets.push([x, y+2, z, 38])
				// }
				if (trap == 2 && limit < maxLimit) {
					for (let x2 = 0; x2 < 5; x2++) {
						for (let z2 = 0; z2 < 5; z2++) {
							if (x2 == z2) {
								for (let y2 = 0; y2 < 3; y2++) {
									sets.push([x-2+x2, y-2+y2, z-2+z2, 5])
								}
							}
						}
					}
					sets.push([x-2, y-2, z-1, 38])
					sets.push([x+2, y-2, z+1, 38])
					sets.push([x+1, y-1, z-1, 38])
					sets.push([x-1, y-1, z+1, 38])
				}
				doors = [
					generated.includes([og[0]+1, og[1]].join(",")),
					generated.includes([og[0]-1, og[1]].join(",")),
					generated.includes([og[0], og[1]+1].join(",")),
					generated.includes([og[0], og[1]-1].join(",")),
				]
				if (doors[0]) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let z2 = 0; z2 < 3; z2++) {
							sets.push([x+3, y-1-1+y2, z-1+z2, 0])
						}
					}
				}
				if (doors[1]) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let z2 = 0; z2 < 3; z2++) {
							sets.push([x-3, y-1-1+y2, z-1+z2, 0])
						}
					}
				}
				if (doors[2]) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let x2 = 0; x2 < 3; x2++) {
							sets.push([x-1+x2, y-1-1+y2, z+3, 0])
						}
					}
				}
				if (doors[3]) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let x2 = 0; x2 < 3; x2++) {
							sets.push([x-1+x2, y-1-1+y2, z-3, 0])
						}
					}
				}
				if (limit >= maxLimit) {
					sets.push([x, y-2, z, 13])
					return
				}
				if (side == 0) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let z2 = 0; z2 < 3; z2++) {
							sets.push([x+3, y-1-1+y2, z-1+z2, 0])
						}
					}
					for (let y2 = 0; y2 < 3; y2++) {
						for (let z2 = 0; z2 < 3; z2++) {
							sets.push([x+5, y-1-1+y2, z-1+z2, 0])
						}
					}
					generateRoom2(x+8, y, z)
				}
				if (side == 1) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let z2 = 0; z2 < 3; z2++) {
							sets.push([x-3, y-1-1+y2, z-1+z2, 0])
						}
					}
					for (let y2 = 0; y2 < 3; y2++) {
						for (let z2 = 0; z2 < 3; z2++) {
							sets.push([x-5, y-1-1+y2, z-1+z2, 0])
						}
					}
					generateRoom2(x-8, y, z)
				}
				if (side == 2) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let x2 = 0; x2 < 3; x2++) {
							sets.push([x-1+x2, y-1-1+y2, z+3, 0])
						}
					}
					for (let y2 = 0; y2 < 3; y2++) {
						for (let x2 = 0; x2 < 3; x2++) {
							sets.push([x-1+x2, y-1-1+y2, z+5, 0])
						}
					}
					generateRoom2(x, y, z+8)
				}
				if (side == 3) {
					for (let y2 = 0; y2 < 3; y2++) {
						for (let x2 = 0; x2 < 3; x2++) {
							sets.push([x-1+x2, y-1-1+y2, z-3, 0])
						}
					}
					for (let y2 = 0; y2 < 3; y2++) {
						for (let x2 = 0; x2 < 3; x2++) {
							sets.push([x-1+x2, y-1-1+y2, z-5, 0])
						}
					}
					generateRoom2(x, y, z-8)
				}
			}
	
			var distance = ry-(waterLevel-10)
			generateRoom2(rx, ry-distance-2, rz)
			for (let x = 0; x < 3; x++) {
				for (let z = 0; z < 3; z++) {
					for (let y = 0; y < distance; y++) {
						sets.push([rx+x-1, ry-y, rz+z-1, 0])
					}
				}
			}
			for (let x = 0; x < 5; x++) {
				for (let z = 0; z < 5; z++) {
					for (let y = 0; y < distance; y++) {
						if (x == 0 || z == 0 ||
							x == 5-1 || z == 5-1) {
							sets.push([rx+x-2, ry-y, rz+z-2, 38])
						}
					}
				}
			}
	
			
		}
		return sets
	}
	
	function srandom(seed) {
	  var m = 0x80000000
	  var a = 1103515245
	  var c = 12345
	  
	  var state = seed % m
	
		state = (a * state + c) % m
	  return state / m
	}
	
	// var rando = []
	// var avg = 0
	// for (let i = 0; i < 1000; i++) {
	// 	avg += Math.round(sRandom(i+1)*9+1)
	// 	rando.push(Math.round(sRandom(i+1)*9+1))
	// }
	// console.log(avg/1000)
	// console.log(rando.join(","))