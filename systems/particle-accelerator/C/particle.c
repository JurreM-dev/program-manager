#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include "particle.h"

bool pushIn(
    uint8_t **byteCodePtr,
    int *countPtr,
    int *capacityPtr,
    uint8_t value)
{
    int index = *countPtr;
    if (index >= *capacityPtr)
    {
        int newCapacity = 2 * *capacityPtr;
        uint8_t *temporary = (uint8_t *)realloc(*byteCodePtr, sizeof(uint8_t) * (*capacityPtr));
        if (temporary == NULL)
        {
            return false;
        }
        *byteCodePtr = temporary;
        *capacityPtr = newCapacity;
    }
    (*byteCodePtr)[index] = value;
    *countPtr = index + 1;
    return true;
}

uint8_t *buildEnergy(
    char *rawText,
    int *outLength,
    void (*printOutput)(const char[]))
{
    uint8_t *byteCode;
    int base = 64;
    int counter = 0;
    int *countPtr = &counter;
    int capacity = base;
    int *capacityPtr = &base;

    uint8_t *result = (uint8_t *)malloc(sizeof(uint8_t) * base);
    if (result == NULL)
        return NULL;

    byteCode = result;


    char **words = NULL;
    int wordCount = 0;

    for (char *t = strtok(rawText, " "); t; t = strtok(NULL, " "))
    {
        words = realloc(words, (wordCount + 1) * sizeof(char *));
        words[wordCount++] = t;
    }

    int i = 0;
    while(i < wordCount) {
        if(!pushIn(&byteCode, countPtr, capacityPtr, i)){
            printOutput("error, bug in adding to bytecode");
            return;
        }
        i += 1;
    }

    *outLength = counter;

    free(words);
    return byteCode;
}