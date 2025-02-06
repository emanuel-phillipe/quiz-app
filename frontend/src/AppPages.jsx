import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { QuizContext } from './context/quiz';
import { useCookies } from 'react-cookie';
import { WelcomePage } from './components/WelcomePage';
import { Question } from '@phosphor-icons/react';
import { QuestionCreation } from './components/QuizCreation/QuestionCreation';
import GameEnd from './components/GameEnd';
import IncorrectQuestions from './components/IncorrectQuestions';
import Auth from './components/Authentication/Auth';

function AppPages() {

  const [quizState, dispatch] = useContext(QuizContext)
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
  const [authDispatch, setAuthDispatch] = useState(false)

  useEffect(() => {
    const auth = async () => {
      if(!authDispatch){
        if(!cookies.userToken) {          
          dispatch({type: "USER_AUTH"})
        }else{
          const verification = await axios.post(import.meta.env.VITE_API+"/auth/validate", {"token": cookies.userToken}).catch((err) => {
            removeCookie("userToken")
            dispatch({type: "USER_AUTH"})
            return false
          })

          dispatch({type: "HOME_PAGE"})
        }
        
        setAuthDispatch(true)
      }
    }

    auth()
  })  

  return (
    <div className="">

  </div>
  )
}

export default AppPages