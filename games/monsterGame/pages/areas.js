import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import { appContext } from "../contexts.js";

import areaData from "../data/areas.json" with { type: "json" };

const areas = areaData.areas;

export function Areas() {
  const { travelToArea } = useContext(appContext);

  return html`
    <div class="areasBox">
      <h1>Areas</h1>
      <div class="areasScreen">
        ${areas.map((area, index) => {
          return html`
            <div key=${index} class="areaDisplay">
              <p>${area.display}</p>
              <p>min level: ${area.minLevel}</p>
              <button
                class="travelBtn"
                onclick=${() => {
                  travelToArea(area);
                }}
              >
                go there!
              </button>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}
