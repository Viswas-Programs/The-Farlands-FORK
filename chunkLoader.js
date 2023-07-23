importScripts("data.js")
importScripts("https://cdn.jsdelivr.net/npm/noisejs@2.1.0/index.min.js")
// var seed = Math.random()
// console.log(seed)
var noise = new Noise(0.885643552331419)
// 0.8828556045249678 <- the seed where i built the first house
// 0.6443995276743242 <- the seed where i sent the player model

var chunks = {}

self.onmessage = function(event) {
	var task = event.data.task
	if (task == "render") {
		var newChunks = event.data.chunks
		for (let chunk in newChunks) {
			chunks[chunk] = newChunks[chunk]
		}
		var rChunks = event.data.rChunks
		var nChunks = {}
		var geometries = {}
		var sets = []
		for (let chunk of rChunks) {
			var pos = chunk.split(",")
			var x = parseInt(pos[0])
			var y = parseInt(pos[1])
			var z = parseInt(pos[2])
			var offs = [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1]
			]
			for (let off of offs) {
				var c = compactChunk({x:x+off[0], y:y+off[1], z:z+off[2]})
				if (!chunks[c]) {
					var g = generateChunk(x+off[0], y+off[1], z+off[2])
					chunks[c] = g[0]
					nChunks[c] = g[0]
					// sets.push(...g[1])
				}
			}
			var g = generateChunk(x, y, z)
			if (!chunks[chunk]) {
				chunks[chunk] = g[0]
				nChunks[chunk] = g[0]
			}
			// console.log(chunks[chunk])
			sets.push(...g[1])
			geometries[chunk] = renderChunk({x:x, y:y, z:z}, chunks)
		}
		
		self.postMessage({task: task, sets: sets, rChunks: rChunks, chunks: nChunks, geometries: geometries})
	} else if (task == "set") {
		var newChunks = event.data.chunks
		for (let chunk in newChunks) {
			chunks[chunk] = newChunks[chunk]
		}
		var geometries = {}
		var toRender = event.data.toRender
		var nChunks = {}
		var sets = event.data.sets
		for (let i = 0; i < sets.length; i++) {
			var set = sets[i]
			var n = compactChunk(getPos(set[0], set[1], set[2])[0])
			var p = getPos(set[0], set[1], set[2])[0]
			if (!chunks[n]) {
				var g = generateChunk(p.x, p.y, p.z)
				chunks[n] = g[0]
			}
			chunks = setBlock(set[0], set[1], set[2], set[3], chunks)
			nChunks[n] = chunks[n]
		}
		for (let chunk of toRender) {
			var pos = expandChunk(chunk)
			geometries[chunk] = renderChunk(pos, chunks)
		}
		self.postMessage({task: task, chunks: nChunks, geometries: geometries})
	} else if (task == "order") {
		var geometries = event.data.geometries
		var pos = event.data.pos
		
		var newGeometry = {}
		for (let chunk in geometries) {
			var vertices = geometries[chunk].vertices
			var faces = geometries[chunk].faces
			var uvs = geometries[chunk].uvs
			var colours = geometries[chunk].colours
			var ds = []
			
			for (let i = 0; i < vertices.length; i += 3) {
				ds.push([i, Math.random()])
			}
			ds.sort((a, b) => b[1] - a[1])
			var ds2 = []
			for (let sorted of ds) {
				ds2.push(sorted[0])
			}
			var nGeometry = {vertices: [], faces: [], uvs: [], colours: []}
			for (let sorted of ds2) {
				nGeometry.vertices.push(vertices[sorted], vertices[sorted+1], vertices[sorted+2])
				nGeometry.uvs.push(uvs[sorted/3*2], uvs[sorted/3*2+1])
				nGeometry.colours.push(colours[sorted], colours[sorted+1], colours[sorted+2])
			}
			for (let i = 0; i < faces.length; i += 3) {
				nGeometry.faces.push(ds2.indexOf(faces[i]*3))
				nGeometry.faces.push(ds2.indexOf(faces[i+1]*3))
				nGeometry.faces.push(ds2.indexOf(faces[i+2]*3))
			}
			newGeometry[chunk] = nGeometry
		}
		
		self.postMessage({task: task, newGeometry: newGeometry})
	}
}

