// preact and htm imports
import { html, render, useContext, useState, useEffect, useRef } from "https://unpkg.com/htm/preact/standalone.module.js";

// custom component & logic imports
import { appContext } from "./contexts.js";
import { GalaxyTitle } from "./components/parts.js";

// page imports
import { Collection } from "./pages/collection.js";
import { Areas } from "./pages/areas.js";
import { Battle } from "./pages/battle.js";

// data imports
import monsterData from './data/monsters.json' with { type: 'json' };
import rarities from './data/rarities.json' with { type: 'json' }; 

// app constant variables
const monsters = monsterData.monsters;

function App() {
    const [collection, setCollection] = useState([]);

    const [player, setPlayer] = useState({
        name: "Player",
        heighestLevel: 1,
        world: "normal",
        currentArea: "forest",
        currentMonster: null,
        maxStorage: 10,
        currentStorage: 0,
        RAM: 1
    });

    const currentIndex = useRef(1);

    function calcStorage() {
        let totalStorage = 0;
        collection.forEach(monster => {
            totalStorage += monster.size;
        });
        setPlayer(previous => ({...previous, currentStorage: totalStorage}));
    }
    function travelToArea(area) {
        if(player.heighestLevel < area.minLevel) {
            alert("you are still too weak to travel to this area!");
            return; 
        }
        setPlayer(previous => ({previous, currentArea: area.name}));
    }
    function chooseRandomMonster(area) {
        let randomIndex = Math.floor(Math.random() * monsters[area].length);
        let chosenMonster = monsters[area]?.[randomIndex];
        return chosenMonster;
    }
    function buildMonsterStats(monster, levelRand = 0) {
        // building level stats
        let levelAdd = 0;
        if(levelRand && levelRand > 0) {
            levelAdd = Math.floor(Math.random() * (levelRand + 1));
        }
        monster.level = monster.startLevel + levelAdd;

        // building HP stats
        const HpPLMod = Math.round((Math.random() * 5))
        monster.hpPL = monster.minLvlHP + HpPLMod;

        monster.maxHp = monster.hpPL * monster.level;
        monster.currentHp = monster.maxHp;

        // building attack stats
        const DmgPLMod = Math.round((Math.random() * 2) * 10) / 10;
        monster.dmgPL = monster.minLvlAttack + DmgPLMod;
        monster.dmg = Math.round(monster.dmgPL * monster.level);

        // building exp
        let level = monster.level;
        monster.neededExp = 100 + (100 * monster.level)
        monster.currentExp = 0;

        return monster;
    }
    function addMonster(monster) {
        monster.key = currentIndex.current;
        currentIndex.current += 1;
        setCollection(previousCollection => [...previousCollection, monster]);
        calcStorage();
        if(monster.level > player.heighestLevel) {
            setPlayer(previous => ({...previous, heighestLevel: monster.level}));
        }
    }
    function catchMonster(monster) {
        let chance = Math.random();
        let rarity = rarities[monster.rarity];
        let catchChance = rarity.chance;
        const usedChance = chance / player.RAM;

        if(usedChance > catchChance) {
            console.log(`usedChance: ${usedChance}, catchChance: ${catchChance}`)
            alert("failed to catch the monster!");
            return false;
        }
        if(monster.size > player.maxStorage - player.currentStorage) {
            alert("could not catch monster, not enough storage");
            return false;
        }
        addMonster(monster);
        alert("successfully caught the monster!");
        return true;
    }
    function chooseMonster(monster) {
        setPlayer(previous => ({...previous, currentMonster: monster}));
    }
    function healCurrentMonster() {
        let monster = player.currentMonster;
        monster.currentHp = monster.maxHp;
        setPlayer(previous => ({...previous, currentMonster: monster}));
    }

    useEffect(() => {
        async function startUp() {
        const potential = await localforage.getItem("galaxyMonsterGameCollection");
        if(potential && Array.isArray(potential)) {
            setCollection(potential);
        } else {
            let chosenMonster = chooseRandomMonster("lab");
            let builtMonster = buildMonsterStats(chosenMonster);
            addMonster(builtMonster);
        }
    }
    startUp();
    }, []);

    const appStates = {
        collection,
        setCollection,
        chooseRandomMonster,
        buildMonsterStats,
        addMonster,
        travelToArea,
        catchMonster,
        player,
        chooseMonster,
        healCurrentMonster
    };

    return html`
        <${appContext.Provider} value=${appStates}>
            <h1 class="specialTitle">monster game</h1>
            <${GalaxyTitle} />
            <br/>
            <br/>
            <div class="nestedPage">
                <${Collection} />
            </div>
            <div class="nestedPage">
                <${Areas} />
            </div> 
            <div class="nestedPage">
                <${Battle} />
            </div> 
        </${appContext.Provider}>
    `
}

render(html`<${App}/>`, document.body)