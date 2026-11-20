#!/bin/bash
emcc particle.c -o particle.js --no-entry \
  -s EXPORTED_FUNCTIONS='["_buildEnergy", "_malloc", "_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["addFunction","removeFunction", "UTF8ToString", "ccall", "HEAP32"]' \
  -s ALLOW_TABLE_GROWTH=1