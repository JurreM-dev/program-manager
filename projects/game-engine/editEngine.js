function renderEntities(entities) {
    const output = document.getElementById("items");

    output.replaceChildren();

    entities.forEach((entity) => {
        output.innerHTML += `
            <div class="entityBox">
                <h1>${DOMPurify.sanitize(entity.name)}
            </div>
        `
    })
}

function renderAllEntities() {
    const output = document.getElementById("items");

    output.replaceChildren();

    Object.keys(entities).forEach((typing) => {
        entities[typing].forEach((entity) => {
            output.innerHTML += `
                <div class="entityBox">
                    <h1>${DOMPurify.sanitize(entity.name)}
                </div>
            `
        })
    })
}

function addEntity(entityType, entitySample) {
    entities[entityType].push(entitySample);

    renderAllEntities();
    restartScene();
}

function addCube() {
    let x = Number(prompt("x")) ?? 120;
    let y = Number(prompt("y")) ?? 70;
    let width = Number(prompt("width")) ?? 40;
    let height = Number(prompt("height")) ?? 40;
    let color = prompt("color in the format 0x...");
    let name = prompt("name");

    let sample = {x: x, y: y, width: width, height: height, color: color, name: name}
    addEntity("cubes", sample)
}

function addCircle() {
    let x = Number(prompt("x")) ?? 120;
    let y = Number(prompt("y")) ?? 70;
    let radius = Number(prompt("radius")) ?? 30;
    let color = prompt("color in the format 0x...");
    let name = prompt("name");

    addEntity("circles", {x: x, y: y, radius: radius, color: color, name: name})
    renderAllEntities();
}