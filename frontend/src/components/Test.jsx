import React, { useState } from 'react'
import Confetti from "react-confetti";

function Test() {

  const [fire, setFire] = useState(false)

  return (
    <div>
      <div onClick={() => setFire(true)}>Test</div>
      {
      fire && <Confetti /> 
    }
    </div>
  )
}

export default Test