import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export function pageSwitch() {
    return html`
        <div class="horizontalFlex pageSwitch">
            <button>create sets</button>
            <button>study</button>
            <button>shop</button>
            <button>stats</button>
        </div>
    `
}