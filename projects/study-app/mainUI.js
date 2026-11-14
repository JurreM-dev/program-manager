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

// pages
import { StatsPage } from "./pages/stats.js";
import { ShopPage } from "./pages/shop.js";
import { StudyPage } from "./pages/study.js";
import { SetCreatorPage } from "./pages/setCreator.js";

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
        <h1 class="mainTitle">StudyRPG</h1>
        <${PageSwitch}/>

        <${SetCreatorPage}/>
        <${StatsPage}/>
        <${StudyPage}/>
        <${ShopPage}/>
    </${appContext.Provider}>
    `
}

render(html`<${App} />`, document.body);