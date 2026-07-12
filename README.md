# Starry Pawn ✨♟️

A React-based survival puzzle game built on chess mechanics. The player must navigate a dynamically generated board, evade AI-controlled enemy pieces, and capture them to steal their movement patterns. 

Developed as a portfolio project to demonstrate state management, procedural generation, and algorithmic logic in a frontend environment.

## 🎯 Core Features

* **Dynamic Movement System:** Capturing an enemy piece grants its movement abilities (Trinket System). Managing these limited charges (max 3 per type) is key to survival.
* **Adversarial AI:** Enemy pieces actively evaluate the board state to calculate the optimal path to hunt the player.
* **Procedural Generation:** Levels are generated using a 16-character alphanumeric seed, ensuring infinite replayability and allowing players to share exact board states.
* **Metric Tracking & Export:** The game tracks performance (moves, captures) and automatically exports a timestamped `.txt` file containing the run's data and seed upon Game Over.
* **Responsive UI:** Custom CSS Grid/Flexbox implementation for the game board and HUD.

## 💻 Tech Stack

* **Frontend:** React.js (Functional Components, Hooks)
* **Styling:** CSS3 
* **Logic:** Vanilla JavaScript (ES6+)

## 🚀 How to Run Locally

1. Clone the repository.
2. Install dependencies:
    npm install
3. Start the development server:
    npm run dev