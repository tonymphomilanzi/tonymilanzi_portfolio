import React from 'react'

const ContactSection = () => {
  return (
     <section id="get-started" className="footer-section min-h-screen flex flex-col justify-center items-center text-center ">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
        Let’s Build Something Together
      </h2>
      <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">
        Reach out and we’ll bring your ideas to life with clean, scalable digital solutions.
      </p>
      <button className="px-6 py-3 bg-purple-500 rounded-md hover:bg-purple-600 transition">
        Contact Me
      </button>
    </section>
  )
}

export default ContactSection



