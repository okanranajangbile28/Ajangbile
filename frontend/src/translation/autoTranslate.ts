import { delayBetweenRequests, translateText } from "./translationService";

const SKIP_ATTRIBUTE = "data-no-translate";

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "TEXTAREA",
  "OPTION",
  "SVG",
]);

const SKIP_CLASS_NAMES = ["notranslate", "no-translate"];

type TextRecord = {
  node: Text;
  original: string;
};

const originalTexts = new WeakMap<Text, string>();

let currentLanguage = "en";

let observer: MutationObserver | null = null;

let translationTimer: number | null = null;

let translationRunId = 0;

let isTranslating = false;

let needsAnotherScan = false;

const isSkippedElement = (element: Element): boolean => {
  if (SKIP_TAGS.has(element.tagName)) {
    return true;
  }

  if (element.hasAttribute(SKIP_ATTRIBUTE)) {
    return true;
  }

  const className =
    typeof element.className === "string" ? element.className : "";

  return SKIP_CLASS_NAMES.some((name) => className.split(/\s+/).includes(name));
};

const isInsideSkippedElement = (node: Node): boolean => {
  let current: Node | null = node.parentElement;

  while (current) {
    if (current instanceof Element && isSkippedElement(current)) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
};

const isUsefulText = (text: string): boolean => {
  const cleanText = text.trim();

  if (!cleanText) {
    return false;
  }

  if (cleanText.length < 2) {
    return false;
  }

  /*
   * Ignore text that is only numbers,
   * symbols, punctuation or currency.
   */
  if (/^[\d\s.,!?%$₦€£¥₽₹:/\\+\-_=#@&*()[\]{}]+$/.test(cleanText)) {
    return false;
  }

  return true;
};

const getOriginalText = (node: Text): string => {
  const existing = originalTexts.get(node);

  if (existing !== undefined) {
    return existing;
  }

  const original = node.nodeValue || "";

  originalTexts.set(node, original);

  return original;
};

const collectTextNodes = (): TextRecord[] => {
  const records: TextRecord[] = [];

  if (!document.body) {
    return records;
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  let currentNode = walker.nextNode();

  while (currentNode) {
    const textNode = currentNode as Text;

    if (!isInsideSkippedElement(textNode)) {
      const original = getOriginalText(textNode);

      if (isUsefulText(original)) {
        records.push({
          node: textNode,
          original,
        });
      }
    }

    currentNode = walker.nextNode();
  }

  return records;
};

const restoreEnglishText = () => {
  if (!document.body) {
    return;
  }

  const records = collectTextNodes();

  records.forEach(({ node, original }) => {
    if (node.nodeValue !== original) {
      node.nodeValue = original;
    }
  });
};

const translateRecord = async (
  record: TextRecord,
  language: string,
  runId: number,
) => {
  if (runId !== translationRunId) {
    return;
  }

  if (!record.node.isConnected) {
    return;
  }

  const translated = await translateText(record.original, language);

  if (runId !== translationRunId) {
    return;
  }

  if (!record.node.isConnected) {
    return;
  }

  if (translated && translated !== record.original) {
    record.node.nodeValue = translated;
  }
};

const translatePage = async (language: string) => {
  translationRunId += 1;

  const runId = translationRunId;

  if (language === "en") {
    isTranslating = false;
    restoreEnglishText();
    return;
  }

  if (isTranslating) {
    needsAnotherScan = true;
    return;
  }

  isTranslating = true;
  needsAnotherScan = false;

  try {
    const records = collectTextNodes();

    for (const record of records) {
      if (runId !== translationRunId) {
        return;
      }

      await translateRecord(record, language, runId);

      /*
       * Small delay so the free
       * translation service isn't
       * hammered with requests.
       */
      await delayBetweenRequests();
    }
  } finally {
    isTranslating = false;

    if (needsAnotherScan && currentLanguage !== "en") {
      needsAnotherScan = false;

      scheduleTranslation(500);
    }
  }
};

const scheduleTranslation = (delay = 300) => {
  if (translationTimer !== null) {
    window.clearTimeout(translationTimer);
  }

  translationTimer = window.setTimeout(() => {
    translationTimer = null;

    void translatePage(currentLanguage);
  }, delay);
};

const createObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    if (currentLanguage === "en") {
      return;
    }

    let relevantChange = false;

    for (const mutation of mutations) {
      /*
       * Ignore changes caused by
       * our own text replacement.
       */
      if (mutation.type === "characterData") {
        continue;
      }

      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        relevantChange = true;
        break;
      }
    }

    if (relevantChange) {
      if (isTranslating) {
        needsAnotherScan = true;
      } else {
        scheduleTranslation(700);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

export const initializeAutoTranslator = (language: string) => {
  currentLanguage = language;

  if (!document.body) {
    return;
  }

  createObserver();

  /*
   * Wait until React has finished
   * rendering the initial page.
   */
  window.setTimeout(() => {
    void translatePage(currentLanguage);
  }, 300);
};

export const changeAutoTranslationLanguage = (language: string) => {
  currentLanguage = language;

  translationRunId += 1;

  if (language === "en") {
    restoreEnglishText();
    return;
  }

  scheduleTranslation(300);
};

export const stopAutoTranslator = () => {
  translationRunId += 1;

  isTranslating = false;
  needsAnotherScan = false;

  if (translationTimer !== null) {
    window.clearTimeout(translationTimer);

    translationTimer = null;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  restoreEnglishText();
};
