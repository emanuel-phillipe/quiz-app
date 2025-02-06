import React, { useContext, useEffect, useRef, useState } from "react";
import { QuizContext } from "../context/quiz";
import Latex from "react-latex";
import OptionIncorrect from "./OptionIncorrect";
import { ArrowLeft, Sparkle } from "@phosphor-icons/react";
import MathText from "./MathText";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CircularProgress, ThemeProvider, createTheme } from "@mui/material";

function IncorrectQuestions() {
  const [quizState, dispatch] = useContext(QuizContext);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [corrections, setCorrections] = useState([]);
  const [currentCorrection, setCurrentCorrect] = useState("");
  const [geminiProgress, setGeminiProgress] = useState(false);

  const questionRef = useRef(null);

  useEffect(() => { // FOCA NA DIV PRO CONTROLE NO TECLADO FUNCIONAR
    questionRef.current.focus()
  })


  useEffect(() => { // ADICIONAR O EVENTO NA JANELA DA QUESTÃO
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  },[selectedQuestion]);

  const onKey = (event) => {
    if(event.key === "ArrowLeft"){
      var questionToBack = selectedQuestion - 1
      
      if(questionToBack < 0) questionToBack = quizState.incorrectQuestions.length - 1;

      setSelectedQuestion(questionToBack)
    
    }else if(event.key === "ArrowRight"){ 
      var questionToGo = selectedQuestion + 1

      if(questionToGo >= quizState.incorrectQuestions.length) questionToGo = 0;
      
      setSelectedQuestion(questionToGo)
    }
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000",
      },
    },
  });

  useEffect(() => {
    setCurrentCorrect("");

    if (corrections != []) {
      const response = corrections.find(
        (current) => current.index === selectedQuestion
      );

      if (response) {
        setCurrentCorrect(response.text);
      }
    }
  }, [selectedQuestion, corrections]);

  const correctGemini = async () => {
    const currentQuestion = selectedQuestion;
    setGeminiProgress("running");

    const genAi = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
    var prompt =
      "Explique o motivo da questão " +
      quizState.incorrectQuestions[currentQuestion].questionObject.question +
      " ter a opção " +
      quizState.incorrectQuestions[currentQuestion].questionObject.answer +
      " como correta. De forma clara e objetiva. Lembre-se, as respostas estão todas CORRETAS, preciso apenas da explicação.";

    var result = await model.generateContent(prompt.toString());
    var response = await result.response;
    var text = response.text();

    var existingCorrection = corrections;
    var exist = null;

    corrections.forEach((current, index) => {
      if (current.index === currentQuestion) exist = index;
    });

    if (exist !== null) {
      existingCorrection[exist].text = text;

      setCorrections(existingCorrection);
    } else {
      if (corrections.length === 0) {
        setCorrections([
          {
            index: currentQuestion,
            text,
          },
        ]);
      } else {
        setCorrections((current) => [
          ...current,
          {
            index: currentQuestion,
            text,
          },
        ]);
      }
    }

    setGeminiProgress(true);
  };

  const textResponse = () => {
    if (currentCorrection != "undefined") {
      return <MathText>{currentCorrection.toString()}</MathText>;
    } else {
      return "";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="py-4 md:py-12 px-[0.5rem] xl:px-[8rem]" ref={questionRef}>
        <div className="flex mb-5 gap-3 justify-between">
          <div
            onClick={() => dispatch({ type: "QUIZ_END" })}
            className="p-3 px-4 gap-4 font-semibold md:w-max text-center flex items-center cursor-pointer transition-all rounded-lg w-full justify-center bg-zinc-100 hover:bg-zinc-200"
          >
            
            <ArrowLeft
              size={20}
              weight="bold"
              alt="Voltar para a página anterior"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:flex gap-3 justify-between w-full">
          {quizState.incorrectQuestions.map((question, index) => {
            const style =
              selectedQuestion === index
                ? "p-2 px-4 text-center cursor-pointer transition-all rounded-lg w-full font-medium bg-zinc-200 border-[1.7px] border-zinc-400"
                : "p-2 px-4 text-center cursor-pointer hover:border-zinc-400 transition-all border-[1.7px] rounded-lg w-full font-medium border-zinc-300";

            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedQuestion(index);
                }}
                className={style}
              >
                {question.questionNumber + 1}
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-justify text-zinc-800 text-[1rem]">
          {
            quizState.incorrectQuestions[selectedQuestion].questionObject.latex 
            ? 
            <Latex colorIsTextColor={true}>
              {
                quizState.incorrectQuestions[selectedQuestion].questionObject.header 
              }
            </Latex>
            :
            <p>
              {quizState.incorrectQuestions[selectedQuestion].questionObject.header}
            </p>
          }
        </div>

        <div className="mt-3">
          {quizState.incorrectQuestions[
            selectedQuestion
          ].questionObject.options.map((option, index) => {
            // COLOCA A COR DE ACORDO COM A SELEÇÃO
            const isCorrect =
              option ===
              quizState.incorrectQuestions[selectedQuestion].questionObject
                .answer;

            var style;

            if (isCorrect) {
              style = "border-green-400 bg-green-100 text-zinc-800";
            } else if (
              option === quizState.incorrectQuestions[selectedQuestion].option
            ) {
              style = "bg-zinc-100 border-zinc-400 text-zinc-800";
            }

            return (
              <OptionIncorrect
                key={index}
                index={index}
                latex={quizState.incorrectQuestions[selectedQuestion].questionObject.latex}
                option={option}
                styles={style}
              />
            );
          })}
        </div>

        <div className="text-left w-full">
          <div className="flex flex-col md:flex-row md:items-end items-start gap-1 md:gap-2 mb-3 md:mb-0">
            <h2 className="text-2xl font-bold">Explicação da Questão</h2>
            <span className="text-[0.9rem] text-zinc-500 font-semibold">
              EM FASE DE TESTES
            </span>
          </div>
          <p className="text-zinc-500 mb-5">
            Em um passe de mágica, suas perguntas serão respondidas com I.A.
          </p>

          {currentCorrection == "" ? (
            <div
              onClick={() => alert("Desculpe, mas a correção por I.A está em manutenção no momento.")}
              className="mb-4 flex items-center justify-center gap-3 p-3 px-4 text-center cursor-not-allowed transition-all rounded-lg w-max font-medium border-[1.7px] border-zinc-300"
            >
              {geminiProgress == "running" ? (
                <CircularProgress
                  size={24}
                  color="primary"
                />
              ) : (
                <Sparkle size={24} weight="regular" />
              )}

              <p className="text-[1rem font-semibold]">Gerar Resposta</p>
            </div>
          ) : (
            ""
          )}

          {textResponse()}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default IncorrectQuestions;
