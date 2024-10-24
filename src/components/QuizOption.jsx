import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'

function QuizOption({title, desc, creator, questionNumber, click, subject}) {

  const [creatorsWidget, setCreatorsWidget] = useState(false) 

  const classAndTextStyles = {
    div: `border-[0.7px] border-zinc-300 rounded-[0.5rem] p-3 px-4 w-full h-max hover:border-zinc-600 ${creatorsWidget && 'border-zinc-600'} transition-all cursor-pointer`,
    title: "text-[1.1rem] font-semibold",
    desc: "text-[0.9rem] text-zinc-600",
    questionsText: questionNumber == 1 ? questionNumber + " questão objetiva" : questionNumber + " questões objetivas"
  }

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

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const [clicks, setClicks] = useState(0)
  const handleClick = () => {
    click()
  }  

  return (
      <div onClick={() => {handleClick();}} className={classAndTextStyles.div}>
        <h3 className={classAndTextStyles.title}>{title}</h3>
        <p className={classAndTextStyles.desc}>{classAndTextStyles.questionsText}</p>

        <p className={`bg-zinc-100 ${clicks === 1 && 'bg-zinc-200'} p-2 mt-3 rounded-md text-[0.9rem]`}>{clicks == 0 ? truncate(creator.join(", "), 50) : creator.join(", ")}</p>
      </div>
  )
}

export default QuizOption