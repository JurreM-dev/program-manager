#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include "particle.h"

bool pushIn(
    uint8_t **byteCodePtr, 
    int *countPtr, 
    int *capacityPtr,
    uint8_t value
) {
    int index = *countPtr;
    if(index >= *capacityPtr) {
        int newCapacity = 2 * *capacityPtr;
        uint8_t* temporary = (uint8_t*)realloc(*byteCodePtr, sizeof(uint8_t) * (*capacityPtr));
        if(temporary == NULL) {
            return false;
        }
        *byteCodePtr = temporary;
        *capacityPtr = newCapacity;
    }  
    (*byteCodePtr)[index] = value;
    *countPtr = index + 1;
    (*countPtr)++;  
}

uint8_t* buildEnergy(
    char *rawText,
    int *outLength,
    void (*printOutput)(const char[])
) {
    uint8_t* byteCode;
    int base = 64;
    int counter = 0;
    int* countPtr = &counter;
    int capacity = base;
    int* capacityPtr = &base;

    printOutput("particle running");
    printOutput(rawText);

    uint8_t *result = (uint8_t*)malloc(sizeof(uint8_t) * base);
    if(result == NULL) return NULL;



    byteCode = result;

    *outLength = counter;

    return byteCode;
}