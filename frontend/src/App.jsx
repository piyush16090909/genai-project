import { useEffect } from "react"
import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"

function App() {

  useEffect(() => {
    const savedTheme = localStorage.getItem("prepai-theme")
    const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark"
    document.documentElement.setAttribute("data-theme", theme)
  }, [])

  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App