/**
 * Web Speech API Voice Assistance for SmartDose.
 * Multilingual voice support for:
 * - English (en-US / en-IN)
 * - Kannada (kn-IN)
 * - Telugu (te-IN)
 * - Hindi (hi-IN)
 */

import { AppLanguage } from '../types';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Speech cancellation failed:', err);
    }
  }
}

export interface SpeechOptions {
  rate?: number; // 0.7 (slow) to 1.1 (normal)
  pitch?: number; // 0.8 to 1.2
  lang?: string;
  langCode?: AppLanguage | string;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function getBCP47Tag(lang?: AppLanguage | string): string {
  switch (lang) {
    case 'kn':
      return 'kn-IN';
    case 'te':
      return 'te-IN';
    case 'hi':
      return 'hi-IN';
    case 'en':
    default:
      return 'en-IN';
  }
}

export function speakText(text: string, options: SpeechOptions = {}): boolean {
  if (!isSpeechSupported()) {
    console.warn('Web Speech API is not supported in this browser.');
    return false;
  }

  try {
    // Stop any ongoing speech
    stopSpeaking();

    const targetLang = options.lang || getBCP47Tag(options.langCode || 'en');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 0.85; // Slightly slower default for older adults
    utterance.pitch = options.pitch ?? 1.0;
    utterance.lang = targetLang;

    if (options.onEnd) {
      utterance.onend = () => options.onEnd?.();
    }
    if (options.onError) {
      utterance.onerror = (e) => options.onError?.(e);
    }

    // Try to pick a natural sounding voice matching the target language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const langPrefix = targetLang.split('-')[0];
      const matchingVoice =
        voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return false;
  }
}

/**
 * Format a natural spoken sentence for a medication dose in the requested language
 */
export function formatDoseSpeechText(
  medicineName: string,
  strength: string,
  quantityPerDose: number,
  unit: string,
  mealTiming: string,
  scheduledTimeFormatted: string,
  specialInstructions?: string,
  lang: AppLanguage | string = 'en'
): string {
  // Kannada
  if (lang === 'kn') {
    const mealPhraseKn =
      mealTiming === 'before_meal'
        ? 'ಊಟಕ್ಕೆ ಮುಂಚೆ'
        : mealTiming === 'after_meal'
        ? 'ಊಟದ ನಂತರ'
        : mealTiming === 'with_meal'
        ? 'ಊಟದ ಜೊತೆಗೆ'
        : mealTiming === 'empty_stomach'
        ? 'ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ'
        : 'ವೈದ್ಯರ ಸಲಹೆಯಂತೆ';

    let text = `ಔಷಧಿ ಜ್ಞಾಪನೆ: ${medicineName} ${strength}. ${quantityPerDose} ${unit} ತೆಗೆದುಕೊಳ್ಳಿ, ${mealPhraseKn}. ನಿಗದಿತ ಸಮಯ: ${scheduledTimeFormatted}.`;
    if (specialInstructions && specialInstructions.trim().length > 0) {
      text += ` ಸೂಚನೆ: ${specialInstructions.trim()}.`;
    }
    return text;
  }

  // Telugu
  if (lang === 'te') {
    const mealPhraseTe =
      mealTiming === 'before_meal'
        ? 'భోజనానికి ముందు'
        : mealTiming === 'after_meal'
        ? 'భోజనం తర్వాత'
        : mealTiming === 'with_meal'
        ? 'భోజనంతో పాటు'
        : mealTiming === 'empty_stomach'
        ? 'ఖాళీ కడుపుతో'
        : 'వైద్యుని సలహా మేరకు';

    let text = `మందుల రిమైండర్: ${medicineName} ${strength}. ${quantityPerDose} ${unit} తీసుకోండి, ${mealPhraseTe}. సమయం: ${scheduledTimeFormatted}.`;
    if (specialInstructions && specialInstructions.trim().length > 0) {
      text += ` సూచన: ${specialInstructions.trim()}.`;
    }
    return text;
  }

  // Hindi
  if (lang === 'hi') {
    const mealPhraseHi =
      mealTiming === 'before_meal'
        ? 'भोजन से पहले'
        : mealTiming === 'after_meal'
        ? 'भोजन के बाद'
        : mealTiming === 'with_meal'
        ? 'भोजन के साथ'
        : mealTiming === 'empty_stomach'
        ? 'खाली पेट'
        : 'निर्देशानुसार';

    let text = `दवा रिमाइंडर: ${medicineName} ${strength}। ${quantityPerDose} ${unit} लें, ${mealPhraseHi}। समय: ${scheduledTimeFormatted}।`;
    if (specialInstructions && specialInstructions.trim().length > 0) {
      text += ` निर्देश: ${specialInstructions.trim()}।`;
    }
    return text;
  }

  // English (default)
  const mealPhraseEn =
    mealTiming === 'before_meal'
      ? 'before your meal'
      : mealTiming === 'after_meal'
      ? 'after your meal'
      : mealTiming === 'with_meal'
      ? 'with food'
      : mealTiming === 'empty_stomach'
      ? 'on an empty stomach'
      : 'as prescribed';

  let text = `Medication reminder for ${medicineName}, ${strength}. Take ${quantityPerDose} ${unit}, ${mealPhraseEn}, scheduled for ${scheduledTimeFormatted}.`;

  if (specialInstructions && specialInstructions.trim().length > 0) {
    text += ` Instructions: ${specialInstructions.trim()}.`;
  }

  return text;
}
