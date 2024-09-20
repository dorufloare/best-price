import React from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Link from 'next/link'


const Header = () => {
  return (
    <nav className='flex flex-row justify-between items-center pb-4 bg-white'>
      <div className='flex flex-row justify-center pl-[20%] pt-4 gap-12'>
        <div className=''>
          <Link href='/'  className='text-gray-700 font-bold text-sm'>
            Home
          </Link>
        </div>
        <div>
          <Link href='/dashboard' className='text-gray-700 font-bold text-sm'>
            Your products
          </Link>
        </div>
        <div>
          <Link href='/dashboard' className='text-gray-700 font-bold text-sm'>
            Support
          </Link>
        </div>
        <div>
          <Link href='/dashboard' className='text-gray-700 font-bold text-sm'>
            About us
          </Link>
        </div>
        
      </div>
    
      <div className='flex flex-row pr-[20%] items-center pt-4 gap-12'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div>
            <Link href='/dashboard' className='text-gray-700 font-bold text-sm'>
              Account
            </Link>
          </div>
          <UserButton/ >
        </SignedIn>
      </div>
    </nav>
  )
}

export default Header
