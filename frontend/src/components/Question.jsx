import { useContext, useEffect, useRef, useState } from "react"
import { QuizContext } from "../context/quiz"
import Option from "./Option"
import Latex from "react-latex"

export const Question = () => {  

  const [currentSelection, setCurrentSelection] = useState({
    option: "",
    answer: "",
  });
  const [quizState, dispatch] = useContext(QuizContext)
  const currentQuestion = quizState.questions[quizState.currentQuestion]
  const questionRef = useRef(null);
  
  useEffect(() => { // FOCA NA DIV PRO CONTROLE NO TECLADO FUNCIONAR
    questionRef.current.focus()
  })

  var timer;

  useEffect(() => { // ADICIONAR O EVENTO NA JANELA DA QUESTÃO
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  },[quizState.currentQuestion]);

  useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    timer = setInterval(() => {
      dispatch({type: "UPDATE_TIME"})
    }, 1000)

    return ()=> clearInterval(timer)
  }, [dispatch])

  const onSelectOption = (option) => {

    setCurrentSelection((current) => { // A CADA CLIQUE NA OPÇÃO ELA É COLOCADA AQUI
      return {
        option,
        answer: currentQuestion.answer
      };
    })
  }

  const onContinue = () => {
    dispatch({type: "CONCLUDE_ANSWER", payload: currentSelection}) // SELECIONA A OPÇÃO DE VEZ

    setCurrentSelection({
      option: "",
      answer: ""
    })

    dispatch({type: "CHANGE_QUESTION"})
  }

  const timerWidget = () => {

    const pStyle = "font-normal text-zinc-700"

    if(quizState.timeNeeded.minutes === 0){
      return quizState.timeNeeded.seconds < 10 ? <p className={pStyle}>0{quizState.timeNeeded.seconds}s</p> : <p className={pStyle}>{quizState.timeNeeded.seconds}s</p>
    }else{
      var seconds = quizState.timeNeeded.seconds < 10 ? "0" + quizState.timeNeeded.seconds : quizState.timeNeeded.seconds
      var minutes = quizState.timeNeeded.minutes < 10 ? "0" + quizState.timeNeeded.minutes : quizState.timeNeeded.minutes

      return <p className={pStyle}>{minutes}m{seconds}s</p>
    }
  }

  const optionsLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const onKey = (event) => {

    if(event.key === "Enter"){
      if(currentSelection.option != ""){
        dispatch({type: "CONCLUDE_ANSWER", payload: currentSelection}) // SELECIONA A OPÇÃO DE VEZ

        setCurrentSelection({
          option: "",
          answer: ""
        })

        dispatch({type: "CHANGE_QUESTION"})
      }
    }

    optionsLetters.forEach((current, index) => {
      if(event.key === current){
        if(currentQuestion.options[index]){
          onSelectOption(currentQuestion.options[index])
        }
      }
    })  
  }

  const containerStyleIfMoreThanTwoDescs = currentQuestion.descriptions.length >= 2 ? "flex gap-3 flex-col justify-between" : "flex gap-3 flex-col justify-between"

  return (
    <div className="py-1 md:py-5 outline-none" onKeyDown={onKey} tabIndex={-1} ref={questionRef}>
      <div className="flex gap-3 mt-8 flex-col md:flex-row justify-between">
        <div className="flex gap-3 flex-col md:flex-row w-full">
          
          <div className="bg-zinc-100 p-2 px-4 rounded-lg w-full md:w-max flex justify-center items-center">
            <p className="font-normal text-zinc-700"><span className="font-bold text-zinc-950">{quizState.currentQuestion+1}</span> de {quizState.questions.length}</p>
          </div>
          
          <div className="flex gap-3">
            {
              currentQuestion.descriptions.map((description, index) => {
                return (
                  <div key={index} className="bg-zinc-100 p-2 px-4 rounded-lg justify-center w-full md:w-max text-center flex items-center">
                    <p className="font-normal text-zinc-700">{description}</p>
                  </div>
                )
              })
            }
            <div className="bg-zinc-100 p-2 rounded-lg px-6 flex justify-center w-full md:w-max items-center">
              {
                timerWidget()
              }
              
            </div>
          </div>

        </div>
          <div>
            <button onClick={() => dispatch({type: "HOME_PAGE"})} className="p-2 px-4 border-[0.7px] w-full rounded-lg border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-800 font-medium transition-all">Desistir</button>
          </div>
      </div>

      <div className="mt-3 text-justify text-zinc-800 text-[1rem]">
        <Latex colorIsTextColor={true}>
          {currentQuestion.header}
        </Latex>

      </div>

        <div className="mt-3">
          {currentQuestion.options.map((option, index) => { // COLOCA A COR DE ACORDO COM A SELEÇÃO
            const isSelected = option === currentSelection.option;
            let optionStyles = isSelected ? "bg-zinc-200 text-zinc-800" : "";

            if(index === currentQuestion.options.length - 1){
              optionStyles = optionStyles + "mb-[2rem]"
            }

            return (
              <Option
                option={option}
                index={index}
                key={index}
                selectOption={() => onSelectOption(option)}
                currentQuestion={currentQuestion}
                styles={optionStyles}
              />
            )
          })}
        </div>

        <div className="h-24">
          {/* Div para aumentar a distância entre o botão fixo e a última opção */}
        </div>

      <div className="fixed w-full px-[2rem] py-[1] md:px-[5rem] xl:px-[8rem] bottom-0 left-0 p-6 backdrop-blur-sm md:mb-10">
        {currentSelection.option != "" ? <button className={"p-5 w-full rounded-[0.5rem] transition-all text-zinc-50 font-medium bg-zinc-700 hover:bg-zinc-900"} onClick={() => onContinue()}>Continuar</button> :
        <button disabled className={"p-5 w-full rounded-[0.5rem] transition-all text-zinc-50 font-medium bg-zinc-500 cursor-not-allowed"}>Continuar</button>}
        
      </div>
    </div>
  )
}