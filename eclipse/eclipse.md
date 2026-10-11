# eclipse docs

## into
this is one of the more compilicated parts of stellarOS. It is essentially an experimental coding language with an IDE

## eclipse coding language

- variables

eclipse is **NOT** strongly typed, so variable types are allowed to change. It does use explicit typing.

to declare a variable you use this:

`sky test: num = 42`

or this format:

`sky <varName>: <varType> = <value>`

the types are:
- str (for strings)
- bool (boolean also works)
- num (numbers)

you can also use a calculation with 2 numbers or even variables in num variables! 

- printing

for printing eclipse uses the `say()` function. you cannot use calculations inside of say but you can print variables.

- if-statements

else if and else are not implemented yet, but for an if statement you use `experiment()`

use this:

`experiment(i < 5): {
    ...
}`

- getting input

for input you use either `learn()` or `addKnowledge()`

they both do the exact same, learn() is just a newer, shorter version.

this is the whole syntax:

`learn("what is your name?") into name`

- functions

in eclipse functions are called rituals, because eclipse was based of of the concept of dark magic.
this is how you create a function:

`ritual sayHi(name): {
    say("hi!")
    say(name)
}`

then to call it:

`
sky name: str = "John"
summon sayHi(name)
`

you can only give variables as parameters, and a ritual can NOT change a variable in the global scope yet.

## eclipse IDE

the IDE is fairly simple.

in the top right you see 2 buttons.

the right button opens a window and runs the code.

the left button opens the terminal. inside of the terminal file commands (mkdir, touch, rm, etc) work using the same files as the main terminal. You can also save and load using this. to save you use:

`save test.ecl`

if the file does not exist the program will run a few commands in the terminal itself to save it. 
if you don't enter a file name it will get newFile.ecl

to load you just use:

`load test.ecl`

## outro

please know that eclipse is still VERY experimental and is not a full coding environment/language yet and may also not always be actively worked on.