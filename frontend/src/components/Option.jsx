import React, { useContext, useState } from 'react'
import { QuizContext } from '../context/quiz'
import Latex from 'react-latex';

function Option({option, index, selectOption, currentQuestion, styles, keyPress}) {

  const [color, setColor] = useState("p-3 cursor-pointer flex items-center border-zinc-200 border-[1.7px] w-full my-5 rounded-[0.5rem] text-zinc-500 hover:border-zinc-800 hover:text-zinc-800 transition-all")
  const [currentSelection, setCurrentSelection] = useState({
    option: "",
    answer: "",
  });

  const [quizState, dispatch] = useContext(QuizContext)
  const optionsLetters = ["a", "b", "c", "d", "e"]

  const onClicked = () => {
    setCurrentSelection((current) => {
      return {
        option: option,
        answer: currentQuestion.answer
      }
    })

    dispatch({type: "UPDATE_ANSWER", payload: currentSelection})

    selectOption()
  }

  return (
    <div onClick={() => onClicked()} className={color + ' ' + styles}>
      <div className={'flex items-center justify-center px-3 h-10 rounded-[0.4rem]'}>
        <p className='font-semibold text-[1.1rem] '>{optionsLetters[index]}</p>
      </div>
      <div className=''>
        {currentQuestion.latex ? (<Latex>{option}</Latex>) : <p>{option}</p>}
      </div>
    </div>
  )
}

export default Option