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
                <input placeholder="set name" id="setNameIn"/>
                <textarea placeholder=${"type out your set here\nif there are multiple options (for answers only) put / inbetween\neach new line is a new word in the set\nput it like this: <word> = <answer1>/<answer2>"} id="setIn"></textarea>
            </div>
        `
    }
} 