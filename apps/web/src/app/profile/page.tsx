'use client';
import { useAppSelector } from '../lib/features/hooks';
import Image from 'next/image';

export default function Profile() {
  const user = useAppSelector((state) => state.Users.value);
  return (
    <div className='bg-white text-black '>
      <div className='profile pt-10 text-3xl text-center'>
        your profile
      </div>
    <div className="flex flex-row h-screen w-full items-center">
      
      <div className=" w-1/2 bg-yellow-200 m-20 text-5xl">
        {user?.name}
        <br/>
        <p className='email text-sm'>{user?.email}</p>
      </div>
      <div className="flex w-1/2 m-20 items-center justify-center">
        <Image
          src={user?.image ? user?.image : ''}
          width={500}
          height={500}
          alt='image'
          className="img rounded-xl"
        />
      </div>
    </div>
    </div>
  );
}
