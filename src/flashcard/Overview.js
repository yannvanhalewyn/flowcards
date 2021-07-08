import { map } from "ramda";
import { isLoading, isSuccess } from "../remote/events";

const Flashcard = ({ id, prompt, solution }) => {
  return (
    <li className="mb-2 p-4 rounded bg-white" key={id}>
      <p className="font-bold">{prompt}</p>
      <p className="mt-1 italic text-gray-800">{solution}</p>
    </li>
  );
};

const Flashcards = ({ flashcards, status, dispatch }) => {
  if (isLoading(status)) {
    return <span>Loading...</span>;
  } else if (isSuccess(status)) {
    return (
      <div className="mt-4">
        <h1 className="font-bold text-xl mb-2 text-center">Study your cards</h1>
        <hr className="mb-4 border-2 border-dashed border-yellow-200"/>
        <ul>{map(Flashcard, flashcards)}</ul>
        <div className="text-center mt-4">
          <button className="btn btn--blue mx-auto"
                  onClick={() => dispatch({ type: "QUIZ/START", flashcards })}
          >
            Take a Quiz!
          </button>
        </div>
      </div>
    );
  }

  return <div>Could not load Flashcards</div>;
};

export default Flashcards;
