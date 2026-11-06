import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

const galaxyTitle = `  
  GGGG    AAA   L      AAA   X   X  Y   Y
 G       A   A  L     A   A   X X    Y Y
 G  GG   AAAAA  L     AAAAA    X      Y
 G   G   A   A  L     A   A   X X     Y
  GGGG   A   A  LLLL  A   A  X   X    Y`;

export function GalaxyTitle() {
    return html`
        <pre class="galaxyTitle">${galaxyTitle}</pre>
      `
}