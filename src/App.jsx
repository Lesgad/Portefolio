import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'

function App() {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen text-gray-900 font-sans flex flex-col">
        <main className="flex-1">
          <Hero />
          <About />
          <Contact />
        </main>
      </div>
    </>
  )
}

export default App
