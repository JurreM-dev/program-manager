// libraries
import {
  html,
  render,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// contexts
import { appContext, setsContext } from "./contexts.js";

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
  const [sets, setSets] = useState([]);

  // effects
  useEffect(() => {
    async function loadSets() {
      const potential = await localforage.getItem("studyRPGSetsSave");
      if (potential) {
        setSets(potential);
        console.log(potential);
      }
    }
    loadSets();
  }, []);
  useEffect(() => {
    localforage.setItem("studyRPGSetsSave", sets);
  }, [sets]);

  // inner functions
  function addSet(set) {
    setSets((prevSets) => [...prevSets, set]);
  }

  // context values
  const appStates = {
    currentPage,
    setCurrentPage,
  };

  const setStates = {
    sets,
    setSets,
    addSet,
  };

  return html`
    <${appContext.Provider} value=${appStates}>
    <${setsContext.Provider} value=${setStates}>
        <h1 class="mainTitle">StudyRPG</h1>
        <${PageSwitch}/>

        <${SetCreatorPage}/>
        <${StatsPage}/>
        <${StudyPage}/>
        <${ShopPage}/>
    </${appContext.Provider}>
    </${setsContext.Provider}>
    `;
}

render(html`<${App} />`, document.body);
