import React, { useContext } from 'react'
import { useCookies } from 'react-cookie';
import { QuizContext } from '../context/quiz';
import { Power } from '@phosphor-icons/react';
import { styled, Tooltip, tooltipClasses } from "@mui/material"

function Profile({leavePopup}) {

  const [quizState, dispatch] = useContext(QuizContext)
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']); 
  
  const ButtonTooltip = styled(({ className, ...props }) => (
    <Tooltip  {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#f4f4f5",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      color: "#52525b",
      backgroundColor: "#f4f4f5",
      fontSize: theme.typography.pxToRem(13),
      fontWeight: "bold"
    },
  }));

  const logout = () => {
    removeCookie("userToken")
    dispatch({type: "USER_AUTH"})
  }

  return (
   <div onClick={() => {leavePopup()}} className='fixed w-full h-screen'>
     <div className="fixed bottom-20 left-0 justify-center items-center flex z-30 w-full">
      <div className="bg-zinc-50 border-[0.7px] border-zinc-200 shadow-xl w-max p-5 rounded-lg">
        <h1 className='font-semibold'>{quizState.userInfo.fullName}</h1>
        <p className='text-[0.9rem] text-zinc-500'>{quizState.userInfo.school}</p>

        <hr className='mt-3'/>

        <div className='w-full flex mt-2'>
          <ButtonTooltip title="Sair">
            <button onClick={() => logout()} className='p-1 rounded-md hover:border-zinc-500 transition-all border-[0.7px] border-zinc-300 text-zinc-600 hover:text-zinc-800'><Power size={22} weight='regular'/></button>
          </ButtonTooltip>
        </div>
      </div>
    </div>
   </div>
  )
}

export default Profile