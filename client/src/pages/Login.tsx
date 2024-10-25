import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "../auth/authSlice"

const getUsernameFromEmail = (email: string | null): string => {
  if (!email) return ""
  return email.split("@")[0]
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState<string | null>("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formElements = form.elements as HTMLFormControlsCollection & {
      email: HTMLInputElement
      password: HTMLInputElement
    }

    const formData = {
      email: formElements.email.value,
      password: formElements.password.value,
    }

    const username = getUsernameFromEmail(formData.email)

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`)
      }

      const data = await res.json()
      dispatch(login({ email: data.email, username }))
      navigate(`/${username}`)
    } catch (error) {
      console.log("Login failed.", error)
      setError("Invalid credentials. Please try again.")
    }
  }

  return (
    <main className="w-full px-10 h-screen flex items-center justify-center">
      <section className="max-w-md w-[70rem] border shadow-lg rounded-xl overflow-hidden">
        <div className="md:basis-1/2 w-full m-auto flex items-center justify-center p-4">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Login to your Account
            </h1>
            <form onSubmit={handleSubmit} className="mt-4 ">
              <div className="flex flex-col">
                <label htmlFor="email" className="font-medium">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="placeholder:text-sm px-2 py-1 border rounded-md mt-1"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label htmlFor="password" className="font-medium">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="placeholder:text-sm px-2 py-1 border rounded-md mt-1"
                />
              </div>
              {error && (
                <p style={{ color: "red", marginTop: "5px" }}>{error}</p>
              )}
              <button
                type="submit"
                className="bg-blue-500 px-2 border rounded-md py-1 mt-8 mx-auto flex font-medium text-white hover:bg-blue-600 "
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
