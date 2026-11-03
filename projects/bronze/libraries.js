export const customCompilers = {
  CLI: (body, errorPutter, pageHtml, environment, OScommands) => {
    let errorCount = 0;

    function errorPut(message) {
      errorCount++;
      errorPutter(message);
    }

    const CLIcompilerObject = {
      PRINT: (value) => {
        const parts = value.split(" ");
        if (parts[0].trim() === "VAR") {
          const key = JSON.stringify(parts.slice(1).join(" "));
          CLIstring += `terminal.println(customVars[${key}]);\n`;
          return;
        }
        const safeValue = JSON.stringify(value);
        CLIstring += `terminal.println(${safeValue});\n`;
      },
      IDENTIFIER: (value) => {
        const chosen = value.split(" ")[0];
        identifier = chosen;
      },
      CHANGECOLOR: (value) => {
        const color = JSON.stringify(value.split(" ")[0]);
        CLIstring += `terminal.changeColor(${color});\n`;
      },
      CHANGEBGCOLOR: (value) => {
        const parts = value.split(" ");
        if (parts[0] === "VAR") {
          const key = JSON.stringify(parts.slice(1).join(" "));
          CLIstring += `terminal.changeBackColor(customVars[${key}]);\n`;
          return;
        }
        const color = JSON.stringify(parts[0]);
        CLIstring += `terminal.changeBackColor(${color});\n`;
      },
      DEFINE: (value) => {
        const parts = value.split(" ");
        const name = parts[0];
        const type = parts[1];
        if (!name || type !== "TEXT") {
          errorPut("ERROR, not a valid type for a variable");
          return;
        }
        if (parts[2]?.trim() !== "=") {
          errorPut(
            "ERROR, to define a variable you need to use an equals sign",
          );
          return;
        }
        const valueParts = parts.slice(3);
        const variableValue = valueParts.join(" ");

        if (!variableValue) {
          errorPut("ERROR, a variable needs a value");
          return;
        }

        const variableName = JSON.stringify(name);

        if (valueParts[0] === "ARGS") {
          const argNumber = valueParts[1];

          if (argNumber === "ALL") {
            CLIstring += `customVars[${variableName}] = args;\n`;
            return;
          }

          if (!argNumber || isNaN(argNumber) || Number(argNumber) < 1) {
            errorPut("ERROR, ARGS needs a positive number or ALL after it");
            return;
          }

          const index = Number(argNumber) - 1;
          CLIstring += `customVars[${variableName}] = args.trim().split(/\\s+/)[${index}];\n`;
        } else if (variableValue.startsWith("VAR ")) {
          const sourceName = JSON.stringify(variableValue.slice(4));
          CLIstring += `customVars[${variableName}] = customVars[${sourceName}];\n`;
        } else {
          CLIstring += `customVars[${variableName}] = ${JSON.stringify(variableValue)};\n`;
        }
      },
    };

    let identifier = null;
    let CLIstring = "";
    const lines = body.split("\n");
    if (environment !== "bronzeOS") {
      errorPut(
        "WARNING, please note that this code does not actually run the CLI in this environment",
      );
    }
    lines.forEach((line, index) => {
      line = line.trim();
      let broken = line.split(" ");
      const keyWord = broken[0];
      line = broken.splice(1).join(" ");

      if (
        !CLIcompilerObject[keyWord] ||
        typeof CLIcompilerObject[keyWord] !== "function"
      ) {
        if (keyWord) {
          errorPut(
            "COMPILER ERROR, in library: CLI, keyword: " +
              keyWord +
              " does not exist at line: " +
              (index + 1),
          );
        }
        return;
      }
      CLIcompilerObject[keyWord](line);
    });
    if (errorCount === 0 && environment === "bronzeOS") {
      const requiredParams = ["args", "terminal", "customVars"];
      if (!identifier) {
        errorPutter("COMPILER ERROR, need identifier for CLI compilation");
        return;
      }
      if (!OScommands.addCLI || typeof OScommands.addCLI !== "function") {
        errorPutter("COMPILER ERROR, error in os commands");
        return;
      }
      OScommands.addCLI(identifier, CLIstring, requiredParams);
      errorPutter(
        "succesfully compiled CLI " +
          identifier +
          " and added it to your " +
          environment +
          " commands",
      );
    } else if(environment === "bronzeOS" && errorCount > 0) {
      errorPutter("COMPILER ERROR, there are " + errorCount + " errors in the CLI compilation");
    }
  },
  GUI: (body, errorPutter, pageHtml, environment, OScommands) => {
    let errorCount = 0;

    function errorPut(message) {
      errorCount++;
      errorPutter(message);
    }
    const GUIcompilerObject = {};
    let GUIcalls = [];
    // environment check
    if (environment !== "bronzeOS") {
      errorPut(
        "WARNING, please note that this code does not actually run the GUI in this environment",
      );
    };
      // split parts divided by { and }
      let parts = body.trim().split(/\{|\}/);
      let actualParts = [];

      // get actual parts and check if it's a valid amount of parts
      parts.forEach((part)=>{
        part = part.trim();
        if(!part) {
          return;
        }
        actualParts.push(part);
      });
      if(actualParts.length % 2 > 0) {
        errorPut("COMPILER ERROR, invalid amount of parts for GUI library, each title needs a body")
        return;
      }

      // compiling the parts
      for(let i = 0; i++; i < actualParts.length()) {
        const partId = actualParts[i];
        i++;
        const partBody = actualParts[i];
      }
  }
};
