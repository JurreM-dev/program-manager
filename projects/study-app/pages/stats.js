import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "./../contexts.js";

export function StatsPage() {
    const {currentPage, setCurrentPage, user, setUser} = useContext(appContext);

    if(currentPage === "stats") {
        return html`
            <div id="statsPage" class="Page alignCenter verticalFlex">
                <h2>name:</h2>
                <input 
                    value=${user.name}
                    onInput=${(event)=>{setUser((prev)=> ({...prev, name: event.currentTarget.value}))}}
                />
            </div>
        `
    }
} 