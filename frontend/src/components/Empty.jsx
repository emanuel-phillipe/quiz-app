import { Wind } from '@phosphor-icons/react'
import React, { useContext } from 'react'
import { QuizContext } from '../context/quiz'

function Empty() {

  const [quizState, dispatch] = useContext(QuizContext)


  return (
    <div className='fixed flex justify-center items-center top-0 left-0 w-full h-screen'>
      <div className='flex flex-col justify-center items-center'>
        <Wind size={60} className='mb-3 text-zinc-500'/>
        <h1 className='text-3xl font-semibold text-zinc-800'>Nada novo por aqui...</h1>
        <p className='text-zinc-500'>Mas você pode criar um novo quiz!</p>

        <button onClick={() => {dispatch({type: "QUIZ_CREATION"})}} className='py-2 shadow-sm border-[0.7px] px-6 rounded-lg mt-8 hover:border-zinc-500 hover:bg-zinc-100 transition-all outline-none border-zinc-300'>Criar Quiz</button>
      </div>
    </div>
  )
}

export default Empty