import { useState } from 'react'

const DisplayHeader = ({ text }) => {
  return (
    <h1>{text}</h1>
  )
}

const DisplayContent = ({ anecdotes, points, index }) => {
  return (
    <div>
      <div>{anecdotes[index]}</div>
      <div>has {points[index]} votes</div>
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(8).fill(0))
  const [highest, setHighest] = useState(0)

  const getRandomNum = () => Math.floor(Math.random() * (7 - 0 + 1)) + 0

  const updatePoints = (i) => {
    const copy = [...points]
    copy[i] += 1
    setHighest(copy.indexOf(Math.max(...copy)))
    setPoints(copy)
  }

  return (
    <div>
      <DisplayHeader text="Anecdote of the day" />
      <DisplayContent anecdotes={anecdotes} points={points} index={selected} />
      <button onClick={() => { updatePoints(selected) }} >vote</button>
      <button onClick={() => { setSelected(getRandomNum()) }} >next anecdote</button>
      <DisplayHeader text="Anecdote with most votes" />
      <DisplayContent anecdotes={anecdotes} points={points} index={highest} />
    </div>
  )
}

export default App