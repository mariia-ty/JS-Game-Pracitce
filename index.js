class Game {
  constructor() {
    document.addEventListener("keydown", this.keyEvents.bind(this)); 
    this.a_dead = new Audio(
      "https://www.dropbox.com/s/r7o9las1ki6tr0u/fail.wav?dl=1"
    );
    this.a_eat = new Audio(
      "https://www.dropbox.com/s/qukhjmxog6h3we8/crunch.wav?dl=1"
    );
    this.a_start = new Audio(
      "https://www.dropbox.com/s/xff36yvnh2zsxzh/start.wav?dl=1"
    );
  }

  gameWindow() {
    this.winWidth = 500; 
    this.winHeight = 500; 
    createCanvas(this.winWidth, this.winHeight).parent("gameBox");
  }

  draw() {
    background("rgb(83, 71, 105)");
    stroke("rgba(83, 66, 87, 0.5)");

    this.snake();
    this.apple();
    this.scoreBoard();
    this.bestScore();
  }

  update() {
    this.frame = false;
    this.draw();
  }

  start() {
    this.positionX = 15;
    this.positionY = 10;
    this.appleX = this.appleY = 11;
    this.trail = [];
    this.tailSize = 5;
    this.speedX = this.speedY = 0;
    this.gridSize = 25; 
    this.tileCount = 20; 
    this.fps = 1000 / 18;
    this.timer = setInterval(this.update.bind(this), this.fps);
    this.score = 0;
  }

  reset() {
    clearInterval(this.timer);
    this.a_dead.play();
    this.start();
  }

  keyEvents(e) {
    if (e.keyCode === 37 && this.speedX !== 1) {
      this.a_start.play();
      this.speedX = -1;
      this.speedY = 0;
      this.frame = true;
    }

    if (e.keyCode === 39 && this.speedX !== -1) {
      this.a_start.play();
      this.speedX = 1;
      this.speedY = 0;
      this.frame = true;
    }

    if (e.keyCode === 40 && this.speedY !== -1) {
      this.a_start.play();
      this.speedX = 0;
      this.speedY = 1;
      this.frame = true;
    }

    if (e.keyCode === 38 && this.speedY !== 1) {
      this.a_start.play();
      this.speedX = 0;
      this.speedY = -1;
      this.frame = true;
    }
  }

  snake() {
    fill("rgba(216, 219, 23, 0.75)");
    this.trail.forEach((a) => {
      rect(
        a.positionX * this.gridSize,
        a.positionY * this.gridSize,
        this.gridSize - 2,
        this.gridSize - 2,
        20,
        20
      );
    });
    this.positionX += this.speedX;
    this.positionY += this.speedY;

    if (this.positionX < 0) {
      this.positionX = this.tileCount - 1;
    } else if (this.positionY < 0) {
      this.positionY = this.tileCount - 1;
    } else if (this.positionX > this.tileCount - 1) {
      this.positionX = 0;
    } else if (this.positionY > this.tileCount - 1) {
      this.positionY = 0;
    }

    this.trail.forEach((t) => {
      if (this.positionX === t.positionX && this.positionY === t.positionY) {
        this.reset();
      }
    });

    this.trail.push({ positionX: this.positionX, positionY: this.positionY });

    while (this.trail.length > this.tailSize) {
      this.trail.shift();
    }
  }

  apple() {
    fill("red");

    rect(
      this.appleX * this.gridSize,
      this.appleY * this.gridSize,
      this.gridSize - 5,
      this.gridSize - 5,
      5,
      5
    );

    if (this.appleX === this.positionX && this.appleY === this.positionY) {
      this.tailSize++;
      this.score++;
      this.appleX = Math.floor(Math.random() * this.tileCount);
      this.appleY = Math.floor(Math.random() * this.tileCount);
      this.trail.forEach((t) => {
        if (this.appleX === t.positionX && this.appleY == t.positionY) {
          this.apple();
        }
      });
      this.a_eat.play();
    }
  }

  scoreBoard() {
    textSize(15);
    noStroke();
    fill(26);
    text("SCORE", 10, 20);
    textSize(20);
    text(this.score, 32.5, 45);
  }

  bestScore() {
    textSize(15);
    text("BEST", 450, 20); 
    if (!localStorage.getItem("best")) {
      localStorage.setItem("best", 0);
    }
    textSize(20);
    text(localStorage.getItem("best"), 465, 45); 

    if (this.score > localStorage.getItem("best")) {
      this.best = this.score;
      localStorage.setItem("best", this.best);
    }
  }
}

const game = new Game();
window.onload = () => game.start();

function setup() {
  game.gameWindow();
}

function draw() {
  game.update();
}
