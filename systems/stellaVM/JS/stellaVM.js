export class StellaVM {
  charOutput = "";
  flush() {
    this.out(this.charOutput);
    this.charOutput = "";
  }
  constructor(module, output) {
    this.output = (val) => {
      if (this.charOutput.length > 0) {
        this.flush();
      }
      output(val);
    };
    this.out = output;
    this.module = module;
    this.charAdd = (char) => {
      this.charOutput += String.fromCharCode(char);
    };
  }
  run(instructions) {
    let found = false;

    const instructionBytes = new Uint8Array(instructions);

    this.output("VM loaded!\n");

    const ptr = this.module._malloc(instructionBytes.length);

    this.module.HEAPU8.set(instructionBytes, ptr);

    const outputPtr = this.module.addFunction(this.output, "vi");

    const outputCharPtr = this.module.addFunction(this.charAdd, "vi");

    try {
      const result = this.module._stellaVM(
        ptr,
        instructionBytes.length,
        outputPtr,
        outputCharPtr,
      );
      found = true;
      if(this.charOutput.length > 0) {
        this.flush();
      }
      this.output("VM finished!");
    } finally {
      this.module._free(ptr);

      this.module.removeFunction(outputPtr);
      this.module.removeFunction(outputCharPtr);
    }
    return {
        success: found,
    };
  }
}
