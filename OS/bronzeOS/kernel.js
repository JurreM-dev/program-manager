class BronzeKernel {
  userName = "user";
  #userRole = "user";

  #appsData;
  #terminal;
  #GUI;

  #OSfunctions;

  particleVars = {
    ready: false,
    assembler: null,
  };

  stellaVMVars = {
    ready: false,
    VM: null
  }

  constructor(terminal, GUI) {
    this.#GUI = GUI;
    this.#terminal = terminal;
    this.#loadUserData();

    this.#OSfunctions = {
      println: this.#terminal.println.bind(this.#terminal),
      addCLI: this.#addCLI.bind(this),
      addGUI: this.#addGUI.bind(this),
    };

    this.#loadCLIs();
  }

  async fetchApps() {
    const data = await (await fetch("./../../programs.json")).json();
    if (data) {
      this.#appsData = data;
    }
  }

  exec(command, args, terminal, GUI) {
    command = command.trim();
    if (!command || (!this.#commands[command] && !this.#CLIcommands[command])) {
      terminal.println(command);
      terminal.println("ERROR, invalid command");
      return;
    }
    if (
      this.#commands[command] &&
      typeof this.#commands[command] === "function"
    ) {
      this.#commands[command](args, terminal, GUI);
    } else if (
      this.#CLIcommands[command] &&
      typeof this.#CLIcommands[command] === "function"
    ) {
      this.#CLIcommands[command](
        args,
        this.exec.bind(this),
        this.#customVars,
        terminal,
        GUI,
      );
    }
  }

  // saving and loading
  #saveUserData() {
    const userData = {
      userName: this.userName,
      userRole: this.#userRole,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  #loadUserData() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      this.userName = userData.userName || "user";
      this.#userRole = userData.userRole || "user";
    }
  }

  // command parsing and execution
  #commands = {
    // file commands
    mkdir: (args, terminal) => {
      if (args.length === 0) {
        terminal.println("Error: No directory name provided.");
        return;
      }
      const dirName = args.split(" ")[0];
      mkdir(dirName, terminal.println);
    },
    ls: (args, terminal) => {
      ls(args, terminal.println);
    },
    rm: (args, terminal) => {
      if (args.length === 0) {
        terminal.println("Error: No file or directory name provided.");
        return;
      }
      const targetName = args.split(" ")[0];
      rm(targetName, terminal.println);
    },
    cd: (args, terminal) => {
      if (args.length === 0) {
        terminal.println("Error: No file or directory name provided.");
        return;
      }
      const targetName = args.split(" ")[0];
      cd(targetName, terminal.println);
    },
    touch: (args, terminal) => {
      if (args.length === 0) {
        terminal.println("Error: give a valid file name.");
        return;
      }
      const name = args.split(" ")[0];
      touch(name, terminal.println);
    },
    // user commands
    user: (args, terminal) => {
      const words = args.split(" ");
      const Keyword = words[0];
      if (
        !this.#innerCommands.user[Keyword] ||
        typeof this.#innerCommands.user[Keyword] !== "function"
      ) {
        terminal.println("ERROR, invalid user command");
        return;
      }
      const rest = words.splice(1).join(" ").trim();
      this.#innerCommands.user[Keyword](rest, terminal);
      this.#saveUserData();
    },
    // app commands
    app: (args, terminal, GUI) => {
      const words = args.split(" ");
      const Keyword = words[0];
      if (
        !this.#innerCommands.app[Keyword] ||
        typeof this.#innerCommands.app[Keyword] !== "function"
      ) {
        terminal.println("ERROR, invalid app command");
        return;
      }
      const rest = words.splice(1).join(" ").trim();
      this.fetchApps().then(() => {
        this.#innerCommands.app[Keyword](rest, terminal, GUI);
        terminal.newLine();
      });
    },
    // terminal commands
    clear: (args, terminal) => {
      terminal.clear();
    },
    // CLI commands
    compileBrz: (args, terminal) => {
      const bronze = new Bronze(
        terminal.println,
        "bronzeOS",
        this.#OSfunctions,
      );
      const words = args.split(" ");
      const fileName = words[0];
      const fileContent = readFile(
        fileName,
        this.#terminal.println.bind(this.#terminal),
      );
      if (!fileContent) {
        terminal.println("ERROR, file does not exist");
        return;
      }
      bronze.compileBronze(fileContent);
    },
    registerCLI: (args, terminal) => {
      const words = args.split(" ");
      const fileName = words[0];
      const fileContent = readFile(
        fileName,
        this.#terminal.println.bind(this.#terminal),
      );
      if (!fileContent) {
        terminal.println("ERROR, file does not exist");
        return;
      }
      console.log("registering CLI: " + fileName.replace(/\.brz$/, ""));
      console.log("file content: " + fileContent);
      this.#registerCLI(fileName.replace(/\.brz$/, ""), fileContent);
    },
    "particle-load": (args, terminal) => {
      const kernel = this;
      const particleModuleConfig = {
        onRuntimeInitialized: function () {
          kernel.particleVars.ready = true;
          kernel.particleVars.assembler = new ParticleAccelerator(
            this,
            terminal.println,
          );
        },
      };
      createParticleModule(particleModuleConfig);
    },
    "particle-accelerate": (args, terminal) => {
      if (this.particleVars.ready) {
        const words = args.split(" ");
        const fileName = words[0];
        const fileContent = readFile(
          fileName,
          this.#terminal.println.bind(this.#terminal),
        );
        if (!fileContent) {
          terminal.println("ERROR, file does not exist");
          return;
        }

        const binary = this.particleVars.assembler.assemble(fileContent);

        if(binary.success === false) {
          terminal.println("ERROR, error in particle assembling");
          return;
        }

        writeBinary(fileName.split(".")[0] + ".energy", binary.result, this.#terminal.println.bind(this.#terminal));
        terminal.println("succesfully accelerated particle into energy!");

        return;
      }
      terminal.println("particle accelerator not loaded");
    },
    "stellaVM-start": (args, terminal) => {
      const kernel = this;
      const stellaVMModuleConfig = {
        onRuntimeInitialized: function () {
          kernel.stellaVMVars.ready = true;
          kernel.stellaVMVars.VM = new StellaVM(
            this,
            terminal.println
          );
        }
      }
      createStellaModule(stellaVMModuleConfig);
    },
    "stellaVM-run": (args, terminal) => {
      if(!this.stellaVMVars.ready) {
        terminal.println("stellaVM is not running yet, start it first");
        return;
      }
      const words = args.split(" ");
        const fileName = words[0];
        const fileContent = readBin(
          fileName,
          this.#terminal.println.bind(this.#terminal),
        );
        if (!fileContent) {
          terminal.println("ERROR, file does not exist");
          return;
        }
        this.stellaVMVars.VM.run(fileContent);
    }
  };

  #innerCommands = {
    user: {
      setname: (args, terminal) => {
        const name = args;
        this.userName = name;
        terminal.refreshTypingIndicator();
      },
    },
    app: {
      list: (args, terminal) => {
        const usedObj = this.#appsData.programs;
        Object.keys(usedObj).forEach((key) => {
          if (
            usedObj[key].version.startsWith("x") ||
            usedObj[key].version === "v0.0.0"
          ) {
            return;
          }
          terminal.println(usedObj[key].name);
        });
      },
      install: (args, terminal) => {
        const appName = args.split(" ")[0];
        if (!this.#appsData.programs[appName]) {
          terminal.println("ERROR, app does not exist");
          return;
        }
        if (root.programs.some((program) => program.name === appName)) {
          terminal.println("app already downloaded, updating if needed...");
          let index = root.programs.findIndex((app) => app.name === appName);
          root.programs[index] = this.#appsData.programs[appName];
        } else {
          root.programs.push(this.#appsData.programs[appName]);
        }
        terminal.println("succesfully installed app");
        saveRoot();
      },
      open: (args, terminal, GUI) => {
        const appName = args.split(" ")[0];
        if (!root.programs.some((program) => program.name === appName)) {
          terminal.println("app cannot be opened, not installed");
          return;
        }
        let objectIndex = root.programs.findIndex(
          (app) => app.name === appName,
        );
        if (objectIndex === -1) {
          terminal.println("app cannot be opened, not found");
          return;
        }
        let object = root.programs[objectIndex];
        GUI.showWindow("./../../" + object.path);
      },
      close: (args, terminal, GUI) => {
        GUI.closeWindow();
      },
    },
  };

  // ===============================================
  // CLI system
  // ===============================================

  #addCLI(identifier, body, params) {
    this.#CLIcommands[identifier] = new Function(...params, body);
  }

  #savedCLIs = {};

  #registerCLI(identifier, body) {
    localforage.getItem("bronzeOS_CLI_register").then((potential) => {
      if (potential) {
        console.log("has potential");
        this.#savedCLIs = potential;
        console.log(this.#savedCLIs);
      }
      console.log("reached");

      this.#savedCLIs[identifier] = {
        body: body,
        name: identifier,
      };

      console.log(this.#savedCLIs);

      localforage.setItem("bronzeOS_CLI_register", this.#savedCLIs);
    });
  }

  #loadCLIs() {
    const bronze = new Bronze(
      this.#terminal.println,
      "bronzeOS",
      this.#OSfunctions,
    );
    localforage.getItem("bronzeOS_CLI_register").then((potential) => {
      if (potential) {
        this.#savedCLIs = potential;
      }

      Object.keys(this.#savedCLIs).forEach((key) => {
        const obj = this.#savedCLIs[key];
        const fileContent = obj.body;
        console.log(fileContent);
        bronze.compileBronze(fileContent);
      });
      this.#terminal.newLine();
    });
  }

  #customVars = {};

  #CLIcommands = {};

  // ===============================================
  // GUI SYSTEM
  // ===============================================

  #addGUI(
    calls,
    {
      moveable = false,
      multiple = false,
      resizable = false,
      selfStyles = "",
      handleId = null,
    } = {},
  ) {
    if (!handleId) {
      handleId = null;
    }

    calls.forEach((call) => {
      console.log("adding GUI call: " + call.type);
      switch (call.type) {
        case "WINDOW":
          this.#GUI.changeWindow(call.html, selfStyles);
          break;

        default:
          this.#terminal.println("IMPLEMENTATION ERROR, type not found");
          break;
      }
    });
    this.#GUI.setWindowSettings({
      draggable: moveable,
      multiple: multiple,
      resizable: resizable,
      selfStyles: selfStyles,
      handle: handleId,
    });
  }
}
