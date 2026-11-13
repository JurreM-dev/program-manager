import {
  html,
  useContext,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, playerContext, worldContext } from "../contexts.js";

export function StoriesPage() {
  const { renderedPage } = useContext(appContext);
  if (renderedPage === "storiesPage") {
    console.log("storiesPage");
    return html`
      <div class="Page">
        <h1 class="PageTitle">stories page</h1>
      </div>
    `;
  }
}
