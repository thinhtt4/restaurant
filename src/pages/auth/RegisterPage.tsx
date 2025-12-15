
import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="bg-color-primary flex justify-center items-center h-screen  p-10 z-10">
      <div className="container relative w-[880px]  bg-white rounded-[30px]  overflow-hidden flex">
        <div className=" w-1/2 bg-color-banner  rounded-r-[150px] flex justify-center items-center text-center">
          <div>
            <h1 className="text-[36px]">Welcome Back!</h1>
            <p className="mt-[5px] mb-10   mx-0 text-white">
              Already have an account?
            </p>
            <Link to={"/auth/login"} data-discover="true">
              <button className="btn register-btn btn-white">Login</button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-full p-[25px] overflow-y-auto">
            <RegisterForm/>
          </div>
        </div>
      </div>
    </div>
  );
}
