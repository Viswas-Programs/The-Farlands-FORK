var inventoryOpen = false
var selected = 0
var showName = 0

var selectedRecipe = -1
var lastHeldItem = "none"
var clickSlow = 0
var selectedItem = ["none", 0]
var inInventory = 0

var safeInventory = []
var inventory = []
for (let i = 0; i < 50; i++ ) {
	inventory.push(["none", 0])
}

var tab = "backpack"

// draw ui
function renderUI() {
	uiCanvas.width = canvas.width
	uiCanvas.height = canvas.height
	uiCanvas.style.width = uiCanvas.width + "px"
	uiCanvas.style.height = uiCanvas.height + "px"
  uictx.clearRect(0, 0, uiCanvas.width, uiCanvas.height)
	uictx.imageSmoothingEnabled = false
	uictx.globalAlpha = 1
	var cBlock = getBlock(Math.floor(player.pos.x), Math.floor(player.pos.y+0.5), Math.floor(player.pos.z))
	if (cBlock == 6) {
		uictx.fillStyle = "rgba(10, 119, 229, 0.75)"
		uictx.fillRect(0, 0, uiCanvas.width, uiCanvas.height)
	}
	uictx.globalAlpha = 0.75
	if (player.dashes > 0) {
		uictx.drawImage(crosshairDash, uiCanvas.width/2-25, uiCanvas.height/2-25, 50, 50)
	} else {
		uictx.drawImage(crosshair, uiCanvas.width/2-25, uiCanvas.height/2-25, 50, 50)
	}

	var hoverText = ""
	var off = 0
	uictx.globalAlpha = 0.9
	if (inventoryOpen) {
		if (tab == "backpack") {
			uictx.drawImage(inventoryImg, 0, 0, 88, 176, 0, 0, 88*4, 176*4)
			for (let i = 0; i < 10; i++) {
				var hovered = mouse.x > 0 && mouse.x < 16*4 && mouse.y > 0+i*16*4 && mouse.y < 0+i*16*4+16*4
				inventoryLogic(i, hovered)
				if (hovered && inventory[i][0] != "none") {
					hoverText = inventory[i][0]
				}
				if (i == selected) {
					uictx.drawImage(inventoryImg, 160, 176, 32, 16, 0, 0+i*16*4, 32*4, 16*4)
				} else {
					uictx.drawImage(inventoryImg, 144, 176, 16, 16, 0, 0+i*16*4, 16*4, 16*4)
				}
				var item = itemData[inventory[i][0]][0]
				if (item) {
					uictx.drawImage(itemsImg, item[0]*16, item[1]*16, 16, 16, 4.8, i*16*4+4.8, 16/1.5*4*1.1, 16/1.5*4*1.1)
				}
				if (hovered) {
					uictx.fillStyle = "rgb(255, 255, 255, 0.25)"
					uictx.fillRect(0, 0+i*16*4, 16*4, 16*4)
				}
				if (fontLoaded && inventory[i][1] > 1) {
					uictx.fillStyle = `rgb(${255}, ${255}, ${255})`
					uictx.font = `${15}px font`
					uictx.strokeStyle = "black"
					uictx.lineWidth = 3
					uictx.strokeText(`${inventory[i][1]}`, 4.8, i*16*4+16)
					uictx.fillText(`${inventory[i][1]}`, 4.8, i*16*4+16)
				}
			}
			for (let y = 0; y < 10; y++) {
				for (let x = 0; x < 4; x++) {
					var hovered = mouse.x > 0+16*4+16*4*x && mouse.x < 0+16*4+16*4*x+64 && mouse.y > 0+y*16*4 && mouse.y < 0+y*16*4+64
					inventoryLogic(x+y*4+10, hovered)
					if (hovered && inventory[x+y*4+10][0] != "none") {
						hoverText = inventory[x+y*4+10][0]
					}
					if (clickSlow > 0 && hovered) {
						drawSlot(0+16*4+16*4*x+32, 0+y*16*4+32, itemData[inventory[x+y*4+10][0]][0], hovered, inventory[x+y*4+10][1], 48, 48)
					} else {
						drawSlot(0+16*4+16*4*x+32, 0+y*16*4+32, itemData[inventory[x+y*4+10][0]][0], hovered, inventory[x+y*4+10][1])
					}
				}
			}


		} else if (tab == "crafting") {
			uictx.drawImage(inventoryImg, 88, 0, 88, 176, 0, 0, 88*4, 176*4)
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 5; x++) {
					let hovered = mouse.x > 32+x*64-32 && mouse.x < 32+x*64-32+64 && mouse.y > 24*4+y*64-32 && mouse.y < 24*4+y*64-32+64
					let itemData2 = []
					if (x+y*5 < recipes.length) {
						itemData2 = itemData[recipes[x+y*5][0][0]][0]
						if (hovered) {
							hoverText = recipes[x+y*5][0][0]
						}
					}
					if (clickSlow > 0 && hovered) {
						drawSlot(32+x*64, 24*4+y*64, itemData2, selectedRecipe == x+y*5, x+y*5 < recipes.length ? 1 : 0, 48, 48)
						if (hovered) {
							let x2 = 32+x*64
							let y2 = 24*4+y*64
							let w = 48
							let h = 48
							uictx.globalAlpha = 0.25
							uictx.drawImage(inventoryImg, 192, 176, 16, 16, x2-w/2*1.1, y2-h/2*1.1, w*1.1, h*1.1)
							uictx.globalAlpha = 0.9
						}
					} else {
						drawSlot(32+x*64, 24*4+y*64, itemData2, selectedRecipe == x+y*5, x+y*5 < recipes.length ? 1 : 0)
						if (hovered) {
							let x2 = 32+x*64
							let y2 = 24*4+y*64
							let w = 64
							let h = 64
							uictx.globalAlpha = 0.25
							uictx.drawImage(inventoryImg, 192, 176, 16, 16, x2-w/2, y2-h/2, w, h)
							uictx.globalAlpha = 0.9
						}
					}
					if (lClick && hovered && x+y*5 < recipes.length) {
						selectedRecipe = x+y*5
					}
				}
			}

			var canCraft = selectedRecipe != -1
			for (let i = 0; i < 5; i++) {
				let hovered = mouse.x > 32+i*64-32 && mouse.x < 32+i*64-32+64 && mouse.y > 89*4-32 && mouse.y < 89*4-32+64
				let itemData2 = []
				let count = 1
				if (selectedRecipe != -1) {
					if (i < recipes[selectedRecipe][1].length) {
						itemData2 = itemData[recipes[selectedRecipe][1][i][0]][0]
						count = recipes[selectedRecipe][1][i][1]
						if (hovered) {
							hoverText = recipes[selectedRecipe][1][i][0]
						}
						if (!hasItemA(recipes[selectedRecipe][1][i][0], count)) {
							canCraft = false
						}
					}
				}
				drawSlot(32+i*64, 89*4, itemData2, false, count)
				if (hovered) {
					let x2 = 32+i*64
					let y2 = 89*4
					let w = 64
					let h = 64
					uictx.globalAlpha = 0.25
					uictx.drawImage(inventoryImg, 192, 176, 16, 16, x2-w/2, y2-h/2, w, h)
					uictx.globalAlpha = 0.9
				}
			}
			let hovered = mouse.x > 32+2*64-32 && mouse.x < 32+2*64-32+64 && mouse.y > (89+15)*4-32 && mouse.y < (89+15)*4-32+64
			let itemData2 = []
			let count = 1
			if (selectedRecipe != -1) {
				itemData2 = itemData[recipes[selectedRecipe][0][0]][0]
				if (hovered) {
					hoverText = recipes[selectedRecipe][0][0]
				}
				count = recipes[selectedRecipe][0][1]
			}
			drawSlot(32+2*64, (89+15)*4, itemData2, false, count)
			if (hovered) {
				let x2 = 32+2*64
				let y2 = (89+15)*4
				let w = 64
				let h = 64
				uictx.globalAlpha = 0.25
				uictx.drawImage(inventoryImg, 192, 176, 16, 16, x2-w/2, y2-h/2, w, h)
				uictx.globalAlpha = 0.9
			}
			
			if (canCraft) {
				let hovered = mouse.x > 32+2*64-64+16 && mouse.x < 32+2*64-64+32*4-16 && mouse.y > (89+15)*4+24+12 && mouse.y < (89+15)*4+24+16*4-16              
				if (hovered) {
					if (clickSlow > 0) {
						uictx.drawImage(inventoryImg, 112, 176, 32, 16, 32+2*64-64/1.125, (89+15)*4+24-(16/1.125-16)*2, 32/1.125*4, 16/1.125*4)
					} else {
						uictx.drawImage(inventoryImg, 112, 176, 32, 16, 32+2*64-64*1.125, (89+15)*4+24-(16*1.125-16)*2, 32*1.125*4, 16*1.125*4)
					}
					
					if (lClick) {
						for (let item of recipes[selectedRecipe][1]) {
							removeItem(item[0], item[1])
						}
						addItem(recipes[selectedRecipe][0][0], recipes[selectedRecipe][0][1])
					}
					
				} else {
					uictx.drawImage(inventoryImg, 112, 176, 32, 16, 32+2*64-64, (89+15)*4+24, 32*4, 16*4)
				}
			}
			
		} else if (tab == "options") {
			uictx.drawImage(inventoryImg, 0, 0, 88, 176, 0, 0, 88*4, 176*4)

			let hovered = mouse.x > 80*2-16*4 && mouse.x < 80*2+16*4 && mouse.y > 10+16 && mouse.y < 10+16+16*4
			drawText(10, 10+20, "Horizontal Render Distance: "+renderSize.x, 18)
			drawSlider(80*2, 10+16, (renderSize.x-2)/10, hovered)
			if (hovered && mouse.down) {
				renderSize.x = 2 + Math.round((mouse.x-(80*2-16*4)) / (32*4)*10)
				renderSize.z = 2 + Math.round((mouse.x-(80*2-16*4)) / (32*4)*10)
			}

			hovered = mouse.x > 80*2-16*4 && mouse.x < 80*2+16*4 && mouse.y > 10+16+64 && mouse.y < 10+16+16*4+64
			drawText(10, 10+20+64, "Vertical Render Distance: "+renderSize.y, 18)
			drawSlider(80*2, 10+16+64, (renderSize.y-2)/2, hovered)
			if (hovered && mouse.down) {
				renderSize.y = 2 + Math.round((mouse.x-(80*2-16*4)) / (32*4)*2)
			}

			hovered = mouse.x > 80*2-16*4 && mouse.x < 80*2+16*4 && mouse.y > 10+16+128 && mouse.y < 10+16+16*4+128
			drawText(10, 10+20+128, "Chunk Load Speed: "+chunkLoadSpeed, 18)
			drawSlider(80*2, 10+16+128, (chunkLoadSpeed-1)/4, hovered)
			if (hovered && mouse.down) {
				chunkLoadSpeed = 1 + Math.round((mouse.x-(80*2-16*4)) / (32*4)*4)
			}

			var playerNames = {
				"0,0": "Silver",
				"1,0": "Camsical",
			}
			drawText(10, 10+20+128+128, "Player Skin: "+ playerNames[playerT.join(",")], 18)

			hovered = mouse.x > 10 && mouse.x < 10+12*4 && mouse.y > 10+20+128+128+10 && mouse.y < 10+20+128+128+10+12*4
			drawButton(10+12*4/2, 10+20+128+128+10+12*4/2, 12*4, 12*4, inventoryImg, 48, 176+16, 16, 16, hovered, clickSlow > 0)
			if (lClick && hovered) {
				if (playerT.join(",") == "1,0") {
					playerT = [0, 0]
					player.updateTexture(playerT)
					for (let model of player.model) {
						model.box.updateBuffers()
					}
				}
			}
			hovered = mouse.x > 10 && mouse.x < 10+12*4 && mouse.y > 10+20+128+128+10+12*4 && mouse.y < 10+20+128+128+10+12*4+12*4
			drawButton(10+12*4/2, 10+20+128+128+10+12*4+12*4/2, 12*4, 12*4, inventoryImg, 32, 176+16, 16, 16, hovered, clickSlow > 0)
			if (lClick && hovered) {
				if (playerT.join(",") == "0,0") {
					playerT = [1, 0]
					player.updateTexture(playerT)
					for (let model of player.model) {
						model.box.updateBuffers()
					}
				}
			}
			// if (hovered) {
			// 	uictx.drawImage(inventoryImg, 48, 176+16, 16, 16, 10-(12*4*1.1-12*4)/2, 10+20+128+128+10-(12*4*1.1-12*4)/2, 12*4*1.1, 12*4*1.1)
			// 	uictx.globalAlpha = 0.25
			// 	uictx.drawImage(inventoryImg, 192, 176, 16, 16, 10-(12*4*1.1-12*4)/2, 10+20+128+128+10-(12*4*1.1-12*4)/2, 12*4*1.1, 12*4*1.1)
			// 	uictx.globalAlpha = 0.9
			// } else {
			// 	uictx.drawImage(inventoryImg, 48, 176+16, 16, 16, 10, 10+20+128+128+10, 12*4, 12*4)
			// }

			// hovered = mouse.x > 10 && mouse.x < 10+12*4 && mouse.y > 10+20+128+128+10+12*4 && mouse.y < 10+20+128+128+10+12*4+12*4
			// if (hovered) {
			// 	if (clickSlow > 0) {
				
			// 	}
			// 	uictx.drawImage(inventoryImg, 32, 176+16, 16, 16, 10-(12*4*1.1-12*4)/2, 10+20+128+128+10+12*4-(12*4*1.1-12*4)/2, 12*4*1.1, 12*4*1.1)
			// 	uictx.globalAlpha = 0.25
			// 	uictx.drawImage(inventoryImg, 192, 176, 16, 16, 10-(12*4*1.1-12*4)/2, 10+20+128+128+10+12*4-(12*4*1.1-12*4)/2, 12*4*1.1, 12*4*1.1)
			// 	uictx.globalAlpha = 0.9
			// } else {
			// 	uictx.drawImage(inventoryImg, 32, 176+16, 16, 16, 10, 10+20+128+128+10+12*4, 12*4, 12*4)
			// }
			
			uictx.drawImage(playerImg, 32+playerT[0]*48, 0, 8, 8, 10+12*4+5, 10+20+128+128+10, 24*4, 24*4)

			drawText(10, 30+256+24*4+18*2, "*You can see yourself by pressing P*", 14)
			
			// uictx.drawImage(inventoryImg, 16*7, 176+16, 32, 16, 88*2-32*3, 10+16, 32*4, 16*4)
			// if (hovered) {
			// 	uictx.globalAlpha = 0.1
			// 	uictx.drawImage(inventoryImg, 16*9, 176+16, 32, 16, 88*2-32*3, 10+16, 32*4, 16*4)
			// 	uictx.globalAlpha = 0.9
			// }
			// uictx.drawImage(inventoryImg, 16*6, 176+16, 16, 16, 88*2-32*3-5*4 + (32*4-6*4)*((renderSize.x-2)/4), 10+16, 16*4, 16*4)
			// if (hovered) {
			// 	uictx.globalAlpha = 0.1
			// 	uictx.drawImage(inventoryImg, 16*11, 176+16, 16, 16, 88*2-32*3-5*4 + (32*4-6*4)*((renderSize.x-2)/4), 10+16, 16*4, 16*4)
			// 	uictx.globalAlpha = 0.9
			// }
			

			// hovered = mouse.x > 88*2-32*3 && mouse.x < 88*2-32*3+32*4 && mouse.y > 10+16 && mouse.y < 10+16+16*4
			// drawText(10, 10+20+64, "Vertical Render Distance: "+renderSize.x, 18)
			// uictx.drawImage(inventoryImg, 16*7, 176+16, 32, 16, 88*2-32*3, 10+16, 32*4, 16*4)
			// if (hovered) {
			// 	uictx.globalAlpha = 0.1
			// 	uictx.drawImage(inventoryImg, 16*9, 176+16, 32, 16, 88*2-32*3, 10+16, 32*4, 16*4)
			// 	uictx.globalAlpha = 0.9
			// }
			// uictx.drawImage(inventoryImg, 16*6, 176+16, 16, 16, 88*2-32*3-5*4 + (32*4-6*4)*((renderSize.x-2)/4), 10+16, 16*4, 16*4)
			// if (hovered) {
			// 	uictx.globalAlpha = 0.1
			// 	uictx.drawImage(inventoryImg, 16*11, 176+16, 16, 16, 88*2-32*3-5*4 + (32*4-6*4)*((renderSize.x-2)/4), 10+16, 16*4, 16*4)
			// 	uictx.globalAlpha = 0.9
			// }
			// if (hovered && mouse.down) {
			// 	renderSize.x = 2 + Math.round((mouse.x-(88*2-32*3)) / (32*4)*3)
			// 	renderSize.z = 2 + Math.round((mouse.x-(88*2-32*3)) / (32*4)*3)
			// }
		}

		var tabs = ["backpack", "crafting", "options"]
		for (let i in tabs) {
			let hovered = mouse.x > (i*16+16)*4 && mouse.x < (i*16+16)*4+16*4 && mouse.y > 164*4 && mouse.y < 164*4+16*4
			let x = i
			let y = 0
			let selectedOff = 48
			if (i == 2) {
				x = -1
				y = 1
				selectedOff = 16
			}
			if (tab == tabs[i]) {
				uictx.drawImage(inventoryImg, x*16+16, 176+y*16, 16, 16, (i*16+16)*4, 164*4, 16*4, 16*4)
				if (hovered) {
					uictx.globalAlpha = 0.25
					uictx.drawImage(inventoryImg, 208, 176, 16, 16, (i*16+16)*4, 164*4, 16*4, 16*4)
					uictx.globalAlpha = 0.9
				}
			} else {
				uictx.drawImage(inventoryImg, x*16+16+selectedOff, 176+y*16, 16, 16, (i*16+16)*4, 164*4, 16*4, 16*4)
				if (hovered) {
					uictx.globalAlpha = 0.25
					uictx.drawImage(inventoryImg, 224, 176, 16, 16, (i*16+16)*4, 164*4, 16*4, 16*4)
					uictx.globalAlpha = 0.9
				}
			}
			if (hovered && lClick) {
				tab = tabs[i]
			}
		}
		// let hovered2 = mouse.x > 16*4 && mouse.x < 16*4+16*4 && mouse.y > 164*4 && mouse.y < 164*4+16*4
		// uictx.drawImage(inventoryImg, 16, 176, 16, 16, 16*4, 164*4, 16*4, 16*4)
		// if (hovered2) {
		// 	uictx.globalAlpha = 0.25
		// 	uictx.drawImage(inventoryImg, 208, 176, 16, 16, 16*4, 164*4, 16*4, 16*4)
		// 	uictx.globalAlpha = 0.9
		// }
		// hovered2 = mouse.x > 32*4 && mouse.x < 32*4+16*4 && mouse.y > 164*4 && mouse.y < 164*4+16*4
		// uictx.drawImage(inventoryImg, 32+48, 176, 16, 16, 32*4, 164*4, 16*4, 16*4)
		// if (hovered2) {
		// 	uictx.globalAlpha = 0.25
		// 	uictx.drawImage(inventoryImg, 224, 176, 16, 16, 32*4, 164*4, 16*4, 16*4)
		// 	uictx.globalAlpha = 0.9
		// }
		
		off = 88*4-28
	} else {
		let i = 0
		for (let x = -72*4-36; x < 72*4+72; x += 72) {
			drawSlot(uiCanvas.width/2+x, uiCanvas.height-16*5/2-10, itemData[inventory[i][0]][0], i == selected, inventory[i][1], 72, 72)
			i += 1
		}
	}
	if (fontLoaded) {
		uictx.fillStyle = `rgb(${255}, ${255}, ${255})`

		uictx.globalAlpha = 0.9
		uictx.textAlign = "left"
		uictx.strokeStyle = "black"
		uictx.lineWidth = 8
		uictx.font = `${35}px font`
		uictx.strokeText(`FPS: ${Math.round(fps)}`, 10+off, 10+25)
		uictx.fillText(`FPS: ${Math.round(fps)}`, 10+off, 10+25)
		uictx.font = `${20}px font`
		uictx.strokeText(`CPS: ${Math.round(cps)}`, 10+off, 35+25)
		uictx.fillText(`CPS: ${Math.round(cps)}`, 10+off, 35+25)

		if (hoverText != "" && selectedItem[0] == "none" && hasMouse) {
			uictx.strokeStyle = "black"
			uictx.lineWidth = 3
			uictx.font = `${20}px font`
			uictx.strokeText(expandName(hoverText), mouse.x+10, mouse.y+30)
			uictx.fillText(expandName(hoverText), mouse.x+10, mouse.y+30)
		}

		if (inventory[selected][0] != "none" && !inventoryOpen) {
			uictx.globalAlpha = showName
			if (showName > 2.75) {
				uictx.globalAlpha = 1-(showName-2.75)*4
			}
			uictx.textAlign = "center"
			uictx.strokeStyle = "black"
			uictx.lineWidth = 4
			uictx.font = `${25}px font`
			uictx.strokeText(expandName(inventory[selected][0]), uiCanvas.width/2, uiCanvas.height-16*5/2-15-36)
			uictx.fillText(expandName(inventory[selected][0]), uiCanvas.width/2, uiCanvas.height-16*5/2-15-36)
		}
	}
	if (selectedItem[1] > 0 && hasMouse) {
		let w = 64
		let h = 64
		let item = itemData[selectedItem[0]][0]
		uictx.drawImage(itemsImg, item[0]*16, item[1]*16, 16, 16, mouse.x+32-w/2/1.5*1.1, mouse.y+40-h/2/1.5*1.1, w/1.5*1.1, h/1.5*1.1)
		if (selectedItem[1] > 1) {
			uictx.fillStyle = `rgb(${255}, ${255}, ${255})`
			uictx.font = `${15}px font`
			uictx.strokeStyle = "black"
			uictx.lineWidth = 3
			uictx.strokeText(`${selectedItem[1]}`, mouse.x+32-w/2/1.5, mouse.y+40-h/2/1.5/2)
			uictx.fillText(`${selectedItem[1]}`, mouse.x+32-w/2/1.5, mouse.y+40-h/2/1.5/2)
		}
	}
}

