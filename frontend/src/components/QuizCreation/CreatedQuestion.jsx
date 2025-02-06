import React from 'react'

function CreatedQuestion({question}) {
  return (
    <div>
      <p>{question.question}</p>
      <p>{question.descriptions[0]}</p>
    </div>
  )
}

export default CreatedQuestion