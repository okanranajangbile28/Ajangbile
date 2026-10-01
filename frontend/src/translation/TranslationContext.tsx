import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_LANGUAGE, languages, type Language } from "./languages";

import { translateText } from "./translationService";

import {
  changeAutoTranslationLanguage,
  initializeAutoTranslator,
} from "./autoTranslate";

type TranslationContextType = {
  language: string;
  languageInfo: Language;
  languages: Language[];
  setLanguage: (language: string) => void;
  translate: (text: string) => Promise<string>;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

type TranslationProviderProps = {
  children: ReactNode;
};

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const savedLanguage = localStorage.getItem("ajangbile-language");

      const validLanguage = languages.some(
        (item) => item.code === savedLanguage,
      );

      return validLanguage && savedLanguage ? savedLanguage : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  /*
   * Save the selected language and
   * tell the automatic translator
   * whenever the language changes.
   */
  useEffect(() => {
    try {
      localStorage.setItem("ajangbile-language", language);
    } catch {
      // Ignore localStorage errors.
    }

    changeAutoTranslationLanguage(language);
  }, [language]);

  /*
   * Start the automatic translator.
   *
   * The translator itself receives the
   * current language when it starts.
   */
  useEffect(() => {
    const startTranslator = () => {
      initializeAutoTranslator(language);
    };

    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", startTranslator, {
        once: true,
      });

      return () => {
        window.removeEventListener("DOMContentLoaded", startTranslator);
      };
    }

    startTranslator();
  }, [language]);

  const setLanguage = useCallback((newLanguage: string) => {
    const languageExists = languages.some((item) => item.code === newLanguage);

    if (!languageExists) {
      return;
    }

    setLanguageState(newLanguage);
  }, []);

  const translate = useCallback(
    async (text: string) => {
      return translateText(text, language);
    },
    [language],
  );

  const languageInfo =
    languages.find((item) => item.code === language) || languages[0];

  const contextValue = useMemo(
    () => ({
      language,
      languageInfo,
      languages,
      setLanguage,
      translate,
    }),
    [language, languageInfo, setLanguage, translate],
  );

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error("useTranslation must be used inside a TranslationProvider");
  }

  return context;
};
