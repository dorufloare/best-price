import Image from 'next/image';
import React, { useState } from 'react';

const ProductThumbnail: React.FC<{
  imageUrl: string;
  title: string;
  available: boolean;
  price: string;
}> = ({ imageUrl, title, available, price }) => {
  
  // State to handle fallback image
  const [imgSrc, setImgSrc] = useState(imageUrl);

  const handleImageError = () => {
    // When image fails to load, use the placeholder image
    setImgSrc('/assets/images/placeholder.jpg');
  };

  return (
    <div className='flex flex-col justify-center items-center w-[100%] p-5'>
      <div className='relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] overflow-hidden'>
        <Image
          src={imgSrc}
          alt='product thumbnail'
          objectFit='contain'
          objectPosition='center'
          layout='fill'
          onError={handleImageError}  // Handle image load error
        />
      </div>
      <div className='flex flex-row justify-between items-start gap-0 flex-shrink-0 w-[100%] pt-4'>
        <p className='w-[50%] h-16 text-xs md:text-sm font-semibold overflow-hidden flex-shrink-0'>
          {title}
        </p>
        <p className='w-[30%] h-16 text-xs md:text-sm font-semibold overflow-hidden flex-shrink-0'>
          {available ? price : 'Out of Stock'}
        </p>
      </div>
    </div>
  );
};

export default ProductThumbnail;
