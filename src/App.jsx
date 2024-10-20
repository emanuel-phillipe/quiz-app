import { useContext, useEffect, useState } from "react";
import { Question } from "./components/Question";
import { WelcomePage } from "./components/WelcomePage";
import { QuizContext } from "./context/quiz";
import GameEnd from "./components/GameEnd";
import IncorrectQuestions from "./components/IncorrectQuestions";
import {QuestionCreation} from "./components/QuizCreation/QuestionCreation";
import Auth from "./components/Authentication/Auth";
import { useCookies } from "react-cookie";
import axios from "axios";

export function App() {

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
      {quizState.gameStage === "Start" && <WelcomePage />}
      {quizState.gameStage === "Playing" && <Question />}
      {quizState.gameStage === "Creation" && <QuestionCreation />}
      {quizState.gameStage === "End" && <GameEnd />}
      {quizState.gameStage === "Incorrects" && <IncorrectQuestions />}
      {quizState.gameStage === "Auth" && <Auth />}
    </div>
  )
}