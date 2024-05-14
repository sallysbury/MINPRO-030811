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
      const token = Array.isArray(params.token)
        ? params.token[0]
        : params.token;
      const res = await fetch('http://localhost:8000/api/users/verify', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.status == 'ok') {
        createToken(data.token, '/');
        dispatch(setUser(data.userData));
      }
      if (data.message.message == 'jwt expired') {
        deleteToken('token', '/');
        throw 'Verification link expired, please sign up again.';
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <div className="flex bg-white justify-center items-center w-full min-h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center justify-center mx-10 gap-16 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.3)] rounded-2xl h-[300px] shrink w-[600px] px-12">
        <h1 className="text-xgreen text-4xl sm:text-5xl font-bold text-center">
          Register your account
        </h1>
        <button
          className="bg-xblue hover:bg-xblue1 text-white font-semibold text-2xl w-full py-2 rounded-xl"
          onClick={handleVerify}
        >
          verify
        </button>
      </div>
    </div>
  );
}
