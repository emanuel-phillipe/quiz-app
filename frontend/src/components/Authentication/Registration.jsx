import { Envelope, Eye, EyeSlash, GraduationCap, Key, User } from '@phosphor-icons/react'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useCookies } from 'react-cookie';
import { QuizContext } from '../../context/quiz';
import LoadingScreen from '../LoadingScreen';

function Registration() {

  const [quizState, dispatch] = useContext(QuizContext)
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

  const [inputSelected, setInputSelected] = useState({
    fullName: false,
    email: false,
    school: false,
    password: false,
    confirmPassword: false
  })

  const [loading, setLoading] = useState(false)

  const [inputsValues, setInputsValues] = useState({
    fullName: "",
    school: "",
    email: "",
    password: {visible: false, content: ""},
    confirmPassword: "",
  })

  const [possibleErrors, setPossibleErrors] = useState({
    incorrectEmail: false,
  })

  const handleUserRegistration = async () => {
    setLoading(true)
    const registration = await axios.post(import.meta.env.VITE_API+"/user/create", {"fullName": inputsValues.fullName, "email": inputsValues.email, "school": inputsValues.school, "password": inputsValues.password.content}).catch((err) => {
      if(err.status === 403) {setPossibleErrors((current) => {return {...current, incorrectEmail: true}}); return;}
    })

    const userToken = await axios.post(import.meta.env.VITE_API+"/auth/login", {"email": inputsValues.email, "password": inputsValues.password.content}).catch((err) => {
      if(err.status === 404) {setPossibleErrors((current) => {return {...current, incorrectEmail: true}}); return;}
      else if(err.status === 401) {setPossibleErrors((current) => {return {...current, incorrectPassword: true}}); return;}
    })

    setLoading(false)
    setCookie("userToken", userToken.data.info, {path: "/"})
    dispatch({type: "HOME_PAGE"})
  }

  return (
    <div className='border-[0.7px] p-4 shadow-sm rounded-xl'>

        {loading && <LoadingScreen />}

        <div className='mb-5'>
          <h1 className='text-2xl font-semibold'>Registro</h1>
          <p className='text-zinc-500'>Insira as informações abaixo para continuar</p>
        </div>

        <div className='flex flex-col gap-3'>

          <div className={`gap-2 border-[0.7px] transition-all p-2 rounded-lg flex items-center ${inputSelected.fullName ? 'text-zinc-800 border-zinc-500' : 'text-zinc-400'}`}>
            <User alt='Nome Completo' size={24}/>
            <input value={inputsValues.fullName} onChange={(event) => {setInputsValues((current) => {return {...current, fullName: event.target.value}})}} onBlur={() => {setInputSelected((current) => {return {...current, fullName: false}})}} onFocus={() => {setInputSelected((current) => {return {...current, fullName: true}})}} type="text" placeholder='Phillipe Ribeiro de Carvalho' className='placeholder:text-zinc-400 w-full outline-none'/>
          </div>

          <div className={`gap-2 border-[0.7px] transition-all p-2 rounded-lg flex items-center ${inputSelected.school ? 'text-zinc-800 border-zinc-500' : 'text-zinc-400'}`}>
            <GraduationCap alt='Escola' size={24}/>
            <input value={inputsValues.school} onChange={(event) => {setInputsValues((current) => {return {...current, school: event.target.value}})}} onBlur={() => {setInputSelected((current) => {return {...current, school: false}})}} onFocus={() => {setInputSelected((current) => {return {...current, school: true}})}} type="text" placeholder='Colégio Santa Maria Minas' className='placeholder:text-zinc-400 w-full outline-none'/>
          </div>

          <div className={`gap-2 border-[0.7px] transition-all p-2 rounded-lg flex items-center ${inputSelected.email ? 'text-zinc-800 border-zinc-500' : 'text-zinc-400'}`}>
            <Envelope className={`${possibleErrors.incorrectEmail && 'text-red-400 animate-pulse'} transition-all`} alt='Email' size={24}/>
            <input value={inputsValues.email} onChange={(event) => {setInputsValues((current) => {return {...current, email: event.target.value}})}} onBlur={() => {setInputSelected((current) => {return {...current, email: false}})}} onFocus={() => {setInputSelected((current) => {return {...current, email: true}})}} type="email" placeholder='philliperibeiro@gmail.com' className='placeholder:text-zinc-400 w-full outline-none'/>
          </div>

          <div className={`gap-2 border-[0.7px] transition-all p-2 rounded-lg flex items-center ${inputSelected.password ? 'text-zinc-800 border-zinc-500' : 'text-zinc-400'}`}>
            <Key className={`${possibleErrors.incorrectPassword && 'text-red-400 animate-pulse'} transition-all`} alt='Senha' size={24}/>
            <input value={inputsValues.password.content} onChange={(event) => {setInputsValues((current) => {return {...current, password: {visible: current.password.visible, content: event.target.value}}})}} onBlur={() => {setInputSelected((current) => {return {...current, password: false}})}} onFocus={() => {setInputSelected((current) => {return {...current, password: true}})}} type={inputsValues.password.visible ? 'text' : 'password'} placeholder={inputsValues.password.visible ? 'Sua senha' : '*********'} className='placeholder:text-zinc-400 w-full outline-none'/>
            {
              inputsValues.password.visible ? <button><EyeSlash alt='Esconder senha' onClick={() => {setInputsValues((current) => {return {...current, password: {...current.password, visible: false}}})}} size={24} className='mr-1 cursor-pointer'/></button> :
              <button><Eye alt='Mostrar senha' onClick={() => {setInputsValues((current) => {return {...current, password: {...current.password, visible: true}}})}} size={24} className='mr-1 cursor-pointer'/></button>
            }
          </div>

          <div className={`gap-2 border-[0.7px] transition-all p-2 rounded-lg flex items-center ${inputSelected.confirmPassword ? 'text-zinc-800 border-zinc-500' : 'text-zinc-400'}`}>
            <Key className={`${possibleErrors.incorrectPassword && 'text-red-400 animate-pulse'} transition-all`} alt='Confirmar Senha' size={24}/>
            <input value={inputsValues.confirmPassword} onChange={(event) => {setInputsValues((current) => {return {...current, confirmPassword: event.target.value}})}} onBlur={() => {setInputSelected((current) => {return {...current, confirmPassword: false}})}} onFocus={() => {setInputSelected((current) => {return {...current, confirmPassword: true}})}} type={inputsValues.password.visible ? 'text' : 'password'} placeholder={inputsValues.password.visible ? 'Sua senha' : '*********'} className='placeholder:text-zinc-400 w-full outline-none'/>
          </div>
        </div>

        <div className='mt-5 flex flex-col gap-3'>
          <button onClick={() => {handleUserRegistration()}} disabled={inputsValues.email == "" || inputsValues.password == "" || inputsValues.fullName == "" || inputsValues.school == "" || inputsValues.confirmPassword == "" || inputsValues.password.content !== inputsValues.confirmPassword} className='py-3 disabled:cursor-not-allowed bg-zinc-100 border-zinc-300 text-zinc-500 disabled:hover:text-zinc-500 disabled:hover:border-zinc-300 hover:border-zinc-500 transition-all hover:text-zinc-800 border-[0.7px] rounded-lg w-full'>Registrar</button>
        </div>
      </div>
  )
}

export default Registration