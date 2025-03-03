import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      // Admin login request
      const response = await axios.post("http://localhost:4000/api/auth/login", { email, password }, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message || 'Login successful')
        setIsAuthenticated(true);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred, please try again')
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>Admin</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
      </div>
    </form>
  )
}

export default Login
