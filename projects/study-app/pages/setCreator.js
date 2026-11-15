import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, setsContext } from "./../contexts.js";

export function SetCreatorPage() {
    const {currentPage, setCurrentPage} = useContext(appContext);
    const {addSet} = useContext(setsContext);

    const [currentCreating, setCurrentCreating] = useState("");
    const [currentSetName, setCurrentSetName] = useState("");

    function makeSet() {
        let lines = currentCreating.split("\n");
        let set = {
            name: currentSetName,
            set: []
        }
        lines.forEach((line)=>{
            line = line.trim();
            let parts = line.split("=");
            if(parts.length > 2 || parts.length < 2) {
                return;
            }
            let word = parts[0].trim();
            let definitions = parts[1].split("/");
            let usedDefinitions = [];
            definitions.forEach((definition)=>{
                usedDefinitions.push(definition.trim().toLowerCase());
            })
            set.set.push({
                word: word,
                definitions: usedDefinitions
            });
        });
        addSet(set);
    }

    if(currentPage === "setCreator") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>Set Creator</h2>
                <input 
                    placeholder="set name" 
                    id="setNameIn"
                    value=${currentSetName}
                    onInput=${(event)=>{setCurrentSetName(event.currentTarget.value)}}
                />
                <textarea 
                    placeholder=${"type out your set here\nif there are multiple options (for answers only) put / inbetween\neach new line is a new word in the set\nput it like this: <word> = <answer1>/<answer2>"}  
                    id="setIn"
                    onInput=${(event)=>{setCurrentCreating(event.currentTarget.value)}}
                    value=${currentCreating}
                    spellcheck=${false}
                ></textarea>
                <button
                    onclick=${makeSet}
                >confirm</button>
            </div>
        `
    }
} 