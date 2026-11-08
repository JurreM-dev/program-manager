# bronze language & IDE
## first of all: what actually IS bronze?
bronze is a transpiled language used to create HTML and CSS, but using the CLI library it can also compile into CLI functionality for bronzeOS

## what is the goal?
the main goal, even though we haven't reached it yet, is that it can be used to build GUIs and CLIs for bronzeOS using a simple to use language.

## how to use the IDE
in the IDE you just type your code and then you can run and export files 

## "how do I import a library?"

as of right now importing libraries is not required because there is only one and it is built into the compiler, that is the CLI library, it'll automatically compile as a whole CLI or not depening on the environment it's run from.

## what is there in the language as of right now?

code that is transpiled is compiled in **segments** all with their own meaning for the page or CLI

they all have their own syntax.

**BODY**

this is the main segment, it compiles into HTML

available elements:

- `TEXT <content>`  (transpiles to \<p>)

- `BUTTON <content>` (transpiles to \<button>)

- `HEADER <level 1-6> <content>` (transpiles to \<h1>-\<h6>)

- `LINE` (transpiles to \<hr>)

This is of course still very limited, but it is being worked on.

you can also pass in attributes `<<(here)>>`

you split them with a comma

available are:

- `COLOR`

- `CLASS`

- `ID`

- `ROUNDING`

- `BACKGROUNDCOLOR`

- `MARGIN`

- `PADDING`

- `ONCLICK`

for stuff like onclick you follow it up with an *action*

available actions are:

- `ALERT <value>`

you write it like this:

`BUTTON click me <<ONCLICK ALERT hello!>>`

**STYLESHEET**

in here you can just use vanilla CSS

**CLI**

this is from the CLI library, here you write CLIs for bronzeOS, you use an identifier for what to call the CLI with, then you pass an action

available actions:

- `PRINT <value>`
- `EXEC <stellar command>`
- `CHANGECOLOR <color>`
- `CHANGEBGCOLOR <color>`
- `DEFINE <name> <type> = <value>`

example:
```bronze
CLI (
    IDENTIFIER sayHi
    PRINT hi!
)
```

Variables can be stored in `customVars`. `ARGS` is the text passed after the
command name, and `VAR <name>` reads a stored variable:

```bronze
CLI (
    IDENTIFIER say
    DEFINE message TEXT = ARGS ALL
    PRINT VAR message
)
```

ARGS can have ALL or a specific index, or you just store a text value, as of now TEXT is the only valid type

## how do you use segments?

segments are formatted like this:

```bronze
    BODY (
        TEXT this is in segment 1
    )
    <--->
    BODY (
        TEXT this is in segment 2
    )
```

you seperate it using `<--->`

**GUI**

this is the *official* GUI library for bronzeOS, as of right now it can be used for making custom windows

available parts:

## for windows

- `FRAME`  the iframe that opens the app
- `MULTIPLE <TRUE or FALSE>` allow multiple windows
- `MOVABLE <TRUE or FALSE>` allow dragging windows
- `RESIZABLE <TRUE or FALSE>` allow resizing windows
- `SELF <any CSS>` for styling the window itself
- `HANDLE` class of the handle for dragging, otherwise drags window itself

all normal BODY elements and attributes work (some attributes may not work on special GUI elements)

you build GUI like this:

```bronze
    GUI (
        WINDOW {
            FRAME
            TEXT here goes your window
        }
    )
```

## in the future

the focus lays on expanding the body compiler, the CLI library and the GUI library, development is currently paused