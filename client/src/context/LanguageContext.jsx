import { createContext, useEffect, useState } from "react";

export const LanguageContext = createContext({
  language: "EN",
  setLanguage: () => {},
});

const getInitialLanguage = () => {
  try {
    const saved = localStorage.getItem("language");
    return saved === "BN" ? "BN" : "EN"; // প্রথমে সবসময় English
  } catch {
    return "EN";
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem("language", language);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = language === "BN" ? "bn" : "en";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};