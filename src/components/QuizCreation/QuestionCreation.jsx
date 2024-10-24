import React, { useContext, useState } from "react";
import { QuizContext } from "../../context/quiz";
import { Plus, PlusMinus, Sparkle, Trash, TrashSimple } from "@phosphor-icons/react";
import { CreateQuestionPage } from "./CreateQuestionPage";
import AutoQuestion from "./AutoQuestion";
import { isMobile } from "react-device-detect";
import axios from "axios";
import { useCookies } from "react-cookie";
import LoadingScreen from "../LoadingScreen";

// {
//   question: "Qual é a principal diferença entre os conceitos de fotossíntese e respiração celular?",
//   options: ["A fotossíntese ocorre em todos os organismos vivos, enquanto a respiração celular ocorre apenas em plantas.", "Fotossíntese é o processo pelo qual as plantas produzem alimento a partir de luz solar, água e dióxido de carbono, liberando oxigênio. Respiração celular é a conversão de glicose em energia (ATP) nas células, liberando dióxido de carbono e água.", "Fotossíntese é o processo pelo qual as células produzem alimento a partir de luz solar, água e dióxido de carbono, liberando oxigênio. Respiração celular é a conversão de glicose em energia (ATP) nas plantas, liberando dióxido de carbono e água.", "A fotossíntese ocorre apenas durante o dia, enquanto a respiração celular ocorre apenas à noite."],
//   answer: "Fotossíntese é o processo pelo qual as plantas produzem alimento a partir de luz solar, água e dióxido de carbono, liberando oxigênio. Respiração celular é a conversão de glicose em energia (ATP) nas células, liberando dióxido de carbono e água.",
//   descriptions: ["Biologia"],
//   latex: false
// },

