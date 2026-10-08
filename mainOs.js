let osSave = {
    downloadedOs: null,
    instaOs: null
}

function installOs(os) {
    osSave.downloadedOs = os;
    localStorage.setItem("OS", JSON.stringify(osSave));
}

function loadOs() {
    potential = localStorage.getItem("OS");
    if(potential) {
        osSave = JSON.stringify(potential);
        if(osSave.instaOS) {
            window.location.href = osSave.instaOs.path;
        }
    }
}

function bootOs(osName) {
    if(osSave.downloadedOs && osSave.downloadedOs.name === osName) {
        window.location.href = osSave.downloadedOs.path;
    } else {
        return false;
    }
}

loadOs();