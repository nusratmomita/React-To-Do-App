import React from 'react'
import Footer from '../Components/Footer'
import { Outlet } from 'react-router'
import Header from '../Components/header'

const Root = () => {
  return (
    <div className='max-w-7xl mx-auto'>
        <Header></Header>
        <Outlet></Outlet>
        {/* <Footer></Footer> */}
    </div>
  )
}

export default Root