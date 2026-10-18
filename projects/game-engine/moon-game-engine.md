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

Also it does have some features that could definitely be worth trying out for yourself, and overall it is pretty fun to use for small fun projects. 

## how to use the engine?

inside of the engine you can see that on the left there is the editor and on the right are preview/displays
inside the editor you have: entities, player settings, editor settings
you can switch between them using the sidebar which you open using the ">" button on the bottom left.

in the preview display there is in the top right also a restart button, this refreshes the scene.

## entities

entities are simply what we call game objects, as of right now we have:

- cubes
- circles
- platforms
- emojiSprites
- emojiPlatforms

platforms and emojiPlatforms also collide with cubes and circles!

also circles can bounce!

you can click on an item in the list to edit it too!

**IMPORTANT NOTE**
at emojiPlatforms it may not fill the full width since we divide the width by the width of the emoji(s) in your chosen font size, which is then rounded down, meaning that the platform will probably not exactly be the given width.

## player

here you set the player! You use one of the entities you already made (it cannot be a platform). 

you also tweak settings like speed, max jumps, jump power, hp and death on falling into the void here

## editor settings

For now this is just where you can toggle physics debug

## world settings

here you can set the background color of the world.

## saving and loading

all games are stored locally on device in indexedDB using localforage. Make sure to save, it does not go automatically!

## libraries used

* for saving it uses the localforage library
* in some of the item rendering it uses DOMpurify
* for the actual game rendering and canvas it uses Phaser js