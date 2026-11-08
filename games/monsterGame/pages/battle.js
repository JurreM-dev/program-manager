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

  const [enemyMonster, setEnemyMonster] = useState(null);

  function openBattle() {
    document.getElementById("peaceScreen").style.display = "none";
    document.getElementById("battleScreen").style.display = "flex";
  }

  function openRandomBattle() {
    let monster = chooseRandomMonster(player.currentArea);
    monster = buildMonsterStats(monster, 4);
    setEnemyMonster(monster);
    openBattle();
  }

  function exitBattle() {
    document.getElementById("peaceScreen").style.display = "flex";
    document.getElementById("battleScreen").style.display = "none";
  }

  return html`
    <div id="peaceScreen" class="battleScreen">
      <h1>battle</h1>
      <h2>current area: ${player.currentArea}</h2>
      <button
        class="randomEncounterBtn"
        onclick=${() => {
          if (!player.currentMonster) {
            alert("You need to choose a monster first!");
            return;
          }
          openRandomBattle();
        }}
      >
        random encounter
      </button>
    </div>
    <div class="battleScreen" id="battleScreen" style="display: none;">
      <div id="battleField">
        <div class="battleBox">
          <h1>${player.currentMonster ? player.currentMonster.name : "Your Monster"}</h1>
        </div>
        <div class="battleBox">
          <h1>${enemyMonster ? enemyMonster.name : "Enemy Monster"}</h1>
        </div>
      </div>
      <div id="movesBox">
        <button
          onclick=${()=>{
            const result = catchMonster(enemyMonster);
            if(result) {
              exitBattle();
            }
          }}
        >catch</button>
      </div>
    </div>
  `;
}
