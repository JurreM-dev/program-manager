import {
  html,
  useContext,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "../contexts.js";

export function NavBar() {
    const { setRenderedPage } = useContext(appContext);

    return html`
        <div id="navBar">
            <button
                onclick=${() => setRenderedPage("playPage")}
            >⌨</button>
            <button
                onclick=${() => setRenderedPage("createPage")}
            >🌍</button>
        </div>
    `
}