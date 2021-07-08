import {
  assoc,
  assocPath,
  sortBy,
  compose,
  map,
  prop,
  nth,
  without,
  keys,
  reduce,
  append,
  path,
  length,
} from "ramda";

import * as Flashcard from "../flashcard/model";

const shuffle = sortBy((_x) => Math.random());
const first = nth(0);

/*
 * Creates a new quiz from a list of flashcards. Questions will be shuffled.
 */
export const make = (flashcards) => {
  const questions = compose(map(prop("id")), shuffle)(flashcards);
  return {
    questions,
    currentQuestion: first(questions),
    // A map from flashcard ID to user submitted answer.
    answers: {},
    isFinished: false,
  };
};

/*
 * Sets the answer for the given flashcardId
 */
export const setAnswer = (quiz, flashcardId, answer) => {
  return assocPath(["answers", flashcardId], answer, quiz);
};

/*
 * Returns the flashcard ID of the next unanaswered question.
 */
export const getNextQuestion = (quiz) => {
  const { questions, answers } = quiz;
  const unansweredQuestions = without(keys(answers), questions);
  return first(unansweredQuestions);
};

/*
 * Sets the current question to the next unanswered question.
 */
export const advanceToNextQuestion = (quiz) => {
  const nextQuestion = getNextQuestion(quiz);
  return assoc("currentQuestion", nextQuestion, quiz);
};

/*
 * Sets the isFinished property. Useful to know in the UI when to display the
 * quiz overview. This should be done using routing, but since this app is so
 * small no routing implementation is available.
 */
export const finish = (quiz) => assoc("isFinished", true, quiz);

/*
 * Returns a quiz report containing the list of errors, modeled as a flashcard
 * with an extra key which is the users answer, and a score tuple of type
 * [nSuccess, nQuestions]
 */
export const report = (quiz, flashcardsById) => {
  const errors = reduce(
    (errors, flashcardId) => {
      const flashcard = prop(flashcardId, flashcardsById);
      const answer = path(["answers", flashcardId], quiz);
      if (Flashcard.isCorrect(flashcard, answer)) {
        return errors;
      }
      return append(assoc("answer", answer, flashcard), errors);
    },
    [],
    keys(quiz.answers)
  );

  const numberOfQuestions = length(quiz.questions);

  return {
    errors,
    score: [numberOfQuestions - length(errors), numberOfQuestions],
  };
};
