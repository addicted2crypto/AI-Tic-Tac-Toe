interface Board {
    [index: number]: 'X' | 'O' | null;
  }
  
  enum GameResult {
    XWins = -10,
    OWins = 10,
    Tie = 0,
  }
  //fix the return type of the function
  function calculateWinner(board: Board): GameResult | null {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (const combination of winningCombinations) {
      if (
        board[combination[0]] !== null &&
        board[combination[0]] === board[combination[1]] &&
        board[combination[1]] === board[combination[2]]
      ) {
        return board[combination[0]] === 'X' ? GameResult.XWins : GameResult.OWins;
      }
    }
  
    if (Object.values(board).every((cell) => cell !== null)) {
      return GameResult.Tie;
    }
  
    return null;
  }
  
  function isBoardFull(board: Board): boolean {
    return Object.values(board).every((cell) => cell !== null);
  }
  
  function minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean
  ): number | null {
    const winner = calculateWinner(board);
  
    if (winner === GameResult.XWins) {
      return -10 + depth;
    } else if (winner === GameResult.OWins) {
      return 10 - depth;
    } else if (winner === GameResult.Tie) {
      return 0;
    }
  
    if (isMaximizing) {
      let bestScore: number | null = null;
  
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          if (score !== null && (bestScore === null || score > bestScore)) {
            bestScore = score;
          }
        }
      }
  
      return bestScore;
    } else {
      let bestScore: number | null = null;
  
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score: number | null = minimax(board, depth + 1, true);
          board[i] = null;
          if (score !== null && (bestScore === null || score < bestScore)) {
            bestScore = score;
          }
        }
      }
  
      return bestScore;
    }
  }
  
  function makeMove(board: Board): number | null {
    let bestScore: number | null = null;
    let bestMove: number | null = null;
  
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score: number | null = minimax(board, 0, false);
        board[i] = null;
        if (score !== null && (bestScore === null || score > bestScore)) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
  
    return bestMove;
  }
  
  // Example 
  const initialBoard: Board = Array(9).fill(null);
  initialBoard[0] = 'X';
  initialBoard[1] = 'O';
  
  console.log(makeMove(initialBoard));
  