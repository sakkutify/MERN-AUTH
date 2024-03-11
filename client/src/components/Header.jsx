import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { SiAuthelia } from "react-icons/si"

import { FaRegUser } from "react-icons/fa6"

const Header = () => {
  const { currentUser } = useSelector((state) => state.user)

  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white border-b-gray-300 shadow-sm">
      <div className="px-2 max-w-6xl mx-auto">
        <div className="flex mx-auto justify-between px-2 py-3">
          {/* Primary */}
          <div className="flex items-center gap-0 sm:gap-16">
            {/* Logo */}
            <Link
              className="flex justify-center items-center gap-2 text-3xl"
              to="/"
            >
              <SiAuthelia className="text-accentRed" />
              <span className="font-bold text-black">Mern Auth</span>
            </Link>
          </div>

          {/* Secondary Menu */}
          <div className="flex gap-3 items-center md:order-2 justify-end">
            {currentUser ? (
              <>
                <div>
                  <button
                    className="bg-accentRed px-4 py-3 text-xl text-white border border-black hover:bg-accentDarkRed transition duration-500 ease-in-out rounded-sm"
                    onClick={() => navigate("/profile")}
                  >
                    <FaRegUser />
                  </button>
                </div>
              </>
            ) : (
              <button
                className="bg-accentRed rounded-sm px-4 py-3 text-white border border-black hover:bg-accentDarkRed transition duration-500 ease-in-out"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
