import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="bg-color-primary flex justify-center items-center h-screen  p-10 z-10">
      <Outlet />
    </div>

  )
}
