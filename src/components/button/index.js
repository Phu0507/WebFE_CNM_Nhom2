import React from 'react'

const Button = ({
    label= 'Button',
    type= 'button',
    className= '',
    disabled= false,
}) => {
  return (
    <button type={type} className={`bg-primary hover:bg-primary focus:ring-blue-300 font-medium text-white 
        w-full px-4 py-2 rounded-lg focus:outline-none text-center ${className}`} disabled={disabled}>{label}</button>
  )
}

export default Button