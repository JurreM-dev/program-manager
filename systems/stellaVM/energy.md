# energy docs
## what is energy?
Energy is the bytecode of stellaVM, which gets executed by stellaVM. The name energy comes from te fact that everything is built on top of energy, and the future of stellaVM will be built on this.

## what is this guide for?
this guide is mainly for writing the bytecode by hand instead of using particle.

## how many registers can you manipulate?
there are 8 registers. A up to H. The hexadecimal number for A is 0x00 and for H 0x07. 

## what are flags?
the current flags are Z and S. Z means two compared registers are 0, S that the second one is bigger than the other so the result is negative

## writing energy manually
we will go over all current instructions here.

- HLT `0x00` this instruction ends the program.
- SET `0x01 <register hexadecimal> <upper byte> <lower byte>` registers are 16 bit but instructions 8 bit, so the first number is the upper byte and the second one the lower byte.
- OUT `0x02 <register number>` this prints out a registers content
- MOV `0x03 <location register> <origin register>` this copies a registers content to another
- ADD `0x04 <location register> <added register>` this adds the second register to the location register
- SUB `0x05 <location register> <subtracted register>` this subtracts the second register from the location register
- MUL `0x06 <location register> <multiplication register>` this multiplies the location register by the second register
- DIV `0x07 <location register> <dividing register>` this divides the location register by the second register
- MOD `0x08 <location register> <dividing register>` this calculates the remainder of dividing the location register by the second register
- CMP `0x09 <first register> <second register>` this compares two registers and does not write any register, it only edits the Z and S flags
- JMP `0x0A <index of instruction>` jump to the direct instruction at the given index in your instruction index
- JEQ `0x0B <index of instruction>` does the same as jump but only when the Z flag is true
- JNE `0x0C <index of instruction>` does the same as jump but only when flag Z is **not** true