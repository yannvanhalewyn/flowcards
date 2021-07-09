import { prop, compose, indexBy } from "ramda";
import { createRemoteLoader } from "../remote/model";

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

/*
 * Loads the flashcards into a Recoil atom
 */
export const remoteFlashcards = createRemoteLoader({
  key: "userFlashCards",
  endpoint: "/flashcards.json",
  // Function that picks the flashcards key from response, then indexes the list
  // by their ID for easy access
  parseResponse: compose(indexBy(prop("id")), prop("flashcards")),
  default: {},
});
