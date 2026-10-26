import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.4.16/+esm";

export class Bronze {
    #errorPut;
    #htmlBody;

    constructor(errorOut = console.log) {
        this.name = "Bronze";
        this.#errorPut = errorOut;
    }

    // READING OUT
    readHtml() {
        return(this.#htmlBody);
    }

    // COMPILER
    compileBronze(code) {
        if(typeof code !== "string") {
            this.#errorPut("COMPILER ERROR, type of inserted code is not string");
        }
        this.#htmlBody = "";
        const segments = code.split("<--->");
        segments.forEach((segment) => {
            const identifier = segment.trim().split("(")[0].trim();
            switch(identifier) {
                case "BODY":
                    const body = segment.split("(").splice(1).join("(").split(")").splice(0, 1).join(")");
                    this.#bodyCompiler(body);
                break
                default: 
                    this.#errorPut("COMPILER ERROR, segment " + identifier + " is unvalid");
                break
            }
        })
    }

    // ============================================================
    // COMPILER BODY
    // ============================================================

    // body compiler function

    #bodyCompiler(body) {
        const lines = body.split("\n");
        lines.forEach((line, index)=>{
            line = line.trim();
            let broken = line.split(" ");
            const keyWord = broken[0];
            line = broken.splice(1).join(" ");

            broken = line.trim().split(/<<|>>/);
            const value = broken[0];
            const attributes = broken[1];

            if(!this.#bodyCompilerObject[keyWord] || typeof this.#bodyCompilerObject[keyWord] !== "function") {
                this.#errorPut("COMPILER ERROR, the keyword " + keyWord + " does not exist on line " + (index + 1));
                return;
            } 

            const attributeHTML = this.#atributesCompiler(attributes);

            this.#bodyCompilerObject[keyWord](value, attributeHTML);

        })
    }

    // attributes compiler

    #atributesCompiler(attributeString) {
        const attributes = attributeString.split(",");

        let attributeHTML = "";

        let stylingHTML = "";

        attributes.forEach((attribute)=>{
            attribute = attribute.trim();
            let broken = attribute.split(" ");
            const keyWord = broken[0];
            const rest = broken.splice(1).join(" ")

            if(!this.#attributeCompilerObject[keyWord] || typeof this.#attributeCompilerObject[keyWord] !== "function") {
                this.#errorPut("COMPILER ERROR, attribute " + keyWord + " does not exist");
                return;
            };

            const response = this.#attributeCompilerObject[keyWord](rest);
            if(response.specificType && response.specificType === "styling") {
                stylingHTML += response.body;
            } else {
                attributeHTML += response.body;
            }
        }); 
        let styleAttribute = ""
        if(stylingHTML) {
            styleAttribute = `style="${stylingHTML}"`;
        }
        return `${attributeHTML} ${styleAttribute}`;
    }

    // compiler objects
    #attributeCompilerObject = {
        ID: (value) => {
            const splitValue = value.split(" ");
            const chosenValue = splitValue[0];

            const cleanID = DOMPurify.sanitize(chosenValue);

            return {body: ` id="${cleanID}"`};
        },
        CLASS: (value) => {
            const cleanClass = DOMPurify.sanitize(value);

            return {body: ` class="${cleanClass}"`}
        },
        COLOR: (value) => {
            const splitValue = value.split(" ");
            const chosenValue = splitValue[0];

            const cleanColor = DOMPurify.sanitize(chosenValue);

            return {body: ` color: ${cleanColor};`, specificType: "styling"};
        }
    }

    #bodyCompilerObject = {
        TEXT: (value, parsedAttributes = "") => {
            const unFiltered = value;
            const filtered = DOMPurify.sanitize(unFiltered);
            this.#htmlBody += `<p ${parsedAttributes}>${filtered.trim()}</p>\n`;
        }
    }
}