import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "./../contexts.js";

export function ShopPage() {
    const {currentPage, setCurrentPage} = useContext(appContext);

    if(currentPage === "shop") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>Shop</h2>
            </div>
        `
    }
} 