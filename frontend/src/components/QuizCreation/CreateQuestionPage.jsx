import React, { useContext, useEffect, useState } from "react";
import { QuizContext } from "../../context/quiz";
import { isMobile } from "react-device-detect";
import { io } from "socket.io-client";

export function CreateQuestionPage({saveQuestion, questionToEditIndex, questionToEdit, autoQuestion, cancelQuestion}) {
  const placeholder =
    "O que caracteriza o movimento modernista no Brasil?";

  const [quizState, dispatch] = useContext(QuizContext);
  const [questionInfo, setQuestionInfo] = useState({
    header: "",
    options: [],
    answer: "",
    descriptions: [],
    latex: false,
  });
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentOption, setCurrentOption] = useState("");
  const [ableToSave, setAbleToSave] = useState(false)
  const [autoQuestionRegistered, setAutoQuestionRegistered] = useState(false)
  const [editQuestionRegistered, setEditQuestionRegistered] = useState(false)

  if(autoQuestion && !autoQuestionRegistered){
    setQuestionInfo({header: autoQuestion.header, options: autoQuestion.options, answer: autoQuestion.answer, descriptions: [], latex: false})
    setAutoQuestionRegistered(true)
  }

  if(questionToEdit && !editQuestionRegistered){
    setQuestionInfo({header: questionToEdit.header, options: questionToEdit.options, answer: questionToEdit.answer, descriptions: questionToEdit.descriptions, latex: questionToEdit.latex})
    setEditQuestionRegistered(true)
  }

  useEffect(() => {
    var able = false

    if(questionInfo.header != "" && questionInfo.options != [] && questionInfo.answer != ""){
      able = true
    }
    
    setAbleToSave(able)
  })

  const descInput = React.useRef(null);
  const optionInput = React.useRef(null);

  const optionsLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const onKeyPressed = (event) => {
    if (event.key === "Enter") {
      if (document.activeElement === descInput.current) {
        if (currentDescription) {
          setQuestionInfo((current) => {
            return {
              ...current,
              descriptions: [...current.descriptions, currentDescription],
            };
          });

          setCurrentDescription("");
        }
      }
    }
  };

  const onEnterPressedOnOptionInput = (event) => {
    if (event.key === "Enter") {
      if (document.activeElement === optionInput.current) {
        if (currentOption) {
          setQuestionInfo((current) => {
            return {
              ...current,
              options: [...current.options, currentOption],
            };
          });

          setCurrentOption("");
        }
      }
    }
  };

  const latexOptionButtonTrue = questionInfo.latex ? "p-2 px-4 text-zinc-50 bg-zinc-800 font-semibold transition-all rounded-lg": "p-2 px-4 text-zinc-700 border-zinc-700 font-semibold border-[0.7px] hover:border-zinc-700 transition-all rounded-lg"
  const latexOptionButtonFalse = !questionInfo.latex ? "p-2 px-4 text-zinc-50 bg-zinc-800 font-semibold transition-all rounded-lg": "p-2 px-4 text-zinc-700 border-zinc-700 font-semibold border-[0.7px] hover:border-zinc-700 transition-all rounded-lg"

  const saveOption = ableToSave ? "p-2 px-4 cursor-pointer rounded-lg font-medium border-[0.7px] border-zinc-300 hover:border-zinc-500 transition-all" : "cursor-not-allowed p-2 px-4 rounded-lg font-medium border-[0.7px] border-zinc-300 transition-all"
  const saveOptionMobile = ableToSave ? "p-2 rounded-lg font-medium bg-zinc-100 py-3 w-full transition-all" : "cursor-not-allowed text-zinc-700 text-center bg-zinc-100 p-2 py-3 px-4 rounded-lg font-medium transition-all"


  const correctOptionSelection = (option) => {
    if(option === questionInfo.answer){
      setQuestionInfo((current) => {return {...current, answer: ""}})
      return
    }
    setQuestionInfo((current) => {return {...current, answer: option}})
  }

  const [optionBeingEdited, setOptionBeingEdited] = useState("")
  const [optionText, setOptionText] = useState("")

  const editOption = (e, option) => {
    switch(e.detail){
      case 2:
        setOptionBeingEdited(option)
        break;
    }
  }

  const completeOptionEditing = (e, index) => {
    if(e.key === "Enter"){
      var infos = questionInfo
      infos.options[index] = optionText

      setQuestionInfo(infos)
      setOptionBeingEdited("")
      setOptionText("")
    }
  }


  return (
    <div className="py-1 md:py-8">
      <div className="mb-3 flex justify-between gap-3">
        <div className="flex gap-3">
          {questionInfo.descriptions != []
            ? questionInfo.descriptions.map((description, index) => {
                return (
                  <div key={index} className="bg-zinc-100 p-2 px-4 rounded-lg w-max">
                    <p className="font-normal text-zinc-700">{description}</p>
                  </div>
                );
              })
            : ""}

          <div className="border-[0.7px] border-zinc-400 p-2 px-4 rounded-lg w-max">
            <input ref={descInput} onKeyDown={onKeyPressed} onChange={(e) => setCurrentDescription(e.target.value)} value={currentDescription} type="text" className="font-normal text-zinc-700 bg-transparent outline-none" placeholder="Descrição..." />
          </div>
        </div>

        <div className="flex gap-3">
            {
              isMobile ? "" : <button className={saveOption} onClick={() => {saveQuestion(questionInfo)}}>
              <p className="">Salvar</p>
            </button>
            }
            <button onClick={cancelQuestion} className="p-2 px-4 rounded-lg font-medium border-[0.7px] border-zinc-300 hover:border-zinc-500 transition-all">Cancelar</button>
        </div>
      </div>
      <textarea
        onChange={(e) =>
          setQuestionInfo((current) => {
            return { ...current, header: e.target.value };
          })
        }
        value={questionInfo.header}
        className="w-full text-justify h-[15rem] outline-none"
        rows={3}
        placeholder={placeholder}
      ></textarea>

      <div>
        {questionInfo.options != []
          ? questionInfo.options.map((option, index) => {

              var divStyle = questionInfo.answer === option ? "p-3 cursor-pointer flex items-center border-[1.7px] w-full my-5 rounded-[0.5rem] transition-all text-zinc-500 hover:text-zinc-800 border-green-400 bg-green-200" : "p-3 cursor-pointer flex items-center border-[1.7px] w-full my-5 rounded-[0.5rem] transition-all text-zinc-500 hover:text-zinc-800"

              return (
                <div onClick={() => correctOptionSelection(option)} key={index} className={divStyle}>
                  
                  <div className={'flex items-center justify-center px-3 h-10 rounded-[0.4rem]'}>
                    <p className='font-semibold text-[1.1rem] '>{optionsLetters[index]}</p>
                  </div>
                  
                  <div className={"flex items-center justify-center px-3 h-16 rounded-[0.4rem]"}>
                    {
                      optionBeingEdited !== option ? <span onClick={(e) => editOption(e, option)} className="font-normal text-[1rem] ">{option}</span> 
                      : <input type="text" placeholder={option} value={optionText} onChange={(e) => {setOptionText(e.target.value)}} className="outline-none" onKeyDown={(e) => {completeOptionEditing(e, index)}}/>
                    }
                  </div>
                  
                </div>
              );
            }) : ""}

        <div className="p-3 cursor-pointer flex items-center border-zinc-200 border-[1.7px] w-full my-5 rounded-[0.5rem] text-zinc-500 hover:text-zinc-800 transition-all">
          <div className={"flex items-center justify-center px-3 h-10 rounded-[0.4rem]"}>
            <p className="font-semibold text-[1.1rem] ">
              {optionsLetters[questionInfo.options.length]}
            </p>
          </div>
          <div className="">
            <input type="text" value={currentOption} onChange={(e) => {setCurrentOption(e.target.value);}} placeholder="Opção da questão" onKeyDown={onEnterPressedOnOptionInput} ref={optionInput} className="outline-none w-full" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col">
        <h2 className="font-semibold text-xl">LateX para Números</h2>
        <p className="text-zinc-500">Para a impressão correta de números, uma extensão na questão é necessária. Por isso, há números na sua questão?</p>
      
        <div className="flex mt-3 gap-3">
            <button onClick={() => {setQuestionInfo((current) => {return {...current, latex: true}})}} className={latexOptionButtonTrue}>Sim</button>
            <button onClick={() => {setQuestionInfo((current) => {return {...current, latex: false}})}} className={latexOptionButtonFalse}>Não</button>
        </div>
      
      </div>

      {
        isMobile ? 
        <footer className="fixed w-full bottom-0 backdrop-blur-sm mb-4 left-0 px-[2rem] md:px-[5rem] xl:px-[8rem]">
          <button className={saveOptionMobile} onClick={() => {saveQuestion(questionInfo)}}>
            <p className="">Salvar</p>
          </button>
        </footer>
        : ""
      }

    </div>
  );
}