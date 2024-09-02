"use client";

import { useAuth } from '@clerk/nextjs'; 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthListener = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => { 
    if (!isSignedIn) {
      localStorage.clear();
      router.push('/sign-in'); 
    }
  }, [isSignedIn, router]);

  return null; 
};

export default AuthListener;
