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
  const [goldCoins, setGoldCoins] = useState(0);
  const [user, setUser] = useState({
    name: "user",
    currentExp: 0,
    neededExp: 100,
    currentLevel: 1
  });

  // effects
  useEffect(() => {
    async function loadSets() {
      const potential = await localforage.getItem("studyRPGSetsSave");
      if (potential) {
        setSets(potential);
        console.log(potential);
      }
    }
    async function loadUser() {
      const potential = await localforage.getItem("studyRPGCoinSave");
      if(potential) {
        setUser(potential);
      }
    }
    function loadCoins() {
      const potential = localStorage.getItem("studyRPGCoinSave");
      if(potential) {
        setGoldCoins(Number(potential));
      }
    }
    loadSets();
    loadUser();
    loadCoins();
  }, []);
  useEffect(() => {
    localforage.setItem("studyRPGSetsSave", sets);
  }, [sets]);
  useEffect(() => {
    localStorage.setItem("studyRPGCoinSave", goldCoins);
  }, [goldCoins]);
  useEffect(() => {
    localforage.setItem("studyRPGUserSave", user);
  })

  // inner functions
  function addSet(set) {
    setSets((prevSets) => [...prevSets, set]);
  }

  // context values
  const appStates = {
    currentPage,
    setCurrentPage,
    goldCoins,
    setGoldCoins,
    user,
    setUser
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
