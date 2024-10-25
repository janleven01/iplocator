import { IPLocationProps } from "../utils/types"

export const getIP = async (ip: string) => {
  const res = await fetch(`http://localhost:3000/ip-location?ip=${ip}`)
  if (!res.ok) throw new Error(`Failed to fetch location data: ${res.status}`)

  return res.json()
}

export const storeIP = async (
  data: IPLocationProps,
  username: string | undefined
) => {
  const res = await fetch(`http://localhost:3000/store-ip/${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
  return res.json()
}

export const getIpHistory = async (username: string) => {
  const res = await fetch(`http://localhost:3000/ip-history/${username}`)
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
  return res.json()
}
