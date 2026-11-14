// libraries
import {
  html,
  render,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// contexts
import { appContext } from "./contexts.js";

// components
import { PageSwitch } from "./components.js";

function App() {
    // states
    const [currentPage, setCurrentPage] = useState("setCreator");

    // context values
    const appStates = {
        currentPage,
        setCurrentPage
    }

    return html`
    <${appContext.Provider} value=${appStates}>
    <div>
        <h1 class="mainTitle">StudyRPG</h1>
        <${PageSwitch}/>
        <p>${currentPage}</p>
    </div>
    </${appContext.Provider}>
    `
}

render(html`<${App} />`, document.body);