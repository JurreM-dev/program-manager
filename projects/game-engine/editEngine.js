function renderEntities(entities) {
    const output = document.getElementById("entityTab");

    output.replaceChildren();

    entities.forEach((entity) => {
        output.innerHTML += `
            <div class="entityBox">
                <h1>${DOMPurify.sanitize(entity.name)}
            </div>
        `
    })
}

function addEntity(entityType, entitySample) {
    entities[entityType].push(entitySample);

    renderEntities(entities[entityType]);
    restartScene();
}
let sample = {x: 120, y: 70, width: 40, height: 40, color: 0x0317fc, name: "Jeff"}
addEntity("cubes", sample)