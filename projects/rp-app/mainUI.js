import {
  html,
  render,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// pages
import { CreatePage } from "./pages/Create.js";
import { PlayPage } from "./pages/Play.js";

// contexts
import { appContext, playerContext, storyContext, worldContext } from "./contexts.js";
import { NavBar } from "./components/NavBar.js";

function App() {
  // STATES
  const [renderedPage, setRenderedPage] = useState("playPage");
  const [player, setPlayer] = useState({
    name: "player",
    species: "human",
    looks: "",
    description: "",
    inventory: [],
    job: "none",
    team: null,
    currentLocation: null,
  });
  const [teams, setTeams] = useState({});
  const [currentWriting, setCurrentWriting] = useState("");

  // EFFECTS
  useEffect(() => {
    localforage.setItem("oceanRpGamePlayerSave", player);
  }, [player]);

  useEffect(() => {
    localforage.setItem("oceanRpGameCurrentWritingSave", currentWriting);
  })

  // STARTUP EFFECT
  useEffect(() => {
    // loading player data
    async function loadPlayer() {
      const potential = await localforage.getItem("oceanRpGamePlayerSave");
      if (potential) {
        setPlayer(potential);
      }
    }
    async function loadCurrentWriting() {
      const potential = await localforage.getItem("oceanRpGameCurrentWritingSave");
      if(potential) {
        setCurrentWriting(potential);
      }
    }
    loadCurrentWriting();
    loadPlayer();
  }, []);

  // CONTEXTS
  const states = {
    renderedPage,
    setRenderedPage,
  };

  const playerStates = {
    player,
    setPlayer,
  };

  const worldStates = {
    teams,
    setTeams,
  };

  const storyStates = {
    currentWriting,
    setCurrentWriting
  }

  return html`
    <${appContext.Provider} value=${states}>
        <${playerContext.Provider} value=${playerStates}>
            <${worldContext.Provider} value=${worldStates}>
              <${storyContext.Provider} value=${storyStates}>
                <${CreatePage}/>
                <${PlayPage}/>

                <${NavBar}/>
              </${storyContext.Provider}>
            </${worldContext.Provider}>
        </${playerContext.Provider}>
    </${appContext.Provider}>
    `;
}

render(html`<${App} />`, document.body);
