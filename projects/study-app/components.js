import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// contexts
import { appContext } from "./contexts.js";

function PageChanger({ changeTo, children }) {
    const {currentPage, setCurrentPage} = useContext(appContext);

    return html`
        <button
            onclick=${()=>{
                setCurrentPage(changeTo);
            }}
        >${children}</button>
    `
}

export function PageSwitch() {
    return html`
        <div class="horizontalFlex pageSwitch">
            <${PageChanger} changeTo=${"setCreator"}>set creator</${PageChanger}>
            <${PageChanger} changeTo=${"study"}>study</${PageChanger}>
            <${PageChanger} changeTo=${"shop"}>shop</${PageChanger}>
            <${PageChanger} changeTo=${"stats"}>stats</${PageChanger}>
        </div>
    `
}