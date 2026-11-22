export class ParticleAccelerator {
  constructor(module, output) {
    this.module = module;
    this.output = output;
  }

  assemble(text) {
    text = text.replaceAll(/\s+/g, " ");

    const lengthPtr = this.module._malloc(4);

    const printCallback = this.module.addFunction((strPtr) => {
      this.output(this.module.UTF8ToString(strPtr));
    }, "vi");
    this.output("runtime found");

    const resultPtr = this.module.ccall(
      "buildEnergy",
      "number",
      ["string", "number", "number"],
      [text, lengthPtr, printCallback],
    );

    const arrayLength = this.module.HEAP32[lengthPtr >> 2];

    const jsArray = Array.from(
      this.module.HEAPU8.subarray(resultPtr, resultPtr + arrayLength),
    );

    this.module._free(lengthPtr);
    this.module._free(resultPtr);
    this.module.removeFunction(printCallback);

    if(jsArray.length < 1) {
      return {
        success: false,
        result: null
      }
    }
    return {
      success: true,
      result: jsArray
    }
  }
}
