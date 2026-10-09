let autumnUser = {
    name: "guest user",
    pfp: null
}

function saveUser() {
    localforage.setItem("autumnUser", autumnUser);
}

async function loadBackUser() {
    potential= await localforage.getItem("autumnUser");
    if(potential) {
        autumnUser = potential;
    }
}