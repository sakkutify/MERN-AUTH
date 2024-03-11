import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
  })

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }))
  }

  const startCountdown = () => {
    setCountdown(60)
  }
  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => setCountdown(countdown - 1), 1000)
    }
  }, [countdown])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    if (formData.email === "") {
      toast.error("Email is required")
      setLoading(false)
      return
    }

    // Check if the last request was made more than 2 minutes ago
    if (countdown > 0) {
      toast.error(
        `Please wait for ${countdown} seconds before making another request`
      )
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const responseJSON = await res.json()
      if (res.ok && responseJSON.success) {
        setEmailSent(true)
        startCountdown()
      } else {
        toast.error(responseJSON.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-2">
      <div className="max-w-sm mx-auto rounded-sm shadow-inner p-3 my-16 flex flex-col gap-3 border bg-white">
        <h1 className="text-center">Forgot Password</h1>
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
          <button
            className={`bg-accentRed border rounded-sm border-black text-white h-12 hover:bg-accentDarkRed transition duration-500 ease-in-out ${
              loading || countdown > 0 ? "opacity-50" : "opacity-100"
            }`}
            disabled={loading || countdown > 0}
          >
            {loading ? (
              <span className="ml-2">Sending reset email...</span>
            ) : (
              "Send reset email"
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
        {emailSent && (
          <div className="w-full flex-col justify-between items-center bg-green-200 px-2 py-4 border border-green-600 text-black cursor-pointer">
            <div className="text-black text-center text-sm">
              Reset password link has been sent to <b>{formData.email}</b>. The
              link will expire in 15 minutes.
            </div>

            {countdown > 0 && (
              <div className="text-black text-center text-sm">
                Resend password link in <b>{countdown} seconds</b>.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
