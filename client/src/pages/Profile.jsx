import useBodyScrollLock from "../hooks/useBodyScrollLock"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import LoaderIcon from "../assets/LoaderIcon.svg"

import { useSelector } from "react-redux"
import {
  updateUserStarted,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice.js"
import { useDispatch } from "react-redux"
import useErrorMessageTimeout from "../hooks/useErrorMessageTimeout.js"
import useSignout from "../hooks/useSignout.js"
import useDeleteUser from "../hooks/useDeleteUser.js"
import { toast } from "react-toastify"
import ConfirmModal from "../components/ConfirmModal.jsx"

export default function Profile() {
  const { currentUser, errorMessage, loading } = useSelector(
    (state) => state.user
  )
  const [toggle] = useBodyScrollLock()

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: "",
  })

  const dispatch = useDispatch()
  const handleSignout = useSignout()
  const handleDeleteUser = useDeleteUser()

  const handleChange = (e) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [e.target.id]:
          e.target.id === "name" ? e.target.value : e.target.value.trim(),
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(updateUserStarted())
    if (formData.name === "" || formData.email === "") {
      dispatch(updateUserFailure("Fields can't be empty"))
      return
    }

    const requestBody = {}
    if (formData.name !== currentUser.name) {
      requestBody.name = formData.name
    }

    if (formData.email !== currentUser.email) {
      requestBody.email = formData.email
    }

    if (formData.password !== "") {
      requestBody.password = formData.password
    }

    try {
      const res = await fetch(`/api/v1/user/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      const responseJSON = await res.json()
      if (res.ok) {
        dispatch(updateUserSuccess(responseJSON.data))
        toast.success(responseJSON.message)
      } else {
        dispatch(updateUserFailure(responseJSON.message))
      }
    } catch (error) {
      dispatch(updateUserFailure("Something went wrong"))
    }
  }

  const cancelDelete = () => {
    toggle()
    setShowModal(false)
    setDeleteItemId(null)
  }

  useEffect(() => {
    toast.error(errorMessage)
  }, [errorMessage])

  useErrorMessageTimeout(errorMessage)

  return (
    <div>
      <div className="max-w-sm mx-auto p-3 my-16 flex flex-col gap-3 border bg-white rounded-sm shadow-inner">
        <h1 className="text-center">My Profile</h1>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="name"
            placeholder="Full name"
            autoComplete="name"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            id="email"
            placeholder="Email"
            autoComplete="email"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            id="password"
            placeholder="We don't store your password"
            onChange={handleChange}
            value={formData.password}
          />

          <button
            className={`bg-accentRed border rounded-sm border-black text-white h-12 hover:bg-accentDarkRed transition duration-500 ease-in-out ${
              loading ? "opacity-50" : "opacity-100"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="ml-2">Updating Profile...</span>
            ) : (
              "Update Profile"
            )}
          </button>
          <div className="text-accentRed flex justify-between">
            <span
              onClick={() => setShowModal(true)}
              className="cursor-pointer"
            >
              Delete Account
            </span>
            <span
              onClick={handleSignout}
              className="cursor-pointer"
            >
              Sign Out
            </span>
          </div>
        </form>
        {showModal && (
          <ConfirmModal
            showModal={showModal}
            setShowModal={setShowModal}
            confirmDelete={() => handleDeleteUser()}
            cancelDelete={cancelDelete}
            text={
              "Are you sure you want to delete your account? All your data will be also deleted"
            }
          />
        )}
      </div>
    </div>
  )
}
