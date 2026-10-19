export class Stardust {
    #pincode
    #userToken
    #stardustData

    constructor() {
        let rawStorage = localStorage.getItem("starDustStorage");
        let stardustDataPotential = rawStorage ? JSON.parse(atob(rawStorage)) : null;
        if(stardustDataPotential) {
            this.#stardustData = stardustDataPotential
            this.#pincode = this.#stardustData.permissionCode
            this.#userToken = this.#stardustData.userToken
        } else {
            this.#stardustData = {
                balance: 0,
                owed: 0,
                permissionCode: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
                userToken: crypto.randomUUID()
            }
            this.#pincode = this.#stardustData.permissionCode;
            this.#userToken = this.#stardustData.userToken;
            alert("hey! this is your first time using stardust correct? Here is your code: " + this.#pincode + " make sure you remember it at all times!");
            alert("oh and this is your user token, it is used for writing money into your account: " + this.#userToken);
            alert("note: this is all local, no real banks and stuff, but if I were you I wouldn't lose access to all of your stardust!");
        }
        this.#saveStardust();
    }

    writeMoney(triedToken, stardust) {
        if(stardust < 0) {
            alert("ERROR, cannot write negative stardust");
            return false;
        }
        if(triedToken === this.#userToken) {
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
        if(cost < 0) {
            alert("ERROR, you can't take negative stardust");
            return false;
        }
        if(triedPincode !== this.#pincode || !triedPincode) {
            alert("pincode is not right, transaction failed");
            return false;
        }
        if(this.#stardustData.balance < cost) {
            alert("insufficient funds, transaction failed");
            return false;
        }
        this.#stardustData.balance -= cost;
        this.#saveStardust();
    }

    readMoney(triedPincode) {
        if(triedPincode !== this.#pincode || !triedPincode) {
            alert("pincode is not right, action failed");
            return false;
        }
        return {
            balance: this.#stardustData.balance,
            owed: this.#stardustData.owed
        }
    }

    #saveStardust() {
        let stringedData = JSON.stringify(this.#stardustData);
        let asciiData = btoa(stringedData);
        localStorage.setItem("starDustStorage", asciiData);
    }
}