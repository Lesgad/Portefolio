import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen text-gray-900 font-sans flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}