function drawButton(x, y, w, h, img, srcX, srcY, srcW, srcH, hovered, clicked) {
	if (clicked && hovered) {
		w /= 1.5
		h /= 1.5
	}
	if (hovered) {
		uictx.drawImage(img, srcX, srcY, srcW, srcH, x-w*1.1/2, y-h*1.1/2, w*1.1, h*1.1)
		uictx.globalAlpha = 0.25
		uictx.drawImage(inventoryImg, 192, 176, 16, 16, x-w*1.1/2, y-h*1.1/2, w*1.1, h*1.1)
		uictx.globalAlpha = 0.9
	} else {
		uictx.drawImage(img, srcX, srcY, srcW, srcH, x-w/2, y-h/2, w, h)
	}
}

function drawSlider(x, y, percentage, hovered) {
	uictx.drawImage(inventoryImg, 16*7, 176+16, 32, 16, x-16*4, y, 32*4, 16*4)
	if (hovered) {
		uictx.globalAlpha = 0.1
		uictx.drawImage(inventoryImg, 16*9, 176+16, 32, 16, x-16*4, y, 32*4, 16*4)
		uictx.globalAlpha = 0.9
	}
	uictx.drawImage(inventoryImg, 16*6, 176+16, 16, 16, x-16*4-5*4 + (32*2+10*4)*percentage, y, 16*4, 16*4)
	if (hovered) {
		uictx.globalAlpha = 0.1
		uictx.drawImage(inventoryImg, 16*11, 176+16, 16, 16, x-16*4-5*4 + (32*2+10*4)*percentage, y, 16*4, 16*4)
		uictx.globalAlpha = 0.9
	}
}

