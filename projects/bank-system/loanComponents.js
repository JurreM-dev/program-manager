import {
  html,
  useContext
} from "https://unpkg.com/htm/preact/standalone.module.js";

import { appContext } from "./contexts.js";

export function loanStardust({stardust}) {
  const { triggers, setTriggers } = useContext(appContext);

  return html`
    <p>use this to take out loans in stardust</p>
    <p class="longerText">
      <strong>important! </strong>the stardust system is hardcoded not allowing
      us to lend you more than ten times your current balance
    </p>
    <br />
    <p>amount you want to lend:</p>
    <input
      type="number"
      class="inputBar"
      id="loanAmountInput"
      placeholder="the amount you want to lend"
    />
    <br />
    <p>your user token:</p>
    <input
      type="text"
      class="inputBar"
      id="loanTokenInput"
      placeholder="your user token of stardust"
    />
    <br />
    <button
      onclick=${() => {
        const tokenAttempt = document.getElementById("loanTokenInput").value;
        if (!tokenAttempt) {
          alert("you need to put in your user token!");
          return;
        }
        const amountAttempt = document.getElementById("loanAmountInput").value;
        if (!amountAttempt) {
          alert("put in a valid amount to lend first!");
          return;
        }
        const response = stardust.lendMoney(tokenAttempt, amountAttempt);
        if (!response) {
          return;
        }
        setTriggers((oldTriggers) => oldTriggers + 1);
      }}
    >
      confirm
    </button>
  `;
}

export function repayStardust({stardust}) {
  const { triggers, setTriggers, pincode, setPincode } = useContext(appContext);

  return html`
    <p>use this to <strong>repay</strong> stardust loans!</p>
    <br />
    <p>amount you want to repay:</p>
    <input
      type="number"
      class="inputBar"
      id="repayAmountInput"
      placeholder="the amount you want to repay"
    />
    <br />
    <p>your pincode:</p>
    <input
      type="number"
      class="inputBar"
      id="repayPinInput"
      placeholder="your pincode of stardust"
      value=${pincode}
      onBlur=${(e) => setPincode(e.currentTarget.value)}
    />
    <br/>
    <button
      onclick=${() => {
        const pinAttempt = document.getElementById("repayPinInput").value;
        if (!pinAttempt) {
          alert("you need to put in your stardust pincode!");
          return;
        }
        const amountAttempt = document.getElementById("repayAmountInput").value;
        if (!amountAttempt) {
          alert("put in a valid amount to repay first!");
          return;
        }
        const response = stardust.payBackLoan(pinAttempt, amountAttempt);
        if (!response) {
          return;
        }
        setTriggers((oldTriggers) => oldTriggers + 1);
      }}
    >
      confirm
    </button>
  `
}