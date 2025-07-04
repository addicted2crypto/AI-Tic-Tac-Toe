"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Info, Trophy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Score {
  human: number
  ai: number
  draws: number
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState(5) 
  const [aiThinking, setAiThinking] = useState(false)
  const [currentmodel, setCurrentModel] = useState("codestral") //default model can be changed to whatever you want
  //add whatever models you want to use here add error handling for invalid models
  // const models = ["llama2", "llama3", "mistral", "gemini", "gpt-4o"]
  // localStorage.setItem("tictactoeModel", currentmodel) //save model to local storage
  useEffect(() => {
    const savedModel = localStorage.getItem("tictactoeModel")
    if (savedModel) {
      setCurrentModel(savedModel)
    }
  }, []);
  const [score, setScore] = useState<Score>(() => {
  
    // const savedScore = localStorage.getItem("tictactoeScore")
    return  { human: 0, ai: 0, draws: 0 }
  })

  
  useEffect(() => {
    localStorage.setItem("tictactoeScore", JSON.stringify(score))
  }, [score])

  
  useEffect(() => {
    const winner = calculateWinner(board)
    if (winner) {
      setWinner(winner)
      if (winner === "X") {
        setScore((prev) => ({ ...prev, human: prev.human + 1 }))
      } else if (winner === "O") {
        setScore((prev) => ({ ...prev, ai: prev.ai + 1 }))
      }
    } else if (!board.includes(null)) {
      setWinner("draw")
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }))
    }
  }, [board])

  
  useEffect(() => {
    if (!isXNext && !winner) {
      makeAIMove()
    }
  }, [isXNext, winner])

  
  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext || isLoading) 
      return

    const newBoard = [...board]
    newBoard[index] = "X"
    setBoard(newBoard)
    setIsXNext(false)
  }

  
   const makeAIMove = async () => {
    setIsLoading(true)
    setAiThinking(true)
    setError(null)

    try {
      console.log("Making AI move with difficulty level:", difficulty)
      console.log("Current board state:", board)
      const response = await fetch("https://ai.ainetguard.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi4:14b-q8_0",
          messages: [
            {
              role: "system",
              content: `You are playing tic-tac-toe. You are 'O'. The current board is: 
              ${formatBoardForAI(board)}
              
              Difficulty level: ${difficulty}/10 (where 1 is very easy and makes random/poor moves, and 10 is impossible to beat and makes perfect moves).
              
              The board positions are numbered 1-9 as follows:
              [1][2][3]
              [4][5][6]
              [7][8][9]
              
              Based on the current board state and difficulty level ${difficulty}, choose the best move (1-9) for 'O'.
              Return only the number of your chosen position (1-9).`,
            },
          ],
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const aiMoveText = data.message.content.trim()

      const aiMovePosition = Number.parseInt(aiMoveText.match(/\d+/)?.[0] || "-1")

      const aiMove = aiMovePosition - 1

      if (aiMove >= 0 && aiMove < 9 && !board[aiMove]) {
        const newBoard = [...board]
        newBoard[aiMove] = "O"
        setBoard(newBoard)
      } else {
        console.warn("AI returned an invalid move:", aiMovePosition)
        const newBoard = [...board]
        const emptySpots = board.map((spot, idx) => (spot === null ? idx : -1)).filter((idx) => idx !== -1)
        if (emptySpots.length > 0) {
          newBoard[emptySpots[0]] = "O"
          setBoard(newBoard)
        }
      }

      setIsXNext(true)
    } catch (err) {
      console.error("Error making AI move:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
      setAiThinking(false)
    }
  }

  //add format board for AI here
  const formatBoardForAI = (board: Array<string | null>) => {
    let result = ""
    for (let i = 0; i < 9; i += 3) {
      result += `[${board[i] || " "}][${board[i + 1] || " "}][${board[i + 2] || " "}]\n`
    }
    return result
  }

  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setError(null)
    setAiThinking(false)
  }

  
  const resetScore = () => {
    setScore({ human: 0, ai: 0, draws: 0 })
  }

  
  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return "Easy"
    if (level <= 4) return "Beginner"
    if (level <= 6) return "Medium"
    if (level <= 8) return "Hard"
    return "Impossible"
  }

  
  const renderSquare = (index: number) => {
    
    const displayValue = board[index] || (winner ? "" : (index + 1).toString())

    return (
      <Button
        variant="outline"
        className={`h-20 w-20 text-3xl font-bold ${
          board[index] === "X" ? "text-blue-600" : board[index] === "O" ? "text-red-600" : "text-gray-300"
        } ${!board[index] && !winner && isXNext ? "hover:bg-gray-100" : ""}`}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || !!winner || !isXNext || isLoading}
      >
        {displayValue}
      </Button>
    )
  }

  
  const getStatus = () => {
    if (winner === "X") return "You win!"
    if (winner === "O") return "AI wins!"
    if (winner === "draw") return "It's a draw!"
    if (aiThinking) return "AI is thinking... 🤖"
    return isXNext ? "Your turn (X)" : "AI's turn (O)"
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md mb-6">
        <CardHeader>
          <CardTitle className="text-center">{getStatus()}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">
                Difficulty: {difficulty} - {getDifficultyLabel(difficulty)}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Level 1: Very easy, makes random moves
                      <br />
                      Level 10: Impossible to beat, makes perfect moves
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              value={[difficulty]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setDifficulty(value[0])}
              disabled={isLoading || !isXNext || !!winner}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetGame} className="gap-2" disabled={isLoading}>
            <RefreshCw className="h-4 w-4" />
            New Game
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{score.human}</div>
              <div className="text-sm text-muted-foreground">Human</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{score.draws}</div>
              <div className="text-sm text-muted-foreground">Draws</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{score.ai}</div>
              <div className="text-sm text-muted-foreground">AI</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetScore} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Score
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


function calculateWinner(squares: Array<string | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

