import Image from 'next/image';
import React from 'react'

const ProductThumbnail: React.FC<{
  imageUrl: string;
  title: string;
  available: boolean;
  price: string;
}> = ({ imageUrl, title, available, price }) => {

  console.log(imageUrl);

  return (
    <div className='flex flex-col justify-center items-center w-[100%] p-5'>
      <Image
        src={imageUrl}
        alt='product thumbnail'
        width={200}
        height={200}
      />
      <div className='flex flex-row justify-between items-start gap-0 flex-shrink-0 w-[100%] pt-4'>
        <p className='w-[50%] h-16 text-sm overflow-hidden flex-shrink-0'> {title} </p>
        <p className='w-[30%] h-16 text-sm overflow-hidden flex-shrink-0'> {available === true ? price : 'Out of Stock'} </p>
      </div>
    </div>
  )
}

export default ProductThumbnail
