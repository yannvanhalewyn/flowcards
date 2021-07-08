import { assoc, dissoc } from "ramda";
import * as Quiz from "./model.js";

////////////////////////////////////////////////////////////////////////////////
// Action Creators

export const start = (flashcards) => ({ type: "QUIZ/START", flashcards });
export const answerQuestion = (flashcardId, answer) => ({
  type: "QUIZ/ANSWER_QUESTION",
  flashcardId,
  answer,
});
export const nextQuestion = () => ({ type: "QUIZ/NEXT_QUESTION" });
export const finish = () => ({ type: "QUIZ/FINISH" });
export const close = () => ({ type: "QUIZ/CLOSE" });

////////////////////////////////////////////////////////////////////////////////
// Reducer

export const reducers = {
  "QUIZ/START": (state, action) => {
    const { flashcards } = action;
    return assoc("currentQuiz", Quiz.make(flashcards), state);
  },

  "QUIZ/ANSWER_QUESTION": (state, action) => {
    const newQuiz = Quiz.setAnswer(
      state.currentQuiz,
      action.flashcardId,
      action.answer
    );
    return assoc("currentQuiz", newQuiz, state);
  },

  "QUIZ/NEXT_QUESTION": (state, action) => {
    return assoc(
      "currentQuiz",
      Quiz.advanceToNextQuestion(state.currentQuiz),
      state
    );
  },

  "QUIZ/FINISH": (state, action) => {
    return assoc("currentQuiz", Quiz.finish(state.currentQuiz), state);
  },

  "QUIZ/CLOSE": (state, action) => {
    return dissoc("currentQuiz", state);
  },
};
