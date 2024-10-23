import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { QuizContext } from '../context/quiz';

export default function Admin() {

  const [infoFetched, setInfoFetched] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
  const [quizState, dispatch] = useContext(QuizContext)

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await axios.get(import.meta.env.VITE_API + "/user", {headers: {Authorization: `Bearer ${cookies.userToken}`}}).catch((err) => {
        removeCookie()
        dispatch({type: "USER_AUTH"})
        return false
      })

      if(response) {
        if(response.data.type == "COMMON") window.location.replace("/") 
      }
    }

    getUserInfo()
  })

  return (
    <div>Admin</div>
  )}