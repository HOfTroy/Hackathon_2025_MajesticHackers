// =============================
// GAME CONFIGURATION
// =============================
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.style.margin = "0";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.backgroundColor = "black";

canvas.width = 600;
canvas.height = 600;
document.body.appendChild(canvas);

// =============================
// LOAD IMAGES
// =============================
const bgImg = new Image();
bgImg.src = "./assets/images/ocean.jpg";

const fishRight = new Image();
fishRight.src = "./assets/sprites/fish_right.png";

const fishLeft = new Image();
fishLeft.src = "./assets/sprites/fish_left.png";

const trashImages = [];
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  img.src = `./assets/sprites/trash${i}.png`;
  trashImages.push(img);
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
  dy: 0,
  facing: "right",
};

// =============================
// TRASH OBJECTS
// =============================
let trashes = [];
let score = 0;

// =============================
// CONTROLS
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
  if (e.key === "ArrowUp" || e.key === "w") {
    player.dy = -player.speed;
  }
  if (e.key === "ArrowDown" || e.key === "s") {
    player.dy = player.speed;
  }
});

document.addEventListener("keyup", (e) => {
  if (
    ["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)
  ) {
    player.dx = 0;
  }
  if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
    player.dy = 0;
  }
});

// =============================
// UPDATE PLAYER POSITION
// =============================
function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Boundary check
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height)
    player.y = canvas.height - player.height;
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
      trashes.splice(i, 1);
      score++;
    }
  }
}

// =============================
// DRAW EVERYTHING
// =============================
function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Draw fish
  const fishImg = player.facing === "right" ? fishRight : fishLeft;
  ctx.drawImage(fishImg, player.x, player.y, player.width, player.height);

  // Draw trash
  trashes.forEach((t) => {
    t.y += t.speed;
    ctx.drawImage(t.img, t.x, t.y, t.width, t.height);
  });

  // Remove off-screen trash
  trashes = trashes.filter((t) => t.y < canvas.height + 50);

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);
}

// =============================
// MAIN GAME LOOP
// =============================
function update() {
  movePlayer();
  checkCollisions();
  draw();
  requestAnimationFrame(update);
}

update();
