document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.querySelector(".menu-container");

  // Create "Start Game" button
  const startButton = document.createElement("button");
  startButton.textContent = "Start Game 🎮";
  startButton.style.fontSize = "24px";
  startButton.style.padding = "10px 20px";
  startButton.style.borderRadius = "10px";
  startButton.style.border = "none";
  startButton.style.cursor = "pointer";
  startButton.style.backgroundColor = "purple";
  startButton.style.color = "white";
  startButton.style.marginTop = "20px";
  startButton.addEventListener("click", () => {
    window.location.href = "game.html";
  });

  menuContainer.appendChild(startButton);

  // Animate fish gently swimming
  const fish = document.querySelector(".fish");
  let direction = 1;
  let pos = 0;

  setInterval(() => {
    pos += direction * 2;
    fish.style.left = `${500 + pos}px`;
    if (pos > 50 || pos < -50) direction *= -1;
  }, 100);
});
