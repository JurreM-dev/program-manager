# stellaVM docs

## what is stellaVM and what is the goal of it?
StellaVM is a more low level project within stellarOS. It is mainly written in **C** as of right now. It is compiled to webAssembly using emscripten. The goal is to create a more optimized low level tool for building systems and coding languages that can be integrated into other host environments like bronzeOS for example. StellaVM is **not** meant to take over all of stellarOS, but mainly meant as an experimental VM that could be used to build more custom coding languages.

## how does stellaVM work?
StellaVM executes custom bytecode called "energy" and as of right now just has access to registers, but soon there may also be RAM added. 

## run energy in bronzeOS
when you have an actual energy binary run `stellaVM-start` and `stellaVM-run <filename>` to run it

## more docs
* [energy docs](energy.md)
* [stellaVM error docs](stellaVM_errs.md)
* [particle docs](../particle-accelerator/particle.md)