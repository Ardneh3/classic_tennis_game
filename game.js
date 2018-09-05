const canvas = document.querySelector('#pongCanvas');
const canvasContext = canvas.getContext('2d');

let ballX = canvas.width / 2;
let ballY = Math.floor(Math.random() * canvas.height);
const initialBallSpeed = 8;
let ballSpeedX = initialBallSpeed;
let ballSpeedY = initialBallSpeed;
const ballSize = 12.5;
const ballSpeedChange = 0.2;

const paddlesHeight = 100;
const paddlesWidth = 15;
const centerOfPaddle = paddlesHeight / 2;

const leftPaddleX = 50;
let leftPaddleY = 250;

const rightPaddleX = canvas.width - 50;
let rightPaddleY = 250;

let aiSpeed = 10;

let humanPlayer = 'playerOne';

let playerOneScore = 0;
let playerTwoScore = 0;
let winningScore = 3;
let winningPlayer = null;

let startGame = true;
let endGame = false;

const frameRate = 40;

let intervalId = null;

const colors = {
  'playerOne': '#26F008',
  'playerTwo': '#F02106',
  'qButton': '#FDFF00',
  'nButton': '#FDFF00',
  'lButton': '#FDFF00',
  'eButton': '#FDFF00',
  'mButton': '#FDFF00',
  'hButton': '#FDFF00'
}

const drawCircle = (data) => {
  canvasContext.fillStyle = data.color;
  canvasContext.beginPath();
  canvasContext.arc(data.circleX, data.circleY, data.radius, 0, Math.PI * 2);
  canvasContext.fill();
}

const drawRectangle = (data) => {
  canvasContext.fillStyle = data.color;
  canvasContext.fillRect(data.leftX, data.topY, data.width, data.height);
}

const drawRectBorders = (data) => {
  canvasContext.strokeStyle = data.color;
  if (data.shadowColor) {
    canvasContext.shadowColor = data.shadowColor;
    canvasContext.shadowBlur = data.shadowBlur;
    canvasContext.shadowOffsetX = data.shadowOffsetX;
    canvasContext.shadowOffsetY = data.shadowOffsetY;
  }
  canvasContext.strokeRect(data.leftX, data.topY, data.width, data.height);
  canvasContext.shadowColor = '';
  canvasContext.shadowBlur = 0;
  canvasContext.shadowOffsetX = 0;
  canvasContext.shadowOffsetY = 0;
}

const drawText = (data) => {
  if (data.center) {
  canvasContext.textAlign = 'center';
  } else {
    canvasContext.textAlign = 'start';
  }
  canvasContext.font = data.font;
  canvasContext.fillStyle = data.color;
  canvasContext.fillText(data.text, data.textX, data.textY);
}

const drawNet = () => {
  for (let i = 0; i < canvas.height; i += 40) {
    drawRectangle({
      'leftX': canvas.width / 2 - 5,
      'topY': i,
      'width': 10,
      'height': 20,
      'color': '#FFF'
    });
  }
}

