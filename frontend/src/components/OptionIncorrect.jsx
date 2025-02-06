import React, { useContext, useState } from 'react'
import { QuizContext } from '../context/quiz'
import Latex from 'react-latex';

function OptionIncorrect({option, index, latex, styles}) {

  const [color, setColor] = useState("p-3 flex items-center border-zinc-200 border-[1.7px] w-full my-5 rounded-[0.5rem] text-zinc-500 transition-all")

  const [quizState, dispatch] = useContext(QuizContext)
  const optionsLetters = ["a", "b", "c", "d", "e"]

  return (
    <div className={color + ' ' + styles}>
      <div className={'flex items-center justify-center px-3 h-10 rounded-[0.4rem]'}>
        <p className='font-semibold text-[1.1rem] '>{optionsLetters[index]}</p>
      </div>
      <div className=''>
        {latex ? (<Latex>{option}</Latex>) : <p>{option}</p>}
      </div>
    </div>
  )
}

export default OptionIncorrect