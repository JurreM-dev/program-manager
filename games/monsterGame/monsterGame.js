// preact and htm imports
import { html, render, useContext, useState, useEffect } from "https://unpkg.com/htm/preact/standalone.module.js";

// custom component & logic imports
import { appContext } from "./contexts.js";
import { GalaxyTitle } from "./components/parts.js";

function App() {

    return html`
        <h1 class="specialTitle">monster game</h1>
        <${GalaxyTitle} />
    `
}

render(html`<${App}/>`, document.body)