import { assoc, dissoc } from "ramda";
import * as Quiz from "./model.js";

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
