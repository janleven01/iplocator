import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import PrivateRoute from "./PrivateRoute"
import IPHistory from "./pages/IPHistory"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/:username" element={<Home />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/ip-history/:username" element={<IPHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
