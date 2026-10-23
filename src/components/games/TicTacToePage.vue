<template>
  <div class="container py-4" id="game-container">
    <h1 class="text-center mb-4">Tic Tac Toe</h1>

    <!-- Config menu -->
    <div v-if="gameStarted && !playersChosen" class="text-center mb-4">
      <h3>Game Setup</h3>
      <div class="row justify-content-center">
        <div class="form-group mx-2 mb-3">
          <label class="d-block mb-1">Players</label>
          <select :value="configNumPlayers" @change="onConfigChange('configNumPlayers', $event)" class="form-control">
            <option :value="2">2 Players</option>
            <option :value="3">3 Players</option>
            <option :value="4">4 Players</option>
          </select>
        </div>
        <div class="form-group mx-2 mb-3">
          <label class="d-block mb-1">Grid Size</label>
          <select :value="configBoardSize" @change="onConfigChange('configBoardSize', $event)" class="form-control">
            <option v-for="size in gridSizeOptions" :key="size" :value="size" :disabled="size <= configNumPlayers">
              {{ size }}&times;{{ size }}
            </option>
          </select>
        </div>
        <div class="form-group mx-2 mb-3">
          <label class="d-block mb-1">Win With</label>
          <select :value="configWinLength" @change="onConfigChange('configWinLength', $event)" class="form-control">
            <option v-for="len in winLengthOptions" :key="len" :value="len" :disabled="len > configBoardSize">
              {{ len }} in a row
            </option>
          </select>
        </div>
        <div class="form-group mx-2 mb-3">
          <label class="d-block mb-1">Gravity</label>
          <select :value="configGravity" @change="onConfigChange('configGravity', $event)" class="form-control">
            <option :value="'none'">None</option>
            <option :value="'fall'">Fall 1 Cell Per Turn</option>
            <option :value="'instant'">Instant Gravity</option>
          </select>
        </div>
      </div>
      <button class="btn btn-success btn-lg" @click="applyConfig">Start Game</button>
      <small class="d-block text-muted mt-2">
        Grid must be larger than the number of players, and a winning line must fit inside the grid.
      </small>
    </div>

    <!-- Game board -->
    <div v-if="gameStarted && playersChosen" class="text-center mb-3">
      <h3 v-if="!gameOver" class="mb-2">Turn: <span :style="{ color: currentPlayerColor }">{{ currentPlayerSymbol }}</span></h3>
      <h3 v-else class="mb-2">
        <span :style="{ color: winnerColor }">{{ winnerSymbol }}</span> Wins!
      </h3>
      <div class="board" :class="{ 'board-gameover': gameOver }" :style="boardStyle">
        <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell"
          :class="{
            'cell-filled': cell !== '',
            'cell-winner': winnerCells.includes(index),
            'cell-blink': fallBlinkCells.includes(index),
            'cell-fade': fallFadeCells.includes(index)
          }"
          @click="makeMove(index)"
        >
          <span class="piece" :class="pieceClass(cell)">{{ cell }}</span>
        </div>
      </div>
      <div class="player-legend mb-3">
        <span
          v-for="(symbol, index) in activeSymbols"
          :key="symbol"
          class="legend-item"
          :style="{ color: playerColor(index) }"
        >{{ symbol }}</span>
      </div>
      <button v-if="!gameOver" class="btn btn-secondary mx-2" @click="undoMove" :disabled="moves.length === 0">
        <i class="fas fa-undo"></i> Undo
      </button>
      <button class="btn btn-outline-primary mx-2" @click="resetGame">New Game</button>
    </div>

    <!-- Landing -->
    <div v-if="!gameStarted" class="text-center">
      <p class="lead mb-4">Connect your pieces in a row to win!</p>
      <button class="btn btn-primary btn-lg mx-2" @click="showInstructions = true">How to Play</button>
      <button class="btn btn-primary btn-lg mx-2" @click="showPlayerSelection">Start Game</button>
    </div>

    <!-- Instructions -->
    <div v-if="showInstructions" class="modal-backdrop d-flex align-items-center justify-content-center">
      <div class="modal-content bg-dark text-light" style="max-width: 500px; width: 90%;">
        <div class="modal-header">
          <h5 class="modal-title">How to Play</h5>
          <button type="button" class="close text-light" @click="showInstructions = false">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p><strong>Tic Tac Toe</strong> is played on a configurable grid (3&times;3 up to 7&times;7).</p>
          <p>- Players take turns placing their pieces (X, O, Z and S)</p>
          <p>- First player to connect the required number of pieces in a row (horizontally, vertically, or diagonally) wins!</p>
          <p class="mt-3"><strong>Controls:</strong></p>
          <ul>
            <li>Click any empty cell to place your piece</li>
            <li>Undo button to reverse moves back to the start of the game</li>
            <li>Start a new game at any time</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showInstructions = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const PLAYER_SYMBOLS = ["X", "O", "Z", "S"];
