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
  // states
  const [randList, setRandList] = useState(false);
  const [randomizerContent, setRandomizerContent] = useState("");

  function randomize() {
    const list = randomizerContent.split("\n");
    const id = Math.floor(Math.random() * list.length);
    const result = String(list[id]);
    animateOut(result);
  }

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
        <h2>dice</h2>
        <button
          onclick=${() => animateOut(String(Math.floor(Math.random() * 6) + 1))}
        >
          roll a D6
        </button>
        <button
          onclick=${() => animateOut(String(Math.floor(Math.random() * 12) + 1))}
        >
          roll a D12
        </button>
        <button
          onclick=${() => animateOut(String(Math.floor(Math.random() * 20) + 1))}
        >
          roll a D20
        </button>
        <h2>flip a coin!</h2>
        <button
          onclick=${() => animateOut(Math.random() < 0.5 ? "heads" : "tails")}
        >
          flip a coin
        </button>
        <h2>randomizer</h2>
        <button onclick=${randomize}>randomize!</button>
        <button
          class="smallBtn"
          onclick=${()=>{
            setRandList(!randList);
          }}
        >options</button>
        ${(() => {
          if (randList) {
            return html`<textarea 
              spellcheck=${false} 
              id="randomIn"
              onInput=${(event)=>{setRandomizerContent(event.currentTarget.value)}}
              value=${randomizerContent}
              ></textarea>`;
          }
        })()}

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
  const [specialOpen, setSpecialOpen] = useState(false);
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
          spellcheck=${false}
          value=${currentWriting}
          onInput=${(event) => {
            setCurrentWriting(event.currentTarget.value);
          }}
        ></textarea>
        <div id="inputPlace">
          <button
            onclick=${() => {
              setSpecialOpen(true);
            }}
          >✨</button>
          <input
            spellcheck=${false}
            type="text"
            placeholder="type here"
            id="messageIn"
          />
          <button
            onclick=${() => {
              setCurrentWriting((previous) => previous + "\n\n" + document.getElementById("messageIn").value);
              document.getElementById("messageIn").value = "";
            }}
          >🖊</button>
        </div>
        <${specialMenu} passed=${passed} />
      </div>
    `;
  }
 }

