import {
  html,
  useContext,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// anime js import
import {
  animate,
  scrambleText,
} from "https://cdn.jsdelivr.net/npm/animejs/+esm";

import {
  appContext,
  playerContext,
  storyContext,
  worldContext,
} from "../contexts.js";

function specialMenu({ passed }) {
  // special output function

  function animateOut(printedValue) {
    const animationOut = document.getElementById("animationOut");
    animate(animationOut, {
      innerHTML: scrambleText({ text: printedValue, duration: 750 }),
    });
  }

  if (passed.specialOpen) {
    return html`
      <div id="specialMenu">
        <h1 id="animationOut">...</h1>
        <button
          onclick=${() => animateOut(String(Math.floor(Math.random() * 6) + 1))}
        >
          roll a D6
        </button>

        <button
          class="closeBtn"
          onclick=${() => {
            passed.setSpecialOpen(false);
          }}
        >
          X
        </button>
      </div>
    `;
  }
}

export function PlayPage() {
  // contexts
  const { renderedPage } = useContext(appContext);
  const { currentWriting, setCurrentWriting } = useContext(storyContext);

  // states
  const [specialOpen, setSpecialOpen] = useState(true);
  const passed = {
    specialOpen,
    setSpecialOpen,
  };

  if (renderedPage === "playPage") {
    return html`
      <div class="Page">
        <h1 class="PageTitle">play roleplay</h1>
        <textarea
          id="playTextArea"
          spellcheck="false"
          value=${currentWriting}
          onInput=${(event) => {
            setCurrentWriting(event.currentTarget.value);
          }}
        ></textarea>
        <${specialMenu} passed=${passed} />
      </div>
    `;
  }
}
