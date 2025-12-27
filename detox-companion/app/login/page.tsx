import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Detox Companion</h1>
          <p className="text-base md:text-sm text-slate-600 mt-2">Your support through recovery</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

