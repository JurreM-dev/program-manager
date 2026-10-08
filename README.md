# stellarOS (program-manager)
## introduction: what is stellarOS?
stellarOS started as a project to make a terminal and apps inside of the web, as a webOS.
That is what it still is today, but stellarOS now also lets you boot an inner OS like autumn OS!

## programs
programs were the very first core of stellarOS, these are basically just apps, the main programs I advice experimenting with are:

- calculator
- skyDocs

these are very simple apps. to install a program just run:
`program install <program name>`

## file system
stellarOS also has a terminal based file system. This is saved as an object in browser storage fully locally, using localforage, a library built on top of indexedDB.
Current supported commands:
- mkdir
- rm
- touch
- cd
- ls

with ls you can also use the --all to show hidden files.

## OS
**os** is the inner OS system, that brings extra functionality and a dashboard to stellarOS, this is still very experimental and also one of the things I am currently working on! As of right now there is only one OS: autumnOS
>how to download and boot an OS?
download:
`os download <os name>`
booting:
`os boot <os name>`

you can only have one os installed at a time and can only boot what is currently installed.

## other projects within stellarOS
these are some other projects in stellarOS I have or am working on, note that some of these are not well polished or just not finished at all, since some of them are paused and not focused on.
- eclipse
a custom IDE and coding language that was heavily inspired off of the concept of dark magic

- constellation
my own version of git. This is still far from done and is also part of the eclipse ecosystem which is not my focus as of right now.

## current focus

the current focus is mainly building more useful and small apps and building the and for the os system, and working on autumnOS