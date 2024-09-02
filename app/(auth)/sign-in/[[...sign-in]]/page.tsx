"use client"; 

import { SignIn } from '@clerk/nextjs';
import React, { useEffect } from 'react';

const SignInPage = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }, []); 

  return (
    <div className='flex justify-center align-middle items-center h-screen'>
      <SignIn/>
    </div>
  )
};

export default SignInPage;
