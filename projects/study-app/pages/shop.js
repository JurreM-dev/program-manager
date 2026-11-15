import {
  html,
  useState,
  useContext,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// stardust import
import { Stardust } from "../../bank-system/moneySystems.js";

// context
import { appContext } from "./../contexts.js";

export function ShopPage() {
    const {currentPage, setCurrentPage, goldCoins, setGoldCoins} = useContext(appContext);

    if(currentPage === "shop") {
        return html`
            <div class="Page alignCenter verticalFlex">
                <h2>Shop</h2>
                <p id="coinCount">gold coins: ${goldCoins} 🪙</p>
                <div class="shopItem alignCenter verticalFlex">
                    <h2>1 stardust</h2>
                    <p>one stardust for the stellarOS stardust money system!</p>
                    <button
                        onclick=${() => {
                            if(goldCoins < 50) {
                                alert("not enough coins!");
                                return;
                            }
                            setGoldCoins((prev) => prev - 50);
                            alert("we will handle stardust now (if you have no stardust account it will be made and you will get your bank info")
                            let stardust = new Stardust();
                            let token = prompt("what is you stardust bank token?");
                            stardust.writeMoney(token, 1);
                        }}
                    >buy (50 gold coins)</button>
                </div>
            </div>
        `
    }
} 