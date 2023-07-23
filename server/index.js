const WebSocket = require("ws")
const utils = require("./utils.js")
const chunkManager = require("./chunks.js")
const wsServer = new WebSocket.Server({ port: 8080 })
var usedBytes = 0
var ubplayer = 0
var ubchunks = 0
var ubmisc = 0
var players = {}
var queue = []
var sent = 0
var playerData = {}
var changed = {}
var cyclePlayers = 0
var cycleData = 0
var dataIds = {x: 0, y: 1, z: 2, rx: 3, ry: 4, hr: 5, c: 6, a: 7, u: 8, }
var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" 
// console.log(letters.length)
var chunks = {}

function compressList(list) {
	var clist = ""
	var amount = 0
	var lastItem = list[0]
	let i = 0
	for (let i in list) {
		let item = list[i]
		if (item == lastItem && amount < 52) {
			amount += 1
		} else {
			clist += lastItem.toString()+letters[amount-1]
			amount = 1
		}
		lastItem = item
		i++
	}
	clist += lastItem.toString()+letters[amount-1]
	return clist
}

var g = chunkManager.generateChunk(0, 3, 0)
var chunk = g[0]
var sets = g[1]
// console.log(chunk.toString().length)
// console.log(compressList(chunk))
// console.log(compressList(chunk).length)

function sendMsgChunks(player, data) {
	if (ubchunks+JSON.stringify(data).length+8+50 > 4500) {
		return
	}
	usedBytes += JSON.stringify(data).length+8+50
	ubchunks += JSON.stringify(data).length+8+50
	
	player.send(JSON.stringify(data))
}

function sendMsgMisc(player, data) {
	if (ubmisc+JSON.stringify(data).length+8+50 > 1000) {
		if (queue.length < 1000) {
			queue.push([player, data])
		}
		return
	}
	usedBytes += JSON.stringify(data).length+8+50
	ubmisc += JSON.stringify(data).length+8+50
	
	player.send(JSON.stringify(data))
}

function sendMsgPlayer(player, data) {
	if (ubplayer+JSON.stringify(data).length+8+50 > 4500) {
		return
	}
	usedBytes += JSON.stringify(data).length+8+50
	ubplayer += JSON.stringify(data).length+8+50
	
	player.send(JSON.stringify(data))
}

wsServer.on("connection", (socket) => {
	var id = utils.getId().toString()
	for (let player in players) {
		sendMsgMisc(players[player], {"joined": id})
		sendMsgMisc(socket, {"joined": player})
	}
	players[id] = socket
	sendMsgMisc(socket, {"id": id, "data": playerData})
	console.log("---------")
  console.log("Player joined " + id)
	console.log("Players Online: " + Object.keys(players).length)
  socket.on("message", (message) => {
		var msg = JSON.parse(message)
		if (msg.data) {
			playerData[id] = [
				msg.data[0],
				msg.data[1],
				msg.data[2],
				msg.data[3],
				msg.data[4],
				msg.data[5],
				msg.data[6],
				msg.data[7],
				msg.data[8],
				msg.data[9],
			]
		}
		if (msg.chunk) {
			var g = generateChunk(msg.chunk[0], msg.chunk[1], msg.chunk[2])
			sendMsgChunks(socket, compressList(g[0]))
		}
		if (msg.broadcast) {
			// for (let player in players) {
			// 	if (player == id) { continue }
			// 	sendMsg(players[player], msg.broadcast)
			// }
		}
		if (msg.send) {
			// if (players[msg.send[0]]) {
			// 	sendMsg(players[msg.send[0]], msg.send[1])
			// }
		}
  })

  socket.on("close", () => {
    console.log("Player left :( " + id)
		delete players[id]
		delete playerData[id]
		utils.freeId(id)
		for (let player in players) {
			sendMsgMisc(players[player], {"left": id})
		}
		console.log("Players Online: " + Object.keys(players).length)
  })
})

setInterval(() => {
	var actuallySend = {}
	let keys = Object.keys(playerData)
	for (let i = 0; i < 2; i++) {
		let get = Math.round(Math.random()*(keys.length-1))
		let done = Object.keys(actuallySend).length >= keys.length
		var key = keys[get]
		while (actuallySend[key] && !done) {
			let get = Math.round(Math.random()*(keys.length-1))
			key = keys[get]
		}
		if (key) {
			actuallySend[key] = playerData[key]
		}
	}
	var sendPlayers = {}
	keys = Object.keys(players)
	for (let i = 0; i < 2; i++) {
		let get = Math.round(Math.random()*(keys.length-1))
		let done = Object.keys(sendPlayers).length >= keys.length
		var key = keys[get]
		while (sendPlayers[key] && !done) {
			let get = Math.round(Math.random()*(keys.length-1))
			key = keys[get]
		}
		if (key) {
			sendPlayers[key] = players[key]
		}
	}
	for (let player in sendPlayers) {
		var sendData = {}
		for (let data in actuallySend) {
			if (data != player) {
				sendData[data] = actuallySend[data]
			}
		}
		if (JSON.stringify(sendData) != "{}") {
			sendMsgPlayer(sendPlayers[player], {"data": sendData})
		}
	}
}, 1000/10)

setInterval(() => {
	// console.log(JSON.stringify(changed))
	// console.log(ub2, "| estimated:", (JSON.stringify(changed).length+58)*10)
	ubplayer = 0
	ubchunks = 0
	ubmisc = 0

	for (let msg of queue) {
		sendMsgMisc(msg[0], msg[1])
	}
	queue = []
	
	// console.log(playerData)
}, 1000)