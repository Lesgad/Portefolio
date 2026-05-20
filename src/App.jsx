import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1" />
      <Footer />
    </div>
  )
}

export default App
