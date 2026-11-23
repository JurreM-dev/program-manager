# particle docs
## what is particle?
particle is the assembly of stellaVM. It assembles **directly** into energy bytecode with practically no abstractions
## max integers and registers
The integers are 16-bit
The registers are A up to H, so 8 registers

## how to use it

there are a few very specific ways to use particle:
- HLT stops the program
- SET `SET <register> <integer>` this sets a register
- OUT `OUT <register>` outputs the registers content in the host environment
- MOV `MOV <location register> <copied register>`

- numeric operators (ADD, SUB, MUL, DIV, MOD) are all built: `<instruction> <location register> <what to mutate the location with>`

- CMP `CMP <register 1> <register 2>` changes neither register, just check flags
- jump instructions (JMP, JEQ, JNE), always `<instruction> <bytecode index>` be careful here with how energy is different from particle (JMP is always, JEQ if the last CMP was 0, JNE if the last CMP was not zero)

## where to write it
write particle in basicIDE (`program install basicIDE, program open basicIDE`) and start particle in bronzeOS and assemble it (`particle-load, particle-accelerate <file name>`) to energy