const drawStartScreen = () => {
  drawRectangle({
    'leftX': 0,
    'topY': 0,
    'width': canvas.width,
    'height': canvas.height,
    'color': 'black'
  });
  drawText({
    'text': 'Select Side',
    'textX': canvas.width / 2,
    'textY': 50,
    'font': '24px Helvetica',
    'color': '#FFF',
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 - 150,
    'topY': 100,
    'width': 150,
    'height': 50,
    'color': colors.playerOne,
    'shadowColor': colors.playerOne,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Left',
    'textX': canvas.width / 2 - 75,
    'textY': 130,
    'font': '24px Helvetica',
    'color': colors.playerOne,
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 + 40,
    'topY': 100,
    'width': 150,
    'height': 50,
    'color': colors.playerTwo,
    'shadowColor': colors.playerTwo,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Right',
    'textX': canvas.width / 2 + 115,
    'textY': 130,
    'font': '24px Helvetica',
    'color': colors.playerTwo,
    'center': true
  });
  drawText({
    'text': 'Select Length Of Game',
    'textX': canvas.width / 2,
    'textY': 200,
    'font': '24px Helvetica',
    'color': '#FFF',
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 - 250,
    'topY': 250,
    'width': 150,
    'height': 50,
    'color': colors.qButton,
    'shadowColor': colors.qButton,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Quick',
    'textX': canvas.width / 2 - 175,
    'textY': 280,
    'font': '24px Helvetica',
    'color': colors.qButton,
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 - 60,
    'topY': 250,
    'width': 150,
    'height': 50,
    'color': colors.nButton,
    'shadowColor': colors.nButton,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Normal',
    'textX': canvas.width / 2 + 15,
    'textY': 280,
    'font': '24px Helvetica',
    'color': colors.nButton,
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 + 130,
    'topY': 250,
    'width': 150,
    'height': 50,
    'color': colors.lButton,
    'shadowColor': colors.lButton,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Long',
    'textX': canvas.width / 2 + 205,
    'textY': 280,
    'font': '24px Helvetica',
    'color': colors.lButton,
    'center': true
  });
  drawText({
    'text': 'Select Difficulty',
    'textX': canvas.width / 2,
    'textY': 350,
    'font': '24px Helvetica',
    'color': '#FFF',
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 - 250,
    'topY': 400,
    'width': 150,
    'height': 50,
    'color': colors.eButton,
    'shadowColor': colors.eButton,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Easy',
    'textX': canvas.width / 2 - 175,
    'textY': 430,
    'font': '24px Helvetica',
    'color': colors.eButton,
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 - 60,
    'topY': 400,
    'width': 150,
    'height': 50,
    'color': colors.mButton,
    'shadowColor': colors.mButton,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Medium',
    'textX': canvas.width / 2 + 15,
    'textY': 430,
    'font': '24px Helvetica',
    'color': colors.mButton,
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 + 130,
    'topY': 400,
    'width': 150,
    'height': 50,
    'color': colors.hButton,
    'shadowColor': colors.hButton,
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Hard',
    'textX': canvas.width / 2 + 205,
    'textY': 430,
    'font': '24px Helvetica',
    'color': colors.hButton,
    'center': true
  });
  drawRectBorders({
    'leftX': canvas.width / 2 - 60,
    'topY': 500,
    'width': 150,
    'height': 50,
    'color': '#FADE00',
    'shadowColor': '#FADE00',
    'shadowBlur': 10,
    'shadowOffsetX': 0,
    'shadowOffsetY': 0
  });
  drawText({
    'text': 'Start',
    'textX': canvas.width / 2 + 15,
    'textY': 530,
    'font': '24px Helvetica',
    'color': '#FADE00',
    'center': true
  });
}

const score = (player) => {
  const canvasBallOffset = canvas.height - ballSize;

  ballX = canvas.width / 2;
  ballY = Math.floor(Math.random() * (canvasBallOffset - ballSize) + ballSize);
  ballSpeedX = -initialBallSpeed;
  ballSpeedY = initialBallSpeed;

  if (player === 'playerOne') {
    playerOneScore += 1;
  } else {
    playerTwoScore += 1;
  }

  winningPlayer = playerOneScore > playerTwoScore ? 'playerOne' : 'playerTwo';

  if (playerOneScore === winningScore || playerTwoScore === winningScore) {
    endGame = true;
  }
}

const compareLeftY = () => {
  if (ballY >= leftPaddleY && ballY <= leftPaddleY + paddlesHeight) {
    return true;
  }

return false;
}

const compareLeftX = () => {
  if (ballX - ballSize <= leftPaddleX + paddlesWidth && ballX - ballSize > leftPaddleX) {
    return true;
  }

return false;
}

const compareRightY = () => {
  if (ballY >= rightPaddleY && ballY <= rightPaddleY + paddlesHeight) {
    return true;
  }

return false;
}

const compareRightX = () => {
  if (ballX + ballSize >= rightPaddleX && ballX + ballSize < rightPaddleX + paddlesWidth) {
    return true;
  }

return false;
}

const speedUp = (value, paddleY) => {
  const topOfPaddle = paddleY * 0.33;
  const bottomOfPaddle = paddleY * 0.66;

  if (ballSpeedY > 0) {
    if (ballY > paddleY && ballY < paddleY + topOfPaddle || ballY > paddleY + bottomOfPaddle && ballY < paddleY + paddlesHeight) {
      ballSpeedY += ballSpeedChange * 2;

      return ballSpeedY;
    } else if (ballY > paddleY + topOfPaddle && ballY < paddleY + bottomOfPaddle) {
      ballSpeedY += ballSpeedChange * 0.5;

      return ballSpeedY;
    }
      ballSpeedY += value;

      return ballSpeedY;

  }

  if (ballSpeedY < 0) {
    if (ballY > paddleY && ballY < paddleY + topOfPaddle || ballY > paddleY + bottomOfPaddle && ballY < paddleY + paddlesHeight) {
      ballSpeedY -= ballSpeedChange * 2;

      return ballSpeedY;
    } else if (ballY > paddleY + topOfPaddle && ballY < paddleY + bottomOfPaddle) {
      ballSpeedY -= ballSpeedChange * 0.5;

      return ballSpeedY;
    }
      ballSpeedY -= value;

      return ballSpeedY;

  }

  return ballSpeedY;
}

