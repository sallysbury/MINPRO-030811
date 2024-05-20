'use client';
import { createToken, deleteToken } from '@/app/actions';
import { useAppDispatch } from '@/app/lib/features/hooks';
import { setUser } from '@/app/lib/features/user/user';
import { useParams } from 'next/navigation';

export default function Verify() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const handleVerify = async () => {
    try {
      const token = Array.isArray(params.token)? params.token[0] : params.token;
      const res = await fetch('http://localhost:8000/api/accounts/verify', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token);
      
      const data = await res.json();
      console.log(data);
      
      if (data.status == 'ok') {
        createToken(data.token, '/');
        dispatch(setUser(data.data));
      }
      if (data.message == 'expired') {
        deleteToken('token', '/');
        throw 'link expired, please sign up again.';
      }

    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <div className="flex bg-white justify-center items-center w-full h-screen">
      <div>
        <h1 className='ver gap-10'>
          Verify your account
        </h1>
        <button className="bg-black text-white text-2xl w-full py-2 rounded-xl" onClick={handleVerify}>
          verify
        </button>
      </div>
    </div>
  );
}
