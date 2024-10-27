import { FunctionDeclarationSchemaType, GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState } from 'react'

import OpenAI from "openai";
import { Sparkle } from '@phosphor-icons/react';
import { CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { isMobile } from 'react-device-detect';


function AutoQuestion({createQuestion, cancelCreation}) {

  const [question, setQuestion] = useState("")
  const [gptCorrection, setGptCorrection] = useState(null)

  const correctGPT = async () => {

    setGptCorrection(false)

    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_KEY,
      dangerouslyAllowBrowser: true,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "Você deve organizar a questão escrita pelo usuário em um objeto separado em enunciado, opções e a resposta. Você não deve escrever a letra na frente das opções (exemplo: A) ... deve ser escrito apenas a \"...\")"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": question
            }
          ]
        }
      ],
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      tools: [
        {
          "type": "function",
          "function": {
            "name": "organize_question",
            "description": "organize a question components, such as options and answer, in an object",
            "parameters": {
              "type": "object",
              "properties": {
                "header": {
                  "type": "string"
                },
                "options": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "answer": {
                  "type": "string",
                  "description": "The question's answer without the option letter (A,B,C,D,E)."
                }
              },
              "required": [
                "header",
                "options",
                "answer"
              ]
            }
          }
        }
      ],
    });
    
    var responseJSON = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
    setGptCorrection(null)
    createQuestion(responseJSON)

  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
    <div className='p-4 py-12 w-full h-full'>

      <div className='flex justify-between'>
        <div>
          <h1 className="text-4xl font-bold w-full">Auto-Organização</h1>
          <p className="text-zinc-500">
            Coloque a questão como o recomendado abaixo e ela será organizada por I.A.
          </p>
        </div>
        <div>
          {!isMobile && <button onClick={cancelCreation} className="p-2 px-4 rounded-lg font-medium border-[0.7px] border-zinc-300 text-zinc-500 hover:text-zinc-700 hover:border-zinc-500 transition-all">Voltar</button>}
        </div>
      </div>
      
      <div className=''>
        <textarea onChange={(e) => {setQuestion(e.target.value)}} value={question} className={`w-full ${isMobile ? 'h-[35rem]' : 'h-[15rem]'} outline-none mt-8 rounded-lg text-justify`} placeholder='A fotossíntese é um processo vital para a produção de energia em plantas. Qual das alternativas a seguir descreve corretamente o papel da clorofila na fotossíntese?

A) A clorofila é responsável pela absorção de dióxido de carbono do ar.
B) A clorofila é responsável pela produção de glicose a partir de água e luz solar.
C) A clorofila absorve luz solar, convertendo-a em energia química durante a fase clara da fotossíntese.
D) A clorofila é a principal enzima que converte ATP em ADP durante a fotossíntese.
E) A clorofila libera oxigênio como um subproduto durante a fase escura da fotossíntese.

Resposta: A) A clorofila é responsável pela absorção de dióxido de carbono do ar.
        '></textarea>

        {
          !isMobile && 
          <button disabled={question == ""} onClick={() => correctGPT()} className='w-full disabled:cursor-not-allowed flex justify-center items-center gap-3 border-[0.7px] p-4 border-zinc-300 rounded-lg mt-10 enabled:hover:border-zinc-500 transition-all text-zinc-400 enabled:hover:text-zinc-700'>
            {
              gptCorrection === false ? <CircularProgress
              size={24}
              color="primary"
            /> :
            <Sparkle size={22} weight='regular'/>
            }
            Organizar Questão
          </button>
        }
      </div>

      {isMobile && <footer className='fixed bottom-8 px-8 w-full left-0'>
        <button onClick={() => correctGPT()} className='w-full flex justify-center items-center gap-3 border-[0.7px] p-4 border-zinc-300 rounded-lg mt-10 hover:border-zinc-500 transition-all text-zinc-400 hover:text-zinc-700'>
          {
            gptCorrection === false ? <CircularProgress
            size={24}
            color="primary"
          /> :
          <Sparkle size={22} weight='regular'/>
          }
          Organizar Questão
        </button>
        {isMobile && <button onClick={cancelCreation} className="p-4 mt-2 px-4 w-full rounded-lg font-medium border-[0.7px] border-zinc-300 text-zinc-500 hover:text-zinc-700 hover:border-zinc-500 transition-all">Voltar</button>}
      </footer>}
    </div>
    </ThemeProvider>
  )
}

export default AutoQuestion