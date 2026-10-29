class BronzeKernel {
    userName = "user"

    exec(command, args, terminal) {
        if(!command || (!this.#commands[command] && !this.#CLIcommands[command])) {
            terminal.println("ERROR, invalid command");
            return;
        }
        if(this.#commands[command] && typeof this.#commands[command] === "function") {
            this.#commands[command](args, terminal);
        }
    }

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

    // terminal commands
    clear: (args, terminal) => {
      terminal.clear();
    }
  };

  #CLIcommands = {};
}
