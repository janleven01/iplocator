import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthState } from "../utils/types"

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  username: null,
}

const loadAuthState = (): AuthState => {
  const storedState = localStorage.getItem("authState")
  return storedState ? JSON.parse(storedState) : initialState
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    login(state, action: PayloadAction<{ email: string; username: string }>) {
      state.isAuthenticated = true
      state.email = action.payload.email
      state.username = action.payload.username
      localStorage.setItem("authState", JSON.stringify(state))
    },
    logout(state) {
      state.isAuthenticated = false
      state.email = null
      state.username = null
      localStorage.removeItem("authState")
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
