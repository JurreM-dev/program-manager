#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include "particle.h"

typedef enum {
    HLT = 0x00,
    SET = 0x01,
    OUT = 0x02
} Opcodes;

typedef enum {
    A = 0,
    B,
    C,
    D,
    E,
    F,
    G,
    H
} Registers;

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

bool checkBounds(
    int length,
    int current,
    int needed
) {
    if(current + needed > length) {
        return false;
    }
    return true;
}

uint8_t findRegister(char letter) {
    if(letter == 'A') {
        return 0x00;
    } else if(letter == 'B') {
        return 0x01;
    } else if(letter == 'C') {
        return 0x02;
    } else if(letter == 'D') {
        return 0x03;
    } else if(letter == 'E') {
        return 0x04;
    } else if(letter == 'F') {
        return 0x05;
    } else if(letter == 'G') {
        return 0x06;
    } else if(letter == 'H') {
        return 0x07;
    }
    return 0xFF;
}

uint8_t *buildEnergy(
    char *rawText,
    int *outLength,
    void (*printOutput)(const char[]))
{
    printOutput("particle accelerator response");
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
        int val;
        int sec = -1;
        int third = -1;
        int fourth = -1;
        char *word = words[i++];
        printOutput(word);
        if(strcmp(word, "HLT") == 0) {
            val = 0x00;
        } else if(strcmp(word, "SET") == 0) {
            val = 0x01;
            if(!checkBounds(wordCount, i, 2)) {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord = words[i++];
            char letter = regWord[0];
            uint8_t registerFound = findRegister(letter); 
            if(registerFound > 7) {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound;
            char *usedInt = words[i++];
            int used = atoi(usedInt);
            if(used > 0xFFFF || used < 0) {
                printOutput("ERROR, invalid written number");
                return NULL;
            }
            uint8_t topByte = used / 256;
            uint8_t lowByte = used % 256;
            third = topByte;
            fourth = lowByte;
        } else if(strcmp(word, "OUT") == 0) {
            val = 0x02;
            if(!checkBounds(wordCount, i, 1)) {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord = words[i++];
            char letter = regWord[0];
            uint8_t registerFound = findRegister(letter); 
            if(registerFound > 7) {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound;
        } else if(strcmp(word, "MOV") == 0) {
            val = 0x03;
            if(!checkBounds(wordCount, i, 2)) {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord1 = words[i++];
            char letter1 = regWord1[0];
            uint8_t registerFound1 = findRegister(letter1); 
            if(registerFound1 > 7) {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound1;
            char *regWord2 = words[i++];
            char letter2 = regWord2[0];
            uint8_t registerFound2 = findRegister(letter2); 
            if(registerFound2 > 7) {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            third = registerFound2;
        }

        if(!pushIn(&byteCode, countPtr, capacityPtr, val)){
            printOutput("error, bug in adding to bytecode");
            return NULL;
        }
        if(sec >= 0) {
            if(!pushIn(&byteCode, countPtr, capacityPtr, sec)){
                printOutput("error, bug in adding to bytecode");
                return NULL;
            }
        }
        if(third >= 0) {
            if(!pushIn(&byteCode, countPtr, capacityPtr, third)){
                printOutput("error, bug in adding to bytecode");
                return NULL;
            }
        }
        if(fourth >= 0) {
            if(!pushIn(&byteCode, countPtr, capacityPtr, fourth)){
                printOutput("error, bug in adding to bytecode");
                return NULL;
            }
        }
    }

    *outLength = counter;

    free(words);
    return byteCode;
}