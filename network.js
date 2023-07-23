var ws = new WebSocket("wss://silver-main.glitch.me")

var id = ""
var queue = []
var sent = 0
var data = {x: 0, y: 0, z: 0, rx: 0, ry: 0, hr: 0, c: 0, a: 0, u: "Unnamed", p: [0, 0]}
var playerData = {}

function sendMsg(sendData) {
	if (ws.readyState == WebSocket.OPEN) {
		if (sent < 5) {
			sent += 1
			ws.send(JSON.stringify(sendData))
		} else {
			queue.push(JSON.stringify(sendData))
		}
	}
}

ws.addEventListener("open", (event) => {})

ws.addEventListener("message", (event) => {
	var msg = JSON.parse(event.data)
	if (msg.id) {
		console.log("Connected with id: " + msg.id)
		id = msg.id
		playerData[id] = {}
	}
	if (msg.data) {
		for (let player in msg.data) {
			playerData[player] = {
				x: msg.data[player][0],
				y: msg.data[player][1],
				z: msg.data[player][2],
				rx: msg.data[player][3],
				ry: msg.data[player][4],
				hr: msg.data[player][5],
				c: msg.data[player][6],
				a: msg.data[player][7],
				u: msg.data[player][8],
				p: msg.data[player][9],
			}
		}
	}
	if (msg.joined) {
		players[msg.joined] = new Player(0, 0, 0)
		playerData[msg.joined] = {x: 0, y: 0, z: 0, rx: 0, ry: 0, hr: 0, c: 0}
	}
	if (msg.left) {
		delete playerData[msg.left]
		players[msg.left].delete()
		delete players[msg.left]
	}
	if (msg.attack) {
		players[msg.attack].attacking = 10
	}
	if (msg.hit) {
		var dir = {x: player.pos.x-msg.hit.x, y: player.pos.y-msg.hit.y, z: player.pos.z-msg.hit.z }
		player.vel.x += dir.x
		player.vel.y += /*dir.y +*/ 0.11
		player.vel.z += dir.z
		player.rotating = 60
	}
})

ws.addEventListener("close", (event) => {
	console.log("Disconnected from server")
	// location.reload()
})

setInterval(() => {
	sent = 0
	while (sent < 5 && queue.length > 0) {
		sendMsg(queue[0])
		queue.splice(0, 1)
	}
	var rawData = []
	for (let data2 in data) {
		rawData.push(data[data2])
	}
	sendMsg({"data": rawData})
}, 1000/60)

// setInterval(function () {
// 	if (ws.readyState != WebSocket.OPEN) {
// 		location.reload()
// 	}
// }, 10000)