let gameTable = document.getElementById("gameTable");

let cellArray = []; 
let cellsCount = 0;

let flags = 0;

let bombs = 20;
let bombsArray = [];

let width = 10;

let isGameOver = false;

//Starts the game
function startGame() {
	createGameTable();
	generateRandomBombs();
	establishNeighbours();

	document.getElementById("start").style.display = "none";
}


//Creates the game board
function createGameTable() {
	for (let i = 0; i < 10; i++) {
		let tableRow = document.createElement("tr");
		tableRow.id = "row" + i;

		gameTable.appendChild(tableRow);
		let row = document.getElementById("row" + i);

		for (let j = 0; j < 10; j++) {
			let tableCell = document.createElement("td");
			tableCell.id = cellsCount;
			tableCell.className = "empty";
			cellsCount++;
			cellArray.push(tableCell.id);
			row.appendChild(tableCell);
		}
	}

	for (let i = 0; i < cellArray.length; i++) {

		document.getElementById(cellArray[i]).addEventListener('click', function(e) {
			onClick(i);
		});

		document.getElementById(cellArray[i]).oncontextmenu = function(e) {
			e.preventDefault();
			addFlag(i);
		}
	}
}

//Left click event
function onClick(i) {

	if (isGameOver) {
		return;
	}
	if (document.getElementById(cellArray[i]).style.backgroundColor === "grey" || document.getElementById(cellArray[i]).className === "flag") {
		return;
	}
	if (document.getElementById(cellArray[i]).className === "bomb") {
		gameOver(i);
	} else {
		let total = document.getElementById(cellArray[i]).getAttribute('data');
		if (total != 0) {
			document.getElementById(cellArray[i]).style.backgroundColor = "grey";
			document.getElementById(cellArray[i]).append(total);
			return;
		} else {
			document.getElementById(cellArray[i]).style.backgroundColor = "grey";
		}
		neighboursCheck(i);
	}
}

//Generates the bombs
function generateRandomBombs() {
	let randomBombs = [];
	for (let i = 0; i < bombs; i++) {
		randomize();
	}

	function randomize() {
		let random = cellArray[Math.floor(Math.random() * cellArray.length)];
		if (randomBombs.indexOf(random) === - 1) {
			randomBombs.push(random);
		} else {
			randomize();
		}
	}

	for (let i = 0; i < randomBombs.length; i++) {
		document.getElementById(randomBombs[i]).className = "bomb";
		bombsArray.push(randomBombs[i]);
		document.getElementById(randomBombs[i]).style.backgroundColor = "red";
	}
}

//Adds flags
function addFlag(i) {
	if (isGameOver) {
		return;
	}
	if (document.getElementById(cellArray[i]).style.backgroundColor === "grey" || document.getElementById(cellArray[i]).className === "flag") {
		return;
	}
	if (document.getElementById(cellArray[i]).style.backgroundColor != "grey" && (flags < bombs)) {
		if (document.getElementById(cellArray[i]).className != "flag") {
			document.getElementById(cellArray[i]).className = "flag";
			document.getElementById(cellArray[i]).append("🚩");
			flags++;
			winGame(i);
		} else {
			document.getElementById(cellArray[i]).classList.remove("flag");
			document.getElementById(cellArray[i]).append("");
			flags--;
		}
	}
}

//Establish the neighbours placement
function establishNeighbours() {
	for (let i = 0; i < cellArray.length; i++) {

		let total = 0;
		let isLeftEdge = (i % width === 0);
		let isRightEdge = (i % width === width - 1);

		if (document.getElementById(cellArray[i]).className === "empty") {
			if (i > 0 && !isLeftEdge && document.getElementById(cellArray[i - 1]).className === "bomb") {
				total++;
			}
			if (i > 9 && !isRightEdge && document.getElementById(cellArray[i + 1 - width]).className === "bomb") {
				total++;
			}
			if (i > 10 && document.getElementById(cellArray[i - width]).className === "bomb") {
				total++;
			}
			if (i > 11 && !isLeftEdge && document.getElementById(cellArray[i - 1 - width]).className === "bomb") {
				total++;
			}
			if (i < 98 && !isRightEdge && document.getElementById(cellArray[i + 1]).className === "bomb") {
				total++;
			}
			if (i < 90 && !isLeftEdge && document.getElementById(cellArray[i - 1 + width]).className === "bomb") {
				total++;
			}
			if (i < 88 && !isRightEdge && document.getElementById(cellArray[i + 1 + width]).className === "bomb") {
				total++;
			}
			if (i < 89 && document.getElementById(cellArray[i + width]).className === "bomb") {
				total++;
			}

			document.getElementById(cellArray[i]).setAttribute('data', total);
		}
	}
}

//Reveal the neighbours
function neighboursCheck(i) {

	let isLeftEdge = (i % width === 0);
	let isRightEdge = (i % width === width - 1);

	if (i > 0 && !isLeftEdge) {
		let newId = i - 1;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
	if (i > 9 && !isRightEdge) {
		let newId = i + 1 - width;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
	if (i > 10) {
		let newId = i - width;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
	if (i > 11 && !isLeftEdge) {
		let newId = i - 1 - width;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
	if (i < 98 && !isRightEdge) {
		let newId = i + 1;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
	if (i < 90 && !isLeftEdge) {
		let newId = i - 1 + width;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
	if (i < 88 && !isRightEdge) {
		let newId = i + 1 + width;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
	if (i < 89) {
		let newId = i + width;
		let newCell = document.getElementById(newId);
		onClick(newId);
	}
}

//Game over function
function gameOver(i) {
	isGameOver = true;

	document.getElementById("restart").style.display = "block";

	for (let i = 0; i < bombsArray.length; i++) {
		document.getElementById(cellArray[bombsArray[i]]).append("💣");
	}
}

//Game won function
function winGame(i) {
	let placedFlags = 0;

	for (let i = 0; i < cellArray.length; i++) {
		if (document.getElementById(cellArray[i]).className === "flag") {
			if (bombsArray.indexOf(cellArray[i]) != -1) {
				placedFlags++;
			}
		}
	}

	if (placedFlags === bombs) {
		gameOver(i);
	}
}

//Restart function
function gameRestart() {
	window.location.reload();
}