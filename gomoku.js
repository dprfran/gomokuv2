//freezes after hPlayer's turn
var chessBoard = []; // 2D array to store the state of the chess board
var me = true; // Flag to indicate the player's turn
var over = false; // Flag to indicate if the game is over
var count = 0; // Count of the winning patterns
var wins = []; // Array to store the winning patterns
var myWin = []; // Array to store the player's winning patterns count
var computerWin = []; // Array to store the AI's winning patterns count

// Initialize the data
var initData = function() {
  for (var i = 0; i < 15; ++i) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; ++j) {
      chessBoard[i][j] = 0;
    }
  }

  for (var i = 0; i < 15; ++i) {
    wins[i] = [];
    for (var j = 0; j < 15; ++j) {
      wins[i][j] = [];
    }
  }

  // Horizontal winning patterns
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[i][j + k][count] = true;
      }
      count++;
    }
  }

  // Vertical winning patterns
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[j + k][i][count] = true;
      }
      count++;
    }
  }

  // Diagonal winning patterns (from top-left to bottom-right)
  for (var i = 0; i < 11; ++i) {
    for (var j = 0; j < 11; ++j) {
      for (var k = 0; k < 5; ++k) {
        wins[i + k][j + k][count] = true;
      }
      count++;
    }
  }

  // Diagonal winning patterns (from top-right to bottom-left)
  for (var i = 0; i < 11; ++i) {
    for (var j = 14; j > 3; --j) {
      for (var k = 0; k < 5; ++k) {
        wins[i + k][j - k][count] = true;
      }
      count++;
    }
  }

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

  for (var i = 0; i < 15; ++i) {
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
};

// Play a chess move
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
    oneStep(i, j, true);
    chessBoard[i][j] = 1;

    for (var k = 0; k < count; ++k) {
      if (wins[i][j][k]) {
        myWin[k]++;
        computerWin[k] = 6; // Invalidate the AI's winning on this pattern
        if (myWin[k] === 5) {
          window.alert('You Win!');
          over = true;
        }
      }
    }

    if (!over) {
      me = !me;
      computerAI();
      //setTimeout(computerAI, 500);
    }
  }
};

// Draw a chess piece at the specified position
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
    gradient.addColorStop(0, '#0A0A0A');
    gradient.addColorStop(1, '#636766');
  } else {
    gradient.addColorStop(0, '#D1D1D1');
    gradient.addColorStop(1, '#F9F9F9');
  }
  context.fillStyle = gradient;
  context.fill();
};

// Negamax algorithm with alpha-beta pruning
var negamax = function(alpha, beta, depth, color) {
if (depth === 0 || over) {
  return color * evaluate();
}

var bestValue = -Infinity;

for (var i = 0; i < 15; ++i) {
  for (var j = 0; j < 15; ++j) {
    if (chessBoard[i][j] === 0) {
      chessBoard[i][j] = color;
      var value = -negamax(-beta, -alpha, depth - 1, -color); // Fix: Negate the color parameter
      chessBoard[i][j] = 0;

      bestValue = Math.max(bestValue, value);
      alpha = Math.max(alpha, value);

      if (alpha >= beta) {
        return alpha; // Beta cutoff
      }
    }
  }
}

return bestValue;
};


// Evaluate the score of the current game state
var evaluate = function() {
  var score = 0;

  // Evaluate horizontal patterns
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      var count = 0;
      var empty = 0;
      for (var k = 0; k < 5; ++k) {
        if (chessBoard[i][j + k] === 1) {
          count++;
        } else if (chessBoard[i][j + k] === 0) {
          empty++;
        }
      }
      score += evaluatePattern(count, empty);
    }
  }

  // Evaluate vertical patterns
  for (var i = 0; i < 15; ++i) {
    for (var j = 0; j < 11; ++j) {
      var count = 0;
      var empty = 0;
      for (var k = 0; k < 5; ++k) {
        if (chessBoard[j + k][i] === 1) {
          count++;
        } else if (chessBoard[j + k][i] === 0) {
          empty++;
        }
      }
      score += evaluatePattern(count, empty);
    }
  }

  // Evaluate diagonal patterns (from top-left to bottom-right)
  for (var i = 0; i < 11; ++i) {
    for (var j = 0; j < 11; ++j) {
      var count = 0;
      var empty = 0;
      for (var k = 0; k < 5; ++k) {
        if (chessBoard[i + k][j + k] === 1) {
          count++;
        } else if (chessBoard[i + k][j + k] === 0) {
          empty++;
        }
      }
      score += evaluatePattern(count, empty);
    }
  }

  // Evaluate diagonal patterns (from top-right to bottom-left)
  for (var i = 0; i < 11; ++i) {
    for (var j = 14; j > 3; --j) {
      var count = 0;
      var empty = 0;
      for (var k = 0; k < 5; ++k) {
        if (chessBoard[i + k][j - k] === 1) {
          count++;
        } else if (chessBoard[i + k][j - k] === 0) {
          empty++;
        }
      }
      score += evaluatePattern(count, empty);
    }
  }

  return score;
};

// Evaluate the score of a pattern
var evaluatePattern = function(count, empty) {
  if (count === 5) {
    return 100000; // Five in a row
  } else if (count === 4 && empty === 1) {
    return 10000; // Open four
  } else if (count === 3 && empty === 2) {
    return 1000; // Open three
  } else if (count === 2 && empty === 3) {
    return 100; // Open two
  } else if (count === 1 && empty === 4) {
    return 10; // Open one
  } else {
    return 0;
  }
};

// AI's turn to play
var computerAI = function() {
if (!me) {
  return;
}

var maxScore = -Infinity;
var maxX = 0;
var maxY = 0;

for (var i = 0; i < 15; ++i) {
  for (var j = 0; j < 15; ++j) {
    if (chessBoard[i][j] === 0) {
      chessBoard[i][j] = 2;
      var score = -negamax(-Infinity, Infinity, 3, -1); // Adjust the depth parameter to the desired value
      chessBoard[i][j] = 0;

      if (score > maxScore) {
        maxScore = score;
        maxX = i;
        maxY = j;
      }
    }
  }
}

oneStep(maxX, maxY, false);
chessBoard[maxX][maxY] = 2;

for (var k = 0; k < count; ++k) {
  if (wins[maxX][maxY][k]) {
    computerWin[k]++;
    myWin[k] = 6; // Invalidate the player's winning on this pattern
    if (computerWin[k] === 5) {
      window.alert('AI Wins!');
      over = true;
    }
  }
}

if (!over) {
  //me = !me;
  requestAnimationFrame(playChess);
}
};


// Event listener for mouse click on the canvas
document.getElementById('chess').addEventListener('click', playChess);

// Initialize the game
initData();
drawChessBoard();