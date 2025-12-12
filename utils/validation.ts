import { PoeticForm } from '../types';

export const countSyllables = (text: string): number => {
  if (!text.trim()) return 0;
  // Heuristic for English syllables
  const words = text.toLowerCase().replace(/[^a-z ]/g, '').split(/\s+/).filter(w => w);
  
  return words.reduce((total, word) => {
    if (word.length <= 3) return total + 1;
    
    const processed = word
        .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        .replace(/^y/, '');
        
    const matches = processed.match(/[aeiouy]{1,2}/g);
    const count = matches ? matches.length : 0;
    
    return total + (count || 1);
  }, 0);
};

export interface LineValidation {
  isValid: boolean;
  message?: string; // e.g., "5/7"
  isError: boolean;
  syllableCount: number;
}

export const getRuleSummary = (formId: string): string => {
  switch (formId) {
    case 'haiku': return 'Structure: 3 lines (5 - 7 - 5 syllables)';
    case 'sonnet': return 'Structure: 14 lines, ~10 syllables/line';
    case 'limerick': return 'Structure: 5 lines (AABBA), 7-10/5-7 syllables';
    case 'villanelle': return 'Structure: 19 lines (5 tercets + 1 quatrain)';
    default: return 'Form: Free structure';
  }
};

export const validateLine = (formId: string, line: string, index: number): LineValidation => {
  const count = countSyllables(line);
  const isEmpty = !line.trim();

  if (formId === 'haiku') {
    const targets = [5, 7, 5];
    if (index < 3) {
      const target = targets[index];
      // Valid if it matches target. 
      // If empty, we treat as neutral (not error) unless it's a strict check, 
      // but for live feedback, usually we show current count.
      // We mark as error only if count > 0 and count != target.
      
      const isMatch = count === target;
      const isError = !isEmpty && !isMatch;

      return {
        isValid: isMatch,
        isError,
        message: `${count} / ${target}`,
        syllableCount: count
      };
    } else if (!isEmpty) {
      // Extra lines are errors in strict Haiku
      return {
        isValid: false,
        isError: true,
        message: 'Extra',
        syllableCount: count
      };
    }
  }
  
  if (formId === 'limerick') {
      // AABBA structure
      // Lines 0, 1, 4 are 'A' (usually 7-10 syllables)
      // Lines 2, 3 are 'B' (usually 5-7 syllables)
      const isA = index === 0 || index === 1 || index === 4;
      const isB = index === 2 || index === 3;
      
      let min = 0, max = 0;
      
      if (isA) { min = 7; max = 10; }
      else if (isB) { min = 5; max = 7; }
      else if (!isEmpty) { return { isValid: false, isError: true, message: 'Extra', syllableCount: count }; }

      if (index < 5) {
          const isValid = count >= min && count <= max;
          return {
              isValid,
              isError: !isEmpty && !isValid,
              message: `${count}`,
              syllableCount: count
          };
      }
  }
  
  if (formId === 'sonnet') {
      // Very rough check for Iambic Pentameter length
      const isValid = count >= 9 && count <= 11;
      return {
          isValid,
          isError: !isEmpty && !isValid,
          message: `${count}`,
          syllableCount: count
      };
  }

  // Default / Free Verse
  return {
    isValid: true,
    isError: false,
    message: count > 0 ? `${count}` : '',
    syllableCount: count
  };
};