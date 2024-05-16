'use client';
import Cookies from 'js-cookie';
import { deleteToken } from '@/app/actions';
import { useAppDispatch, useAppSelector } from '@/app/lib/features/hooks';
import { setUser } from '@/app/lib/features/user/user';
import { useEffect } from 'react';

export const Header = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector((state) => state.Users.value);
  
  const getUser = async (token: any) => {
    try {
      const res = await fetch(`http://localhost:8000/api/accounts/accountType`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
        }
    })
      const data = await res.json()
      console.log(data);
      dispatch(setUser(data.userData))
    } catch (error) {
      console.log(error);
    }
  }

  const Logout = () => {
    dispatch(setUser(null));
    deleteToken('token', '/');
    Cookies.remove('token');
  };

  useEffect(() => {
    const token = Cookies.get('token')
   if (token) { getUser(token)}
  }, []);

  return (
    <div className="navbar bg-white text-black">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>E</a></li>
            <li><a>Event Category</a>
              <ul className="p-2">
                <li><a>Music</a></li>
                <li> <a>Sport</a></li>
              </ul>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl" href="/">
          Groove Gala
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Event</a>
          </li>
          <li>
            <a>Everything</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className={`btn btn-ghost ${account?.type ? "hidden" : "flex" }`} href='/login'>
          Login
        </a>
        <a className={`btn btn-ghost ${account?.type ? "hidden" : "flex" }`} href='/signup'>
          Sign Up
        </a>
      </div>
      <div>
        <div className={`dropdown dropdown-end`}>
          <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle avatar ${account?.type ? "flex" : "hidden"}`}>
            <div className="w-10 rounded-full">
              <img alt="Image Users" src={account?.image}/>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content rounded-box w-52"
          >
            <li>
              <a className="justify-between" href='/profile'>
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a onClick={Logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
