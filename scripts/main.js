

let boardSquaresArray = [];
let whoseTurn = -1;  // 0: red; 1: yellow; 2: green; 3: blue

const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");

const players = {
    red: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
    yellow: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
    green: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
    blue: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
}


let btnStart = document.getElementById("btn-start");
let btnTurn = document.getElementById("btn-turn");

let turn = document.getElementById("turn");
let redPlayer = document.getElementById("redPlayer");
let yellowPlayer = document.getElementById("yellowPlayer");
let greenPlayer = document.getElementById("greenPlayer");
let bluePlayer = document.getElementById("bluePlayer");








btnStart.onclick = () => {
    if (btnStart.textContent == "Start Game") {
        whoseTurn = parseInt(Math.random() * 4);
        countMonsters();
        updateGame();
        btnStart.textContent = "End Game";
        btnTurn.style.visibility = "visible";
    }

    else location.reload();
}

btnTurn.onclick = () => {
  let rand;
  do {
    rand = parseInt(Math.random() * 4);
  } while (rand == whoseTurn || players[numToText(rand)].monsters == 0);

  whoseTurn = rand;
  updateTurn();
}

function updateTurn() {
    turn.textContent = `${numToText(whoseTurn)}'s turn`;
}

function countMonsters() {
    const boardSquares = document.getElementsByClassName("square");

    for (let i = 0; i < boardSquares.length; i++) {
      let square = boardSquares[i];

      if (square.querySelector(".piece")) {
        let color = square.querySelector(".piece").getAttribute("color");
        players[color]["monsters"]++;
        if      ((square.querySelector(".piece").getAttribute("class")).includes("werewolf")) players[color]["werewolf"]++;
        else if ((square.querySelector(".piece").getAttribute("class")).includes("vampire")) players[color]["vampire"]++;
        else if ((square.querySelector(".piece").getAttribute("class")).includes("ghost")) players[color]["ghost"]++;
      }
    }
}

function updateGame(){

  // for (let i; i < 4; i++){
  //   let color = numToText(i);
  // }

    if (players.red.monsters)
        redPlayer.textContent = `Werewolves: ${players.red.werewolf},
      Vampires: ${players.red.vampire}, Ghosts: ${players.red.ghost}`;
    else redPlayer.textContent = "Game over";

    if (players.yellow.monsters)
        yellowPlayer.textContent = `Werewolves: ${players.yellow.werewolf},
      Vampires: ${players.yellow.vampire}, Ghosts: ${players.yellow.ghost}`;
    else yellowPlayer.textContent = "Game over";

    if (players.green.monsters)
        greenPlayer.textContent = `Werewolves: ${players.green.werewolf},
      Vampires: ${players.green.vampire}, Ghosts: ${players.green.ghost}`;
    else greenPlayer.textContent = "Game over";

    if (players.blue.monsters)
        bluePlayer.textContent = `Werewolves: ${players.blue.werewolf},
      Vampires: ${players.blue.vampire}, Ghosts: ${players.blue.ghost}`;
    else bluePlayer.textContent = "Game over";

    if(players.red.monsters > 0 && players.yellow.monsters == 0 &&
      players.green.monsters == 0 && players.blue.monsters == 0) {
        alert("Red player won!");
        userLS.red++;
        localStorage.setItem(user, JSON.stringify(userLS));
        logout();
    }
    else if(players.red.monsters == 0 && players.yellow.monsters > 0 &&
      players.green.monsters == 0 && players.blue.monsters == 0) {
        alert("Yellow player won!");
        userLS.yellow++;
        localStorage.setItem(user, JSON.stringify(userLS));
        logout();
    }
    else if(players.red.monsters == 0 && players.yellow.monsters == 0 &&
      players.green.monsters > 0 && players.blue.monsters == 0) {
        alert("Green player won!");
        userLS.green++;
        localStorage.setItem(user, JSON.stringify(userLS));
        logout();
    }
    else if(players.red.monsters == 0 && players.yellow.monsters == 0 &&
      players.green.monsters == 0 && players.blue.monsters > 0) {
        alert("Blue player won!");
        userLS.blue++;
        localStorage.setItem(user, JSON.stringify(userLS));
        logout();
    }

    else updateTurn();
}

