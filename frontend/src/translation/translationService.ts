const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

const STORAGE_PREFIX = "ajangbile-translation";

type TranslationResponse = {
  responseData?: {
    translatedText?: string;
  };
  responseStatus?: number;
  matches?: Array<{
    translation?: string;
    match?: number;
  }>;
};

const memoryCache = new Map<string, string>();

const getStorageKey = (text: string, targetLanguage: string) => {
  return `${STORAGE_PREFIX}:${targetLanguage}:${text}`;
};

const getCachedTranslation = (
  text: string,
  targetLanguage: string,
): string | null => {
  const key = getStorageKey(text, targetLanguage);

  const memoryValue = memoryCache.get(key);

  if (memoryValue) {
    return memoryValue;
  }

  try {
    const localValue = localStorage.getItem(key);

    if (localValue) {
      memoryCache.set(key, localValue);
      return localValue;
    }
  } catch {
    // Ignore localStorage errors.
  }

  return null;
};

const saveTranslation = (
  text: string,
  targetLanguage: string,
  translation: string,
) => {
  const key = getStorageKey(text, targetLanguage);

  memoryCache.set(key, translation);

  try {
    localStorage.setItem(key, translation);
  } catch {
    // Ignore localStorage quota errors.
  }
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  const cleanText = text.trim();

  if (!cleanText || targetLanguage === "en") {
    return text;
  }

  const cachedTranslation = getCachedTranslation(cleanText, targetLanguage);

  if (cachedTranslation) {
    return preserveWhitespace(text, cachedTranslation);
  }

  try {
    const params = new URLSearchParams({
      q: cleanText,
      langpair: `en|${targetLanguage}`,
      mt: "1",
    });

    const response = await fetch(`${MYMEMORY_API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.status}`);
    }

    const data = (await response.json()) as TranslationResponse;

    if (data.responseStatus && data.responseStatus !== 200) {
      throw new Error(`MyMemory returned status ${data.responseStatus}`);
    }

    let translatedText = data.responseData?.translatedText?.trim();

    if (!translatedText && data.matches?.length) {
      translatedText = data.matches
        .find((match) => match.translation?.trim())
        ?.translation?.trim();
    }

    if (!translatedText) {
      throw new Error("No translation was returned.");
    }

    saveTranslation(cleanText, targetLanguage, translatedText);

    return preserveWhitespace(text, translatedText);
  } catch (error) {
    console.error("Ajangbile translation error:", error);

    return text;
  }
};

const preserveWhitespace = (originalText: string, translatedText: string) => {
  const leadingWhitespace = originalText.match(/^\s*/)?.[0] || "";

  const trailingWhitespace = originalText.match(/\s*$/)?.[0] || "";

  return `${leadingWhitespace}${translatedText.trim()}${trailingWhitespace}`;
};

export const clearTranslationCache = () => {
  memoryCache.clear();

  try {
    const keysToRemove: string[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (key?.startsWith(`${STORAGE_PREFIX}:`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore localStorage errors.
  }
};

export const delayBetweenRequests = async () => {
  await wait(120);
};
