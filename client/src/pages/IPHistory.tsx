import { Link, useParams } from "react-router-dom"
import { getIpHistory } from "../api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IPLocationHistory } from "../utils/types"

const IPHistory = () => {
  const { username } = useParams()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `http://localhost:3000/ip-history/${username}/${id}`,
        {
          method: "DELETE",
        }
      )

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ipHistory", username] })
    },
  })

  const handleDelete = async (id: string) => {
    mutation.mutate(id)
  }

  const { data = [] } = useQuery<IPLocationHistory>({
    queryKey: ["ipHistory", username],
    queryFn: () =>
      username
        ? getIpHistory(username)
        : Promise.reject(new Error("Username is required")),
  })

  console.log(data)
  return (
    <main className="max-w-[950px] mx-auto my-10">
      <section className="flex flex-col my-4">
        <h1 className="font-bold text-3xl">Your History</h1>
        <table className="border-separate border rounded-lg my-2">
          <tbody>
            <tr className="*:border-b *:px-2 *:py-1  ">
              <th>Id</th>
              <th>City</th>
              <th>Country</th>
              <th>IP</th>
              <th>Location</th>
              <th>Postal</th>
              <th>Region</th>
              <th>Timezone</th>
              <th>Action</th>
            </tr>
            {data.map((data) => (
              <tr key={data.id} className="*:text-center *:py-2">
                <td>{data.id}</td>
                <td>{data.city}</td>
                <td>{data.country}</td>
                <td>{data.ip}</td>
                <td>{data.loc}</td>
                <td>{data.postal}</td>
                <td>{data.region}</td>
                <td>{data.timezone}</td>
                <td className="space-x-2">
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to={`/${username}`} className="flex mt-4 font-medium">
          <span className="px-2 border rounded-md py-1 hover:bg-slate-200 ml-auto">
            Home
          </span>
        </Link>
      </section>
    </main>
  )
}

export default IPHistory
