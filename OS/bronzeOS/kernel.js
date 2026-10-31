class BronzeKernel {
  userName = "user";
  #userRole = "user";

  #appsData;

  constructor() {
    this.#loadUserData();
  }

  async fetchApps() {
    const data = await (await fetch("./../../programs.json")).json();
    if (data) {
      this.#appsData = data;
    }
  }

  exec(command, args, terminal, GUI) {
    if (!command || (!this.#commands[command] && !this.#CLIcommands[command])) {
      terminal.println("ERROR, invalid command");
      return;
    }
    if (
      this.#commands[command] &&
      typeof this.#commands[command] === "function"
    ) {
      this.#commands[command](args, terminal, GUI);
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
        let objectIndex = root.programs.findIndex(app => app.name === appName);
        if (objectIndex === -1) {
          terminal.println("app cannot be opened, not found");
          return;
        }
        let object = root.programs[objectIndex];
        GUI.showWindow("./../../" + object.path);
      },
      close: (args, terminal, GUI) => {
        GUI.closeWindow();
      }
    },
  };

  #CLIcommands = {};
}
