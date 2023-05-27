var chessBoard = [];
var me = true;
var over = false;

// Win Array
// A 3-dimensional array including all ways of winning
var wins = [];

// Win Statistics Array
// Two arrays recording how each way of winning is satisfied by player and AI
var myWin = [];
var computerWin = [];

// Total number of ways of winning
var count = 0;

// Initialize all the data needed for calculation
var initData = function() {
  chessBoard = [];
  me = true;
  over = false;

  wins = [];

  myWin = [];
  computerWin = [];

  // Initialize the entire chessBoard
  for (var i = 0; i < 15; ++i) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; ++j) {
      chessBoard[i][j] = 0;
    }
  }

  // Initialize Win Array
  for (var i = 0; i < 15; ++i) {
    wins[i] = [];
    for (var j = 0; j < 15; ++j) {
      wins[i][j] = [];
    }
  }

  count = 0;

  // Add vertical ways of winning into Win Array
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[i][j + k][count] = true;
      }
      count++;
    }
  }

  // Add horizontal ways of winning into Win Array
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[j + k][i][count] = true;
      }
      count++;
    }
  }

  // Add "back-slash" ways of winning into Win Array
  for (var i = 0; i < 11; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[i + k][j + k][count] = true;
      }
      count++;
    }
  }

  // Add "forward-slash" ways of winning into Win Array
  for (var i = 0; i < 11; ++i) {
    for (var j = 14; j > 3; --j) {
      for (var k = 0; k < 5; ++k) {
        wins[i + k][j - k][count] = true;
      }
      count++;
    }
  }

  // Initialize Win Statistics Array
  for (var i = 0; i < count; ++i) {
    myWin[i] = 0;
    computerWin[i] = 0;
  }
};

// Draw the chess board
var drawChessBoard = function() {
  var chess = document.getElementById('chess');
  var context = chess.getContext('2d');
  context.clearRect(0, 0, 450, 450);
  context.strokeStyle = '#bfbfbf';

  for (var i = 0; i < 15; ++i) {
    // Draw horizontal lines
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    // Draw vertical lines
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
};

// Draw a chess piece
var oneStep = function(i, j, me) {
  var chess = document.getElementById('chess');
  var context = chess.getContext('2d');
  context.beginPath();
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  var gradient = context.createRadialGradient(
    15 + i * 30 + 2,
    15 + j * 30 - 2,
    13,
    15 + i * 30 + 2,
    15 + j * 30 - 2,
    0
  );
  if (me) {
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#636766');
  } else {
    gradient.addColorStop(0, '#d1d1d1');
    gradient.addColorStop(1, '#f9f9f9');
  }
  context.fillStyle = gradient;
  context.fill();
};

// Click event handler for playing chess
var playChess = function(e) {
  if (over || !me) {
    return;
  }
  var chess = document.getElementById('chess');
  var context = chess.getContext('2d');
  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(x / 30);
  var j = Math.floor(y / 30);
  if (chessBoard[i][j] === 0) {
    oneStep(i, j, me);
    chessBoard[i][j] = 1;
    for (var k = 0; k < count; ++k) {
      if (wins[i][j][k]) {
        myWin[k]++;
        computerWin[k] = 6; // Invalidate the AI's winning on this way
        if (myWin[k] === 5) {
          window.alert('You Win!');
          over = true;
        }
      }
    }
    if (!over) {
      me = !me;
      computerAI();
    }
  }
};

var computerAI = function() {
  var myScore = [];
  var computerScore = [];
  var max = 0; // Record the maximum score
  var u = 0,
    v = 0; // Coordinates of the best position

  // Initialize the scores for each position on the chessBoard
  for (var i = 0; i < 15; ++i) {
    myScore[i] = [];
    computerScore[i] = [];
    for (var j = 0; j < 15; ++j) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }

  // Calculate the scores for each position on the chessBoard
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 15; ++j) {
      if (chessBoard[i][j] === 0) {
        for (var k = 0; k < count; ++k) {
          if (wins[i][j][k]) {
            // Calculate the scores for the player
            if (myWin[k] === 1) {
              myScore[i][j] += 200;
            } else if (myWin[k] === 2) {
              myScore[i][j] += 400;
            } else if (myWin[k] === 3) {
              myScore[i][j] += 2000;
            } else if (myWin[k] === 4) {
              myScore[i][j] += 10000;
            }
            // Calculate the scores for the AI
            if (computerWin[k] === 1) {
              computerScore[i][j] += 220;
            } else if (computerWin[k] === 2) {
              computerScore[i][j] += 420;
            } else if (computerWin[k] === 3) {
              computerScore[i][j] += 2100;
            } else if (computerWin[k] === 4) {
              computerScore[i][j] += 20000;
            }
          }
        }
        // Update the maximum score and the best position
        if (myScore[i][j] > max) {
          max = myScore[i][j];
          u = i;
          v = j;
        } else if (myScore[i][j] === max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        } else if (computerScore[i][j] === max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }

  // Make a move on the best position
  oneStep(u, v, false);
  chessBoard[u][v] = 2;
  for (var k = 0; k < count; ++k) {
    if (wins[u][v][k]) {
      computerWin[k]++;
      myWin[k] = 6; // Invalidate the player's winning on this way
      if (computerWin[k] === 5) {
        window.alert('AI Wins!');
        over = true;
      }
    }
  }
  if (!over) {
    me = !me;
  }
};

// Initialize the game
var init = function() {
  initData();
  drawChessBoard();
  var chess = document.getElementById('chess');
  chess.addEventListener('click', playChess, false);
};

// Start the game
init();
