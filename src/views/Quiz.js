
const card = {
  prompt: "Да",
  answer: "Yes",
};

const handleGuess = (card, input) => {
  if (card.answer === input) {
    alert("Correct!")
  } else {
    alert("False!")
  }
}

const App = () => {
  const [input, setInput] = useState("");

  return (
    <div className="App">
      <h1>Test yourself!</h1>
      <div className="flashcard mt-8 mx-auto p-8">
        <span className="flashcard__prompt">{card.prompt}</span>
        <input
          className="flashcard__input mt-8"
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => handleGuess(card, input)}>Guess!</button>
        <button onClick={() => dispatch({type: "foo"})}>Guess!</button>
      </div>
    </div>
  );
};

export default App;
