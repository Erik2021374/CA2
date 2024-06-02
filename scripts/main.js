
//Controls the pieces' positions
let boardSquaresArray = [];

// 0: red; 1: yellow; 2: green; 3: blue
let whoseTurn = -1;

//Stores the current game
const players = {
    red: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
    yellow: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
    green: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
    blue: {monsters: 0, werewolf: 0, vampire: 0, ghost: 0},
}

//HTML page references
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");
let btnLogin = document.getElementById("btn-login");
let btnStart = document.getElementById("btn-start");
let btnTurn = document.getElementById("btn-turn");
let turn = document.getElementById("turn");
let redPlayer = document.getElementById("redPlayer");
let yellowPlayer = document.getElementById("yellowPlayer");
let greenPlayer = document.getElementById("greenPlayer");
let bluePlayer = document.getElementById("bluePlayer");
let myUser = document.getElementById("userId");
let userInfo = document.getElementById("userInfo");

//Login info storage
let userLS = {noOfLogins: 0, red: 0, yellow: 0, green: 0, blue: 0};
let user;

//Login function
function login() {
    userLS.noOfLogins = 0;
    userLS.red = 0;
    userLS.yellow = 0;
    userLS.green = 0;
    userLS.blue = 0;

    do{
        user = prompt("Enter your username");
    } while (user === '');

    //Else the user pressed Cancel
    if (user) {
        //Check if the user did log in
        if (!localStorage.getItem(user)){
          localStorage.setItem(user, JSON.stringify(userLS));
          // alert("if");
        }

        userLS = JSON.parse(localStorage.getItem(user));
        userLS.noOfLogins++;
        localStorage.setItem(user, JSON.stringify(userLS));

        userInfo.textContent = `Number of logins: ${userLS.noOfLogins}
        Red's victories: ${userLS.red}
        Yellow's victories: ${userLS.yellow}
        Green's victories: ${userLS.green}
        Blue's victories: ${userLS.blue}`

        btnLogin.textContent = "Logout";
        if(userLS.noOfLogins == 1)
          myUser.textContent = `Logged as ${user}`;
        else
          myUser.textContent = `Welcome back, ${user}!`;
    }
}

//Logout function
function logout() {
  myUser.textContent = "Please login.";
  btnLogin.textContent = "Login";
  userInfo.textContent = "";
  location.reload();
}

//When the user clicks on Loggin Button selection
btnLogin.onclick = () => {
  if(btnLogin.textContent === "Login")
      login();
  else
      logout();
}

//When the user clicks on Start Button selection
btnStart.onclick = () => {
    if (btnStart.textContent == "Start Game") {
      if( myUser.textContent == "Please login."){
        alert("You must be logged in to play.");
      }
      else{
        whoseTurn = parseInt(Math.random() * 4);
        countMonsters();
        updateGame();
        btnStart.textContent = "End Game";
        btnTurn.style.visibility = "visible";
      }

    }

    else {
      alert("You will be logged out.");
      location.reload();
    }
}

//End Turn Button implemented
btnTurn.onclick = () => {
  let rand;
  do {
    rand = parseInt(Math.random() * 4);
  } while (rand == whoseTurn || players[numToText(rand)].monsters == 0);

  whoseTurn = rand;
  updateTurn();
}

//Part where the player it'is changed after the turn ends
function updateTurn() {
    turn.textContent = `${numToText(whoseTurn)}'s turn`;
}

//Monster amount displayed
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

//Amount of players and monsters left on the board
function updateGame(){

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

    //In case of victory localStorage get updated
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

//Function responsible to store the pieces on the boarding space
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

//The process below represents the target between original square, destination and result after the shock between players
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

    //When the  "wholived = 0" the attacker will get the square from the player attacked
    //In case is "-1", both players lose and the destination square gets empty
    //-1 it can also means the atacked survived so it doesn't change
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

    //The origin square will be always empty after movement
    currentSquare.pieceColor = "blank";
    currentSquare.pieceType = "blank";
    currentSquare.pieceId = "blank";
}

setupBoardSquares();
setupPieces();
fillBoardSquaresArray();

//Code where is being difened the squares that are allowed to receive pieces
function setupBoardSquares() {
  for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].addEventListener("dragover", allowDrop);
    boardSquares[i].addEventListener("drop", drop);
    let row = 11 - Math.floor(i / 12);
    let column = String.fromCharCode(96 + (i % 12));
    let square = boardSquares[i];
    square.id = column + row;
  }
}

//Allows that monsters can move through the board
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

//Prevents that not allowed moves being excecuted
function allowDrop(ev) {
  ev.preventDefault();
}

