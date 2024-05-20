'use client'
import { ErrorMessage, Field, Form, Formik } from "formik"
import React, {useState} from 'react'
import * as yup from 'yup'
import Cookies from "js-cookie"

const registerSchema = yup.object().shape({
    email: yup.string().email('invalid email').required('email can not be empty')
})

export default function ChangeEmail() {
    const [isConfirm, setConfirm] = useState(false)

    const closeModal = () => {
        const modal = document.getElementById('my_modal_changeEmail')
        if (modal instanceof HTMLDialogElement){
            modal.close()
        }
    }

    const handleConfirm = async (dataSet: {email: string}) => {
        try {
            const token = Cookies.get('token')
            const res = await fetch('http://localhost:8000/api/account/changeEmail', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dataSet)
            })
            const data = await res.json()
            console.log(data);
            if (data.status == 'ok'){
                setConfirm(true)
                setTimeout(() => {
                    closeModal()
                    setConfirm(false)
                }, 3000)
            }else if (data.message){
                alert (data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Formik
                initialValues={{
                    email: "",
                }}
                validationSchema={registerSchema}
                onSubmit={(values: {email: string}, action: {resetForm: () => void}) => {
                    handleConfirm(values)
                    action.resetForm()
                }}>
                {() => {
                    return (
                        <dialog id="my_modal_changeEmail" className="modal">
                            <div className="modal-box flex flex-col bg-white items-center justify-center rounded-2xl max-w-[400px] h-[500px] drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]">
                                <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-zinc-300 ">✕</button>
                                </form>
                                <div className={`${isConfirm? 'hidden' : 'flex'} flex-col items-center w-full px-5`}>
                                    <h1 className='text-black text-4xl font-bold text-center text-balance'>Change Email</h1>
                                    <Form className='flex flex-col items-center w-full'>
                                        <div className='w-full my-28'>
                                            <div  className='flex flex-col'>
                                                <label htmlFor="email" className="text-base text-black font-semibold ml-4"></label>
                                                <Field type="email" placeholder="New email" name="email" className=" text-white text-xl rounded-full py-2 px-5 focus:outline-none placeholder:text-zinc-400" />
                                            </div>
                                            <ErrorMessage component="div" name="email"  className="text-zinc-400 text-sm text-[0.7rem] fixed" />
                                        </div>                               
                                        <button type="submit" className="text-black text-lg sm:text-xl bg-white transition-colors sm:py-2 sm:px-4 rounded-xl w-full relative">Confirm</button>
                                    </Form>
                                </div>
                                <div className={`${isConfirm? 'flex' : 'hidden'} flex-col items-center gap-7`}>
                                    <p className='text-black text-3xl font-semibold'>Verify your new email</p>
                                    <p className='text-black text-xl font-semibold'>Check your inbox</p>
                                </div>
                            </div>
                        </dialog>
                    )
                }}
            </Formik>
        </div>
      )
}