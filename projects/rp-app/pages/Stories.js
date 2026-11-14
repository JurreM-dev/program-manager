import {
  html,
  useContext,
  useState,
  useEffect
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext, storyContext } from "../contexts.js";

function readPage({ current, onClose }) {
  return html`
  <div
    id="readScreen"
    style="display: ${current ? "flex" : "none"};"
    onclick=${onClose}
  >
    ${current && html`
      <h1>${DOMPurify.sanitize(current.title)}</h1>
      <p>${DOMPurify.sanitize(current.content)}</p>
    `}
  </div>
  `
}

export function StoriesPage() {
  // context
  const { renderedPage } = useContext(appContext);
  const { currentWriting, setCurrentWriting } = useContext(storyContext);

  // states
  const [books, setBooks] = useState([]);
  const [currentRead, setCurrentRead] = useState(null);

  // effects
  useEffect(() => {
    async function loadBooks() {
      const potential = await localforage.getItem("oceanRpGameBooksSave");
      if(Array.isArray(potential)) {
        setBooks(potential);
      }
    }
    loadBooks();
  }, []);

  useEffect(() => {
    localforage.setItem("oceanRpGameBooksSave", books);
  }, [books]);

  function saveBook(title, color) {
    setBooks(previous => [...previous, {title: title, content: currentWriting, color: color}]);
    setCurrentWriting("");
  }

  if (renderedPage === "storiesPage") {
    console.log("storiesPage");
    return html`
      <div class="Page">
        <h1 class="PageTitle">stories page</h1>
        <button 
          id="bookSaveBtn"
          onclick=${() => {
            function randomName() {
              const preparts = ["awesome", "sick", "cool", "amazing", "complex", "historical", "ultimate"];
              const edings = ["book", "knowledge", "story", "novel", "diary", "world", "realm", "creation"];
              const id1 = Math.floor(Math.random() * preparts.length);
              const id2 = Math.floor(Math.random() * preparts.length);
              return preparts[id1] + preparts[id2];
            }
            let name = prompt("book name?") ?? randomName();
            let color = prompt("book cover color?") ?? "white";
            let control = books.some((book) => book.title === name);
            if(control) {
              alert("sorry, a book with this name already exists!");
              return;
            }
            saveBook(name, color);
          }}
        >save current RP as book</button>
        <div id="booksLister">
          ${[...books].reverse().map((book) => html`
            <div class="book" style="background-color: ${book.color};" onclick=${() => {
                setCurrentRead(book);
              }}>
              <p>${book.title}</p>
            </div>
          `)}
        </div>
        <${readPage} current=${currentRead} onClose=${() => setCurrentRead(null)} />
      </div>
    `;
  }
}