function drawText(x, y, text, size, align="left") {
	if (!fontLoaded) {return}
	uictx.fillStyle = `rgb(${255}, ${255}, ${255})`
	uictx.font = `${size}px font`
	uictx.strokeStyle = "black"
	uictx.textAlign = align
	uictx.lineWidth = size/5
	uictx.strokeText(text, x, y)
	uictx.fillText(text, x, y)
}

function drawSlot(x, y, item, highlight, count, w=64, h=64) {
	if (highlight) {
		uictx.drawImage(inventoryImg, 0, 176, 16, 16, x-w/2*1.1, y-w/2*1.1, w*1.1, h*1.1)
		if (item) {
			uictx.drawImage(itemsImg, item[0]*16, item[1]*16, 16, 16, x-w/2/1.5*1.1, y-h/2/1.5*1.1, w/1.5*1.1, h/1.5*1.1)
		}
		uictx.globalAlpha = 0.25
		uictx.drawImage(inventoryImg, 192, 176, 16, 16, x-w/2*1.1, y-h/2*1.1, w*1.1, h*1.1)
		uictx.globalAlpha = 0.9
	} else {
		uictx.drawImage(inventoryImg, 0, 176, 16, 16, x-w/2, y-h/2, w, h)
		if (item) {
			uictx.drawImage(itemsImg, item[0]*16, item[1]*16, 16, 16, x-w/2/1.5, y-h/2/1.5, w/1.5, h/1.5)
		}
	}
	if (fontLoaded && count > 1) {
		uictx.fillStyle = `rgb(${255}, ${255}, ${255})`
		uictx.font = `${15}px font`
		uictx.strokeStyle = "black"
		uictx.lineWidth = 3
		uictx.strokeText(`${count}`, x-w/2/1.5, y-h/2/1.5/2)
		uictx.fillText(`${count}`, x-w/2/1.5, y-h/2/1.5/2)
	}
}

