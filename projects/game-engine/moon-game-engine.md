# moon game engine docs

## what is the moon game engine?

the moon game engine is an experimental project to build a game engine on top of Phaser.js and javascript. 

## how does it work with stellarOS?

just like most projects and apps the moon game engine is integrated into stellarOS as a **program** meaning that in the main terminal you can download it and then run it

download:

`program install moon-game-engine`

opening it:

`program open moon-game-engine`

also if you are using a different inner OS (like *autumnOS*) you can use whatever app/program system it uses to run it.

## how good is the moon game engine?

Since it is highly experimental the game engine is definitely not the best, but it is being developed and it could be great for experimenting!

## how to use the engine?

inside of the engine you can see that on the left there is the editor and on the right are preview/displays
inside the editor you have: entities, player settings, editor settings
you can switch between them using the sidebar which you open using the ">" button on the bottom left.

in the preview display there is in the top right also a restart button, this refreshes the scene.

## entities

entities are simply what we call game objects, as of right now we have:

cubes
circles
platforms

platforms also collide with cubes and circles!

you can click on an item in the list to edit it too!

## player

here you set the player! You use one of the entities you already made (it cannot be a platform). Also you can change settings like max jumps, speed and jumpPower.

## editor settings

here you can edit some editor settings

## saving and loading

all games are stored locally on device in indexedDB.