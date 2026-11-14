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
import { pageSwitch } from "./components.js";

function App() {
    // states
    const [currentPage, setCurrentPage] = useState("setCreator")

    return html`
    <div>
        <h1 class="mainTitle">StudyRPG</h1>
        <${pageSwitch}/>
    </div>
    `
}

render(html`<${App} />`, document.body);