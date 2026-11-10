import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, playerContext, worldContext } from "../contexts.js";

export function CreatePage() {
  const { renderedPage } = useContext(appContext);
  const { player, setPlayer } = useContext(playerContext);
  const { teams, setTeams } = useContext(worldContext);

  // inner functions
  function addTeam() {
    const teamName = prompt("team name?") ?? "newTeam";
    if(teams[teamName]) {
      alert("error, team with that name already exists");
      return;
    }
    const teamColor =  prompt("what color will mark your team?");
    const newTeam = {
      color: teamColor,
      name: teamName
    };
    setTeams(prevTeams => ({...prevTeams, [teamName]: newTeam}));
  }

  if (renderedPage === "createPage") {
    return html`
      <div class="Page">
        <h1 class="PageTitle">create/edit roleplay</h1>
        <div class="settingsDiv">
          <h2 class="underTitle">Player</h2>
          <p>name</p>
          <input
            type="text"
            placeholder="player name"
            class="settingsInput"
            value=${player.name}
            onChange=${(event) => {
              setPlayer((previous) => ({
                ...previous,
                name: event.currentTarget.value,
              }));
            }}
          />
          <p>species</p>
          <input
            type="text"
            placeholder="player species"
            class="settingsInput"
            value=${player.species}
            onChange=${(event) => {
              setPlayer((previous) => ({
                ...previous,
                species: event.currentTarget.value,
              }));
            }}
          />
          <p>looks</p>
          <input
            type="text"
            placeholder="player looks"
            class="settingsInput"
            value=${player.looks}
            onChange=${(event) => {
              setPlayer((previous) => ({
                ...previous,
                looks: event.currentTarget.value,
              }));
            }}
          />
        </div>
        <div class="settingsDiv">
          <h2 class="underTitle">Teams and Factions</h2>
          <h3 class="underTitle">teams</h3>
          ${Object.values(teams).map((team)=>{
            return html`
            <div class="teamBox" style="background-color: ${team.color};">
              <p>${team.name}</p>
            </div>
            `
          })}
          <button
            onclick=${addTeam}
          >+ team</button>
        </div>
      </div>
    `;
  }
}
