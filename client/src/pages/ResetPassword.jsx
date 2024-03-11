import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  signInSuccess,
  signInStarted,
  signInFailure,
} from "../redux/user/userSlice.js"
import { useDispatch, useSelector } from "react-redux"
import useErrorMessageTimeout from "../hooks/useErrorMessageTimeout.js"
import { toast } from "react-toastify"

export default function SignUp() {
  const [formData, setFormData] = useState({
    password: "",
  })
  const { userId, token } = useParams()

  const decodedToken = decodeURIComponent(token)

  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [isValidUser, setIsValidUser] = useState(false)

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }))
  }

  useEffect(() => {
    const validateTokenAndUser = async () => {
      try {
        const res = await fetch(
          `/api/v1/auth/reset-password/${userId}/${token}`,
          {
            method: "GET",
          }
        )
        const responseJSON = await res.json()
        console.log(responseJSON)

        if (res.ok && responseJSON.success) {
          setIsValidUser(true)
          console.log(responseJSON)
        }
      } catch (error) {
        toast.error("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    validateTokenAndUser()
  }, [userId, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResetting(true)
    if (formData.password === "") {
      toast.error("Enter the password")
      return
    }

    try {
      const res = await fetch(
        `/api/v1/auth/reset-password/${userId}/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )
      const responseJSON = await res.json()
      if (res.ok && responseJSON.success) {
        toast.success("Password changed successfully")
        navigate("/sign-in")
      } else {
        toast.error(responseJSON.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="mx-2">
      <div className="max-w-sm rounded-sm shadow-inner mx-auto p-3 my-16 flex flex-col gap-3 border bg-white">
        <h1 className="text-center">Reset Password</h1>
        {isValidUser && (
          <>
            <form
              className="w-full flex flex-col gap-3"
              onSubmit={handleSubmit}
            >
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
              />
              <button
                className={`bg-accentRed rounded-sm border border-black text-white h-12 hover:bg-accentDarkRed transition duration-500 ease-in-out ${
                  resetting ? "opacity-50" : "opacity-100"
                }`}
                disabled={resetting}
              >
                {resetting ? (
                  <span className="ml-2"> Changing your password...</span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
            <div className="text-center">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-accentRed hover:underline font-semibold"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
        {!isValidUser && (
          <div className="w-full flex-col justify-between items-center bg-red-200 px-2 py-4 border border-red-600 text-black cursor-pointer">
            <div className="text-black text-center text-sm">
              Reset password link has been expired. Please initiate a new reset
              password request{" "}
              <Link
                to={"/forgot-password"}
                className="underline font-bold"
              >
                here
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
