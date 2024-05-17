'use client';
import { useAppSelector } from '../lib/features/hooks';
import Image from 'next/image';

export default function Profile() {
  const user = useAppSelector((state) => state.Users.value);
  return (
    <div className="card h-screen bg-white pt-20 px-20 gap-10">
      <div className="flex bg-white transition">
        <div className="hidden sm:block sm:basis-56">
          <img
            alt="profile"
            src={user?.image}
            className="aspect-square h-full w-full object-cover rounded-xl"/>
        </div>
      </div>
      <div className="flow-root">
  <dl className="-my-3 divide-y divide-gray-100 text-sm">
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-gray-900">Title</dt>
      <dd className="text-gray-700 sm:col-span-2">Mr / Mrs</dd>
    </div>

    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-gray-900">Name</dt>
      <dd className="text-gray-700 sm:col-span-2">{user?.name}</dd>
    </div>

    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-gray-900">Email</dt>
      <dd className="text-gray-700 sm:col-span-2">{user?.email}</dd>
    </div>

    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-gray-900">Role</dt>
      <dd className="text-gray-700 sm:col-span-2">{user?.type}</dd>
    </div>

    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-gray-900">Referral</dt>
      <dd className="text-gray-700 sm:col-span-2">{user?.referral}</dd>
    </div>

    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="font-medium text-gray-900">Point</dt>
      <dd className="text-gray-700 sm:col-span-2">$1,000,000+</dd>
    </div>
  </dl>
</div>
    </div>
  );
}
