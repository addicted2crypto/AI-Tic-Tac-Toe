import TicTacToe from './components/tic-tac-toe';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Play Tic-Tac-Toe You against AI or player 2</h1>
      <TicTacToe />
    </main>
  )
}