function renderChunk(pos, chunks) {
	var geometry = {"vertices": [], "faces": [], "uvs": [], "colours": []}
	var geometry2 = {"vertices": [], "faces": [], "uvs": [], "colours": []}
	pos = {x: pos.x*cs.x, y: pos.y*cs.y, z: pos.z*cs.z}
	// geometry = renderBlock(geometry, {x: pos.x, y: pos.y, z: pos.z}, "grass", [true, true, true, true, true, true])
	for (let x = 0; x < cs.x; x++) {
		for (let y = 0; y < cs.y; y++) {
			for (let z = 0; z < cs.z; z++) {
				var block = getBlock(x+pos.x, y+pos.y, z+pos.z, chunks)
				var sides = [
					getBlock(x+pos.x, y+pos.y+1, z+pos.z, chunks)==0,
					getBlock(x+pos.x, y+pos.y-1, z+pos.z, chunks)==0,
					getBlock(x+pos.x+1, y+pos.y, z+pos.z, chunks)==0, 
					getBlock(x+pos.x-1, y+pos.y, z+pos.z, chunks)==0, 
					getBlock(x+pos.x, y+pos.y, z+pos.z+1, chunks)==0,
					getBlock(x+pos.x, y+pos.y, z+pos.z-1, chunks)==0
				]
				if (block != 0 && blocks[Object.keys(blocks)[block-1]][6]) {
					geometry = renderBlock(geometry, {x: x, y: y, z: z}, Object.keys(blocks)[block-1], sides)
				}
			}
		}
	}
	for (let x = 0; x < cs.x; x++) {
		for (let y = 0; y < cs.y; y++) {
			for (let z = 0; z < cs.z; z++) {
				var block = getBlock(x+pos.x, y+pos.y, z+pos.z, chunks, true)
				var sides = [
					getBlock(x+pos.x, y+pos.y+1, z+pos.z, chunks, true)==0,
					getBlock(x+pos.x, y+pos.y-1, z+pos.z, chunks, true)==0,
					getBlock(x+pos.x+1, y+pos.y, z+pos.z, chunks, true)==0, 
					getBlock(x+pos.x-1, y+pos.y, z+pos.z, chunks, true)==0, 
					getBlock(x+pos.x, y+pos.y, z+pos.z+1, chunks, true)==0,
					getBlock(x+pos.x, y+pos.y, z+pos.z-1, chunks, true)==0
				]
				if (block != 0 && !blocks[Object.keys(blocks)[block-1]][6]) {
					geometry2 = renderBlock(geometry2, {x: x, y: y, z: z}, Object.keys(blocks)[block-1], sides)
				}
			}
		}
	}
	return [geometry, geometry2]
}

