import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="bg-color-primary flex justify-center items-center h-screen  p-10 z-10">
      <div className="container relative w-[880px] h-[600px] bg-white rounded-[30px]  overflow-hidden flex">
        <div className=" w-1/2 bg-color-banner  rounded-r-[150px] flex justify-center items-center text-center">
          <div>
            <h1 className="text-[36px]">Hello, Welcome</h1>
            <p className="mt-[5px] mb-10 mx-0 text-white">Don't have an account?</p>
            <Link to={"/auth/register"} data-discover="true">
              <button className="btn register-btn btn-white">Register</button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-full p-[25px]">
          <LoginForm/>
          </div>
        </div>
      </div>
    </div>
  );
}
