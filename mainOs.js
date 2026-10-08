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
        osSave = JSON.parse(potential);
        if(osSave.instaOs) {
            const choice = confirm("do you want to open your standardized OS?");
            if(choice) {
                window.location.href = osSave.instaOs.path;
            }
        }
    }
}

function bootOs(osName) {
    if(osSave.downloadedOs && osSave.downloadedOs.name === osName) {
        window.location.href = osSave.downloadedOs.path;
        return true;
    } else {
        return false;
    }
}

function standardizeOs(osName) {
    if(osSave.downloadedOs && osSave.downloadedOs.name === osName) {
        osSave.instaOs = osSave.downloadedOs;
        localStorage.setItem("OS", JSON.stringify(osSave));
        return true;
    } else {
        return false;
    }
}

loadOs();