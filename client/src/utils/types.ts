export type dataInfoProps = {
  label: string
  value: string
}

export interface IPLocation {
  ip: string
  city: string
  country: string
  hostname: string
  postal: string
  loc: string
  region: string
  timezone: string
}

export interface IPLocationWithId extends IPLocation {
  id: string
}

export type IPLocationProps = {
  data: IPLocationProps
  username?: string
}

export type IPLocationHistory = IPLocationWithId[]

export type AuthState = {
  isAuthenticated: boolean
  email: string | null
  username: string | null
}

export type RootState = {
  auth: AuthState
}
