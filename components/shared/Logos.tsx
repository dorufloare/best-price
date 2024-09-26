import React from 'react'
import Marquee from 'react-fast-marquee'
import Image from 'next/image'

const Logos = () => {

  return (
    <>
      <Marquee className='flex items-center'>
        <div className='mx-6 md:mx-12 lg:mx-24 h-[80px] md:h-[150px] w-[80px] md:w-[150px]'>
          <div className='relative w-full h-full'>
            <a href='https://www.emag.ro' target='_blank' rel='noopener noreferrer' className='absolute inset-0 z-10'>
              <span className='sr-only'>Visit eMAG</span>
            </a>
            <Image
              alt='emag'
              src='/assets/logos/emag.png'
              fill
              className='object-contain'
            />
          </div>
        </div>
        <div className='mx-6 md:mx-12 lg:mx-24 h-[80px] md:h-[150px] w-[80px] md:w-[150px]'>
          <div className='relative w-full h-full'>
            <a href='https://www.altex.ro' target='_blank' rel='noopener noreferrer' className='absolute inset-0 z-10'>
              <span className='sr-only'>Visit Altex</span>
            </a>
            <Image
              alt='altex'
              src='/assets/logos/altex.png'
              fill
              className='object-contain'
            />
          </div>
        </div>
        <div className='mx-6 md:mx-12 lg:mx-24 h-[80px] md:h-[150px] w-[80px] md:w-[150px]'>
          <div className='relative w-full h-full'>
            <a href='https://www.mediagalaxy.ro' target='_blank' rel='noopener noreferrer' className='absolute inset-0 z-10'>
              <span className='sr-only'>Visit MediaGalaxy</span>
            </a>
            <Image
              alt='mediagalaxy'
              src='/assets/logos/mediagalaxy.jpg'
              fill
              className='object-contain'
            />
          </div>
        </div>
        <div className='mx-6 md:mx-12 lg:mx-24 h-[80px] md:h-[150px] w-[80px] md:w-[150px]'>
          <div className='relative w-full h-full'>
            <a href='https://www.cel.ro' target='_blank' rel='noopener noreferrer' className='absolute inset-0 z-10'>
              <span className='sr-only'>Visit CEL</span>
            </a>
            <Image
              alt='cel'
              src='/assets/logos/cel.png'
              fill
              className='object-contain'
            />
          </div>
        </div>
        <div className='mx-6 md:mx-12 lg:mx-24 h-[80px] md:h-[150px] w-[80px] md:w-[150px]'>
          <div className='relative w-full h-full'>
            <a href='https://www.nike.com' target='_blank' rel='noopener noreferrer' className='absolute inset-0 z-10'>
              <span className='sr-only'>Visit Nike</span>
            </a>
            <Image
              alt='nike'
              src='/assets/logos/nike.png'
              fill
              className='object-contain'
            />
          </div>
        </div>
        
      </Marquee>
    </>
  )
}

export default Logos
