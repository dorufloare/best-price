import React from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'


const Header = () => {
  return (
    <nav className='flex flex-row justify-between items-center pb-4 bg-slate-50'>
      <div className='flex flex-row justify-center pl-[20%] pt-4 gap-12'>
        <div className=''>
          <a href='/'>
            Home
          </a>
        </div>
        <div>
          <a href='/dashboard'>
            Dashboard
          </a>
        </div>
      </div>
    
      <div className='flex flex-row pr-[20%] items-center pt-4'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Header
