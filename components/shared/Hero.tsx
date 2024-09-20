import React from 'react'
import { Button } from "@/components/ui/button";
import Header from './Header';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { GlobeDemo } from './Globe';

const Hero = () => {
  
  const { userId }: { userId: string | null } = auth();
  const isLoggedIn = !userId ? false: true;

  return (
    <>
      {/* Hero */}
      <div className="container py-24 lg:py-32 h-screen">
        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center h-[100%]">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Best Price: Save money online!
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Track your prices and get notified about the best buying oportunities on the most popular online shopping websites
            </p>
            {/* Buttons */}
            <div className="mt-7 grid gap-3 w-full sm:inline-flex ">
              <Button size={"lg"}>Get started</Button>
              <Button variant={"outline"} size={"lg"}>
                Contact us
              </Button>
            </div>
            {/* End Buttons */}
            
          </div>
          {/* Col */}
          <div className="relative ms-4 h-[100%]">
            <div className='h-[90%] w-auto'>
              <GlobeDemo/>
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Hero */}
    </>
  );
}

export default Hero
