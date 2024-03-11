import React from "react"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate= useNavigate()
  return (
    <main className="w-full">
      <div className="flex flex-col max-w-6xl mx-auto justify-center items-center mt-20 gap-4">
        <img
          src="/404NotFound.png"
          alt="404 Not Found"
          className="border border-black"
        />
        <p className="text-center">Seems you are looking for something that is not available or found</p>
        <button
          className="bg-accentRed px-4 py-3 text-white border border-black hover:bg-accentDarkRed transition duration-500 ease-in-out"
          onClick={() => navigate("/")}
        >
          Go Back to Home
        </button>
      </div>
    </main>
  )
}

export default NotFound
