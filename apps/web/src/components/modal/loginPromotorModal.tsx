'use client';
import { createToken } from '@/app/actions';
import { setUser } from '@/app/lib/features/user/user';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

const registerSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('email can not be empty'),
  password: yup
    .string()
    .min(6, 'password must contains at least 6 characters')
    .required('password can not be empty'),
});

export default function LoginPromotorModal() {
  const router = useRouter();
  const dispatch = useDispatch()
  const handleLogin = async (dataSet: { email: string; password: string }) => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/promotors/login',
        {
          method: 'POST',
          headers: {
            'content-Type': 'application/json',
          },
          body: JSON.stringify(dataSet),
        },
      );
      const data = await response.json();
      console.log(data);
      
      dispatch(setUser(data.data))
      createToken(data.token, '/')
      console.log(data.token);
      if (data.status !== 'ok') {
        throw data.message;
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={registerSchema}
        onSubmit={(
          values: { email: string; password: string },
          action: { resetForm: () => void },
        ) => {
          handleLogin(values);
          action.resetForm();
        }}
      >
        {() => {
          return (
            <div className="flex flex-col items-center justify-center mx-3 bg-white rounded-2xl">
              <h1 className="text-4xl font-bold mb-10 sm:mb-20 text-center text-balance">
                Promotors
              </h1>
              <Form className="flex flex-col items-center w-full gap-7">
                <div className="w-full">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-sm">
                      Email
                    </label>
                    <Field
                      type="email"
                      placeholder="Promotors email"
                      name="email"
                      className="bg-zinc-200 text-xl text-black border-b-[1px] focus:outline-none placeholder:text-zinc-300"
                    />
                  </div>
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="text-sm text-[0.7rem] fixed"
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-col">
                    <label htmlFor="password" className="text-sm">
                      Password
                    </label>
                    <Field
                      type="password"
                      placeholder="Promotors password"
                      name="password"
                      className="bg-zinc-200 text-xl border-b-[1px] border-xmetal focus:outline-none placeholder:text-zinc-300"
                    />
                  </div>
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="text-xmetal text-sm text-[0.7rem] fixed"
                  />
                </div>
                <button
                  type="submit"
                  className="text-black text-2xl w-full py-2 rounded-xl mt-10 sm:mt-20 relative"
                >
                  Login
                </button>
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}
function setPoint(userData: any): any {
  throw new Error('Function not implemented.');
}
