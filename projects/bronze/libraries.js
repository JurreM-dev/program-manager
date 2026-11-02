export const customCompilers = {

    
    CLI: (body, errorPutter, pageHtml, environment, OScommands) => {
        let errorCount = 0;

        function errorPut(message) {
            errorCount++;
            errorPutter(message);
        }

        const CLIcompilerObject = {
            PRINT: (value) => {
                const safeValue = JSON.stringify(value).replace(/^"|"$/g, '');
                CLIstring += `terminal.println("${safeValue}");\n`;
            },
            IDENTIFIER: (value) => {
                const chosen = value.split(" ")[0];
                identifier = chosen;
            },
            CHANGECOLOR: (value) => {
                const color = value.split(" ")[0];
                CLIstring += `document.getElementById("terminal").style.color = "${color}";\n`;
            },
            CHANGEBGCOLOR: (value) => {
                const color = value.split(" ")[0];
                CLIstring += `document.getElementById("terminal").style.background-color = "${color}";\n`;
            }
        }
        
        let identifier = null;
        let CLIstring = "";
        const lines = body.split("\n");
        if(environment !== "bronzeOS") {
                errorPut("WARNING, please note that this code does not actually run the CLI in this environment")
        }
        lines.forEach((line, index) => {
            line = line.trim();
            let broken = line.split(" ");
            const keyWord = broken[0];
            line = broken.splice(1).join(" ");

            if(!CLIcompilerObject[keyWord] || typeof CLIcompilerObject[keyWord] !== "function") {
                if(keyWord) {
                    errorPut("COMPILER ERROR, in library: CLI, keyword: " + keyWord + " does not exist at line: " + (index + 1));
                }
                return;
            }
            CLIcompilerObject[keyWord](line);
        });
        if(errorCount === 0 && environment === "bronzeOS") {
            const requiredParams = ["args", "terminal"];
            if(!identifier) {
                errorPutter("COMPILER ERROR, need identifier for CLI compilation");
                return;
            }
            if(!OScommands.addCLI || typeof OScommands.addCLI !== "function") {
                errorPutter("COMPILER ERROR, error in os commands");
                return;
            }
            OScommands.addCLI(identifier, CLIstring, requiredParams);
            errorPutter("succesfully compiled CLI " + identifier + " and added it to your " + environment + " commands");
        }
    }
}