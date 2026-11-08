import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { appContext } from "../contexts.js";

import rarities from '../data/rarities.json' with { type: 'json' };

export function Battle() {
  const { player, catchMonster, chooseMonster, chooseRandomMonster, buildMonsterStats, healCurrentMonster } =
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

  function handleExp(monster, amount = 0) {
    let updatedMonster = {
      ...monster,
      currentExp: (Number(monster.currentExp) || 0) + amount,
    };

    while(updatedMonster.currentExp >= updatedMonster.neededExp) {
      updatedMonster = {
        ...updatedMonster,
        currentExp: updatedMonster.currentExp - updatedMonster.neededExp,
        level: updatedMonster.level + 1,
        neededExp: 100 + (100 * (updatedMonster.level + 1)),
      };
    }

    return updatedMonster;
  }

  function attacks(attacker, receiver) {
    let chance = Math.random();
    if(chance < 0.07) {
      alert(`${attacker.name} missed!`);
      return { attacker, receiver };
    }
    let damage = attacker.dmg + Math.round(Math.random() * 10);
    receiver.currentHp -= damage;
    if(receiver.currentHp <= 0) {
      receiver.currentHp = 0;
      alert(`${attacker.name} won the battle!`);
      attacker = handleExp(attacker, rarities[receiver.rarity].expGiven);
      exitBattle();
    }
    return { attacker, receiver };
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
          if(player.currentMonster.currentHp <= 0) {
            alert("your monster is already fainted! heal it first!");
            return;
          }
          openRandomBattle();
        }}
      >
        random encounter
      </button>
      <button class="randomEncounterBtn"
        onclick=${() => {
          if (!player.currentMonster) {
            alert("You need to choose a monster first!");
            return;
          }
          healCurrentMonster();
        }}
      >heal monster</button>
    </div>
    <div class="battleScreen" id="battleScreen" style="display: none;">
      <div id="battleField">
        <div class="battleBox">
          <h1>${player.currentMonster ? player.currentMonster.name : "Your Monster"}</h1>
          <h1>HP: ${player.currentMonster ? player.currentMonster.currentHp : 0} / ${player.currentMonster ? player.currentMonster.maxHp : 0}</h1>
        </div>
        <div class="battleBox">
          <h1>${enemyMonster ? enemyMonster.name : "Enemy Monster"}</h1>
          <h1>HP: ${enemyMonster ? enemyMonster.currentHp : 0} / ${enemyMonster ? enemyMonster.maxHp : 0}</h1>
        </div>
      </div>
      <div id="movesBox">
        <button
          onclick=${()=>{
            if(enemyMonster.currentHp === enemyMonster.maxHp) {
              alert("you can't catch a monster at full health!");
              return;
            }
            const result = catchMonster(enemyMonster);
            if(result) {
              exitBattle();
            }
          }}
        >catch</button>
        <button onclick=${exitBattle}>run</button>
        <button
          onclick=${()=>{
            const playerAttack = attacks(player.currentMonster, enemyMonster);
            setEnemyMonster({...playerAttack.receiver});

            if(playerAttack.receiver.currentHp > 0) {
              const enemyAttack = attacks(playerAttack.receiver, playerAttack.attacker);
              chooseMonster({...enemyAttack.receiver});
            } else {
              chooseMonster({...playerAttack.attacker});
            }
          }}
        >attack</button>
      </div>
    </div>
  `;
}
