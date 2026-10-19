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
    </div>
    `
}

function countsBox() {
    const [balance, setBalance] = useState(0);
    const [owed, setOwed] = useState(0);

    const [pincode, setPincode] = useState(null);

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
    }, [pincode])

    return html`
    <div class="mainBox">
        <p>put in your pincode below, only saved locally, only used to read out your balance =)</p>
        <input
            id="pinInput"
            class="inputBar"
            type="text"
            onBlur=${(e) => setPincode(e.currentTarget.value)}
        />
        <hr/>
        <p>balance: ${balance}</p>
        <hr/>
        <p>owed: ${owed}</p>
    </div>
    `
}

function App() {
    const [username, setUsername] = useState("user");

    const state = {
        username,
        setUsername
    };

    return html`
        <${appContext.Provider} value=${state}>
            <${titleBox} />
            <${countsBox} />
        </${appContext.Provider}>   
    `
}

render(html`<${App}/>`, document.body)