import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "./../contexts.js";

export function StatsPage() {
    const {currentPage, setCurrentPage} = useContext(appContext);

    if(currentPage === "stats") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>stats</h2>
            </div>
        `
    }
} 