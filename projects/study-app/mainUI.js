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
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState({
    name: "user",
    currentExp: 0,
    neededExp: 100,
    currentLevel: 1,
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
      const potential = await localforage.getItem("studyRPGUserSave");
      if (potential) {
        setUser(potential);
      } else {
        setUser({
          name: "user",
          currentExp: 0,
          neededExp: 100,
          currentLevel: 1,
        });
      }
    }
    function loadCoins() {
      const potential = localStorage.getItem("studyRPGCoinSave");
      if (potential) {
        setGoldCoins(Number(potential));
      }
    }
    Promise.all([loadSets(), loadUser()]).then(() => {
      loadCoins();
      setIsLoaded(true);
    });
  }, []);
  useEffect(() => {
    if (!isLoaded) return;
    localforage.setItem("studyRPGSetsSave", sets);
  }, [sets, isLoaded]);
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("studyRPGCoinSave", goldCoins);
  }, [goldCoins, isLoaded]);
  useEffect(() => {
    if (!isLoaded) return;
    checkExp();
    localforage.setItem("studyRPGUserSave", user);
  }, [user, isLoaded]);

  // inner functions
  function addSet(set) {
    setSets((prevSets) => [...prevSets, set]);
  }
  function checkExp() {
    if (user.currentExp >= user.neededExp) {
      let tempLevel = user.currentLevel + 1;
      setUser((prev) => ({
        ...prev,
        neededExp: tempLevel * 100,
        currentExp: 0,
        currentLevel: prev.currentLevel + 1,
      }));
      alert("level up!");
    }
  }

  // context values
  const appStates = {
    currentPage,
    setCurrentPage,
    goldCoins,
    setGoldCoins,
    user,
    setUser,
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
