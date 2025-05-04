import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty(),
})

type LoginSchema = z.infer<typeof loginSchema>

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    setLoading(true)

    const result = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (!result.error) {
      navigate('/')
      return
    }

    form.setError('email', { message: result.error.message })
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-xl">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@tk.local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  )
}

function LoginSocial() {
  return (
    <div className="border-t pt-4">
      <Button
        className="w-full text-white bg-[#24292F] hover:bg-[#24292F]/90"
        onClick={() =>
          authClient.signIn.social({
            provider: 'github',
            callbackURL: window.location.href,
          })
        }
      >
        Login with GitHub
      </Button>
    </div>
  )
}

export default function Login() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Login</h1>
          </CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />

          <LoginSocial />

          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <NavLink to="/auth/signup" className="underline underline-offset-4">
              Sign up
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
