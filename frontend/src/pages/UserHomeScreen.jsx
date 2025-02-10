import React, { useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const UserHomeScreen = () => {
    const {userData,setUserData,token,backendUrl,loadUserProfileData} =useContext(AppContext)
    //  console.log(userData)

    return userData && (
    <div>
        <h2 className='text-center font-bold'>Welcome to User Home Screen</h2>
        <h3 className='text-center'>{userData.name}</h3>
        <h3 className='text-center'>{userData.email}</h3>
    </div>
  )
}

export default UserHomeScreen