export class StellaVM {
  constructor(module, output, charPrint) {
    this.output = output;
    this.module = module;
    this.charPrint = charPrint;
  }
  run(instructions) {
    let found = false;

    const instructionBytes = new Uint8Array(instructions);

    this.output("VM loaded!\n");

    const ptr = this.module._malloc(instructionBytes.length);

    this.module.HEAPU8.set(instructionBytes, ptr);

    const outputPtr = this.module.addFunction(this.output, "vi");

    const outputCharPtr = this.module.addFunction(this.charPrint, "vi");

    try {
        const result = this.module._stellaVM(
            ptr,
            instructionBytes.length,
            outputPtr,
            outputCharPtr
        )
        found = true;
        this.output("VM finished!");
    } finally {
        this.module._free(ptr);

        this.module.removeFunction(outputPtr);

        return {
            success: found
        }
    }
  }
}
