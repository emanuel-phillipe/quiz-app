import React, { useState } from 'react'
import Welcome from './Welcome'
import Login from './Login'
import Registration from './Registration'
import LoadingScreen from '../LoadingScreen'

function Auth() {

  const [currentPage, setCurrentPage] = useState("welcome")

  return (
    <div className='w-full h-screen flex justify-center items-center'>

      {currentPage === "welcome" && <Welcome handlePageChanging={(page) => {setCurrentPage(page)}}/>}
      {currentPage === "login" && <Login handlePageChanging={(page) => {setCurrentPage(page)}} />}
      {currentPage === "registration" && <Registration />}
    </div>
  )
}

export default Auth