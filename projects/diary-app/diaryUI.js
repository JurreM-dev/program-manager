import {
  html,
  render,
  useContext,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, displaysContext } from "./contexts.js";

import { Stardust } from '../bank-system/moneySystems.js';
const stardust = new Stardust();

let entries = {};

function SideBar() {
  const { showEntryTab, showEntryListTab, showThemeTab } = useContext(displaysContext);

  function closeAll() {
    showEntryTab("none");
    showEntryListTab("none");
    showThemeTab("none");
  }

  return html`
    <aside id="sideBar" class="centerDown">
      <button
        class="sideBtn"
        onclick=${() => {
          closeAll();
          showEntryTab("flex");
        }}
      >
        write entry
      </button>
      <button
        class="sideBtn"
        onclick=${() => {
          closeAll();
          showEntryListTab("flex");
        }}
      >
        entries
      </button>
      <button
        class="sideBtn"
        onclick=${() => {
          closeAll();
          showThemeTab("flex");
        }}
      >
        themes
      </button>
    </aside>
  `;
}

function CreateEntryPage() {
  const [preview, showPreview] = useState("none");
  const [write, showWrite] = useState("block");

  const { entryTab } = useContext(displaysContext);

  const { setTrigger } = useContext(appContext);

  return html`
    <div class="pagePart centerDown" style="display: ${entryTab};">
    <p style="left: 10px; bottom: 10px;" class="decoIcon decoMedium">${availableStyles[currentThemeKey].style_deco}</p>
    <p style="right: 10px; top: 40%;" class="decoIcon decoMedium">${availableStyles[currentThemeKey].style_deco}</p>
    <p style="left: 10px; top: 5%;" class="decoIcon decoMedium">${availableStyles[currentThemeKey].style_deco}</p>
      <h1>create new entry</h1>
      <hr />
      <div class="smallMenu horizontalFlex">
        <button
          onclick=${() => {
            showPreview("none");
            showWrite("block");
          }}
        >
          write
        </button>
        <button
          onclick=${() => {
            showPreview("block");
            showWrite("none");

            const inputMd = document.getElementById("entryTextIn").value;
            const outputMd = marked.parse(inputMd);
            const safeHtml = DOMPurify.sanitize(outputMd);
            document.getElementById("entryMdOut").innerHTML = safeHtml;
          }}
        >
          preview
        </button>
      </div>
      <br />
      <textarea
        class="entryInput"
        style="padding:20px; display: ${write};"
        id="entryTextIn"
      />
      <div
        class="entryInput"
        style="padding:20px; display: ${preview};"
        id="entryMdOut"
      ></div>
      <div class="smallMenu horizontalFlex">
        <button
          onclick=${async () => {
            const entries =
              (await localforage.getItem("blossomDiaryEntries")) ?? {};

            const newName = prompt("entry name?") ?? "-";

            entries[newName] = {
              name: newName,
              id: crypto.randomUUID(),
              content: document.getElementById("entryTextIn").value,
            };

            await localforage.setItem("blossomDiaryEntries", entries);
            setTrigger(prevTrigger => prevTrigger + 1);
          }}
        >
          save
        </button>
      </div>
    </div>
  `;
}

function EntriesPage() {
  const { entryListTab } = useContext(displaysContext);
  const { trigger, setTrigger } = useContext(appContext);

  const [entries, setEntries] = useState({});

  useEffect(() => {
    async function loadEntries() {
      const storedEntries = await localforage.getItem("blossomDiaryEntries");

      setEntries(storedEntries ?? {});
    }

    loadEntries();
  }, [trigger]);

  return html`
    <div class="pagePart centerDown" style="display: ${entryListTab};">
      <h1>entries</h1>

      ${Object.keys(entries).map((entryName) => {
        return html`
            <div class="entryDisplay centerDown">
              <h2>${entryName}</h2>
              <div class="innerEntry">
                <p>${entries[entryName].content}</p>
              </div>
              <div class="smallMenu horizontalFlex">
                <button
                  onclick=${async () => {
                    const entries =
                      (await localforage.getItem("blossomDiaryEntries")) ?? {};

                    delete entries[entryName];

                    await localforage.setItem("blossomDiaryEntries", entries);
                    setTrigger(prevTrigger => prevTrigger + 1);
                  }}
                >
                  delete
                </button>
              </div>
            </div>
        `;
      })}
    </div>
  `;
}

function ThemesPage() {
  const { themeTab } = useContext(displaysContext);

  const { trigger, setTrigger } = useContext(appContext);

  return html`
  <div class="pagePart centerDown" style="display: ${themeTab};">
    <h1>themes</h1>
    ${Object.keys(availableStyles).map((theme)=>{
      let themeJson = availableStyles[theme];
      let price = themeJson.price;
      let priceDisplay = price + "✨";
      if(price <= 0) {
        priceDisplay = "free";
      }
      let buttonHtml = "";

      if (currentThemeKey === theme) {
        buttonHtml = html`<button disabled>equipped</button>`;
      } else if (ownedThemes.includes(theme)) {
        buttonHtml = html`
          <button onclick=${() => {
            currentThemeKey = theme;
            updateTheme();
            setTrigger(prevTrigger => prevTrigger + 1);
          }}>
            equip
          </button>
        `;
      } else {
        buttonHtml = html`
          <button onclick=${() => {
            if(price > 0) {
              let pincode = prompt("your pincode for stardust? (used to purchase the theme)");
              if(!pincode) {
                alert("not a valid pincode");
                return
              }
              const buySuccess = stardust.takeMoney(pincode, price);
              if(!buySuccess) {
                return;
              }
            }
            ownedThemes.push(theme);
            currentThemeKey = theme;
            saveThemes();
            updateTheme();
            setTrigger(prevTrigger => prevTrigger + 1);
          }}>
            buy
          </button>
        `;
      }
      return html`
      <div class="pageCard centerDown">
        <h2>${theme}</h2>
        <p>price: ${priceDisplay}</p>
        <div class="smallMenu">
          ${buttonHtml}
        </div>
      </div>
      `
    })}
  </div>
  `
}

function App() {
  const [entryListTab, showEntryListTab] = useState("none");
  const [entryTab, showEntryTab] = useState("flex");
  const [themeTab, showThemeTab] = useState("none");
  const [trigger, setTrigger] = useState(0);

  const showStates = {
    entryTab,
    showEntryTab,
    entryListTab,
    showEntryListTab,
    themeTab,
    showThemeTab
  };

  const appStates = {
    trigger,
    setTrigger
  }

  return html`
    <${displaysContext.Provider} value=${showStates}>
    <${appContext.Provider} value=${appStates}>
    <div id="root">
        <${SideBar}/>
        <${CreateEntryPage}/>
        <${EntriesPage}/>
        <${ThemesPage}/>
    </div>
    </${appContext.Provider}>
    </${displaysContext.Provider}>
    `;
}

render(html`<${App} />`, document.body);
