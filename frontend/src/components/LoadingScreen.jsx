import React from 'react'

function LoadingScreen() {
  return (
    <div className='fixed top-0 left-0 w-full flex items-center justify-center h-screen backdrop-blur-sm bg-zinc-500/10'>
        <svg className='' width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className='animate-spin origin-center' d="M50.4598 99.6957C37.2393 99.6957 24.5603 94.4439 15.212 85.0956C5.86372 75.7473 0.611905 63.0683 0.611906 49.8479C0.611906 36.6274 5.86372 23.9484 15.212 14.6001C24.5603 5.25181 37.2393 -7.60568e-07 50.4598 -2.17892e-06L50.4598 6.71874C39.0212 6.71874 28.0511 11.2627 19.9629 19.351C11.8746 27.4392 7.33065 38.4093 7.33065 49.8479C7.33065 61.2864 11.8746 72.2565 19.9629 80.3447C28.0512 88.433 39.0212 92.977 50.4598 92.977L50.4598 99.6957Z" fill="black"/>
        <circle cx="51.437" cy="48.8706" r="32.2319" stroke="black" strokeWidth="2"/>
        <circle cx="51.4369" cy="48.8705" r="15.6385" fill="black"/>
        </svg>

    </div>
  )
}

export default LoadingScreen