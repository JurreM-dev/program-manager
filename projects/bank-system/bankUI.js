import { html, render, useContext, useState } from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "./contexts.js";

function titleBox() {
    const {username, setUsername} = useContext(appContext);
    return html`
    <div id="titleBox">
        <h1 class="bigTitle">welcome ${username}!</h1>
    </div>
    `
}

function App() {
    const [username, setUsername] = useState("user");

    const state = {
        username,
        setUsername
    };

    return html`
        <${appContext.Provider} value=${state}>
            <${titleBox} />
        </${appContext.Provider}>   
    `
}

render(html`<${App}/>`, document.body)