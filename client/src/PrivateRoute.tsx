import React from "react"
import { Navigate, Outlet, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "./utils/types"

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const usernameFromState = useSelector(
    (state: RootState) => state.auth.username
  )

  const { username } = useParams<{ username: string }>()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (username !== usernameFromState) {
    return <Navigate to={`/${usernameFromState}`} />
  }

  return <Outlet />
}

export default PrivateRoute
