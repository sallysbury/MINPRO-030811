'use client'
import LoginPromotorModal from "@/components/modal/loginPromotorModal";
import LoginUserModal from "@/components/modal/loginUserModal";

export default function LoginPage(){
    return(
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
                      <div>
                        <LoginUserModal />
                      </div>
                    </div>
                  </div>
                  <div className="card shrink-0 w-full max-w-sm shadow-2xl">
                    <div className="card-body">
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
    )
}