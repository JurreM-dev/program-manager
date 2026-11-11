import {
  html,
  useContext,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, playerContext, storyContext, worldContext } from "../contexts.js";

export function PlayPage() {
    const { renderedPage } = useContext(appContext);
    const { currentWriting, setCurrentWriting } = useContext(storyContext);

    if (renderedPage === "playPage") {
        return html`
            <div class="Page">
                <h1 class="PageTitle">play roleplay</h1>
                <textarea 
                  id="playTextArea"
                  spellCheck="false"
                  value=${currentWriting}
                  onInput=${(event) => {
                    setCurrentWriting(event.currentTarget.value);
                  }}
                ></textarea>
            </div>
        `;
    }
}