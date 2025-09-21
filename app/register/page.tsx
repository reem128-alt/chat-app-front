import React from 'react'
import RegisterForm from './components/registerform'

export default function RegisterPage() {
  return (
    <div className='min-h-screen flex justify-center items-center relative overflow-hidden'>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"></div>
   
      
      {/* Content */}
      <div className="relative z-10 w-full  px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mt-6 font-bold text-gray-900 dark:text-white mb-2">
            Join Us Today
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create your account and get started
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}