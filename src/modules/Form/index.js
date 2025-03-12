import React, { useState } from 'react'
import Input from '../../components/input'
import Button from '../../components/button'

const Form = ({
  isSignin = false,
}) => {
    const [data, setData] = useState({
        name: '',
        ...(!isSignin && {
          phoneNumber: ''
        }),
        ...(!isSignin && {
          email: ''
        }),
        password: '',
        ...(!isSignin && {
          confirmPassword: ''
        }),
        

    })
    console.log(data)
  return (
    <div className="bg-white w-[500px] h-[600px] shadow-lg rounded-lg
    flex flex-col justify-center items-center">
      <div className='text-4xl font-extrabold'>Welcome {isSignin && 'Back'}</div>
      <div className='text-xl font-extrabold mb-5'>{isSignin ? 'Sign in to get explored' : 'Sign up to get started'}</div>
      <form onSubmit={() => console.log('submit')} className="flex flex-col items-center">
      <Input label='Username' name='name' placeholder='Enter your username' className='mb-3' 
      value={data.name} onChange={(e)=> setData({...data, name: e.target.value})} />
      {!isSignin && <Input label='Phone number' name='phoneNumber' placeholder='Enter your phone number' className='mb-3' 
      value={data.phoneNumber} onChange={(e)=> setData({...data, phoneNumber: e.target.value})}/>}
      {!isSignin && <Input label='Email' type='Email' name='email' placeholder='Enter your email' className='mb-3' 
      value={data.email} onChange={(e)=> setData({...data, email: e.target.value})}/>}
      <Input label='Password' type='password' name='password' placeholder='Enter your password' className={isSignin ? 'mb-1' : 'mb-3'} 
      value={data.password} onChange={(e)=> setData({...data, password: e.target.value})}/>
      {isSignin && (
      <div className="w-full mb-7 flex justify-end">
        <span className="text-primary cursor-pointer underline">Forgot password?</span>
      </div>
    )}
      {!isSignin && <Input label='Confirm Password' type='password' name='confirmPassword' placeholder='Enter your password again' className='mb-7' 
      value={data.confirmPassword} onChange={(e)=> setData({...data, confirmPassword: e.target.value})}/>}
      <div className="w-full flex justify-center  mb-2">
        <Button label={isSignin ? 'Sign in' : 'Sign up'} className="w-1/2" type="submit" />
      </div>
      </form>
      <div>{isSignin ? "Did'nt have an account?" : "Already have an account?"} <span className='text-primary cursor-pointer underline'>
      {isSignin ? 'Sign up' : 'Sign in'}</span></div>
    </div>
  )
}

export default Form