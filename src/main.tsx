import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import axios from "axios"

import { router } from "@/routes"
import "@/index.css"

import { AuthProvider } from "@/lib/AuthContext"
import { DEFAULT_SITE_ORIGIN, SITE_ORIGIN } from "@/config"

// axios.interceptors.request.use((requestConfig) => {
//   if (typeof requestConfig.url === "string") {
//     requestConfig.url = requestConfig.url.replace(DEFAULT_SITE_ORIGIN, SITE_ORIGIN)
//   }
//   return requestConfig
// })

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
    <Toaster position="top-right" richColors closeButton />
  </React.StrictMode>
)
