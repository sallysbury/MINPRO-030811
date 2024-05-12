'use client';
import SignupPromotorModal from '@/components/modal/signupPromotorModal';
import SignupUserModal from '@/components/modal/sigupUserModal';

export default function UserRegister() {
  return (
    <div className="hero min-h-screen bg-white text-black">
      <div className="hero-content flex flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign Up now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="flex justify-center gap-5 font-bold max-md:flex-col">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl">
            <div className="card-body">
              <div>
                <SignupUserModal />
              </div>
            </div>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl">
            <div className="card-body">
              <div className="form-control">
                <div>
                  <SignupPromotorModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