function fillBoardSquaresArray() {
  const boardSquares = document.getElementsByClassName("square");
  for (let i = 0; i < boardSquares.length; i++) {
    let row = 11 - Math.floor(i / 12);
    let column = String.fromCharCode(96 + (i % 12));
    let square = boardSquares[i];

    square.id = column + row;
    let color = "";
    let pieceType = "";
    let pieceId = "";
    if (square.querySelector(".piece")) {
      color     = square.querySelector(".piece").getAttribute("color");
      pieceType = square.querySelector(".piece").classList[1];
      pieceId   = square.querySelector(".piece").id;
    } else {
      color = "blank";
      pieceType = "blank";
      pieceId ="blank";
    }
    let arrayElement = {
      squareId: square.id,
      pieceColor: color,
      pieceType: pieceType,
      pieceId: pieceId
    };
    boardSquaresArray.push(arrayElement);
  }
}
function updateBoardSquaresArray (currentSquareId, destinationSquareId, boardSquaresArray, whoLived) {
    /*
    whoLived == 0: strikerPiece
    whoLived == 1: attackedPiece
    whoLived == -1: none
    */

    let currentSquare = boardSquaresArray.find(
        (element) => element.squareId === currentSquareId
    );
    let destinationSquareElement = boardSquaresArray.find(
        (element) => element.squareId === destinationSquareId
    );
    let pieceColor = currentSquare.pieceColor;
    let pieceType = currentSquare.pieceType;
    let pieceId= currentSquare.pieceId;

    if(whoLived == 0){
      destinationSquareElement.pieceColor = pieceColor;
      destinationSquareElement.pieceType = pieceType;
      destinationSquareElement.pieceId = pieceId;
    }
    else if(whoLived == -1){
      destinationSquareElement.pieceColor = "blank";
      destinationSquareElement.pieceType = "blank";
      destinationSquareElement.pieceId = "blank";
    }

    currentSquare.pieceColor = "blank";
    currentSquare.pieceType = "blank";
    currentSquare.pieceId = "blank";
}

setupBoardSquares();
setupPieces();
fillBoardSquaresArray();

function setupBoardSquares() {
    // alert(boardSquares.length)
  for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].addEventListener("dragover", allowDrop);
    boardSquares[i].addEventListener("drop", drop);
    let row = 11 - Math.floor(i / 12);
    let column = String.fromCharCode(96 + (i % 12));
    let square = boardSquares[i];
    square.id = column + row;
  }
}
function setupPieces() {
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener("dragstart", drag);
    pieces[i].setAttribute("draggable", true);
    pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
  }
  for (let i = 0; i < piecesImages.length; i++) {
    piecesImages[i].setAttribute("draggable", false);
  }
}
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  const piece = ev.target;

  const pieceColor = piece.getAttribute("color");
  const pieceType =piece.classList[1];
  const pieceId = piece.id;

  if (numToText(whoseTurn) == pieceColor) {
    const startingSquareId = piece.parentNode.id;
    ev.dataTransfer.setData("text", pieceId + "|" + startingSquareId);
    const pieceObject ={pieceColor:pieceColor, pieceType:pieceType, pieceId:pieceId}

    let legalSquares = getPossibleMoves(
      startingSquareId,
      pieceObject,
      boardSquaresArray
    );

    let legalSquaresJson = JSON.stringify(legalSquares);
    ev.dataTransfer.setData("application/json", legalSquaresJson);
  }

  else alert(`It's ${numToText(whoseTurn)}'s turn!`);

}

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");

  let [pieceId, startingSquareId] = data.split("|");
  let legalSquaresJson = ev.dataTransfer.getData("application/json");
  let legalSquares = JSON.parse(legalSquaresJson);

  const piece = document.getElementById(pieceId);
  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];

  const destinationSquare = ev.currentTarget;
  let   destinationSquareId = destinationSquare.id;

  let squareContent = getPieceAtSquare(destinationSquareId,boardSquaresArray);

  if(!legalSquares.includes(destinationSquareId)) {
    alert(`Invalid move. \nValid moves for this monster: ${legalSquares}`);
    return;
  }

  destinationSquare.appendChild(piece);
  let children = destinationSquare.children;
  let whoLived = 0;

  if (squareContent.pieceType != "blank") {
    if(squareContent.pieceType == pieceType) {
      alert(`${squareContent.pieceType} x ${pieceType}: both dead!`);

      for (let i = 0; i < children.length; i++) {
        if (!children[i].classList.contains('coordinate')) {
          destinationSquare.removeChild(children[i--]);
        }
      }

      // destinationSquare.removeChild(children[0]);
      // destinationSquare.removeChild(children[1]);
      players[squareContent.pieceColor]["monsters"]--;
      players[squareContent.pieceColor][squareContent.pieceType]--;
      players[pieceColor]["monsters"]--;
      players[pieceColor][pieceType]--;

      whoLived = -1;
    }

    else {  //Different monsters

      destinationSquare.appendChild(piece);
      let children = destinationSquare.children;
      if((squareContent.pieceType == "werewolf" && pieceType == "vampire") ||
         (squareContent.pieceType == "vampire" && pieceType == "ghost") ||
         (squareContent.pieceType == "ghost" && pieceType == "werewolf")){

        alert(`${pieceType} x ${squareContent.pieceType}: ${squareContent.pieceType} dead!`);
        // alert("Werewolf x vampire: werewolf dead!");
        destinationSquare.removeChild(children[0]);
        players[squareContent.pieceColor]["monsters"]--;
        players[squareContent.pieceColor][squareContent.pieceType]--;
      }
      else{
        alert(`${pieceType} x ${squareContent.pieceType}: ${pieceType} dead!`);
        destinationSquare.removeChild(children[1]);
        players[pieceColor]["monsters"]--;
        players[pieceColor][pieceType]--;
        whoLived = 1;
      }

    }

  }

  // destinationSquare.appendChild(piece);

  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray,
    whoLived
  );

  updateGame();
  return;
}

