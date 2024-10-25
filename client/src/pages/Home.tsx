import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../auth/authSlice"
import { Link, useParams } from "react-router-dom"
import { dataInfoProps, IPLocationProps } from "../utils/types"
import { getIP, storeIP } from "../api"

const DisplayData = ({ label, value }: dataInfoProps) => {
  return (
    <div className="grid grid-cols-3 *:border *:px-2 *:py-1">
      <div className="font-bold col-span-1">{label}:</div>
      <div className="col-span-2">{value}</div>
    </div>
  )
}

const Home = () => {
  const dispatch = useDispatch()
  const { username } = useParams()

  const queryClient = useQueryClient()
  const [newIp, setNewIp] = useState("")
  const [error, setError] = useState<string | null>("")

  const { data } = useQuery({
    queryKey: ["IP", newIp],
    queryFn: () => getIP(newIp),
  })

  const { mutate } = useMutation({
    mutationFn: ({ data, username }: IPLocationProps) =>
      storeIP(data, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ipHistory"] })
    },
    onError: (error) => {
      console.error("Failed to store IP address:", error)
    },
  })

  const { ip, city, country, hostname, postal, loc, region, timezone } =
    data || {}

  const ipRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

  const validateIp = (ip: string): boolean => {
    return ipRegex.test(ip)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formElements = form.elements as typeof form.elements & {
      ipValue: HTMLInputElement
    }

    const ipValue = formElements.ipValue.value

    if (validateIp(ipValue)) {
      mutate({
        data: data,
        username: username,
      })
      setError(null)
      setNewIp(ipValue)
    } else {
      setError("Please enter a valid IP address.")
    }
  }

  return (
    <main className="max-w-lg mx-auto my-10">
      <button onClick={() => dispatch(logout())} className="flex ml-auto">
        Logout
      </button>
      <section className="flex flex-col my-4">
        <h1 className="font-bold text-3xl">IP & Geolocation Information</h1>
        <div className="mt-3 ">
          <DisplayData label="IP" value={ip} />
          <DisplayData label="City" value={city} />
          <DisplayData label="Country" value={country} />
          <DisplayData label="Hostname" value={hostname} />
          <DisplayData label="Postal" value={postal} />
          <DisplayData label="Loc" value={loc} />
          <DisplayData label="Region" value={region} />
          <DisplayData label="Timezone" value={timezone} />
        </div>

        <Link to={`/ip-history/${username}`} className="flex mt-4 font-medium ">
          <span className="px-2 ml-auto border rounded-md py-1 hover:bg-slate-200">
            View History
          </span>
        </Link>

        <form onSubmit={handleSubmit} className="mt-10 ">
          <div className="flex items-center">
            <label htmlFor="ipValue" className="flex-none">
              Add a new IP address:
            </label>
            <input
              type="text"
              name="ipValue"
              id="ipValue"
              className="border ml-2 rounded-md px-2 py-1 w-full"
            />
          </div>
          {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}

          <button className="bg-blue-500 px-2 border rounded-md py-1 mt-4 mx-auto flex font-medium text-white hover:bg-blue-600 ">
            Submit
          </button>
        </form>
      </section>
    </main>
  )
}

export default Home
