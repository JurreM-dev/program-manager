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

    if(currentPage === "study") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>Study</h2>
                ${chosen
                    ? html`
                        <p>chose: ${chosen.name}</p>
                    `
                    : html`
                        <h3>choose a set by clicking on it</h3>
                        ${sets.map((set) => html`
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