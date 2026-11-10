import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, playerContext } from "../contexts.js";

export function CreatePage() {
  const { renderedPage } = useContext(appContext);
  const { player, setPlayer } = useContext(playerContext)

  if (renderedPage === "createPage") {
    return html`
    <div class="Page">
      <h1 class="PageTitle">create/edit roleplay</h1>
      <div class="settingsDiv">
        <h2 class="underTitle">Player</h2>
        <p>name</p>
        <input type="text" placeholder="player name" class="settingsInput" value=${player.name} onChange=${(event) =>{
           setPlayer(previous => ({...previous, name: event.currentTarget.value}));
          }} />
        <p>species</p>
        <input type="text" placeholder="player species" class="settingsInput" value=${player.species} onChange=${(event) =>{
           setPlayer(previous => ({...previous, species: event.currentTarget.value}));
          }} />
      </div>
    </div> `;
  }
}
