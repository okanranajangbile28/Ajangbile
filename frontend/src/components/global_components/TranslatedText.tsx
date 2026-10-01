import { useEffect, useState, type ReactNode } from "react";

import { useTranslation } from "../../translation/TranslationContext";

type TranslatedTextProps = {
  children: ReactNode;
  className?: string;
};

const TranslatedText = ({ children, className }: TranslatedTextProps) => {
  const { language, translate } = useTranslation();

  const originalText = typeof children === "string" ? children : "";

  const [translatedText, setTranslatedText] = useState(originalText);

  useEffect(() => {
    let cancelled = false;

    const translateContent = async () => {
      if (!originalText) {
        setTranslatedText("");
        return;
      }

      if (language === "en") {
        setTranslatedText(originalText);
        return;
      }

      setTranslatedText(originalText);

      const result = await translate(originalText);

      if (!cancelled) {
        setTranslatedText(result);
      }
    };

    translateContent();

    return () => {
      cancelled = true;
    };
  }, [originalText, language, translate]);

  if (className) {
    return <span className={className}>{translatedText}</span>;
  }

  return <>{translatedText}</>;
};

export default TranslatedText;
