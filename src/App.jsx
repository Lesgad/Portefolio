import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen text-gray-900 font-sans flex flex-col">
        <main className="flex-1">
          <Hero />
          <About />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
