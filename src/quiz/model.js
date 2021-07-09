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
  apply,
} from "ramda";
import { atom, selector, useRecoilState } from "recoil";

import { remoteFlashcards } from "../flashcard/model";
import * as Flashcard from "../flashcard/model";

const shuffle = sortBy((_x) => Math.random());
const first = nth(0);

/*
 * Creates a new quiz from a list of flashcards. Questions will be shuffled.
 */
export const make = (flashcards) => {
  const questionIds = compose(map(prop("id")), shuffle)(flashcards);
  return {
    questionIds,
    currentQuestionId: first(questionIds),
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
  const { questionIds, answers } = quiz;
  const unansweredQuestions = without(keys(answers), questionIds);
  return first(unansweredQuestions);
};

/*
 * Sets the current question to the next unanswered question.
 */
export const advanceToNextQuestion = (quiz) => {
  const nextQuestion = getNextQuestion(quiz);
  return assoc("currentQuestionId", nextQuestion, quiz);
};

/*
 * Sets the isFinished property. Useful to know in the UI when to display the
 * quiz overview. This should be done using routing, but since this app is so
 * small no routing implementation is available.
 */
export const finish = (quiz) => assoc("isFinished", true, quiz);

////////////////////////////////////////////////////////////////////////////////
// Reads

/*
 * The base quiz atom
 */
export const currentQuizAtom = atom({
  key: "currentQuiz",
});

/*
 * The persisted quiz in the state only has a collection of ids for the
 * questions. This derivated selector picks those questions out of the app state
 * in order to create a rich quiz. Will add two keys: `questions` and
 * `currentQuestion` which will contain the flashcard found for the respective
 * ids of `questionIds` and `currentQuestionId`
 */
export const currentQuizWithFlashcards = selector({
  key: "currentQuizWithFlashcards",
  get: ({ get }) => {
    const quiz = get(currentQuizAtom);
    const flashcardsById = get(remoteFlashcards);
    const questions = map((id) => prop(id, flashcardsById), quiz.questionIds);
    const currentQuestion = prop(quiz.currentQuestionId, flashcardsById);

    return compose(
      assoc("questions", questions),
      assoc("currentQuestion", currentQuestion)
    )(quiz);
  },
});

/*
 * Returns a quiz report containing the list of errors, modeled as a flashcard
 * with an extra key which is the users answer, and a score tuple of type
 * [nSuccess, nQuestions]
 */
export const currentQuizReport = selector({
  key: "currentQuizReport",
  get: ({ get }) => {
    const quiz = get(currentQuizWithFlashcards);

    const errors = reduce(
      (errors, question) => {
        const answer = path(["answers", question.id], quiz);
        if (answer && Flashcard.isCorrect(question, answer)) {
          return errors;
        }
        return append(assoc("answer", answer, question), errors);
      },
      [],
      quiz.questions
    );

    const numberOfQuestions = length(quiz.questions);

    return {
      errors,
      score: [numberOfQuestions - length(errors), numberOfQuestions],
    };
  },
});

////////////////////////////////////////////////////////////////////////////////
// Mutations

/*
 * An abstraction around a hook that will use a recoil state to perform an
 * update transformation and persist it back. The mutator can receive any
 * arbitrary number of arguments. The update function should be of type:
 * f(oldValue, ...nArgs) -> newValue.
 *
 * This abstraction is generic and can be re-used if put in proper namespace.
 */
const makeLocalMutator = (atom, f) => () => {
  const [value, setValue] = useRecoilState(atom);
  return (...args) => setValue(apply(f, [value, ...args]));
};

export const useNewQuizMutation = makeLocalMutator(
  currentQuizAtom,
  (quiz, flashcards) => make(flashcards)
);

export const useSubmitAnswerMutation = makeLocalMutator(
  currentQuizAtom,
  setAnswer
);

export const useAdvanceToNextQuestionMutation = makeLocalMutator(
  currentQuizAtom,
  advanceToNextQuestion
);

export const useFinishQuizMutation = makeLocalMutator(currentQuizAtom, finish);

export const useCloseQuizMutation = makeLocalMutator(
  currentQuizAtom,
  () => null
);
