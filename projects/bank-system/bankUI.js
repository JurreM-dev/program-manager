// preact and htm imports
import { html, render, useContext, useState, useEffect } from "https://unpkg.com/htm/preact/standalone.module.js";

// custom component & logic imports
import { appContext } from "./contexts.js";

// bank systems imports
import { Stardust } from './moneySystems.js';

const stardust = new Stardust();

function titleBox() {
    const {username, setUsername} = useContext(appContext);
    return html`
    <div id="titleBox">
        <h1 class="bigTitle">welcome ${username}!</h1>
        <h2>...to the best banking system of stellarOS!</h2>
        <h2>LEAF BANK</h2>
    </div>
    `
}

function countsBox() {
    const [balance, setBalance] = useState(0);
    const [owed, setOwed] = useState(0);

    const [pincode, setPincode] = useState(null);

    const { triggers, setTriggers } = useContext(appContext);

    useEffect(() => {
        if(!pincode) {
            return;
        }
        let response = stardust.readMoney(pincode);
        if(!response) {
            return;
        }
        setOwed(response.owed);
        setBalance(response.balance);
    }, [pincode, triggers])

    return html`
    <div class="mainBox">
        <h1><strong>✨ stardust</strong></h1>
        <p>put in your pincode below, only saved locally, only used to read out your balance =)</p>
        <input
            id="pinInput"
            class="inputBar"
            type="text"
            onBlur=${(e) => setPincode(e.currentTarget.value)}
        />
        <hr/>
        <p>✨ balance: ${balance}</p>
        <hr/>
        <p>✨ owed: ${owed}</p>
    </div>
    `
}

function loansBox() {
    const { triggers, setTriggers } = useContext(appContext);
    return html`
    <div class="mainBox">
        <h1><strong>loans</strong></h1>
        <h2>✨ stardust</h2>
        <hr/>
        <p>use this to take out loans in stardust</p>
        <p class="longerText"><strong>important! </strong>the stardust system is hardcoded not allowing us to lend you more than ten times your current balance</p>
        <br/>
        <p>amount you want to lend:</p>
        <input 
            type="number" 
            class="inputBar"
            id="loanAmountInput"
            placeholder="the amount you want to lend"
        />
        <br/>
        <input
            type="text"
            class="inputBar"
            id="loanTokenInput"
            placeholder="your user token of stardust"
        />
        <br/>
        <button
            onclick=${() => {
                const tokenAttempt = document.getElementById("loanTokenInput").value;
                if(!tokenAttempt) {
                    alert("you need to put in your user token!");
                    return;
                }
                const amountAttempt = document.getElementById("loanAmountInput").value;
                if(!amountAttempt) {
                    alert("put in a valid amount to lend first!");
                    return;
                }
                const response = stardust.lendMoney(tokenAttempt, amountAttempt);
                if(!response) {
                    return;
                }
                setTriggers(oldTriggers => oldTriggers + 1);
            }}>
            confirm
            </button>
        <hr/>
    </div>
    `
}

function App() {
    const [username, setUsername] = useState("user");
    const [triggers, setTriggers] = useState(0);

    const state = {
        username,
        setUsername,
        triggers,
        setTriggers
    };

    return html`
        <${appContext.Provider} value=${state}>
            <${titleBox} />
            <${countsBox} />
            <${loansBox} />
        </${appContext.Provider}>   
    `
}

render(html`<${App}/>`, document.body)