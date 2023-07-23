var usedIds = []

function getId(digits) {
	var id = 1
	while (usedIds.includes(id)) {
		id++
	}
	usedIds.push(id)
	return id
}

function freeId(id) {
	usedIds.splice(usedIds.indexOf(id), 1)
}

module.exports = {
	getId: getId,
	freeId: freeId,
}