function inventoryLogic(i, hovered) {
	if (hovered && lClick) {
		if (inventory[i][0] == selectedItem[0]) {
			if (inventory[i][1] + selectedItem[1] <= 100) {
				inventory[i][1] += selectedItem[1]
				selectedItem = ["none", 0]
			} else {
				var diff = 100-inventory[i][1]
				inventory[i][1] = 100
				selectedItem[1] -= diff
				if (diff == 0) {
					var oldSelectedItem = [...selectedItem]
					selectedItem = [...inventory[i]]
					inventory[i] = [...oldSelectedItem]
				}
			}
		} else {
			var oldSelectedItem = [...selectedItem]
			selectedItem = [...inventory[i]]
			inventory[i] = [...oldSelectedItem]
		}
	}
	if (rClick && hovered) {
		if (selectedItem[0] == "none") {
			if (inventory[i][1] > 1) {
				selectedItem = [inventory[i][0], Math.round(inventory[i][1]/2)]
				inventory[i][1] -= selectedItem[1]
			}
		} else if (inventory[i][0] == selectedItem[0]) {
			if (inventory[i][1] < 100) {
				selectedItem[1] -= 1
				inventory[i][1] += 1
				if (selectedItem[1] <= 0) {
					selectedItem = ["none", 0]
				}
			}
		} else if (inventory[i][0] == "none") {
			inventory[i] = [selectedItem[0], 1]
			selectedItem[1] -= 1
			if (selectedItem[1] <= 0) {
				selectedItem = ["none", 0]
			}
		}
	}
}