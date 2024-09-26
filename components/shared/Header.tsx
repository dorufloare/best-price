import React from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'


const Header = () => {
  return (
    <nav className='flex flex-row justify-between items-center pb-4 bg-white w-screen border bg-slate-100'>
      {/* desktop */ }
      <div className='flex flex-row justify-center pl-[20%] pt-4 gap-2 md:gap-8 lg:gap-12 hidden md:flex'>
        <div>
          <Link href='/'  className='text-gray-700 font-bold text-sm'>
            Home
          </Link>
        </div>
        <div>
          <Link href='/dashboard' className='text-gray-700 font-bold text-sm'>
            Products
          </Link>
        </div>
        <div>
          <Link href='/contact' className='text-gray-700 font-bold text-sm'>
            Contact
          </Link>
        </div>
      </div>
      {/* mobile */ }
      <div className='flex flex-row justify-center pl-[10%] md:pl-[20%] pt-4 gap-8 md:gap-10 lg:gap-12 md:hidden'>
        <div>
          <Link href='/'  className='text-gray-700 font-bold text-sm'>
            <Image
              height={20}
              width={20}
              alt='home'
              src='/assets/icons/home.svg'
            />
          </Link>
        </div>
        <div>
          <Link href='/dashboard' className='text-gray-700 font-bold text-sm'>
          <Image
              height={20}
              width={20}
              alt='home'
              src='/assets/icons/dashboard.svg'
            />
          </Link>
        </div>
        <div>
          <Link href='/contact' className='text-gray-700 font-bold text-sm'>
          <Image
              height={20}
              width={20}
              alt='home'
              src='/assets/icons/contact.svg'
            />
          </Link>
        </div>
      </div>
      <div className='flex flex-row pr-[20%] items-center pt-4 gap-8 md:gap-10 lg:gap-12 '>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div className='hidden'>
            <Link href='/dashboard' className='text-gray-700 font-bold text-sm'>
            <Image
              height={20}
              width={20}
              alt='home'
              src='/assets/icons/account.svg'
              className='md:hidden'
            />
            <Image
              height={30}
              width={30}
              alt='home'
              src='/assets/icons/account.svg'
              className='hidden md:block'
            />
            </Link>
          </div>
          <UserButton/ >
        </SignedIn>
      </div>
    </nav>
  )
}

export default Header
