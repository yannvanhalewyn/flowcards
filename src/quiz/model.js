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

export const setAnswer = (quiz, flashcardId, answer) => {
  return assocPath(["answers", flashcardId], answer, quiz);
};

export const getNextQuestion = (quiz) => {
  const { questions, answers } = quiz;
  const unansweredQuestions = without(keys(answers), questions);
  return first(unansweredQuestions);
};

export const advanceToNextQuestion = (quiz) => {
  const nextQuestion = getNextQuestion(quiz);
  return assoc("currentQuestion", nextQuestion, quiz);
};

export const finish = (quiz) => assoc("isFinished", true, quiz);

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
    quiz.questions
  );

  const numberOfQuestions = length(quiz.questions);

  return {
    errors,
    score: [numberOfQuestions - length(errors), numberOfQuestions],
  };
};
