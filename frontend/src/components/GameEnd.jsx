import React, { useContext } from 'react'
import { QuizContext } from '../context/quiz'
import Confetti from "react-confetti";

function GameEnd() {

  const [quizState, dispatch] = useContext(QuizContext)

  const timerWidget = () => {

    const pStyle = "text-4xl font-bold text-zinc-800"

    if(quizState.timeNeeded.minutes === 0){
      return quizState.timeNeeded.seconds < 10 ? <p className={pStyle}>0{quizState.timeNeeded.seconds}s</p> : <p className={pStyle}>{quizState.timeNeeded.seconds}s</p>
    }else{
      var seconds = quizState.timeNeeded.seconds < 10 ? "0" + quizState.timeNeeded.seconds : quizState.timeNeeded.seconds
      var minutes = quizState.timeNeeded.minutes < 10 ? "0" + quizState.timeNeeded.minutes : quizState.timeNeeded.minutes

      return <p className={pStyle}>{minutes}m{seconds}s</p>
    }
  }

  return (
    <div className='flex flex-col justify-center w-full h-screen items-center'>

      {quizState.score >= (0.5 * quizState.questions.length) && <Confetti />}

      <div className='w-full text-center'>
        <h2 className='text-4xl font-bold'>Fim de Jogo!</h2>
        <p className="text-zinc-500">Você chegou no final, parabéns por ter terminado!</p>
      </div>

      <div className='flex flex-col justify-center'>
        <div className='grid grid-cols-2 grid-rows-2  gap-3'>
          <div className='flex h-max bg-zinc-100 p-3 rounded-[1rem] mt-10 justify-center items-end'>
            <p className='text-4xl font-bold text-zinc-800'>{quizState.score}</p>
            <p className='mb-1 text-zinc-500 ml-1 font-medium'>/ {quizState.questions.length} acertos</p>
          </div>

          <div className='flex justify-center h-max bg-zinc-100 p-5 rounded-[1rem] mt-1 col-span-2 col-start-1 row-start-2 items-end'>
            <p className='text-4xl font-bold text-zinc-800'>{timerWidget()}</p>
            <p className='mb-1 text-zinc-500 ml-2 font-medium'>gastos para terminar</p>
          </div>

          <div className='flex h-max justify-center bg-zinc-100 p-3 rounded-[1rem] mt-10 items-end'>
            <p className='text-4xl font-bold text-zinc-800'>{Number.parseInt(quizState.score / quizState.questions.length * 100)}</p>
            <p className='mb-1 text-zinc-500 ml-1 font-medium'>%</p>
          </div>

          
        </div>
        
        <div className='flex flex-col gap-4'>
          <button onClick={() => dispatch({type: "HOME_PAGE"})} className='p-4 w-full bg-zinc-700 rounded-[0.5rem] hover:bg-zinc-900 transition-all text-zinc-50 font-medium'>Início</button>
          { quizState.incorrectQuestions != [] && <button onClick={() => dispatch({type: "INCORRECT_QUESTIONS"})} className='p-4 w-full border-[1.7px] hover:bg-zinc-100 hover:border-zinc-500 border-zinc-400 rounded-[0.5rem] transition-all font-medium'>Questões Erradas</button> }
        </div>
      </div>
    </div>
  )
}

export default GameEnd