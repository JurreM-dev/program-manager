const editor = document.getElementById("editor");
const lineNumbers = document.getElementById("lineNumbers");

const CURSOR_BOOKMARK = "\u200B";

/*
 * Add new highlighting rules here.
 *
 * Each pattern should be a non-capturing regex pattern.
 * Rules are checked from top to bottom, so put more specific
 * rules before general ones.
 */
const HIGHLIGHT_RULES = [
  {
    className: "string",
    pattern: "\"[^\"\\\\]*\""
  },
  {
    className: "keyword",
    pattern: "\\b(?:sky|experiment|say|learn|addKnowledge)\\b"
  },
  {
    className: "number",
    pattern: "\\b\\d+(?:\\.\\d+)?\\b"
  },
  {
    className: "specialWords",
    pattern: "\\b(?:into|str|num|boolean|bool)\\b"
  }
];

const highlightRegex = new RegExp(
  HIGHLIGHT_RULES
    .map(rule => `(${rule.pattern})`)
    .join("|"),
  "g"
);

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightCode(text) {
  return escapeHtml(text).replace(
    highlightRegex,
    (match, ...groups) => {
      const ruleIndex = groups.findIndex(group => group !== undefined);

      if (ruleIndex === -1) {
        return match;
      }

      const rule = HIGHLIGHT_RULES[ruleIndex];
      return `<span class="${rule.className}">${match}</span>`;
    }
  );
}

function updateLineNumbers(text) {
  let lineCount = text.split("\n").length;

  if (text.endsWith("\n")) {
    lineCount--;
  }

  lineNumbers.innerText = Array.from(
    { length: Math.max(lineCount, 1) },
    (_, index) => index + 1
  ).join("\n");
}

function restoreCursorAtBookmark() {
  const selection = window.getSelection();
  const range = document.createRange();

  const walker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_TEXT
  );

  let textNode;

  while ((textNode = walker.nextNode())) {
    const index = textNode.nodeValue.indexOf(CURSOR_BOOKMARK);

    if (index !== -1) {
      textNode.nodeValue = textNode.nodeValue.replace(
        CURSOR_BOOKMARK,
        ""
      );

      range.setStart(textNode, index);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
  }
}

editor.addEventListener("input", () => {
  const selection = window.getSelection();

  if (!selection.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  const bookmarkNode = document.createTextNode(CURSOR_BOOKMARK);

  range.insertNode(bookmarkNode);

  const text = editor.innerText;

  editor.innerHTML = highlightCode(text);
  updateLineNumbers(text);
  restoreCursorAtBookmark();
});

updateLineNumbers(editor.innerText);
