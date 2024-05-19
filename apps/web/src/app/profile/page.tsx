'use client';
import { setUser } from '../lib/features/user/user';
import { useAppSelector } from '../lib/features/hooks';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

export default function Profile() {
  const account = useAppSelector((state) => state.account.value);
  const imageRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [image, setImage] = useState<File | null>(null)

  const getUser = async (token: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/accountType', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      const data = await response.json()
      dispatch(setUser(data.data))
    } catch (error) {
      alert(error)
    }
  }
  const imageSubmit = async () => {
    try {
      const formData = new FormData()
      if (image) {
        formData.append("file", image)
      }
      const token = Cookies.get("token")
      const res = await fetch('http://localhost:8000/api/accounts/images', {
        method: "PATCH",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (res.ok) {
        getUser(token)
      } else {
        throw res
      }
    } catch (error) {
      console.log(error);
    }
  }
  const change = () => {
    if (imageRef.current && imageRef.current.files){
      const data = imageRef.current.files[0]
      setImage(data)
    }
  }
  return (
    <div className="card h-screen bg-white py-20 px-96 gap-10">
      <div className="flex bg-white transition gap-5">
        <div className="hidden sm:block sm:basis-56">
          <img
            alt="profile"
            src={account?.image}
            className="aspect-square h-full w-full object-cover rounded-xl"
          />
        </div>
        <label className="flex sm:flex sm:items-end sm:justify-end">
          <input onChange={change} type='file' ref={imageRef}/>
          <button onClick={imageSubmit} type='button' className=' bg-gray-500 text-white rounded-md p-1'>
            save
            </button>
        </label>

      </div>
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Title</dt>
            <dd className="text-gray-700 sm:col-span-2">Mr / Mrs</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Name</dt>
            <dd className="text-gray-700 sm:col-span-2">{account?.name}</dd>
            <dt></dt>
            <dd>
             
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Email</dt>
            <dd className="text-gray-700 sm:col-span-2">{account?.email}</dd>
            <dt></dt>
            <dd>
              
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Role</dt>
            <dd className="text-gray-700 sm:col-span-2">{account?.type}</dd>
            <dt></dt>
            <dd></dd>
          </div>

          <div className={`grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 ${account?.type == "promotors"?  "hidden" : "flex"}`}>
            <dt className="font-medium text-gray-900">Referral</dt>
            <dd className="text-gray-700 sm:col-span-2">{account?.referral}</dd>
          </div>

          <div className={`grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 ${account?.type == "promotors"?  "hidden" : "flex"}`}>
            <dt className="font-medium text-gray-900">Point</dt>
            <dd className="text-gray-700 sm:col-span-2">{new Intl.NumberFormat('en-DE').format(+account?.sumPoint!)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
