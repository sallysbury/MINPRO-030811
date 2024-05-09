'use client';
import { useSearchParams } from 'next/navigation';
import LoginPromotorModal from './modal/loginPromotorModal';
import LoginUserModal from './modal/loginUserModal';
import * as yup from 'yup'
import { Formik } from 'formik';

const LoginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required('Email required'),
  password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password required")
})
export default function Login() {
  // const search = useSearchParams()
  // const redirect = search.get('redirect') || '/'
  // const dispatch = useAppD
  const handleLogin = async (dataset: {email: string, password: string}) => {
    try {
      const respone = await fetch('http://localhost:8000/api/users/login', {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify(dataset)
      })
      const data = await respone.json()
      console.log(data);
      if (data.staus != "ok") {
        throw (data.message)
      }
    } catch (error) {
      console.log(error);
      alert (error)
      
    }
  }
  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema = {LoginSchema}
        onSubmit = {(values: {email: string, password: string}, action: {resetForm: () => void }) => {
          handleLogin(values)
            action.resetForm()
          
        }}>
          {() => {
            return (
              <div className="hero min-h-screen bg-white text-black">
                <div className="hero-content flex flex-col">
                  <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">
                      Provident cupiditate voluptatem et in. 
                    </p>
                  </div>
                  <div className="flex justify-center gap-5 font-bold max-md:flex-col">
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl">
                      <div className="card-body">
                        {/* <p>Users Login</p> */}
                        <div>
                          <LoginUserModal />
                        </div>
                      </div>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl">
                      <div className="card-body">
                        {/* <p>Promotors Login</p> */}
                        <div className="form-control">
                          <div>
                            <LoginPromotorModal />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
    </div>
  )
  
}
