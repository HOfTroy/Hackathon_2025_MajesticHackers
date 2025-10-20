// =============================
// GAME CONFIGURATION
// =============================
window.onload = function () { // ✅ ensure everything runs only after page + images load
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.style.margin = "0";
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column"; // so button sits below canvas
  document.body.style.justifyContent = "center";
  document.body.style.alignItems = "center";
  document.body.style.backgroundColor = "black";

  canvas.width = 600;
  canvas.height = 600;
  document.body.appendChild(canvas);

  // =============================
  // RESTART BUTTON
  // =============================
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart Game";
  restartBtn.style.marginTop = "20px";
  restartBtn.style.padding = "10px 20px";
  restartBtn.style.fontSize = "18px";
  restartBtn.style.borderRadius = "10px";
  restartBtn.style.border = "none";
  restartBtn.style.cursor = "pointer";
  restartBtn.style.backgroundColor = "#00bfff";
  restartBtn.style.color = "white";
  restartBtn.style.display = "none"; // hidden at start
  document.body.appendChild(restartBtn);

  // =============================
  // LOAD IMAGES
  // =============================
  const bgImg = new Image();
  bgImg.src = "assets/images/ocean.jpg";

  const fishRight = new Image();
  fishRight.src = "assets/sprites/fish_right.png";

  const fishLeft = new Image();
  fishLeft.src = "assets/sprites/fish_left.png";

  const trashImages = [];
  for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `assets/sprites/trash${i}.png`;
    trashImages.push(img); // ✅ push added images
  }

  // =============================
  // PLAYER (FISH)
  // =============================
  const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 60,
    height: 60,
    speed: 5,
    dx: 0,
    facing: "right",
  };

  // =============================
  // TRASH OBJECTS
  // =============================
  let trashes = [];
  let elapsedTime = 0;
  let gameOver = false;

  // =============================
  // TIMER (count up)
  // =============================
  let timer = setInterval(() => {
    if (!gameOver) elapsedTime++;
  }, 1000);

  // =============================
  // CONTROLS (left & right only)
  // =============================
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
      player.dx = -player.speed;
      player.facing = "left";
    }
    if (e.key === "ArrowRight" || e.key === "d") {
      player.dx = player.speed;
      player.facing = "right";
    }
  });

  document.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
      player.dx = 0;
    }
  });

  // =============================
  // MOVE PLAYER
  // =============================
  function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width)
      player.x = canvas.width - player.width;
  }

  // =============================
  // SPAWN TRASH
  // =============================
  function spawnTrash() {
    const img = trashImages[Math.floor(Math.random() * trashImages.length)];
    const x = Math.random() * (canvas.width - 40);
    const speed = 2 + Math.random() * 2;
    trashes.push({ x, y: -50, width: 40, height: 40, speed, img });
  }

  setInterval(spawnTrash, 1500);

  // =============================
  // CHECK COLLISIONS
  // =============================
  function checkCollisions() {
    for (let i = trashes.length - 1; i >= 0; i--) {
      const t = trashes[i];
      if (
        player.x < t.x + t.width &&
        player.x + player.width > t.x &&
        player.y < t.y + t.height &&
        player.y + player.height > t.y
      ) {
        gameOver = true;
        clearInterval(timer);
        restartBtn.style.display = "block";
        break;
      }
    }
  }

  // =============================
  // DRAW EVERYTHING
  // =============================
  function draw() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    const fishImg = player.facing === "right" ? fishRight : fishLeft;
    ctx.drawImage(fishImg, player.x, player.y, player.width, player.height);

    trashes.forEach((t) => {
      t.y += t.speed;
      ctx.drawImage(t.img, t.x, t.y, t.width, t.height);
    });

    trashes = trashes.filter((t) => t.y < canvas.height + 50);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Time: ${elapsedTime}s`, 20, 30);

    if (gameOver) {
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  
  // ✅ First line: "GAME OVER!"
  ctx.fillText("GAME OVER!", canvas.width / 2 - 150, canvas.height / 2 - 80);

  // ✅ Second line: "You have survived for X seconds"
  ctx.font = "28px Arial"; // smaller font for message
  ctx.fillText(`You have survived for ${elapsedTime} seconds`, canvas.width / 2 - 180, canvas.height / 2 - 30);
}
}

  // =============================
  // MAIN LOOP
  // =============================
  function update() {
    if (!gameOver) {
      movePlayer();
      checkCollisions();
    }
    draw();
    requestAnimationFrame(update);
  }

  // =============================
  // RESTART BUTTON FUNCTIONALITY
  // =============================
  restartBtn.addEventListener("click", () => {
    trashes = [];
    elapsedTime = 0;
    gameOver = false;
    player.x = canvas.width / 2;
    restartBtn.style.display = "none";
    clearInterval(timer);
    timer = setInterval(() => {
      if (!gameOver) elapsedTime++;
    }, 1000);
  });

  // ✅ Start the game only after background loads
  bgImg.onload = () => update();
};
