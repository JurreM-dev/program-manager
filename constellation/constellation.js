let constellationConfig = {
    user: "defaultUser",
    email: "defaultUser@example.com"
}

function initializeConstellation(directory) {
    let test = directory.files.find(f => f.name === ".constellation");
    if(test) {
        Logs("Constellation is already initialized in this directory.");
        return;
    }

    directory.files.push({
        type: "directory",
        name: ".constellation",
        directory: currentPath + ".constellation" + "/",
        files: []
    })

    let currentConstellation = directory.files.find(f => f.name === ".constellation");

    currentConstellation.files.push({
        type: "directory",
        name: "central",
        directory: currentPath + ".constellation" + "/central/",
        files: []
    });

    currentConstellation.files.push({
        type: "directory",
        name: "history",
        directory: currentPath + ".constellation" + "/history/",
        files: []
    });
}

async function constellationCommit(message, directory) {
    let currentConstellation = directory.files.find(f => f.name === ".constellation");
    let fullDirectory = directory.files;

    if (!currentConstellation) {
        Logs("Error: .constellation directory not found. Please initialize constellation first.");
        return;
    }

    let historyDir = currentConstellation.files.find(f => f.name === "history");
    
    if (!historyDir) {
        Logs("Error: history directory not found in .constellation.");
        return;
    }

    let centralFiles = currentConstellation.files.find(f => f.name === "central")

    if (!centralFiles) {
        Logs("Error: central directory not found in .constellation.");
        return;
    }

    let ignoredFiles = directory.files.find(f => (f.name === ".constellationignore" || f.name === ".gitignore") && f.type === "file");
    let ignoredFileNames = [];
    if (ignoredFiles) {
        ignoredFileNames = ignoredFiles.content.split("\n");
    }
    ignoredFileNames.push(".constellation");

    let lastVersion = historyDir.files[historyDir.files.length - 1];

    let currentVersion = [];

    if(!lastVersion) {
        for(const filer of fullDirectory) {
            let file = structuredClone(filer);
            if(ignoredFileNames.includes(file.name)) {
                continue;
            } else {
                file.constellationId = centralFiles.files.length;
                centralFiles.files.push(file)
                let fileHash = null
                if(file.type === "file") {
                    fileHash = await generateHash(file.content);
                }
                currentVersion.push({
                    file: `centralFiles.files.find(f => f.constellationId === ${file.constellationId})`,
                    hash: fileHash,
                    name: file.name
                })
            }
        }
    }

}

async function generateHash(tekst) {
  const encoder = new TextEncoder();
  const data = encoder.encode(tekst);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
