export class Stardust {
  #pincode;
  #userToken;
  #stardustData;

  constructor() {
    let rawStorage = localStorage.getItem("starDustStorage");
    let stardustDataPotential = rawStorage
      ? JSON.parse(atob(rawStorage))
      : null;
    if (stardustDataPotential) {
      this.#stardustData = stardustDataPotential;

      this.#stardustData.balance = Number(this.#stardustData.balance);
      this.#stardustData.owed = Number(this.#stardustData.owed);

      this.#pincode = this.#stardustData.permissionCode;
      this.#userToken = this.#stardustData.userToken;
    } else {
      this.#stardustData = {
        balance: 0,
        owed: 0,
        permissionCode: String(Math.floor(Math.random() * 10000)).padStart(
          4,
          "0",
        ),
        userToken: crypto.randomUUID(),
      };
      this.#pincode = this.#stardustData.permissionCode;
      this.#userToken = this.#stardustData.userToken;
      alert(
        "hey! this is your first time using stardust correct? Here is your code: " +
          this.#pincode +
          " make sure you remember it at all times!",
      );
      alert(
        "oh and this is your user token, it is used for writing money into your account: " +
          this.#userToken,
      );
      alert(
        "note: this is all local, no real banks and stuff, but if I were you I wouldn't lose access to all of your stardust!",
      );
    }
    this.#saveStardust();
  }

  writeMoney(triedToken, stardust) {
    if (stardust < 0) {
      alert("ERROR, cannot write negative stardust");
      return false;
    }
    if (triedToken === this.#userToken) {
      this.#stardustData.balance += stardust;
      console.log("succesfully write " + stardust + " into your account!");
      this.#saveStardust();
      return true;
    } else {
      alert("ERROR, the attempted token is wrong or your token is corrupted");
      return false;
    }
  }

  takeMoney(triedPincode, cost) {
    if (cost < 0) {
      alert("ERROR, you can't take negative stardust");
      return false;
    }
    if (triedPincode !== this.#pincode || !triedPincode) {
      alert("pincode is not right, transaction failed");
      return false;
    }
    if (this.#stardustData.balance < cost) {
      alert("insufficient funds, transaction failed");
      return false;
    }
    this.#stardustData.balance -= cost;
    this.#saveStardust();
    return true;
  }

  readMoney(triedPincode) {
    if (triedPincode !== this.#pincode || !triedPincode) {
      alert("pincode is not right, action failed");
      return false;
    }
    return {
      balance: this.#stardustData.balance,
      owed: this.#stardustData.owed,
    };
  }

  lendMoney(triedUserToken, amount) {
    amount = Number(amount);
    if (triedUserToken !== this.#userToken) {
      alert("ERROR, wrong user token");
      return false;
    }
    if (amount > (this.#stardustData.balance + 1) * 10) {
      alert(
        "ERROR, the stardust system doesn't allow loans of that size for you right now",
      );
      return false;
    }
    if (amount < 1) {
      alert("ERROR, cannot lend less than 1 stardust");
      return false;
    }
    if (this.#stardustData.owed > 0) {
      alert("ERROR, not allowed to have more than one loan at a time");
      return false;
    }
    this.#stardustData.balance += amount;
    this.#stardustData.owed += amount;
    this.#saveStardust();
    return true;
  }

  payBackLoan(triedPincode, money) {
    if (!triedPincode || triedPincode !== this.#pincode) {
      alert("ERROR, transaction failed, wrong pincode");
      return false;
    }
    if (money > this.#stardustData.balance) {
      alert("ERROR, cannot pay back more than you have");
      return false;
    }
    if (money > this.#stardustData.owed) {
      alert("ERROR, cannot pay back than you owe");
      return false;
    }
    if (money < 1) {
      alert("ERROR, need to at least pay 1 stardust back");
      return false;
    }
    this.#stardustData.balance -= money;
    this.#stardustData.owed -= money;
    this.#saveStardust();
    return true;
  }

  #saveStardust() {
    let stringedData = JSON.stringify(this.#stardustData);
    let asciiData = btoa(stringedData);
    localStorage.setItem("starDustStorage", asciiData);
  }
}
