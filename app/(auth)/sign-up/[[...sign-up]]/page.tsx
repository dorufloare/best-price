"use client"; 

import { SignUp } from '@clerk/nextjs';
import React, { useEffect } from 'react';

const SignInPage = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }, []); 

  return (
    <div className='flex justify-center align-middle items-center h-screen'>
      <SignUp/>
    </div>
  )
};

export default SignInPage;