function getPossibleMoves(startingSquareId, piece, boardSquaresArray) {
  let horiVert = getHoriVertMoves(startingSquareId, piece.pieceColor, boardSquaresArray);
  let diagonal = getDiagonalMoves(startingSquareId, piece.pieceColor, boardSquaresArray);
  let legalSquares = [...horiVert, ...diagonal];
  return legalSquares;
}

function getHoriVertMoves(startingSquareId, pieceColor, boardSquaresArray) {
  let vetMoveAllUp = moveAllUp(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let vetMoveAllDown = moveAllDown(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let vetMoveAllLeft = moveAllLeft(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let vetMoveAllRight = moveAllRight(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let legalSquares = [
    ...vetMoveAllUp,
    ...vetMoveAllDown,
    ...vetMoveAllLeft,
    ...vetMoveAllRight,
  ];
  return legalSquares;
}

function getDiagonalMoves(startingSquareId, pieceColor, boardSquaresArray) {
  let vetMoveToDirNE = moveToDirNE(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let vetMoveToDirNW = moveToDirNW(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let vetMoveToDirSE = moveToDirSE(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let vetMoveToDirSW = moveToDirSW(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let legalSquares = [
    ...vetMoveToDirNE,
    ...vetMoveToDirNW,
    ...vetMoveToDirSE,
    ...vetMoveToDirSW,
  ];
  return legalSquares;
}

function moveAllUp(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);

  const rankNumber = parseInt(rank);
  let currentRank = rankNumber;
  let legalSquares = [];

  while (currentRank < 10) {
    currentRank++;
    let currentSquareId = file + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }

  return legalSquares;
}

function moveAllDown(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentRank = rankNumber;
  let legalSquares = [];

  while (currentRank > 1) {
    currentRank--;
    let currentSquareId = file + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }

  return legalSquares;
}

function moveAllLeft(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  let currentFile = file;
  let legalSquares = [];

  if (rank == 0 || rank == 11 || currentFile == "`") return legalSquares;
  while (currentFile != "a") {
    currentFile = String.fromCharCode(currentFile.charCodeAt(0) - 1);
    let currentSquareId = currentFile + rank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }

  return legalSquares;
}

function moveAllRight(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  let currentFile = file;
  let legalSquares = [];

  if (rank == 0 || rank == 11 || currentFile == "k") return legalSquares;
  while (currentFile != "j") {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) + 1
    );
    let currentSquareId = currentFile + rank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }

  return legalSquares;
}

function moveToDirNW(
  startingSquareId,
  pieceColor,
  boardSquaresArray
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "`" || rank == 11) return legalSquares;

  let moves = 2;
  while (!(currentFile == "a" || currentRank == 8 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) - 1
    );
    currentRank++;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}
function moveToDirNE(
  startingSquareId,
  pieceColor,
  boardSquaresArray
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "k" || rank == 11) return legalSquares;

  let moves = 2;
  while (!(currentFile == "j" || currentRank == 10 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) + 1
    );
    currentRank++;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}
function moveToDirSW(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "`" || rank == 0) return legalSquares;

  let moves = 2;
  while (!(currentFile == "a" || currentRank == 1 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) - 1
    );
    currentRank--;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}
function moveToDirSE(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "k" || rank == 0) return legalSquares;

  let moves = 2;
  while (!(currentFile == "j" || currentRank == 1 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) + 1
    );
    currentRank--;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}

function getPieceAtSquare(squareId, boardSquaresArray) {
  let currentSquare = boardSquaresArray.find(
    (element) => element.squareId === squareId
  );
  const color = currentSquare.pieceColor;
  const pieceType = currentSquare.pieceType;
  const pieceId=currentSquare.pieceId;
  return { pieceColor: color, pieceType: pieceType,pieceId:pieceId};
}

function numToText(i) {
  switch(i){
      case 0:   return  "red";
      case 1:   return "yellow";
      case 2:   return "green";
      case 3:   return "blue";
      default:  return "invalid";
  }
}
