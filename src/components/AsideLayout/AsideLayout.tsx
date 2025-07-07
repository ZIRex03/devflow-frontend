import React from 'react'
import '@styles/index.scss'
import Aside from '@components/Aside/Aside'
import { Outlet } from 'react-router-dom'
import { CiMenuBurger } from "react-icons/ci";



const AsideLayout = () => {

  const openAside = () => {

    const aside = document.getElementById('aside');

    if(aside){
      aside.style.transform = 'translateX(0%)'
    }
  }

  return (
    <div className='aside-layout'>
        <Aside/>
        <CiMenuBurger
          className='burger-icon'
          onClick={openAside}
        />
        <Outlet/>
    </div>
  )
}

export default AsideLayout