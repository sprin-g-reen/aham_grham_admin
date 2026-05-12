import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted min-h-svh w-full flex items-center justify-center p-6 md:p-10">
      <div className="max-w-lg">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center select-none group">
            <div className="relative flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]">
              <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex items-center justify-center">
                <img
                  src="/logo_new.png"
                  alt="Aham Grham Logo"
                  className="h-44 w-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          <LoginForm className="-mt-6" />
        </div>
      </div>
    </div>
  )
}
