import { useState } from 'react'

const DisplayTitle = ({ text }) => <h1>{text}</h1>


const DisplayContent = ({ text, value }) => <p>{text} {value}</p>


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <DisplayTitle text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <DisplayTitle text="statistics" />
      <DisplayContent text="good" value={good} />
      <DisplayContent text="neutral" value={neutral} />
      <DisplayContent text="bad" value={bad} />
    </div>
  )
}

export default App