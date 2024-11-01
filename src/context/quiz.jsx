import { createContext, useReducer } from "react";

const stages = ["Start", "Playing", "End", "Incorrects", "Creation", "QuestionCreation", "Auth", "Admin"];

const initialState = {
  gameStage: stages[6],
  subjects: [],
  userInfo: {},
  questions: [],
  currentQuestion: 0,
  score: 0,
  answerSelected: false,
  timeNeeded: {minutes: 0, seconds: 0},
  incorrectQuestions: [],
  quizSelectedToEdit: undefined,
  history: JSON.parse(localStorage.getItem("navigatorInfo")) || [],
}

const quizReducer = (state, action) => {

  switch(action.type) {
    case "SET_USER_INFO":
      var userName = action.payload.userInfo.fullName
      var splitedName = userName.split(" ")

      if(splitedName.length === 1){
        return {
          ...state,
          userInfo: {...action.payload.userInfo, smallName: splitedName[0]}
        }
      }

      if(splitedName[1].toUpperCase() === "DE" || splitedName[1].toUpperCase() === "DOS" || splitedName[1].toUpperCase() === "DO"){
        return {
          ...state,
          userInfo: {...action.payload.userInfo, smallName: splitedName[0] +  " " + splitedName[2]}
        }
      }

      return {
        ...state,
        userInfo: {...action.payload.userInfo, smallName: splitedName[0] +  " " + splitedName[1]}
      }
    case "HOME_PAGE":
      return {
        ...state,
        quizSelectedToEdit: undefined,
        gameStage: stages[0]
      }
    case "USER_AUTH":      
      return {
        ...state,
        gameStage: stages[6]
      }
    case "UPDATE_QUIZES":
      var quizes = action.payload.quizes

      return {
        ...state,
        subjects: quizes
      }
    case "SELECT_QUESTION_AND_SORT":

      var index = action.payload.index

      var questionsSorted = state.subjects[index].questions.sort(() => {
        return Math.random() - 0.5 //EMBARALHAR
      })

      questionsSorted.map((question) => {
        question.options.sort(() => {
          return Math.random() - 0.5 //EMBARALHAR
        })
      })

      return {
        ...state,
        questions: questionsSorted,
        gameStage: stages[1]
      }
    case "UPDATE_TIME":
      return {
        ...state,
        timeNeeded: {
          minutes: state.timeNeeded.seconds === 59 ? state.timeNeeded.minutes + 1 : state.timeNeeded.minutes,
          seconds: state.timeNeeded.seconds === 59 ? 0 : state.timeNeeded.seconds + 1,
        }
      }
    case "CHANGE_QUESTION":
      var nextQuestion = state.currentQuestion + 1
      var endgame = false

      if(!state.questions[nextQuestion]) {
        endgame = true

        var otherValuesStorage = localStorage.getItem("navigatorInfo") != null ? JSON.parse(localStorage.getItem("navigatorInfo")) : []
        var today = new Date()

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        if(localStorage.getItem("navigatorInfo")){
          localStorage.removeItem("navigatorInfo")
        }

        localStorage.setItem("navigatorInfo", JSON.stringify([...otherValuesStorage, {
          score: state.score,
          timeNeeded: state.timeNeeded,
          date: dd + "/" + mm + "/" + yyyy
        }]))
      }

      return {
        ...state,
        currentQuestion: nextQuestion,
        gameStage: endgame ? stages[2] : state.gameStage,
        answerSelected: false,
      }
    case "NEW_GAME":
      return initialState
    case "UPDATE_ANSWER":
      var optionUpdated = action.payload.option

      return {
        ...state,
        answerSelected: optionUpdated
      }
    case "CONCLUDE_ANSWER":

      var answer = action.payload.answer
      var option = action.payload.option

      var correctAnswer = 0

      if(answer == option){
        correctAnswer = 1

        return {
          ...state,
          score: state.score + correctAnswer,
          answerSelected: option,
        }
      }else {
        return {
          ...state,
          incorrectQuestions: [...state.incorrectQuestions, {
            option,
            questionNumber: state.currentQuestion,
            questionObject: state.questions[state.currentQuestion],
            correction: null
          }],
          answerSelected: option,
        }
      }
    case "INCORRECT_QUESTIONS":
      return {
        ...state,
        gameStage: stages[3],
      }
      case "QUIZ_END":
        return {
          ...state,
          gameStage: stages[2]
        }
      case "QUIZ_CREATION":
        if(action.payload){
          return {
            ...state,
            gameStage: stages[4],
            quizSelectedToEdit: action.payload.quiz
          }
        }

        return {
          ...state,
          gameStage: stages[4],
        }
      case "CREATE_QUESTION_PAGE":
        return {
          ...state,
          gameStage: stages[5]
        }
    default:
      return state
  }
}

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {

  const value = useReducer(quizReducer, initialState)

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}