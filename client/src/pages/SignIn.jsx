import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  signInSuccess,
  signInStarted,
  signInFailure,
} from "../redux/user/userSlice.js"
import { useDispatch, useSelector } from "react-redux"
import useErrorMessageTimeout from "../hooks/useErrorMessageTimeout.js"
import { toast } from "react-toastify"
import { FaEyeSlash, FaEye } from "react-icons/fa"

export default function SignUp() {
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)

  const { errorMessage, loading } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(signInStarted())

    if (formData.email === "" || formData.password === "") {
      dispatch(signInFailure("All fields are required"))
      return
    }

    try {
      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const responseJSON = await res.json()
      console.log(responseJSON, "responseJson----->")
      if (res.ok && responseJSON.success) {
        dispatch(signInSuccess(responseJSON.data))
        navigate("/")
      } else {
        dispatch(signInFailure(responseJSON.message))
      }
    } catch (error) {
      dispatch(signInFailure("Something went wrong"))
    }
  }

  useErrorMessageTimeout(errorMessage)

  useEffect(() => {
    toast.error(errorMessage)
  }, [errorMessage])

  return (
    <div className="mx-2">
      <div className="max-w-sm mx-auto p-3 my-16 flex flex-col gap-3 border rounded-sm shadow-inner bg-white">
        <h1 className="text-center">Sign In</h1>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="email"
            placeholder="Email"
            autoComplete="email"
            onChange={handleChange}
            value={formData.email}
          />
          <div className="relative">
            <input
              className="w-full"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-3 top-3 text-2xl text-gray-700 cursor-pointer transition ease-in-out"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-3 text-2xl text-gray-700 cursor-pointer transition ease-in-out"
              />
            )}
          </div>
          <button
            className={`bg-accentRed border rounded-sm border-black text-white h-12 hover:bg-accentDarkRed transition duration-500 ease-in-out ${
              loading ? "opacity-50" : "opacity-100"
            }`}
            disabled={loading}
          >
            {loading ? <span className="ml-2">Signing In...</span> : "Sign In"}
          </button>
        </form>
        <div className="text-center">
          <div>
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-accentRed hover:underline font-semibold"
            >
              Sign up
            </Link>
          </div>
          <Link
            to={"/forgot-password"}
            className="text-accentRed hover:underline font-semibold"
          >
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  )
}
