import React from 'react'

const Input = ({
    label= '',
    type= 'text',
    name= '',
    className= '',
    isRequired= true,
    placeholder= '',
    value= '',
    onChange= () => {},

}) => {
  return (
    <div>
        <label className='block text-sm font-medium text-gray-900'>{label}</label>
        <input type={type}  id={name} className={`bg-gray-50 w-64 px-4 py-1.5 placeholder-gray-320 
        border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-500
         ${className}`} placeholder={placeholder} required = {isRequired} value={value} onChange={onChange}
        />
    </div>
  )
}

export default Input