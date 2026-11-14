import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "./../contexts.js";

export function SetCreatorPage() {
    const {currentPage, setCurrentPage} = useContext(appContext);

    if(currentPage === "setCreator") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>Set Creator</h2>
            </div>
        `
    }
} 