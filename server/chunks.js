var data = require("./data.js")
const { Noise } = require("noisejs")
var cs = data.cs
var worldSize = data.worldSize
var waterLevel = data.waterLevel

// 0.8828556045249678
var noise = new Noise(0.8828556045249678)

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

function generateChunk(xOff, yOff, zOff) {
	xOff = parseInt(xOff)
	zOff = parseInt(zOff)
	yOff = parseInt(yOff)
	var chunk = []
	var sets = []
	
	for (let x = 0; x < cs.x; x++) {
		var x2 = x+xOff*cs.x
		for (let y = 0; y < cs.y; y++) {
			var y2 = y+yOff*cs.y
			for (let z = 0; z < cs.z; z++) {
				var z2 = z+zOff*cs.z
				// spread = ( Math.sin(x2/150)+Math.cos(x2/100)+Math.sin(x2/250) 
				// 					+ Math.sin(z2/100)+Math.cos(z2/150)+Math.sin(z2/250) ) / 6 * 50
				// if (spread < 1) {
				// 	spread = 1
				// }
				// var gen = noise.perlin3((x2+37432)/15, (y2+53723)/15, (z2+95820)/15)
				// gen +- 0.0-noise.perlin3((x2+95028)/15, (y2+45720)/15, (z2+57294)/15)
				// genSpread = Math.round(genSpread*100)/100

				var genSpread = 2
				var gSpread = 1
				var cutoff = 0.4
				
				function getGen(x2, y2, z2) {
					var spikes = false
					var n5 = (noise.perlin2((x2+20482)/(500*gSpread), (z2+98293)/(500*gSpread))+1)/2
					if (n5 > 0.49 && n5 < 0.51) {
						spikes = true
					}
					
					var gen = Math.abs(0.5-(noise.perlin3((x2+95028)/(50), (y2+45720)/(50), (z2+57294)/(50))+1)/2)*2
					gen += Math.abs(0.5-(noise.perlin3((x2+58204)/(45), (y2+856038)/(45), (z2+104842)/(45))+1)/2)*2
					gen += Math.abs(0.5-(noise.perlin3((x2+58204)/(30), (y2+856038)/(30), (z2+104842)/(30))+1)/2)*2
					gen /= 1.5
					gen *= 10
					if (gen > 1) {
						gen = 1
					}
					gen -= (noise.perlin3((x2+37432)/(16*genSpread), (y2+53723)/(16*genSpread), (z2+95820)/(16*genSpread))+1)/2/3
					gen -= (noise.perlin3((x2+74974)/(15*genSpread), (y2+74828)/(15*genSpread), (z2+45432)/(15*genSpread))+1)/2/3
					gen -= (noise.perlin3((x2+99834)/(14*genSpread), (y2+10948)/(14*genSpread), (z2+82728)/(14*genSpread))+1)/2/3
	
					var spread = 100*gSpread
					var spread2 = 20*gSpread
					var spread3 = 50*gSpread
					var n = noise.perlin2(x2/spread, z2/spread)
					n += noise.perlin2((x2+48924)/spread, (z2+94029)/spread)
					n /= 2
					n += 1
					var g1 = 0
					if (n <= 0.5) {
						g1 = 0
					} else if (n <= 0.7) {
						g1 = 0+(n-0.5)/0.2*0.5
					} else if (n <= 0.9) {
						g1 = 0.5
					} else if (n <= 1) {
						g1 = 0.5+(n-0.9)/0.1*0.5
					} else {
						g1 = 1
					}
					var n2 = noise.perlin2((x2+49204)/spread2, (z2+85923)/spread2)
					n2 += noise.perlin2((x2+85092)/spread2, (z2+52943)/spread2)
					n2 /= 2
					n2 += 1
					var g2 = 0
					if (n2 <= 0.2) {
						g2 = 1-n2/0.2*0.33
					} else if (n2 <= 1.5) {
						g2 = 0.66-(n2-0.2)/1.3*0.16
					} else if (n2 <= 1.6) {
						g2 = 0.76-(n2-1.5)/0.1*0.33
					} else if (n2 <= 1.7) {
						g2 = 0.16
					} else if (n2 <= 1.8) {
						g2 = 0.16+(n2-1.7)/0.1*0.16
					} else if (n2 <= 1.85) {
						g2 = 0.33
					} else if (n2 <= 1.9) {
						g2 = 0.33-(n2-1.85)/cutoff*0.16
					} else {
						g2 = 0.16
					}
					var n3 = noise.perlin2((x2+58203)/spread3, (z2+75293)/spread3)
					n3 += noise.perlin2((x2+33029)/spread3, (z2+10412)/spread3)
					n3 /= 2
					n3 += 1
					var g3 = 0
					if (n3 <= 0.2) {
						g3 = n3*0.15
					} else if (n3 <= 0.5) {
						g3 = 0.15+(n3-0.2)/0.3*0.15
					} else if (n3 <= 1) {
						g3 = 0.3
					} else if (n3 <= 1.5) {
						g3 = 0.3+(n3-1)/0.5*0.5
					} else if (n3 <= 1.8) {
						g3 = 0.8+(n3-1.5)/0.3*0.2
					} else {
						g3 = 1
					}
					genHeight = (g1+g2+g3)/3
					genHeight *= (worldSize.y-1)
					genHeight += noise.perlin2((x2+42934)/(500*gSpread), (z2+10484)/(500*gSpread))*worldSize.y
					var n4 = (noise.perlin2((x2+84592)/(200*gSpread), (z2+20483)/(200*gSpread))+1)/2
					if (n4 > 0.45 && n4 < 0.55) {
						var r = 1-Math.abs(0.5-n4)*(1/0.05)
						genHeight += (waterLevel - 10 - genHeight)*r
					}
	
					if (spikes) {
						// var r = 1-Math.abs(0.5-n5)*(1/0.025)
						// genHeight += (worldSize.y - genHeight)*r
						genHeight += (noise.perlin2((x2+52937)*1.1, (z2+47293)*1.1)+1)/2*((noise.perlin2((x2+52937)*1.1, (z2+47293)*1.1))/2)*60
					}
					
					genHeight = Math.round(genHeight)
					return [genHeight, gen, spikes]
				}


        
				function grassGen(x2, y2, z2) {
					if (noise.perlin3((x2+85284)/2, (y2+75928)/2, (z2+48502)/2) > 0.8) {
						sets.push(...generateStructure("medium_house", x2, y2, z2))
					}
					if (noise.perlin3((x2+67340)/2, (y2+41033)/2, (z2+10383)/2) > 0.6) {
						if (spikes) {
							sets.push(...generateStructure("spikes", x2, y2, z2))
						}
						sets.push(...generateStructure("birch tree", x2, y2, z2))
					}
					if (noise.perlin3((x2+54723)/2, (y2+73576)/2, (z2+13539)/2) > 0.6) {
						if (spikes) {
							sets.push(...generateStructure("spikes", x2, y2, z2))
						}
						sets.push(...generateStructure("oak tree", x2, y2, z2))
					}
					if (noise.perlin3((x2+95723)/2, (y2+27493)/2, (z2+64293)/2) > 0.8) {
						sets.push(...generateStructure("dungeon", x2, y2, z2))
					}
				}


        
				function stoneGen(x2, y2, z2) {
					if (noise.perlin3((x2+85284)/5, (y2+75928)/5, (z2+48502)/5) > 0.5) {
						chunk.push(10)
					} else if (noise.perlin3((x2+83562)/4, (y2+32386)/4, (z2+97255)/4) > 0.550) {
						chunk.push(11)
          } else if (noise.perlin3((x2+32567)/4, (y2+23968)/4, (z2+24797)/4) > 0.675 && y2 <= 20) {
						chunk.push(12)
          } else if (noise.perlin3((x2+72476)/4, (y2+74566)/4, (z2+87656)/4) > 0.725 && y2 <= -1) {
						chunk.push(13)
          } else {
						chunk.push(7)
					}
				}
				
				var genData = getGen(x2, y2, z2)
				var genHeight = genData[0]
				var gen = genData[1]
				var spikes = genData[2]

				var aData = getGen(x2, y2+1, z2)
				var aGenHeight = aData[0]
				var aGen = aData[1]
				var aSpikes = aData[2]

				var a5Data = getGen(x2, y2+5, z2)
				var a5GenHeight = a5Data[0]
				var a5Gen = a5Data[1]
				var a5Spikes = a5Data[2]

				var isCut = gen <= cutoff || aGen <= cutoff || a5Gen <= cutoff

				var isAir = !(y2 <= genHeight && gen > cutoff)
				var isAirAbove = !(y2+1 <= aGenHeight && aGen > cutoff)
				var isAirAbove5 = !(y2+5 <= a5GenHeight && a5Gen > cutoff)
				
				// var isAir = !((y2 < genHeight || (y2 == genHeight && y2 <= waterLevel)) && gen > cutoff)
				// var isAirAbove = !((y2+1 <= aGenHeight || (y2+1 == aGenHeight && y2+1 <= waterLevel)) && aGen > cutoff)
				// var isAirAbove5 = !((y2+5 <= a5GenHeight || (y2+5== a5GenHeight && y2+5 <= waterLevel)) && a5Gen > cutoff)
				
				if (!isAir && !isAirAbove) {
					if (isAirAbove5) {
						if (y2 <= waterLevel || spikes) {
							if (isCut & y2+5 < genHeight || spikes) {
								if (y2 < genHeight-5 || spikes) {
									stoneGen(x2, y2, z2)
								} else {
									chunk.push(1)
								}
							} else {
								chunk.push(9)
							}
						} else {
							chunk.push(1)
						}
					} else {
						stoneGen(x2, y2, z2)
					}
				} else if (!isAir && isAirAbove && isAirAbove5) {
					if (y2 <= waterLevel || spikes) {
						if (isCut && y2+5 < genHeight || spikes) {
							if (y2 < genHeight-5 || spikes) {
								stoneGen(x2, y2, z2)
							} else {
								chunk.push(2)
								grassGen(x2, y2, z2)
							}
						} else {
							chunk.push(9)
						}
					} else {
						chunk.push(2)
						grassGen(x2, y2, z2)
					}
				} else {
					if (y2 <= waterLevel && (!isCut || y2 > genHeight)) {
						chunk.push(6)
					} else {
						chunk.push(0)
					}
				}
			}
		}
	}
	return [chunk, sets]
}

module.exports = {
	generateChunk: generateChunk,
	generateStructure: generateStructure,
	srandom: srandom,
}