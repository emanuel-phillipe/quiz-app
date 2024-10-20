import React from 'react'

function Welcome({handlePageChanging}) {
  return (
    <div className='border-[0.7px] p-4 shadow-sm rounded-xl'>
        <h1 className='text-2xl font-semibold'>Bem vindo(a)!</h1>
        <p className='text-zinc-500'>Que bom vê-lo(a) por aqui!</p>

        <div className='mt-5 text-zinc-500'>
          <p className=''>Percebi que você não está autenticado com uma conta... Ou talvez nem tenha uma!</p>
          <p>Escolha uma opção abaixo para acessar a plataforma :)</p>
        </div>

        <div className='mt-10 flex flex-col gap-3'>
          <button onClick={() => {handlePageChanging("login")}} className='py-3 border-zinc-300 text-zinc-600 hover:border-zinc-500 transition-all hover:text-zinc-800 border-[0.7px] rounded-lg w-full'>Já tenho uma conta</button>
          <button onClick={() => {handlePageChanging("registration")}} className='py-3 border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-zinc-500 transition-all hover:text-zinc-800 border-[0.7px] rounded-lg w-full'>Criar uma conta</button>
        </div>
      </div>
  )
}

export default Welcome