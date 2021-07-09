import { map } from "ramda";
import { DashedHeading } from "../Typography";

const Flashcard = ({ id, prompt, solution }) => {
  return (
    <li className="mb-2 p-4 rounded bg-white" key={id}>
      <p className="font-bold">{prompt}</p>
      <p className="mt-1 italic text-gray-800">{solution}</p>
    </li>
  );
};

/*
 * The component displaying all the user's flashcards meant for studying before
 * taking a quiz.
 */
const Flashcards = ({ flashcards, startQuiz }) => (
  <div className="mt-4 animation-appear">
    <DashedHeading>Study your cards</DashedHeading>
    <ul>{map(Flashcard, flashcards)}</ul>
    <div className="text-center mt-4">
      <button className="btn btn--blue mx-auto" onClick={startQuiz}>
        Take a Quiz!
      </button>
    </div>
  </div>
);

export default Flashcards;
