# 🛸 UFO Pawn 🛸

A React-based survival puzzle game built on chess mechanics. 
The player navigates a dynamically generated positions, evade enemy pieces, 
and capture them to steal their movement patterns. 

Developed to demonstrate state management, procedural generation 
and algorithmic logic in a frontend environment.

**[🎮 Play the game live in your browser here!](https://wisaimtiac.github.io/ufo-pawn)**

## Core Features

* **Dynamic Movement System:** Capturing an enemy piece grants its movement abilities (Trinket System). Managing these limited charges (max 3 per type) is key to survival.
* **Enemy Pieces:** Actively evaluate the board state to calculate the optimal path to hunt the player.
* **Procedural Generation:** Levels are generated using a 16-character alphanumeric seed, ensuring replayability and allowing players to save/share exact runs.
* **Export:** The game tracks moves & captures and automatically exports a timestamped `.txt` file containing the run's data and seed upon Game Over.
* **Responsive UI:** Custom CSS Grid/Flexbox implementation for the game board and HUD.

## Built with

* **Frontend:** React.js (Functional Components, Hooks)
* **Styling:** CSS3 
* **Logic:** Vanilla JavaScript (ES6+)

## How to run the game locally

1. Clone the repository.
2. Install dependencies:
    npm install
3. Start the development server:
    npm run dev
4. Open browser and go to http://localhost:5173