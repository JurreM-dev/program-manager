import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, setsContext } from "./../contexts.js";

export function StudyPage() {
    const {currentPage, setCurrentPage} = useContext(appContext);
    const { sets } = useContext(setsContext);

    const [chosen, setChosen] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState({
        question: "",
        answers: []
    });

    function rollQuestion() {
        const questionId = Math.floor(Math.random() * chosen.set.length);
        const question = chosen.set[questionId];
        const asked = question.word;
        const answers = question.definitions;

        setCurrentQuestion({
            question: asked,
            answers
        });
    }

    useEffect(() => {
        if (chosen) {
            rollQuestion();
        }
    }, [chosen]);

    if(currentPage === "study") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>Study</h2>
                ${chosen
                    ? html`
                        <h3>chose: ${chosen?.name}</h3>
                        <h3 id="questionAnswer">...</h3>
                        <p class="question">${currentQuestion?.question}</p>
                        <input class="answerIn"/>
                        <button class="confirmAnswer">question!</button>
                    `
                    : html`
                        <h3>choose a set by clicking on it</h3>
                        ${[...sets].reverse().map((set) => html`
                        <div class="setsOption" onclick=${()=>{setChosen(set)}}>
                            <p>${set.name}</p>
                        </div>
                        `)}
                    `
                }
            </div>
        `
    }
} 