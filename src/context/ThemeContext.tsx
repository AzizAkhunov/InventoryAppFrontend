import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext<any>(null)

export function ThemeProvider({ children }: any) {

const [theme, setTheme] = useState(
localStorage.getItem("theme") || "light"
)

useEffect(() => {

document.documentElement.classList.remove("light", "dark")
document.documentElement.classList.add(theme)

localStorage.setItem("theme", theme)

}, [theme])

return (

<ThemeContext.Provider value={{ theme, setTheme }}>
{children}
</ThemeContext.Provider>

)

}

export function useTheme(){
return useContext(ThemeContext)
}