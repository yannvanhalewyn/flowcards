const cleanString = (s) =>
  s
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, "");

/*
 * Compares the flashcard solution against a (user inputted) answer. Only
 * alphanumeraical characters are compared in a case insensitive way, so it
 * will ignore and casing, whitespace or punctuation.
 */
export const isCorrect = (flashcard, answer) =>
  cleanString(answer) === cleanString(flashcard.solution);
