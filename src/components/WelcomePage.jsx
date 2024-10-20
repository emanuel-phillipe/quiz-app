import { useContext, useEffect, useState } from "react"
import { QuizContext } from "../context/quiz"
import QuizOption from "./QuizOption"
import { ClockCounterClockwise, Plus, Smiley, User } from "@phosphor-icons/react"
import HistoryPage from "./History"
import axios from "axios"
import { useCookies } from "react-cookie"
import Empty from "./Empty"
import { styled, Tooltip, tooltipClasses } from "@mui/material"

export function WelcomePage(){
  const [quizState, dispatch] = useContext(QuizContext)
  const [history, setHistory] = useState(false)
  const [infoFetched, setInfoFetched] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

  useEffect(() => {
    const getQuizes = async () => {
      const response = await axios.get(import.meta.env.VITE_API + "/quiz/all", {headers: {Authorization: `Bearer ${cookies.userToken}`}}).catch((err) => {
        setInfoFetched(false)
      })
          
      if(response) {
        setInfoFetched(true)
        dispatch({type: "UPDATE_QUIZES", payload: {quizes: response.data}})
      }
    }

    const getUserInfo = async () => {
      const response = await axios.get(import.meta.env.VITE_API + "/user", {headers: {Authorization: `Bearer ${cookies.userToken}`}}).catch((err) => {
        removeCookie()
        dispatch({type: "USER_AUTH"})
        return false
      })

      if(response){
        dispatch({type: "SET_USER_INFO", payload: {userInfo: response.data}})
      }
    }

    getUserInfo()
    getQuizes()
  }, []) 

  const ButtonTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
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

  const callQuizes = () => {
    try{
      if(infoFetched && quizState.subjects.length > 0){
        return quizState.subjects.map((subject, index) => {          
          return (<QuizOption key={index} creator={[subject.creatorId]} title={subject.title} questionNumber={subject.questions.length} subject={subject} click={() => dispatch({type: "SELECT_QUESTION_AND_SORT", payload: {index}})}/>)
        })
      }
    }catch(err) {
      console.log("Erro");           
    }
  }

  const callEmptyScreen = () => {
    try{
      if(infoFetched && quizState.subjects.length === 0){
        return (<Empty />)
      }
    }catch(err){
      console.log("Error"); 
    }
  }

  return (
    <div className="py-[2rem] md:py-10">

      {callEmptyScreen()}

      <HistoryPage hidden={history} setHidden={() => setHistory(false)}/>

      <header className="flex justify-between backdrop-blur-sm">
        <div>
          <h1 className="text-4xl font-bold">{`Olá, ${quizState.userInfo.smallName}`}</h1>
          <p className="text-zinc-500 mr-5">Seja muuito bem-vindo(a)! Para começar, é só clicar em algum quiz!</p>
        </div>
        
      </header>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 grid-rows-5">

        {!infoFetched && (
        <> 
          <div className="border-[0.7px] border-zinc-200 rounded-[0.5rem] p-3 px-4 w-full bg-zinc-100 h-28 animate-pulse hover:border-zinc-600 ${creatorsWidget && 'border-zinc-600'} transition-all cursor-pointer"></div>
          <div className="border-[0.7px] border-zinc-200 rounded-[0.5rem] p-3 px-4 w-full bg-zinc-100 h-28 animate-pulse hover:border-zinc-600 ${creatorsWidget && 'border-zinc-600'} transition-all cursor-pointer"></div>
          <div className="border-[0.7px] border-zinc-200 rounded-[0.5rem] p-3 px-4 w-full bg-zinc-100 h-28 animate-pulse hover:border-zinc-600 ${creatorsWidget && 'border-zinc-600'} transition-all cursor-pointer"></div>
          <div className="border-[0.7px] border-zinc-200 rounded-[0.5rem] p-3 px-4 w-full bg-zinc-100 h-28 animate-pulse hover:border-zinc-600 ${creatorsWidget && 'border-zinc-600'} transition-all cursor-pointer"></div>
        </>
        )}

        {
          callQuizes()
        }

      </div>

      <footer className="fixed left-0 bottom-5 flex justify-center w-full"> 
        <div className="border-[0.7px] shadow-md flex justify-center gap-2 items-center border-zinc-300 p-1 rounded-lg">

          <ButtonTooltip title="Histórico">
            <button className="hover:bg-zinc-100 transition-all p-2 rounded-md"><ClockCounterClockwise size={22} alt="Histórico"/></button>
          </ButtonTooltip>

          <ButtonTooltip title="Novo Quiz">
            <button onClick={() => dispatch({type: "QUIZ_CREATION"})} className="hover:bg-zinc-100 transition-all p-2 rounded-md"><Plus size={22} alt="Criar Quiz"/></button>
          </ButtonTooltip>

          <ButtonTooltip title="Conta">
            <button className="hover:bg-zinc-100 transition-all p-2 rounded-md"><User size={22} alt="Conta"/></button>
          </ButtonTooltip>

          <ButtonTooltip title="Amigos">
            <button className="hover:bg-zinc-100 transition-all p-2 rounded-md"><Smiley size={22} alt="Conta"/></button>
          </ButtonTooltip>
        </div>
      </footer>

    </div>
  )
}
