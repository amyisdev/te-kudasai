import { Route, Routes } from 'react-router'
import { AuthLayout } from './components/layouts/auth-layout'
import { RootLayout } from './components/layouts/root-layout'
import { ThemeProvider } from './hooks/use-theme'
import { Login } from './pages/auth/login'
import { SignUp } from './pages/auth/signup'
import MyTickets from './pages/customer/my-tickets'

function App() {
  return (
    <ThemeProvider storageKey="ui-theme">
      <Routes>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        <Route path="/" element={<RootLayout />}>
          <Route index element={<MyTickets />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
export default App
