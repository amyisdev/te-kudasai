import { Route, Routes } from 'react-router'
import AuthLayout from './components/layouts/auth-layout'
import RootLayout from './components/layouts/root-layout'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './hooks/use-theme'
import AllUsers from './pages/admin/all-users'
import AllTickets from './pages/agent/all-tickets'
import FormEditor from './pages/agent/forms/form-editor'
import FormList from './pages/agent/forms/form-list'
import ManageTicket from './pages/agent/manage-ticket'
import Login from './pages/auth/login'
import SignUp from './pages/auth/signup'
import MyTickets from './pages/customer/my-tickets'
import NewTicket from './pages/customer/new-ticket'
import NewTicketForm from './pages/customer/new-ticket-form'
import ViewTicket from './pages/customer/view-ticket'

function App() {
  return (
    <ThemeProvider defaultColorScheme="pink">
      <Routes>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        <Route path="/" element={<RootLayout />}>
          <Route index element={<MyTickets />} />
          <Route path="new-ticket" element={<NewTicket />} />
          <Route path="new-ticket-form" element={<NewTicketForm />} />
          <Route path="tickets/:id" element={<ViewTicket />} />
        </Route>

        <Route path="/agent" element={<RootLayout agentOnly={true} />}>
          <Route index element={<AllTickets />} />
          <Route path="tickets/:id" element={<ManageTicket />} />
          <Route path="forms" element={<FormList />} />
          <Route path="forms/:formId" element={<FormEditor />} />
        </Route>

        <Route path="admin" element={<RootLayout agentOnly={true} />}>
          <Route path="users" element={<AllUsers />} />
        </Route>
      </Routes>

      <Toaster />
    </ThemeProvider>
  )
}
export default App
