import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function CoverLoginPage() {
  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      {/* LEFT – LOGIN */}
      <div className="flex items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm flex flex-col gap-1">
          <div className="flex flex-col items-center justify-center select-none group">
            <div className="relative flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]">
              <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Aham Grham Logo"
                  className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-transform duration-500 group-hover:scale-110"
                />
                <span className="text-4xl font-bold tracking-tight text-foreground ml-[-2.4rem] transition-colors duration-500 group-hover:text-primary">
                  ahamgrham
                </span>
              </div>
            </div>
            <div className="mt-1 w-16 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <LoginForm />
        </div>
      </div>

      {/* RIGHT – COVER */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary/80 p-10 text-primary-foreground">
        {/* Overlay pattern (optional) */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10">
          <h1 className="text-3xl font-semibold leading-tight">
            Welcome back 👋
          </h1>
          <p className="mt-3 max-w-md text-primary-foreground/90">
            Sign in to access your dashboard, manage your data,
            and continue where you left off.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>✔ Secure authentication</li>
            <li>✔ Real-time analytics</li>
            <li>✔ Modern dashboard UI</li>
          </ul>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/80">
          © {new Date().getFullYear()} Aham Grham. All rights reserved.
        </div>
      </div>
    </div>
  )
}
