import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "./../contexts.js";

export function StudyPage() {
    const {currentPage, setCurrentPage} = useContext(appContext);

    if(currentPage === "study") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>Study</h2>
            </div>
        `
    }
} 