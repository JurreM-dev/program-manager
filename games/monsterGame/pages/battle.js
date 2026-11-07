import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { appContext } from "../contexts.js";

export function Battle() {
  const { player, catchMonster, chooseRandomMonster, buildMonsterStats } =
    useContext(appContext);

  function openBattle() {
    document.getElementById("peaceScreen").style.display = "none";
    document.getElementById("battleScreen").style.display = "flex";
  }
  return html`
    <div id="peaceScreen" class="battleScreen">
      <h1>battle</h1>
      <h2>current area: ${player.currentArea}</h2>
      <button
        class="randomEncounterBtn"
        onclick=${() => {
          let monster = chooseRandomMonster(player.currentArea);
          monster = buildMonsterStats(monster);
          catchMonster(monster);

          openBattle();
        }}
      >
        random encounter
      </button>
    </div>
    <div class="battleScreen" id="battleScreen" style="display: none;">
      <div id="battleField">
        <div class="battleBox">
          <h1>your monster</h1>
        </div>
        <div class="battleBox">
          <h1>enemy monster</h1>
        </div>
      </div>
    </div>
  `;
}
