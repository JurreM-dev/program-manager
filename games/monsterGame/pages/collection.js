import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { appContext } from "../contexts.js";

import rarities from "../data/rarities.json" with { type: "json" };

export function Collection() {
  const { collection, chooseMonster } = useContext(appContext);

  return html`
    <div class="collectionScreen">
      <h1>Collection</h1>
      ${collection.map((monster) => {
        return html`
          <div
            class="monsterDisplay"
            style="background-color: ${rarities[monster.rarity]
              .color}; color: ${rarities[monster.rarity].textColor ?? "white"};"
          >
            <p>${monster.name}</p>
            <p>type: ${monster.type}</p>
            <p>level: ${monster.level}</p>
            <p>exp: ${monster.currentExp}/${monster.neededExp}</p>
            <p>hp: ${monster.currentHp}/${monster.maxHp}</p>
            <button
              onclick=${() => {
                chooseMonster(monster);
              }}
            >
              choose
            </button>
          </div>
        `;
      })}
    </div>
  `;
}
