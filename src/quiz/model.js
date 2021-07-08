import {
  assoc,
  assocPath,
  sortBy,
  compose,
  map,
  prop,
  nth,
  without,
  keys
} from "ramda";


const shuffle = sortBy((_x) => Math.random());
const first = nth(0);

export const make = (flashcards) => {
  const questions = compose(map(prop("id")), shuffle)(flashcards);
  return {
    questions,
    currentQuestion: first(questions),
    // A map from question ID to user submitted answer.
    answers: {},
  };
};

export const setAnswer = (quiz, flashcardId, answer) => {
  return assocPath(["answers", flashcardId], answer, quiz);
};

export const nextQuestion = (quiz) => {
  const { questions, answers } = quiz;
  const unansweredQuestions = without(keys(answers), questions);
  return assoc("currentQuestion", first(unansweredQuestions), quiz)
}
