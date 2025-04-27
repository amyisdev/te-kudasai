import { Route, Routes } from 'react-router'
import { AuthLayout } from './components/layouts/auth-layout'
import { RootLayout } from './components/layouts/root-layout'
import { ThemeProvider } from './hooks/use-theme'
import { Login } from './pages/auth/login'
import { SignUp } from './pages/auth/signup'
import MyTickets from './pages/customer/my-tickets'
import NewTicket from './pages/customer/new-ticket'
import ViewTicket from './pages/customer/view-ticket'
import { Toaster } from './components/ui/sonner'

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
          <Route path="new-ticket" element={<NewTicket />} />
          <Route path="tickets/:id" element={<ViewTicket />} />
        </Route>
      </Routes>

      <Toaster />
    </ThemeProvider>
  )
}
export default App
