// preact and htm imports
import { html, render, useContext, useState, useEffect, useRef } from "https://unpkg.com/htm/preact/standalone.module.js";

// custom component & logic imports
import { appContext } from "./contexts.js";
import { GalaxyTitle } from "./components/parts.js";

// page imports
import { Collection } from "./pages/collection.js";

// data imports
import monsterData from './data/monsters.json' with { type: 'json' };

// app constant variables
const monsters = monsterData.monsters;

function App() {
    const [collection, setCollection] = useState([]);

    const currentIndex = useRef(1);

    function chooseRandomMonster(area) {
        let randomIndex = Math.floor(Math.random() * monsters[area].length);
        let chosenMonster = monsters[area][randomIndex];
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
        console.log(HpPLMod);
        monster.hpPL = monster.minLvlHP + HpPLMod;

        monster.maxHp = monster.hpPL * monster.level;
        monster.currentHp = monster.maxHp;

        // building attack stats
        const DmgPLMod = Math.round((Math.random() * 2) * 10) / 10;
        console.log(DmgPLMod);
        monster.dmgPL = monster.minLvlAttack + DmgPLMod;
        monster.dmg = Math.round(monster.dmgPL * monster.level);

        // building exp
        let level = monster.level;
        if(level < 10) {
            monster.neededExp = 100;
        } else if(level < 20) {
            monster.neededExp = 250;
        } else if(level < 30) {
            monster.neededExp = 500;
        } else if(level < 40) {
            monster.neededExp = 675;
        } else if(level < 50) {
            monster.neededExp = 900;
        } else if(level < 60) {
            monster.neededExp = 1300;
        } else if(level < 70) {
            monster.neededExp = 1800;
        } else if(level < 80) {
            monster.neededExp = 2300;
        } else if(level < 90) {
            monster.neededExp = 2800;
        } else if(level < 100) {
            monster.neededExp = 3500;
        }
        monster.currentExp = 0;

        return monster;
    }

    function addMonster(monster) {
        monster.key = currentIndex.current;
        currentIndex.current += 1;
        setCollection(previousCollection => [...previousCollection, monster]);
    }

    useEffect(() => {
        async function startUp() {
        const potential = await localforage.getItem("galaxyMonsterGameCollection");
        if(potential && Array.isArray(potential)) {
            setCollection(potential);
        } else {
            let chosenMonster = chooseRandomMonster("lab");
            let builtMonster = buildMonsterStats(chosenMonster, 5);
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
        addMonster
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
        </${appContext.Provider}>
    `
}

render(html`<${App}/>`, document.body)