import React from 'react';
import { NavLink } from 'react-router';

export const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <NavLink className="text-black" to="/">My Tasks</NavLink>
                    </li>
                </ul>
            </div>
            <a className="btn btn-ghost text-2xl text-amber-100 hover:bg-transparent">TaskMaster</a>
        </div>
        <div className="navbar-end hidden lg:flex">
            <ul className="menu menu-horizontal ">
                <li className='text-xl text-yellow-100'>
                    <NavLink className="hover:bg-transparent border-b-2 border-amber-100" to="/">My Tasks</NavLink>
                </li>
            </ul>
        </div>
    </div>
  )
}


export default Header;
