import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { CreatePage } from "./pages/Create.js";
import { appContext, playerContext } from "./contexts.js";

function App() {
    // STATES
    const [ renderedPage, setRenderedPage ] = useState("createPage");
    const [ player, setPlayer ] = useState({
        name: "player",
        species: "human",
        looks: "",
        description: "",
        inventory: [],
        job: "none",
        team: null,
        currentLocation: null
    });

    // EFFECTS
    useEffect(()=>{
        localforage.setItem("oceanRpGamePlayerSave", player);
    }, [player])

    // STARTUP EFFECT
    useEffect(()=>{
        // loading player data
        async function loadPlayer() {
            const potential = await localforage.getItem("oceanRpGamePlayerSave");
            if(potential) {
                setPlayer(potential);
            }
        }
        loadPlayer();
    }, [])


    // CONTEXTS
    const states = {
        renderedPage,
        setRenderedPage
    }
    
    const playerStates = {
        player,
        setPlayer
    };

    return html`
    <${appContext.Provider} value=${states}>
    <${playerContext.Provider} value=${playerStates}>
        <${CreatePage}/>
    </${appContext.Provider}>
    </${playerContext.Provider}>
    `
}

render(html`<${App} />`, document.body);