export function QuestionCreation() {

  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
  const [quizState, dispatch] = useContext(QuizContext)
  const [quizValues, setQuizValues] = useState({
    title: "",
    creators: [quizState.userInfo.smallName],
    questions: [],
  })
  const [currentCreator, setCurrentCreator] = useState("")
  const [loading, setLoading] = useState(false)

  const [questionsCreation, setQuestionsCreation] = useState(false)
  const [autoQuestion, setAutoQuestion] = useState(false)

  const truncate = (text, limit) => {
    if (text.length > limit) {
        for (let i = limit; i > 0; i--){
            if(text.charAt(i) === ' ' && (text.charAt(i-1) != ','||text.charAt(i-1) != '.'||text.charAt(i-1) != ';')) {
                return text.substring(0, i) + '...';
            }
        }
      return text.substring(0, limit) + '...';
    } else {
        return text;
    }
  }
  
  const saveQuestion = (question) => {
    setQuizValues((current) => {
      return {
        ...current,
        questions: [...current.questions, question]
      }
    })
    
    setQuestionsCreation(false)
  }

  const removeQuestion = (indexToRemove) => {
    var questionsFiltered = quizValues.questions.filter((current, index) => {
      return index !== indexToRemove
    })

    setQuizValues((current) => {
      return {...current, questions: questionsFiltered}
    })
  }

  const ableToSave = quizValues.title != "" && quizValues.creators.length >= 1 && quizValues.questions.length > 0
  const buttonStyle = ableToSave ? "p-2 px-4 rounded-lg cursor-pointer font-medium bg-zinc-100 hover:bg-zinc-200 transition-all" : "p-2 px-4 text-zinc-600 rounded-lg cursor-not-allowed font-medium bg-zinc-100 transition-all"
  const buttonStyleMobile = ableToSave ? "p-4 w-full rounded-lg cursor-pointer font-medium bg-zinc-100  transition-all" : "p-4 w-full rounded-lg cursor-not-allowed font-medium bg-zinc-100  transition-all"

  const createQuiz = async () => {

    if(!ableToSave) {
      return false
    }

    setLoading(true)

    const creationResponse = await axios.post(import.meta.env.VITE_API + "/quiz/create", quizValues, {
      headers: {"Authorization": "Bearer " + cookies.userToken}
    }).catch((err) => {
      alert(`Erro ao criar Quiz (${err.status})`)
    })

    setLoading(false)

    if(!loading) dispatch({type: "HOME_PAGE"})
  }

  const createAutoQuestion = (questionJson) => {
    setAutoQuestion(questionJson)
    setQuestionsCreation(true)
  }

  const addCreator = () => {

    var creators;

    if(currentCreator.includes(",")){
      creators = currentCreator.split(",").map((creator) => {
        return creator.replace(" ", "")
      })
    }else {
      creators = [currentCreator]
    }    
      
    setQuizValues((current) => {
      return {
        ...current,
        creators: [...creators, ...current.creators]
      }
    })    

    setCurrentCreator("")
  }

  const onKeyDownCreator = (event) => {
    if(event.key === "Enter"){
      addCreator()
    }
  }

  const renderPage = () => {
    if(questionsCreation){
      return (<CreateQuestionPage cancelQuestion={() => {setQuestionsCreation(false)}} autoQuestion={autoQuestion} saveQuestion={saveQuestion}/>)
    }else if(autoQuestion === true){
      return (<AutoQuestion cancelCreation={() => {setAutoQuestion(false)}} createQuestion={createAutoQuestion}/>)
    }else{
      return (<div className="py-3 md:py-7">

        {loading && <LoadingScreen />}

        <div className="flex justify-between backdrop-blur-sm">
          <div>
            <h1 className="text-4xl font-bold">Criação de Quiz</h1>
            <p className="text-zinc-500">
              Aqui, é possível criar um novo quiz, com quantas perguntas quiser!
            </p>
          </div>

          <div className="flex flex-col ml-3 md:flex-row gap-3 h-max">
            {
              isMobile ? "" : <button className={buttonStyle} onClick={() => createQuiz()}>Criar</button>
            }
            <button onClick={() => dispatch({type: "HOME_PAGE"})} className="p-2 px-4 rounded-lg font-medium border-[0.7px] border-zinc-300 hover:border-zinc-500 transition-all">Cancelar</button>
          </div>
        </div>
  
        <div className="mt-10 flex flex-col md:flex-row gap-10">
          <div className="">
            <p className="font-semibold mb-1 text-zinc-700">Título / Matéria</p>
            <input type="text" placeholder="Ex. Química" value={quizValues.title} className="border-[0.7px] p-2 rounded-lg border-zinc-300 transition-all focus:border-zinc-700 outline-none" onChange={(e) => setQuizValues((current) => { return {...current, title: e.target.value}})}/>
          </div>

          <div className="">
            <p className="font-semibold mb-1 text-zinc-700">Nome(s) do(s) Criador(es) <span className={`text-[0.8rem] ml-2 ${isMobile && 'block ml-0 mb-3'} font-normal text-zinc-500`}>Escreva o nome e pressione ENTER</span></p>
            <div className="flex gap-2">
              <input onKeyDown={onKeyDownCreator} type="text" placeholder="Ex. Eduardo Ferreira" value={currentCreator} className="border-[0.7px] p-2 rounded-lg border-zinc-300 transition-all focus:border-zinc-700 outline-none" onChange={(e) => setCurrentCreator(e.target.value)}/>
              <button onClick={addCreator} disabled={currentCreator === ""} className={`p-2 ${currentCreator === "" ? 'cursor-not-allowed' : 'hover:bg-zinc-200'} px-4 rounded-lg bg-zinc-100`}><Plus size={18}/></button>
            </div>
            {
              quizValues.creators && <p className="text-[0.8rem] mt-2 text-zinc-500">{quizValues.creators.map(String).join(", ")}</p>
            }
          </div>
        </div>
  
        <div className="mt-10 flex gap-2 flex-col">
          <h2 className="font-semibold text-xl">Questões</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row mt-3 mb-4 justify-between gap-3">
              <div onClick={() => {setQuestionsCreation(true)}} className="p-4 flex gap-3 items-center cursor-pointer w-full border-[0.7px] text-zinc-400 justify-center border-zinc-300 rounded-lg hover:border-zinc-500 hover:text-zinc-900 transition-all">
                <Plus size={22} weight="regular"/>
                Adicionar Manualmente
              </div>
              <div onClick={() => {setAutoQuestion(true)}} className="w-full gap-3 p-4 flex items-center justify-center border-zinc-300 border-[0.7px] rounded-lg cursor-pointer hover:border-zinc-500 text-zinc-400 hover:text-zinc-900 transition-all">
                <Sparkle size={22} weight="regular"/>
                Organização Automática
              </div>
            </div>

            {
              quizValues.questions ? (quizValues.questions.map((current, index) => {
                return (
                  <div key={index} className="flex justify-between p-4 border-[0.7px] border-zinc-300 hover:border-zinc-500 transition-all px-4 rounded-lg items-center">
                    <div className="flex">
                      <p className="text-[1.1rem] pl-1 font-bold">{index <= 9 ? `0${index+1}` : `${index+1}`}</p>
                      <div className="flex flex-col pl-3">
                        <p className="font-normal text-zinc-800">{truncate(current.header, 50)}</p>
                        <p className="text-[0.9rem] text-zinc-500">{current.options.length} opções</p>
                      </div>
                    </div>
                    <div onClick={() => {removeQuestion(index)}} className="mr-4 text-zinc-500 hover:text-zinc-700 transition-all cursor-pointer p-2">
                      <TrashSimple size={22} weight="bold" alt={"Remover questão " + index}/>
                    </div>
                  </div>
                )
              })) : ""
            }

          </div>
        </div>

        {
          isMobile ? <footer className="fixed backdrop-blur-md bottom-0 w-full left-0 px-[2rem] py-5 md:py-8 md:px-[5rem]">
          <button className={buttonStyleMobile} onClick={() => createQuiz()}>Criar Quiz</button>
        </footer> : ""
        }
  
      </div>
)
  }
}

  return (
    <div>
      {
        renderPage()
      }
    </div>
  );
}