function renderBlock(geometry, pos, block, sides) {
	var i0 = 0
	var i1 = 0
	var i2 = 0
	var i3 = 0
	// +Y
	if (sides[0]) {
		geometry.vertices.push(pos.x, pos.y+1, pos.z)
		i0 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y+1, pos.z+1)
		i1 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y+1, pos.z)
		i2 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x, pos.y+1, pos.z+1)
		i3 = geometry.vertices.length/3-1
		for (let i = 0; i < 4; i++) {
			geometry.colours.push(1, 1, 1)
		}
		geometry.faces.push(i0, i1, i2)
		geometry.faces.push(i3, i1, i0)
		geometry.uvs.push(
			blocks[block][0][0], blocks[block][0][1],
			blocks[block][0][0]+blockSize.x, blocks[block][0][1]+blockSize.y,
			blocks[block][0][0]+blockSize.x, blocks[block][0][1],
			blocks[block][0][0], blocks[block][0][1]+blockSize.y
		)
	}
	
	// -Y
	if (sides[1]) {
		geometry.vertices.push(pos.x, pos.y, pos.z)
		i0 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y, pos.z+1)
		i1 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y, pos.z)
		i2 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x, pos.y, pos.z+1)
		i3 = geometry.vertices.length/3-1
		geometry.faces.push(i2, i1, i0)
		geometry.faces.push(i0, i1, i3)
		for (let i = 0; i < 4; i++) {
			geometry.colours.push(0.55, 0.55, 0.55)
		}
		geometry.uvs.push(
			blocks[block][1][0], blocks[block][1][1],
			blocks[block][1][0]+blockSize.x, blocks[block][1][1]+blockSize.y,
			blocks[block][1][0]+blockSize.x, blocks[block][1][1],
			blocks[block][1][0], blocks[block][1][1]+blockSize.y
		)
	}
	
	// +X
	if (sides[2]) {
		geometry.vertices.push(pos.x+1, pos.y, pos.z)
		i0 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y+1, pos.z+1)
		i1 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y+1, pos.z)
		i2 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y, pos.z+1)
		i3 = geometry.vertices.length/3-1
		geometry.faces.push(i2, i1, i0)
		geometry.faces.push(i0, i1, i3)
		for (let i = 0; i < 4; i++) {
			geometry.colours.push(0.85, 0.85, 0.85)
		}
		geometry.uvs.push(
			blocks[block][2][0], blocks[block][2][1],
			blocks[block][2][0]+blockSize.x, blocks[block][2][1]+blockSize.y,
			blocks[block][2][0], blocks[block][2][1]+blockSize.y,
			blocks[block][2][0]+blockSize.x, blocks[block][2][1]
		)
	}
	
	// -X
	if (sides[3]) {
		geometry.vertices.push(pos.x, pos.y, pos.z)
		i0 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x, pos.y+1, pos.z+1)
		i1 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x, pos.y+1, pos.z)
		i2 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x, pos.y, pos.z+1)
		i3 = geometry.vertices.length/3-1
		geometry.faces.push(i0, i1, i2)
		geometry.faces.push(i3, i1, i0)
		for (let i = 0; i < 4; i++) {
			geometry.colours.push(0.7, 0.7, 0.7)
		}
		geometry.uvs.push(
			blocks[block][3][0], blocks[block][3][1],
			blocks[block][3][0]+blockSize.x, blocks[block][3][1]+blockSize.y,
			blocks[block][3][0], blocks[block][3][1]+blockSize.y,
			blocks[block][3][0]+blockSize.x, blocks[block][3][1]
		)
	}
	
	// +Z
	if (sides[4]) {
		geometry.vertices.push(pos.x, pos.y, pos.z+1)
		i0 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y+1, pos.z+1)
		i1 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y, pos.z+1)
		i2 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x, pos.y+1, pos.z+1)
		i3 = geometry.vertices.length/3-1
		geometry.faces.push(i2, i1, i0)
		geometry.faces.push(i0, i1, i3)
		for (let i = 0; i < 4; i++) {
			geometry.colours.push(0.75, 0.75, 0.75)
		}
		geometry.uvs.push(
			blocks[block][4][0], blocks[block][4][1],
			blocks[block][4][0]+blockSize.x, blocks[block][4][1]+blockSize.y,
			blocks[block][4][0]+blockSize.x, blocks[block][4][1],
			blocks[block][4][0], blocks[block][4][1]+blockSize.y
		)
	}
	
	// -Z
	if (sides[5]) {
		geometry.vertices.push(pos.x, pos.y, pos.z)
		i0 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y+1, pos.z)
		i1 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x+1, pos.y, pos.z)
		i2 = geometry.vertices.length/3-1
		geometry.vertices.push(pos.x, pos.y+1, pos.z)
		i3 = geometry.vertices.length/3-1
		geometry.faces.push(i0, i1, i2)
		geometry.faces.push(i3, i1, i0)
		for (let i = 0; i < 4; i++) {
			geometry.colours.push(0.6, 0.6, 0.6)
		}
		geometry.uvs.push(
			blocks[block][5][0], blocks[block][4][1],
			blocks[block][5][0]+blockSize.x, blocks[block][4][1]+blockSize.y,
			blocks[block][5][0]+blockSize.x, blocks[block][4][1],
			blocks[block][5][0], blocks[block][4][1]+blockSize.y
		)
	}
	
	return geometry
}

function getBlock(x, y, z, chunks, raw=false) {
	x = Math.floor(x)
	y = Math.floor(y)
	z = Math.floor(z)
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
	var block = chunk[blockPos.z + blockPos.y*cs.z + blockPos.x*cs.y*cs.z]
	if (transparent.includes(block) && !raw) {
		return 0
	}
	return block
}

function setBlock(x, y, z, block, chunks) {
	x = Math.floor(x)
	y = Math.floor(y)
	z = Math.floor(z)
	var chunkPos = {x: Math.floor(x/cs.x), y: Math.floor(y/cs.y), z: Math.floor(z/cs.z)}
	var blockPos = {x: Math.abs(x % (cs.x)), y: Math.abs(y % (cs.y)), z: Math.abs(z % (cs.z))}
	if (!chunks[chunkPos.x+","+chunkPos.y+","+chunkPos.z]) {
		return chunks
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
	chunks[chunkPos.x+","+chunkPos.y+","+chunkPos.z][blockPos.z + blockPos.y*cs.z + blockPos.x*cs.y*cs.z] = block
	return chunks
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

function compactChunk(chunk) {
	return chunk.x+","+chunk.y+","+chunk.z
}
function expandChunk(chunk) {
	var pos = chunk.split(",")
	return {x: parseInt(pos[0]), y: parseInt(pos[1]), z: parseInt(pos[2])}
}