const cleanString = (s) =>
  s
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z]/g, "");

export const isCorrect = (flashcard, answer) =>
  cleanString(answer) === cleanString(flashcard.solution);
