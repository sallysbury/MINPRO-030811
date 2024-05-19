'use client'
import { ErrorMessage, Field, Formik, Form } from "formik"
import Cookies from "js-cookie"
import { useState } from "react"
import { useDispatch } from "react-redux"
import * as yup from'yup'
import {setUser} from '@/app/lib/features/user/user'

const registerSchema = yup.object().shape({
    name: yup.string().required('name required').min(5, 'name must be at least 5 character').max(20)
})
export default function ChangeNameModal() {
    const dispatch = useDispatch()
    const [isConfirm, setConfirm] = useState()
    const openModal = () => {
        const modal = document.getElementById('my_modal_5')
        
    }
    const closeModal = () => {
        const modal = document.getElementsByClassName('my_modal_name')
        if (modal instanceof HTMLDialogElement){
            modal.close()
        }
    }
    const getUser = async (token: any) => {
        try {
          const res = await fetch(`http://localhost:8000/api/accounts/`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
            }
        })
          const data = await res.json()
          console.log(data);
          dispatch(setUser(data.data))
        } catch (error) {
          console.log(error);
        }
      }
    const handleConfirm = async (dataset: {name: string}) => {
        try {
            const token = Cookies.get('token')
            const res = await fetch('http://localhost:8000/api/accounts/changeName', {
                method: 'PATCH',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer, ${token}`
                },
                body: JSON.stringify(dataset)
            })
            const data = await res.json()
            dispatch(setUser(data.data))
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Formik
                initialValues={{
                    name: "",
                }}
                validationSchema={registerSchema}
                onSubmit={(values: {name: string}, action: {resetForm: () => void}) => {
                    handleConfirm(values)
                    action.resetForm()
                }}>
                {() => {
                    return (
                        <dialog id="my_modal_changeName" className="modal">
                            <div className="modal-box flex flex-col items-center justify-center rounded-2xl max-w-[400px] h-[500px] drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]">
                                <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-zinc-300 ">✕</button>
                                </form>
                                <div className={`${isConfirm? 'hidden' : 'flex'} flex-col items-center w-full px-5`}>
                                    <h1 className=' font-bold text-center'>Change Name</h1>
                                    <Form className='flex flex-col items-center w-full'>
                                        <div className='w-full my-28'>
                                            <div  className='flex flex-col'>
                                                <label htmlFor="name" className="font-semibold ml-4"></label>
                                                <Field type="name" placeholder="New name" name="name" className=" text-white text-xl rounded-full py-2 px-5 focus:outline-none placeholder:text-zinc-400" />
                                            </div>
                                            <ErrorMessage component="div" name="name"  className="text-zinc-400 text-sm text-[0.7rem] fixed" />
                                        </div>                               
                                        <button type="submit" className="text-white text-lg sm:text-xl transition-colors hover:bg-xgreen1 sm:py-2 sm:px-4 rounded-xl w-full">Confirm</button>
                                    </Form>
                                </div>
                                <div className={`${isConfirm? 'flex' : 'hidden'} flex-col items-center gap-7`}>
                                    <p className='text font-semibold'>Confirm</p>
                                </div>
                            </div>
                        </dialog>
                    )
                }}
            </Formik>
        </div>
      )
}
