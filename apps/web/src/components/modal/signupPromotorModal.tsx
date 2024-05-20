'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

const registerSchema = yup.object().shape({
  name: yup.string().required('name can not be empty'),
  email: yup.string().email('invalid email').required('email can be empty'),
  password: yup
    .string()
    .min(6, 'password must containt at least 6 characters')
    .required('password can not be empty'),
});
export default function SignupPromotorModal() {
  const router = useRouter();
  const handleRegister = async (dataSet: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const respone = await fetch(
        'http://localhost:8000/api/promotors/register',
        {
          method: 'POST',
          headers: {
            'content-Type': 'application/json',
          },
          body: JSON.stringify(dataSet),
        },
      );
      const data = await respone.json();
      if (data.status !== 'ok') {
        throw data;
      } else {
        router.push('/waitingverif');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
        }}
        validationSchema={registerSchema}
        onSubmit={(
          values: { name: string; email: string; password: string },
          action: { resetForm: () => void },
        ) => {
          console.log(values);
          handleRegister(values);
          action.resetForm();
        }}
      >
        {() => {
          return (
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center justify-center mx-10 bg-white drop-shadow rounded-2xl px-12">
                <h1 className="text-center">
                  Promotors Register
                </h1>
                <Form className="flex flex-col items-center w-full">
                  <div className="flex max-sm:flex-col justify-center items-center max-sm:w-full">
                    <div className="flex flex-col gap-7 sm:gap-10 sm:my-5 w-full">
                      <div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="name"
                            className="text-sm font-semibold"
                          >
                            Name
                          </label>
                          <Field
                            type="name"
                            placeholder="Your name"
                            name="name"
                            className="bg-zinc-200 text-xl text-xblack  border-b-[1px] border-xmetal focus:outline-none placeholder:text-zinc-300"
                          />
                        </div>
                        <ErrorMessage
                          component="div"
                          name="name"
                          className="text-xmetal text-sm text-[0.7rem] fixed"
                        />
                      </div>
                      <div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="email"
                            className="text-sm text-xgreen font-semibold"
                          >
                            Email
                          </label>
                          <Field
                            type="email"
                            placeholder="Your email"
                            name="email"
                            className="bg-zinc-200 text-xl text-black border-b-[1px] border-xmetal focus:outline-none placeholder:text-zinc-300"
                          />
                        </div>
                        <ErrorMessage
                          component="div"
                          name="email"
                          className=" text-[0.7rem] fixed"
                        />
                      </div>
                      <div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="password"
                            className="text-sm"
                          >
                            Password
                          </label>
                          <Field
                            type="password"
                            placeholder="Your password"
                            name="password"
                            className="bg-zinc-200 text-xl text-black border-b-[1px] border-xmetal focus:outline-none placeholder:text-zinc-300"
                          />
                        </div>
                        <ErrorMessage
                          component="div"
                          name="password"
                          className="text-sm text-[0.7rem] fixed"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-2xl w-full py-2 rounded-xl mt-10 sm:mt-20 relative"
                  >
                    Register
                    
                  </button>
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}
