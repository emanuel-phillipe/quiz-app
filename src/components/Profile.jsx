import React, { useContext } from 'react'
import { useCookies } from 'react-cookie';
import { QuizContext } from '../context/quiz';

function Profile({leavePopup}) {

  const [quizState, dispatch] = useContext(QuizContext)
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);  

  return (
   <div onClick={() => {leavePopup()}} className='fixed w-full h-screen'>
     <div className="fixed bottom-20 left-0 justify-center items-center flex z-30 w-full">
      <div className="bg-zinc-50 border-[0.7px] border-zinc-200 shadow-xl w-max p-5 rounded-lg">
        <h1 className='font-semibold'>{quizState.userInfo.fullName}</h1>
        <p className='text-[0.9rem] text-zinc-500'>{quizState.userInfo.school}</p>

        <div>
          
        </div>
      </div>
    </div>
   </div>
  )
}

export default Profile