//Function that controlls when a piece is dragged
function drag(ev) {
  const piece = ev.target;

  const pieceColor = piece.getAttribute("color");
  const pieceType =piece.classList[1];
  const pieceId = piece.id;

  //Checks if the piece belongs to the specific colour turn
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

  //It speficy that the Start button needs to be selected
  else if (btnStart.textContent == "Start Game")
    alert("Press Start Button to play");

  //It shows that the piece selected belongs to another colour
  else
    alert(`It's ${numToText(whoseTurn)}'s turn!`);

}

//Função que define o que acontece quando olta a peça em determinado local
function drop(ev) {
  ev.preventDefault();

  //Extract the info from where the monster comes from and where it goings
  let data = ev.dataTransfer.getData("text");

  let [pieceId, startingSquareId] = data.split("|");
  let legalSquaresJson = ev.dataTransfer.getData("application/json");
  let legalSquares = JSON.parse(legalSquaresJson);

  const piece = document.getElementById(pieceId);
  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];

  const destinationSquare = ev.currentTarget;
  let   destinationSquareId = destinationSquare.id;

  //It will verify if the destination square has a piece
  let squareContent = getPieceAtSquare(destinationSquareId,boardSquaresArray);

  //Verify if the excecuted movement follow the rules
  if(!legalSquares.includes(destinationSquareId)) {
    alert(`Invalid move. \nValid moves for this monster: ${legalSquares}`);
    return;
  }

  //The piece will be inserted on the destination square so it decides the clash
  destinationSquare.appendChild(piece);

  let children = destinationSquare.children;
  let whoLived = 0;

  if (squareContent.pieceType != "blank") {
    if(squareContent.pieceType == pieceType) {
      alert(`${squareContent.pieceType} x ${pieceType}: both dead!`);

      //Remover as peças do quadrado
      for (let i = 0; i < children.length; i++) {
        if (!children[i].classList.contains('coordinate')) {
          destinationSquare.removeChild(children[i--]);
        }
      }

      players[squareContent.pieceColor]["monsters"]--;
      players[squareContent.pieceColor][squareContent.pieceType]--;
      players[pieceColor]["monsters"]--;
      players[pieceColor][pieceType]--;

      whoLived = -1;
    }

    //Monsters
    else {

      destinationSquare.appendChild(piece);
      let children = destinationSquare.children;

      //Verifica a regra de combate para ver quem sobrevive
      if((squareContent.pieceType == "werewolf" && pieceType == "vampire") ||
         (squareContent.pieceType == "vampire" && pieceType == "ghost") ||
         (squareContent.pieceType == "ghost" && pieceType == "werewolf")){

        alert(`${pieceType} x ${squareContent.pieceType}: ${squareContent.pieceType} dead!`);

        //Remove the losers from the square
        destinationSquare.removeChild(children[0]);

        players[squareContent.pieceColor]["monsters"]--;
        players[squareContent.pieceColor][squareContent.pieceType]--;
      }
      //The attacked player won
      else{
        alert(`${pieceType} x ${squareContent.pieceType}: ${pieceType} dead!`);
        destinationSquare.removeChild(children[1]);
        players[pieceColor]["monsters"]--;
        players[pieceColor][pieceType]--;
        whoLived = 1;
      }
    }
  }

  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray,
    whoLived
  );

  //Updtaes the info displayed on the page
  updateGame();
  return;
}

//Process to verify the possible movement of the selected piece
function getPossibleMoves(startingSquareId, piece, boardSquaresArray) {

  let horiVert = getHoriVertMoves(startingSquareId, piece.pieceColor, boardSquaresArray);

  let diagonal = getDiagonalMoves(startingSquareId, piece.pieceColor, boardSquaresArray);
  let legalSquares = [...horiVert, ...diagonal];
  return legalSquares;
}

//Horizontal and vertical movements
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

//Diagonal movement
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

//Check all the possibilities in the vertical above
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

//Check all the possibilities in the vertical below
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

//Check all the possibilities in the horizontal left
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

//Check all the possibilities in the horizontal right
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

//Check all possibilities in the upper left diagonal
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

//Check all possibilities in the upper right diagonal
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

//Check all possibilities in the lower left diagonal
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

//Check all possibilities in the lower right diagonal
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

//Verify if on the destination square is a piece
function getPieceAtSquare(squareId, boardSquaresArray) {
  let currentSquare = boardSquaresArray.find(
    (element) => element.squareId === squareId
  );
  const color = currentSquare.pieceColor;
  const pieceType = currentSquare.pieceType;
  const pieceId=currentSquare.pieceId;
  return { pieceColor: color, pieceType: pieceType,pieceId:pieceId};
}

//Converts numbers to their text correspondents
function numToText(i) {
  switch(i){
      case 0:   return "red";
      case 1:   return "yellow";
      case 2:   return "green";
      case 3:   return "blue";
      default:  return "invalid";
  }
}
