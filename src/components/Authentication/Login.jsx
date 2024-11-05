import { Envelope, Eye, EyeSlash, Key } from '@phosphor-icons/react'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useCookies } from "react-cookie";
import { QuizContext } from '../../context/quiz';
import LoadingScreen from '../LoadingScreen';

function Login({handlePageChanging}) {

  const [quizState, dispatch] = useContext(QuizContext)
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
  const [loading, setLoading] = useState(false)

  const [inputSelected, setInputSelected] = useState({
    email: false,
    password: false
  })

  const [inputsValues, setInputsValues] = useState({
    email: "",
    password: {visible: false, content: ""},
  })

  const [possibleErrors, setPossibleErrors] = useState({
    incorrectEmail: false,
    incorrectPassword: false,
  })

  const handleUserLogin = async () => {
    setLoading(true)
    
    const userToken = await axios.post(import.meta.env.VITE_API+"/auth/login", {"email": inputsValues.email, "password": inputsValues.password.content}).catch((err) => {
      if(err.status === 404) {setPossibleErrors((current) => {return {...current, incorrectEmail: true}}); setLoading(false); return;}
      else if(err.status === 401) {setPossibleErrors((current) => {return {...current, incorrectPassword: true}}); setLoading(false); return;}
    })

    setLoading(false)

    setCookie("userToken", userToken.data.info, {path: "/"})
    dispatch({type: "HOME_PAGE"})
  }

  const handleFocusedInput = (inputName) => {
    switch(inputName){
      case "email":
        setPossibleErrors((current) => {return {...current, incorrectEmail: false}})
        setInputSelected((current) => {return {...current, email: true}})
        break;
      case "password":
        setPossibleErrors((current) => {return {...current, incorrectPassword: false}})
        setInputSelected((current) => {return {...current, password: true}})
        break;
    }
  }

  return (
    <div>

      {loading && <LoadingScreen />}

      <div className='border-[0.7px] p-4 shadow-sm rounded-xl'>
        <div className='mb-5'>
          <h1 className='text-2xl font-semibold'>Login</h1>
          <p className='text-zinc-500'>Insira as informações abaixo para continuar</p>
        </div>

        <div className='flex flex-col gap-3'>
          <div className={`gap-2 border-[0.7px] transition-all p-2 rounded-lg flex items-center ${inputSelected.email ? 'text-zinc-800 border-zinc-500' : 'text-zinc-400'}`}>
            <Envelope className={`${possibleErrors.incorrectEmail && 'text-red-400 animate-pulse'} transition-all`} alt='Email' size={24}/>
            <input value={inputsValues.email} onChange={(event) => {setInputsValues((current) => {return {...current, email: event.target.value}})}} onBlur={() => {setInputSelected((current) => {return {...current, email: false}})}} onFocus={() => {handleFocusedInput("email")}} type="email" placeholder='philliperibeiro@gmail.com' className='placeholder:text-zinc-400 w-full outline-none'/>
          </div>

          <div className={`gap-2 border-[0.7px] transition-all p-2 rounded-lg flex items-center ${inputSelected.password ? 'text-zinc-800 border-zinc-500' : 'text-zinc-400'}`}>
            <Key className={`${possibleErrors.incorrectPassword && 'text-red-400 animate-pulse'} transition-all`} alt='Senha' size={24}/>
            <input value={inputsValues.password.content} onChange={(event) => {setInputsValues((current) => {return {...current, password: {...current, content: event.target.value}}})}} onBlur={() => {setInputSelected((current) => {return {...current, password: false}})}} onFocus={() => {handleFocusedInput("password")}} type={inputsValues.password.visible ? 'text' : 'password'} placeholder={inputsValues.password.visible ? 'Sua senha' : '*********'} className='placeholder:text-zinc-400 w-full outline-none'/>
            {
              inputsValues.password.visible ? <button><EyeSlash alt='Esconder senha' onClick={() => {setInputsValues((current) => {return {...current, password: {...current.password, visible: false}}})}} size={24} className='mr-1 cursor-pointer'/></button> :
              <button><Eye alt='Mostrar senha' onClick={() => {setInputsValues((current) => {return {...current, password: {...current.password, visible: true}}})}} size={24} className='mr-1 cursor-pointer'/></button>
            }
          </div>
        </div>

        <div className='mt-5 flex flex-col gap-3'>
          <button onClick={() => {handleUserLogin()}} disabled={inputsValues.email == "" || inputsValues.password == ""} className='py-3 disabled:cursor-not-allowed bg-zinc-100 border-zinc-300 text-zinc-500 disabled:hover:text-zinc-500 disabled:hover:border-zinc-300 hover:border-zinc-500 transition-all hover:text-zinc-800 border-[0.7px] rounded-lg w-full'>Entrar</button>
        </div>
      </div>
      <div className='mt-5 w-full flex justify-center'>
        <button onClick={() => {handlePageChanging("registration")}} className='text-[0.9rem] hover:underline focus:underline transition-all outline-none cursor-pointer text-zinc-400'>{'<- '} Não tenho uma conta {' ->'}</button>
      </div>
    </div>
  )
}

export default Login