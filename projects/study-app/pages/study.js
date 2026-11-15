import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// anime js import
import {
  animate,
  scrambleText,
} from "https://cdn.jsdelivr.net/npm/animejs/+esm";

import { appContext, setsContext } from "./../contexts.js";

export function StudyPage() {
  // contexts
  const { currentPage, setCurrentPage, setGoldCoins, setUser } = useContext(appContext);
  const { sets } = useContext(setsContext);

  // states
  const [chosen, setChosen] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answers: [],
  });
  const [answering, setAnswering] = useState("");

  // inner functions
  function rollQuestion() {
    const questionId = Math.floor(Math.random() * chosen.set.length);
    const question = chosen.set[questionId];
    const asked = question.word;
    const answers = question.definitions;

    setCurrentQuestion({
      question: asked,
      answers,
    });
  }

  function answerQuestion() {
    const answer = answering.toLowerCase();
    if (currentQuestion.answers.includes(answer)) {
        const gainedCoins = Math.floor(Math.random() * 2) + 1;
        revealOutput(`correct! Well done! you gained ${gainedCoins} golden coins!`);
        setGoldCoins((prev) => prev + gainedCoins);
        setUser((prev)=>({
          ...prev,
          currentExp: prev.currentExp + 1
        }))
        setAnswering("");
        rollQuestion();
    } else {
        revealOutput("wrong! You'll get it next time though!");
        setAnswering("");
        rollQuestion();
    }
  }

  function revealOutput(printedValue) {
    let out = document.getElementById("questionAnswer");
    animate(out, {
      innerHTML: scrambleText({ text: printedValue, duration: 750 }),
    });
  }

  // effects
  useEffect(() => {
    if (chosen) {
      rollQuestion();
    }
  }, [chosen]);

  if (currentPage === "study") {
    return html`
      <div class="Page alignCenter verticalFlex">
        <h2>Study</h2>
        ${chosen
          ? html`
              <h3>chose: ${chosen?.name}</h3>
              <h3 id="questionAnswer">...</h3>
              <p class="question">${currentQuestion?.question}</p>
              <input
                class="answerIn"
                onInput=${(event) => {
                  setAnswering(event.currentTarget.value);
                }}
                value=${answering}
              />
              <button class="confirmAnswer" onclick=${answerQuestion}>question!</button>
            `
          : html`
              <h3>choose a set by clicking on it</h3>
              ${[...sets].reverse().map(
                (set) => html`
                  <div
                    class="setsOption"
                    onclick=${() => {
                      setChosen(set);
                    }}
                  >
                    <p>${set.name}</p>
                  </div>
                `,
              )}
            `}
      </div>
    `;
  }
}
