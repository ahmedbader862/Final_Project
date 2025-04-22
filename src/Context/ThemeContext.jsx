import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark"); // light or dark

  const toggleTheme = () => {
    setTheme((prev) => {
      console.log('Previous theme:', prev);
      const newTheme = prev === "light" ? "dark" : "light";
      console.log('New theme:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};