# bronzeOS 
## what is bronzeOS?
bronze is an inner OS system of stellarOS, just like autumnOS for example. Where autumnOS is GUI focused bronzeOS is CLI focused. 

## the goal
The goal is customizability. bronzeOS should allow users to customize their CLI commands and later even their own GUI. This will work with the CLI and GUI libraries for the bronze language 

## current commands
since there are no help commands available yet, this is currently the main guide, commands are:

FILE COMMANDS

- `mkdir <dirname>`

- `touch <filename>`

- `cd <dirname`

- `ls`

- `rm <name>`

APP COMMANDS

- `app install <app name>`

- `app open <app name>`

- `app close`

- `app list`

USER COMMANDS

- `user setname <name>`

BRONZE COMMANDS

- `compileBrz <filename>`

TERMINAL COMMANDS

- `clear`

## the file system
bronzeOS uses the same file system and installed apps (programs) as normal stellarOS, saved in indexedDB using the localforage library

## custom CLI using bronze
using the bronze coding language docs you can create a CLI for bronzeOS. then you save it into the file system and compile it using 
`compileBrz`

as of right now custom CLI functions do not save and are very limited