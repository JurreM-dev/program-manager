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

  exec(command, args, terminal) {
    if (!command || (!this.#commands[command] && !this.#CLIcommands[command])) {
      terminal.println("ERROR, invalid command");
      return;
    }
    if (
      this.#commands[command] &&
      typeof this.#commands[command] === "function"
    ) {
      this.#commands[command](args, terminal);
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
    app: (args, terminal) => {
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
      this.#innerCommands.app[Keyword](rest, terminal);
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
        this.fetchApps().then(() => {
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
          terminal.newLine();
        });
      },
    },
  };

  #CLIcommands = {};
}
