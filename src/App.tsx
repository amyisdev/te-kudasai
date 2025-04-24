import { Route, Routes } from 'react-router'
import { AuthLayout } from './components/layouts/auth-layout'
import { RootLayout } from './components/layouts/root-layout'
import { Login } from './pages/auth/login'
import { SignUp } from './pages/auth/signup'
import Home from './pages/customer/home'

function App() {
  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}
export default App
