import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted min-h-svh w-full flex items-center justify-center p-6 md:p-10">
      <div className="max-w-lg">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col items-center justify-center select-none group">
            <div className="relative flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]">
              <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex items-center translate-x-[1.3rem]">
                <img
                  src="/logo.png"
                  alt="Aham Grham Logo"
                  className="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-500 group-hover:rotate-[-2deg]"
                />
                <span className="text-4xl font-extrabold tracking-tighter text-foreground ml-[-2.6rem] transition-colors duration-500 group-hover:text-primary">
                  ahamgrham
                </span>
              </div>
            </div>
            <div className="mt-1 w-16 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
