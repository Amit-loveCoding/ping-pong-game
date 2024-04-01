var ball = document.getElementById("ball");
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");
var bgMusic = document.getElementById("bgMusic"); // Get the audio element
var body = document.body; // Get the body element

body.style.backgroundImage = "url('asset/image/ping-pong.jpg')"; // Set the background image

const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score,
  maxScore,
  movement,
  ballSpeedx = 2,
  ballSpeedy = 2;

let gameOn = false;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

(function () {
  let rod = localStorage.getItem(storeName);
  maxScore = parseInt(localStorage.getItem(storeScore)) || 0; // Convert to number
  alert(rod + " has a maximum score of " + maxScore * 100);
  resetBoard(rod);
})();

function resetBoard(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";

  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

  score = 0;
  gameOn = false;
  clearInterval(movement); // Clear interval on reset
}

function storeWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(storeName, rod);
    localStorage.setItem(storeScore, maxScore); // Use different key for maxScore
  }
  clearInterval(movement);
  resetBoard(rod);
  alert(
    rod + " wins with a score of " + score * 100 + ". Max Score is " + maxScore
  );
  bgMusic.pause(); // Pause the music when the game ends
}

window.addEventListener("keydown", function (event) {
  let rodSpeed = 20;

  let rodRect = rod1.getBoundingClientRect();

  if (
    event.code === "KeyD" &&
    rodRect.x + rodRect.width < this.window.innerWidth
  ) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  if (event.code === "Enter") {
    if (!gameOn) {
      gameOn = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;

      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      bgMusic.play(); // Start playing the music when the game starts
      movement = setInterval(function () {
        ballX += ballSpeedx;
        ballY += ballSpeedy;

        let rod1X = rod1.getBoundingClientRect().x;
        let rod2X = rod2.getBoundingClientRect().x;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedx = -1 * ballSpeedx; //Reverse the direction
        }

        let ballPos = ballX + ballDia / 2;

        if (ballY <= rod1Height) {
          ballSpeedy = -1 * ballSpeedy;
          score++;

          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            storeWin(rod2Name, score);
          }
        } else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedy = -1 * ballSpeedy;
          score++;
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            storeWin(rod2Name, score);
          }
        }
      }, 10);
    }
  }
});