const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f0b90b"];

export default {
  name: "TicTacToePage",
  data() {
    return {
      boardSize: 4,
      winLength: 3,
      numPlayers: 2,

      gameStarted: false,
      gameOver: false,
      playersChosen: false,

      configNumPlayers: 2,
      configBoardSize: 4,
      configWinLength: 3,
      configGravity: "none",
      gridSizeOptions: [3, 4, 5, 6, 7],
      winLengthOptions: [3, 4, 5],

      gravityMode: "none",
      fallBlinkCells: [],
      fallFadeCells: [],
      fallPiecePlayer: null,
      fallPieceFrom: null,
      fallPieceTo: null,
      isFalling: false,

      board: [],
      moves: [],
      currentPlayerIndex: 0,

      winnerSymbol: "",
      winnerLine: [],
      winnerCells: [],

      showInstructions: false
    };
  },
  computed: {
    currentPlayerSymbol() {
      return PLAYER_SYMBOLS[this.currentPlayerIndex];
    },
    currentPlayerColor() {
      return PLAYER_COLORS[this.currentPlayerIndex];
    },
    winnerColor() {
      const idx = this.winnerIndex;
      return idx === -1 ? "" : PLAYER_COLORS[idx];
    },
    winnerIndex() {
      return PLAYER_SYMBOLS.indexOf(this.winnerSymbol);
    },
    activeSymbols() {
      return PLAYER_SYMBOLS.slice(0, this.numPlayers);
    },
    boardStyle() {
      const size = this.boardSize;
      const cellSize = Math.max(34, Math.min(80, Math.floor(440 / size)));
      return {
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        width: `${cellSize * size}px`,
        height: `${cellSize * size}px`,
        "--cell-size": `${cellSize}px`
      };
    },
  },
  mounted() {
    this.initializeBoard();
    this.validateConfig();
  },
  methods: {
    currentSymbol(index) {
      return PLAYER_SYMBOLS[index];
    },
    pieceClass(cell) {
      const idx = PLAYER_SYMBOLS.indexOf(cell);
      if (idx === -1) return "";
      const map = {
        0: "piece-red",
        1: "piece-blue",
        2: "piece-green",
        3: "piece-gold"
      };
      return map[idx];
    },
    playerColor(index) {
      return PLAYER_COLORS[index];
    },
    initializeBoard() {
      this.board = Array(this.boardSize * this.boardSize).fill("");
      this.moves = [];
      this.currentPlayerIndex = 0;
      this.gameStarted = false;
      this.gameOver = false;
      this.playersChosen = false;
      this.winnerSymbol = "";
      this.winnerLine = [];
      this.winnerCells = [];
    },
    resetBoardState() {
      this.board = Array(this.boardSize * this.boardSize).fill("");
      this.moves = [];
      this.currentPlayerIndex = 0;
      this.winnerSymbol = "";
      this.winnerLine = [];
      this.winnerCells = [];
    },
    startGame() {
      this.numPlayers = this.configNumPlayers;
      this.boardSize = this.configBoardSize;
      this.winLength = this.configWinLength;
      this.gravityMode = this.configGravity;
      this.fallBlinkCells = [];
      this.fallFadeCells = [];
      this.isFalling = false;
      this.resetBoardState();
      this.gameStarted = true;
      this.gameOver = false;
      this.playersChosen = true;
    },
    showPlayerSelection() {
      this.resetBoardState();
      this.fallBlinkCells = [];
      this.fallFadeCells = [];
      this.isFalling = false;
      this.gameStarted = true;
      this.gameOver = false;
      this.playersChosen = false;
    },
    onConfigChange(key, event) {
      const value = event.target.value;
      // configGravity uses string values, others use numbers
      if (key === "configGravity") {
        this[key] = value;
      } else {
        this[key] = Number(value);
      }
      this.validateConfig();
    },
    validateConfig() {
      // Rule 1: grid must be larger than the number of players
      if (this.configBoardSize <= this.configNumPlayers) {
        this.configBoardSize = this.configNumPlayers + 1;
      }
      // Rule 2: win length must not exceed the grid size
      if (this.configWinLength > this.configBoardSize) {
        this.configWinLength = this.configBoardSize;
      }
      // Ensure win length is at least 3
      if (this.configWinLength < 3) {
        this.configWinLength = 3;
      }
    },
    applyConfig() {
      this.startGame();
    },
    makeMove(position) {
      if (!this.gameStarted || this.gameOver) return;
      if (this.isFalling) return;
      if (this.board[position] !== "") return;

      const currentPlayer = this.currentPlayerIndex;
      const size = this.boardSize;

      let finalPosition = position;
      let fallFrom = null;

      if (this.gravityMode === "instant") {
        // Find the lowest empty cell in this column
        const col = position % size;
        finalPosition = -1;
        // Start from bottom row, go up
        for (let row = size - 1; row >= 0; row--) {
          const idx = row * size + col;
          if (this.board[idx] === "") {
            finalPosition = idx;
            break;
          }
        }
        if (finalPosition === -1) return; // Column is full
        if (finalPosition !== position) {
          fallFrom = position;
        }
      }

      if (this.gravityMode === "instant" && fallFrom !== null) {
        // Place piece at click position first for animation
        this.board[fallFrom] = this.currentSymbol(currentPlayer);
        this.moves.push({ position: finalPosition, player: currentPlayer });

        // Animate the piece falling from fallFrom to finalPosition
        this.isFalling = true;
        this.fallFadeCells = [fallFrom];
        this.fallBlinkCells = [];

        setTimeout(() => {
          // Piece has fallen: clear old position, set new position
          this.board[fallFrom] = "";
          this.board[finalPosition] = this.currentSymbol(currentPlayer);
          this.moves[this.moves.length - 1].position = finalPosition;

          this.fallFadeCells = [];

          // Blink cells above the landed piece (same column, above finalPosition)
          const col = finalPosition % size;
          const row = Math.floor(finalPosition / size);
          const blinkCells = [];
          for (let r = 0; r < row; r++) {
            blinkCells.push(r * size + col);
          }
          this.fallBlinkCells = blinkCells;

          // After blink animation, check winner and switch player
          setTimeout(() => {
            this.fallBlinkCells = [];
            this.isFalling = false;
            if (this.checkWinner()) {
              this.gameOver = true;
              return;
            }
            if (this.board.every(cell => cell !== "")) {
              this.gameOver = true;
              return;
            }
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.numPlayers;
          }, 600);
        }, 200);
      } else {
        this.board[finalPosition] = this.currentSymbol(currentPlayer);
        this.moves.push({ position: finalPosition, player: currentPlayer });
        this.handlePlacedPiece();
      }
    },
    handlePlacedPiece() {
      if (this.checkWinner()) {
        this.gameOver = true;
        return;
      }

      if (this.board.every(cell => cell !== "")) {
        this.gameOver = true;
        return;
      }

      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.numPlayers;

      if (this.gravityMode === "fall" && this.currentPlayerIndex === 0) {
        // After all players have taken a turn, shift everything down by 1 row
        this.applyFallGravity();
      }
    },
    undoMove() {
      if (this.moves.length === 0) return;

      this.moves.pop();

      this.board = Array(this.boardSize * this.boardSize).fill("");
      for (const move of this.moves) {
        this.board[move.position] = this.currentSymbol(move.player);
      }

      if (this.moves.length > 0) {
        this.currentPlayerIndex = (this.moves[this.moves.length - 1].player + 1) % this.numPlayers;
      } else {
        this.currentPlayerIndex = 0;
      }

      this.gameOver = false;
      this.winnerSymbol = "";
      this.winnerLine = [];
      this.winnerCells = [];
      this.isFalling = false;
      this.fallFadeCells = [];
      this.fallBlinkCells = [];
    },
    applyFallGravity() {
      const size = this.boardSize;
      const blinkCells = [];
      const fadeCells = [];

      // Shift all pieces down by 1 row
      // Process from bottom to top
      for (let row = size - 1; row >= 0; row--) {
        for (let col = 0; col < size; col++) {
          const idx = row * size + col;
          const belowIdx = (row + 1) * size + col;

          if (row === size - 1) {
            // Bottom row - piece falls out
            if (this.board[idx] !== "") {
              blinkCells.push(idx);
            }
            this.board[idx] = "";
          } else {
            // Move piece from current cell to below if below is empty
            if (this.board[idx] !== "" && this.board[belowIdx] === "") {
              this.board[belowIdx] = this.board[idx];
              this.board[idx] = "";
              fadeCells.push(idx);
            }
          }
        }
      }

      // Start the fall animation
      this.isFalling = true;
      this.fallFadeCells = fadeCells;
      this.fallBlinkCells = blinkCells;

      setTimeout(() => {
        // Board was already shifted in the first pass
        // Just clear the fade animation and keep isFalling until blink completes
        this.fallFadeCells = [];

        if (blinkCells.length > 0) {
          this.fallBlinkCells = blinkCells;
          setTimeout(() => {
            this.fallBlinkCells = [];
            this.isFalling = false;
          }, 600);
        } else {
          this.isFalling = false;
        }
      }, 200);
    },
    checkWinner() {
      const lines = this.getWinningLines();

      for (const line of lines) {
        const cells = line.map(i => this.board[i]);

        for (let start = 0; start <= cells.length - this.winLength; start++) {
          const slice = cells.slice(start, start + this.winLength);
          const first = slice[0];

          if (first !== "" && slice.every(cell => cell === first)) {
            this.winnerSymbol = first;
            this.winnerLine = line.slice(start, start + this.winLength);
            this.winnerCells = line.slice(start, start + this.winLength);
            return true;
          }
        }
      }

      return false;
    },
    getWinningLines() {
      const lines = [];
      const size = this.boardSize;
      const len = this.winLength;

      // Horizontal lines
      for (let row = 0; row < size; row++) {
        for (let col = 0; col <= size - len; col++) {
          const line = [];
          for (let i = 0; i < len; i++) {
            line.push(row * size + (col + i));
          }
          lines.push(line);
        }
      }

      // Vertical lines
      for (let col = 0; col < size; col++) {
        for (let row = 0; row <= size - len; row++) {
          const line = [];
          for (let i = 0; i < len; i++) {
            line.push((row + i) * size + col);
          }
          lines.push(line);
        }
      }

      // Diagonal lines (top-left to bottom-right)
      for (let row = 0; row <= size - len; row++) {
        for (let col = 0; col <= size - len; col++) {
          const line = [];
          for (let i = 0; i < len; i++) {
            line.push((row + i) * size + (col + i));
          }
          lines.push(line);
        }
      }

      // Diagonal lines (top-right to bottom-left)
      for (let row = 0; row <= size - len; row++) {
        for (let col = len - 1; col < size; col++) {
          const line = [];
          for (let i = 0; i < len; i++) {
            line.push((row + i) * size + (col - i));
          }
          lines.push(line);
        }
      }

      return lines;
    },
    resetGame() {
      this.showInstructions = false;
      this.gameStarted = false;
      this.playersChosen = false;
      this.initializeBoard();
    }
  }
};
</script>