const aiMovement = () => {
  const safeOffset = paddlesHeight * 0.35;

  if (humanPlayer === 'playerOne') {
    if (rightPaddleY <= 0) {
      rightPaddleY = 0;
    }
    if (rightPaddleY + paddlesHeight >= canvas.height) {
      rightPaddleY = canvas.height - paddlesHeight;
    }
    if (rightPaddleY + centerOfPaddle < ballY - safeOffset) {
      rightPaddleY += aiSpeed;
    } else if (rightPaddleY + centerOfPaddle > ballY + safeOffset) {
      rightPaddleY -= aiSpeed;
    }
  } else {
    if (leftPaddleY <= 0) {
      leftPaddleY = 0;
    }
    if (leftPaddleY + paddlesHeight >= canvas.height) {
      leftPaddleY = canvas.height - paddlesHeight;
    }
    if (leftPaddleY + centerOfPaddle < ballY - safeOffset) {
      leftPaddleY += aiSpeed;
    } else if (leftPaddleY + centerOfPaddle > ballY + safeOffset) {
      leftPaddleY -= aiSpeed;
    }
  }
}

const drawElementsOnCanvas = () => {
  drawRectangle({
    'leftX': 0,
    'topY': 0,
    'width': canvas.width,
    'height': canvas.height,
    'color': 'black'
  });

  drawRectangle({
    'leftX': leftPaddleX,
    'topY': leftPaddleY,
    'width': paddlesWidth,
    'height': paddlesHeight,
    'color': '#26F008'
  });
  drawRectangle({
    'leftX': rightPaddleX,
    'topY': rightPaddleY,
    'width': paddlesWidth,
    'height': paddlesHeight,
    'color': '#F02106'
  });
  drawText({
    'text': playerOneScore,
    'textX': 100,
    'textY': 100,
    'font': '104px Helvetica',
    'color': '#26F008'
  });
  drawText({
    'text': playerTwoScore,
    'textX': canvas.width - 150,
    'textY': 100,
    'font': '104px Helvetica',
    'color': '#F02106'
  });
  if (endGame) {
    drawText({
      'text': `${winningPlayer === humanPlayer ? 'You' : 'Computer'} won!`,
      'textX': canvas.width / 2,
      'textY': canvas.height / 3,
      'font': '24px Helvetica',
      'color': 'white',
      'center': true
    });
    drawRectBorders({
      'leftX': canvas.width / 2 - 75,
      'topY': canvas.height / 2,
      'width': 150,
      'height': 50,
      'color': '#FFF',
      'shadowColor': '#DDD',
      'shadowBlur': 10,
      'shadowOffsetX': 0,
      'shadowOffsetY': 0
    });
    drawText({
      'text': 'Restart',
      'textX': canvas.width / 2,
      'textY': canvas.height / 2 + 30,
      'font': '24px Helvetica',
      'color': '#FFF',
      'center': true
    });

    return;
  }
  drawCircle({
    'circleX': ballX,
    'circleY': ballY,
    'radius': ballSize,
    'color': 'white'
  });

  drawNet();
}

const moveOnCanvas = () => {
  if (endGame) {
    return;
  }
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (compareLeftY() && compareLeftX()) {
    speedUp(ballSpeedChange, leftPaddleY);
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
  }

  if (compareRightY() && compareRightX()) {
    speedUp(ballSpeedChange, rightPaddleY);
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
  }

  aiMovement();

  if (ballX >= canvas.width - ballSize) {
    score('playerOne');
  }
  if (ballX <= 0) {
    score('playerTwo');
  }
  if (ballY >= canvas.height - ballSize) {
    ballSpeedY = -ballSpeedY;
    speedUp(Number((Math.random() * (0.3 - 0.1) + 0.1).toFixed(2)));

  return;
  }
  if (ballY <= 0 + ballSize) {
    ballSpeedY = -ballSpeedY;
    speedUp(Number((Math.random() * (0.3 - 0.1) + 0.1).toFixed(2)));
  }
}

const movePlayerPaddle = (event) => {
  if (humanPlayer === 'playerOne') {
    leftPaddleY = event.offsetY - centerOfPaddle;
    if (leftPaddleY <= 0) {
      leftPaddleY = 0;
    }
    if (leftPaddleY + paddlesHeight >= canvas.height) {
      leftPaddleY = canvas.height - paddlesHeight;
    }
  } else {
    rightPaddleY = event.offsetY - centerOfPaddle;
    if (rightPaddleY <= 0) {
      rightPaddleY = 0;
    }
    if (rightPaddleY + paddlesHeight >= canvas.height) {
      rightPaddleY = canvas.height - paddlesHeight;
    }
  }
}

