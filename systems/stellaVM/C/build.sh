#!/bin/bash
emcc VM.c -o vm.js --no-entry \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='createStellaModule' \
  -s EXPORTED_FUNCTIONS='["_stellaVM","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["addFunction","removeFunction","HEAPU8"]' \
  -s ALLOW_TABLE_GROWTH=1  -s EXPORTED_FUNCTIONS='["_stellaVM","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["addFunction","removeFunction","HEAPU8"]' \
  -s ALLOW_TABLE_GROWTH=1