<style scoped>
#game-container {
  min-height: 500px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.board {
  display: grid;
  gap: 2px;
  margin: 20px auto;
  background-color: #343a40;
  padding: 2px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.cell {
  width: var(--cell-size, 60px);
  height: var(--cell-size, 60px);
  background-color: #495057;
  border: 2px solid #6c757d;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: -2px;
  font-size: calc(var(--cell-size, 60px) * 0.45);
}

.cell:hover {
  background-color: #6c757d;
  transform: scale(1.05);
  border-color: #f0b90b;
}

.board-gameover .cell {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  border-color: #6c757d;
}

.board-gameover .cell:hover {
  background-color: #6c757d;
  transform: none;
  border-color: #6c757d;
}

.cell-filled {
  cursor: default;
}

.cell-winner {
  animation: blink 0.8s infinite;
}

.cell-blink {
  animation: blinkYellow 0.6s ease-in-out;
}

@keyframes blinkYellow {
  0%,
  100% {
    background-color: #f0b90b;
  }
  50% {
    background-color: #6c757d;
  }
}

.cell-fade .piece {
  opacity: 0.3;
  transition: opacity 0.2s ease;
}
@keyframes blink {
  0%,
  100% {
    background-color: #f0b90b;
  }
  50% {
    background-color: #6c757d;
  }
}

.piece {
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.piece-red {
  color: #e74c3c;
}

.piece-blue {
  color: #3498db;
}

.piece-green {
  color: #2ecc71;
}

.piece-gold {
  color: #f0b90b;
}

.player-legend {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.legend-item {
  font-size: 1.1rem;
  font-weight: bold;
}

.legend-item::before {
  content: "●";
  margin-right: 0.3rem;
}
</style>