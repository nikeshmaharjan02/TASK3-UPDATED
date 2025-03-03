import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'

const Sidebar = () => {

  return (
    <div className='min-h-screen bg-white border-r '>
      <ul className='text-[#515151] mt-5'>
        <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' :''}`} to={'/admin-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' :''}`} to={'/sales-report'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Sales Report</p>
        </NavLink>


        <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' :''}`} to={'/users-list'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Users List</p>
        </NavLink>


        <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' :''}`} to={'/add-product'}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Product</p>
        </NavLink>
    </ul> 
    
      
    </div>
  )
}

export default Sidebar
