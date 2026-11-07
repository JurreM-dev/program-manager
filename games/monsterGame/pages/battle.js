import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { appContext } from "../contexts.js";

export function Battle() {
    const { player, catchMonster, chooseRandomMonster, buildMonsterStats } = useContext(appContext);
    return html`
        <button
            onclick=${()=>{
                let monster = chooseRandomMonster(player.currentArea);
                monster = buildMonsterStats(monster);
                catchMonster(monster);
            }}
        >test</button>
    `
}