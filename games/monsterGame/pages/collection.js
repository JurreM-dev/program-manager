import { html, render, useContext, useState, useEffect } from "https://unpkg.com/htm/preact/standalone.module.js";
import { appContext } from "../contexts.js";

export function Collection() {
    const { collection } = useContext(appContext)

    return html`
    <div class="collectionScreen">
        <h1>Collection</h1>
        ${collection.map((monster)=>{
            return html`
                <p>${monster.name}</p>
            `
        })}
    </div>
    `
}