const selectPlayer = (event) => {
  if (startGame) {
    if (event.offsetX > canvas.width / 2 - 150 && event.offsetX < canvas.width / 2 && event.offsetY > 100 && event.offsetY < 150) {
      humanPlayer = 'playerOne';
      colors.playerOne = '#FFF';
      colors.playerTwo = '#F02106';
      drawStartScreen();
    }
    if (event.offsetX > canvas.width / 2 + 40 && event.offsetX < canvas.width / 2 + 190 && event.offsetY > 100 && event.offsetY < 150) {
      humanPlayer = 'playerTwo';
      colors.playerOne = '#26F008';
      colors.playerTwo = '#FFF';
      drawStartScreen();
    }
  }
}

const selectLength = (event) => {
  if (startGame) {
    if (event.offsetX > canvas.width / 2 - 250 && event.offsetX < canvas.width / 2 - 150 && event.offsetY > 250 && event.offsetY < 300) {
      winningScore = 3;
      colors.qButton = '#FFF';
      colors.nButton = '#FDFF00';
      colors.lButton = '#FDFF00';
      drawStartScreen();
    }
    if (event.offsetX > canvas.width / 2 - 60 && event.offsetX < canvas.width / 2 + 90 && event.offsetY > 250 && event.offsetY < 300) {
      winningScore = 5;
      colors.qButton = '#FDFF00';
      colors.nButton = '#FFF';
      colors.lButton = '#FDFF00';
      drawStartScreen();
    }
    if (event.offsetX > canvas.width / 2 + 130 && event.offsetX < canvas.width / 2 + 280 && event.offsetY > 250 && event.offsetY < 300) {
      winningScore = 10;
      colors.qButton = '#FDFF00';
      colors.nButton = '#FDFF00';
      colors.lButton = '#FFF';
      drawStartScreen();
    }
  }
}

const selectDifficulty = (event) => {
  if (startGame) {
    if (event.offsetX > canvas.width / 2 - 250 && event.offsetX < canvas.width / 2 - 150 && event.offsetY > 400 && event.offsetY < 450) {
      aiSpeed = 9;
      colors.eButton = '#FFF';
      colors.mButton = '#FDFF00';
      colors.hButton = '#FDFF00';
      drawStartScreen();
    }
    if (event.offsetX > canvas.width / 2 - 60 && event.offsetX < canvas.width / 2 + 90 && event.offsetY > 400 && event.offsetY < 450) {
      aiSpeed = 12;
      colors.eButton = '#FDFF00';
      colors.mButton = '#FFF';
      colors.hButton = '#FDFF00';
      drawStartScreen();
    }
    if (event.offsetX > canvas.width / 2 + 130 && event.offsetX < canvas.width / 2 + 280 && event.offsetY > 400 && event.offsetY < 450) {
      aiSpeed = 15;
      colors.eButton = '#FDFF00';
      colors.mButton = '#FDFF00';
      colors.hButton = '#FFF';
      drawStartScreen();
    }
  }
}

const resetGame = (event) => {
  if (endGame) {
    if (event.offsetX > canvas.width / 2 - 75 && event.offsetX < canvas.width / 2 + 75 && event.offsetY > 150 && event.offsetY > 200) {
      playerOneScore = 0;
      playerTwoScore = 0;
      winningPlayer = null;
      startGame = true;
      endGame = false;
      ballSpeedX = initialBallSpeed;
      ballSpeedY = initialBallSpeed;
      clearInterval(intervalId);
      drawStartScreen();
    }
  }
}

const animateElements = () => {
  if (!startGame && !endGame) {
    moveOnCanvas();
    drawElementsOnCanvas();
  }
}

drawStartScreen();

canvas.addEventListener('mousedown', selectPlayer);
canvas.addEventListener('mousemove', movePlayerPaddle);
canvas.addEventListener('mousedown', selectLength);
canvas.addEventListener('mousedown', selectDifficulty);
canvas.addEventListener('mousedown', resetGame);

const game = () => {
  if (!startGame && !endGame) {
    drawElementsOnCanvas();
    intervalId = setInterval(animateElements, 1000 / frameRate);
  }
}

const gameStart = (event) => {
  if (startGame) {
    if (event.offsetX > canvas.width / 2 - 60 && event.offsetX < canvas.width / 2 + 90 && event.offsetY > 500 && event.offsetY < 550) {
      startGame = false;
      game();
    }
  }
}

canvas.addEventListener('mousedown', gameStart);
