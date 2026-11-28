#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include "particle.h"

typedef enum
{
    HLT = 0x00,
    SET = 0x01,
    OUT = 0x02,
    MOV = 0x03,

    // numeric operations
    ADD = 0x04,
    SUB = 0x05,
    MUL = 0x06,
    DIV = 0x07,
    MOD = 0x08,

    // comparisons
    CMP = 0x09,

    // jumps
    JMP = 0x0A,
    JEQ = 0x0B,
    JNE = 0x0C,
    JGT = 0x0D,
    JLT = 0x0E,

    // complexer functions
    OUTC = 0x0F,

    // memory functions
    STORE = 0x10,
    LOAD = 0x11,
    STOREB = 0x12,
    LOADB = 0x13
} Opcodes;

typedef enum
{
    A = 0,
    B,
    C,
    D,
    E,
    F,
    G,
    H
} Registers;

typedef struct
{
    char name[32];
    uint16_t address;
} Label;

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
        uint8_t *temporary = (uint8_t *)realloc(*byteCodePtr, sizeof(uint8_t) * newCapacity);
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
    int needed)
{
    if (current + needed > length)
    {
        return false;
    }
    return true;
}

uint8_t findRegister(char letter)
{
    if (letter == 'A')
    {
        return 0x00;
    }
    else if (letter == 'B')
    {
        return 0x01;
    }
    else if (letter == 'C')
    {
        return 0x02;
    }
    else if (letter == 'D')
    {
        return 0x03;
    }
    else if (letter == 'E')
    {
        return 0x04;
    }
    else if (letter == 'F')
    {
        return 0x05;
    }
    else if (letter == 'G')
    {
        return 0x06;
    }
    else if (letter == 'H')
    {
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
    int *capacityPtr = &capacity;

    Label labels[128];

    int labelCount = 0;
    uint16_t byteOffset = 0;

    uint8_t *result = (uint8_t *)malloc(sizeof(uint8_t) * capacity);
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

    int p = 0;
    while (p < wordCount)
    {
        char *word = words[p++];
        size_t len = strlen(word);

        if (len > 0 && word[len - 1] == ':')
        {
            if (labelCount < 128)
            {
                strncpy(labels[labelCount].name, word, len - 1);
                labels[labelCount].name[len - 1] = '\0';
                labels[labelCount].address = byteOffset;
                labelCount++;
            }
            continue;
        }

        if (strcmp(word, "HLT") == 0)
        {
            byteOffset += 1;
        }
        else if (strcmp(word, "OUT") == 0 || strcmp(word, "OUTC") == 0)
        {
            byteOffset += 2;
            p += 1;
        }
        else if (strcmp(word, "SET") == 0)
        {
            byteOffset += 4;
            p += 2;
        }
        else if (strcmp(word, "JMP") == 0 || strcmp(word, "JEQ") == 0 || strcmp(word, "JNE") == 0 || strcmp(word, "JGT") == 0 || strcmp(word, "JLT") == 0)
        {
            byteOffset += 3;
            p += 1;
        }
        else
        {
            byteOffset += 3;
            p += 2;
        }
    }

    int i = 0;
    while (i < wordCount)
    {
        int val;
        int sec = -1;
        int third = -1;
        int fourth = -1;
        char *word = words[i++];
        size_t len = strlen(word);
        if (len > 1 && word[len - 1] == ':')
        {
            continue;
        }

        if (strcmp(word, "HLT") == 0)
        {
            val = 0x00;
        }
        else if (strcmp(word, "SET") == 0)
        {
            val = 0x01;
            if (!checkBounds(wordCount, i, 2))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord = words[i++];
            char letter = regWord[0];
            uint8_t registerFound = findRegister(letter);
            if (registerFound > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound;
            char *usedInt = words[i++];
            int used = atoi(usedInt);
            if (used > 0xFFFF || used < 0)
            {
                printOutput("ERROR, invalid written number");
                return NULL;
            }
            uint8_t topByte = used / 256;
            uint8_t lowByte = used % 256;
            third = topByte;
            fourth = lowByte;
        }
        else if (strcmp(word, "OUT") == 0)
        {
            val = 0x02;
            if (!checkBounds(wordCount, i, 1))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord = words[i++];
            char letter = regWord[0];
            uint8_t registerFound = findRegister(letter);
            if (registerFound > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound;
        }
        else if (strcmp(word, "MOV") == 0)
        {
            val = 0x03;
            if (!checkBounds(wordCount, i, 2))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord1 = words[i++];
            char letter1 = regWord1[0];
            uint8_t registerFound1 = findRegister(letter1);
            if (registerFound1 > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound1;
            char *regWord2 = words[i++];
            char letter2 = regWord2[0];
            uint8_t registerFound2 = findRegister(letter2);
            if (registerFound2 > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            third = registerFound2;
        }
        else if (strcmp(word, "ADD") == 0 || strcmp(word, "SUB") == 0 || strcmp(word, "MUL") == 0 || strcmp(word, "DIV") == 0 || strcmp(word, "MOD") == 0)
        {
            if (strcmp(word, "ADD") == 0)
            {
                val = 0x04;
            }
            else if (strcmp(word, "SUB") == 0)
            {
                val = 0x05;
            }
            else if (strcmp(word, "MUL") == 0)
            {
                val = 0x06;
            }
            else if (strcmp(word, "DIV") == 0)
            {
                val = 0x07;
            }
            else if (strcmp(word, "MOD") == 0)
            {
                val = 0x08;
            }

            if (!checkBounds(wordCount, i, 2))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *locationWord = words[i++];
            char locationLetter = locationWord[0];
            uint8_t locationFound = findRegister(locationLetter);
            if (locationFound > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = locationFound;
            char *plusWord = words[i++];
            char plusLetter = plusWord[0];
            uint8_t plusFound = findRegister(plusLetter);
            if (plusFound > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            third = plusFound;
        }
        else if (strcmp(word, "CMP") == 0)
        {
            val = 0x09;
            if (!checkBounds(wordCount, i, 2))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord1 = words[i++];
            char letter1 = regWord1[0];
            uint8_t registerFound1 = findRegister(letter1);
            if (registerFound1 > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound1;
            char *regWord2 = words[i++];
            char letter2 = regWord2[0];
            uint8_t registerFound2 = findRegister(letter2);
            if (registerFound2 > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            third = registerFound2;
        }
        else if (strcmp(word, "JMP") == 0 || strcmp(word, "JNE") == 0 || strcmp(word, "JEQ") == 0 || strcmp(word, "JGT") == 0 || strcmp(word, "JLT") == 0)
        {
            if (strcmp(word, "JMP") == 0)
            {
                val = JMP;
            }
            else if (strcmp(word, "JEQ") == 0)
            {
                val = JEQ;
            }
            else if (strcmp(word, "JNE") == 0)
            {
                val = JNE;
            }
            else if (strcmp(word, "JGT") == 0)
            {
                val = JGT;
            }
            else if (strcmp(word, "JLT") == 0)
            {
                val = JLT;
            }
            if (!checkBounds(wordCount, i, 1))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *targetWord = words[i++];
            int used = -1;

            for (int l = 0; l < labelCount; l++)
            {
                if (strcmp(labels[l].name, targetWord) == 0)
                {
                    used = labels[l].address;
                    break;
                }
            }

            if (used == -1)
            {
                used = atoi(targetWord);
            }
            if (used > 0xFFFF || used < 0)
            {
                printOutput("ERROR, invalid written number");
                return NULL;
            }
            uint8_t topByte = used / 256;
            uint8_t lowByte = used % 256;
            sec = topByte;
            third = lowByte;
        }
        else if (strcmp(word, "OUTC") == 0)
        {
            val = OUTC;
            if (!checkBounds(wordCount, i, 1))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord = words[i++];
            char letter = regWord[0];
            uint8_t registerFound = findRegister(letter);
            if (registerFound > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound;
        }
        else if (strcmp(word, "STORE") == 0 || strcmp(word, "LOAD") == 0 || strcmp(word, "STOREB") == 0 || strcmp(word, "LOADB") == 0)
        {
            if (strcmp(word, "STORE") == 0)
            {
                val = STORE;
            }
            else if (strcmp(word, "LOAD") == 0)
            {
                val = LOAD;
            } else if(strcmp(word, "STOREB") == 0) 
            {
                val = STOREB;
            } else if(strcmp(word, "LOADB") == 0) 
            {
                val = LOADB;
            }
            if (!checkBounds(wordCount, i, 2))
            {
                printOutput("ERROR, unexpected end of input");
                return NULL;
            }
            char *regWord1 = words[i++];
            char letter1 = regWord1[0];
            uint8_t registerFound1 = findRegister(letter1);
            if (registerFound1 > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            sec = registerFound1;
            char *regWord2 = words[i++];
            char letter2 = regWord2[0];
            uint8_t registerFound2 = findRegister(letter2);
            if (registerFound2 > 7)
            {
                printOutput("ERROR, register out of bounds");
                return NULL;
            }
            third = registerFound2;
        }

        else
        {
            printOutput("ERROR, unknown opcode entry");
            return NULL;
        }

        if (!pushIn(&byteCode, countPtr, capacityPtr, val))
        {
            printOutput("error, bug in adding to bytecode");
            return NULL;
        }
        if (sec >= 0)
        {
            if (!pushIn(&byteCode, countPtr, capacityPtr, sec))
            {
                printOutput("error, bug in adding to bytecode");
                return NULL;
            }
        }
        if (third >= 0)
        {
            if (!pushIn(&byteCode, countPtr, capacityPtr, third))
            {
                printOutput("error, bug in adding to bytecode");
                return NULL;
            }
        }
        if (fourth >= 0)
        {
            if (!pushIn(&byteCode, countPtr, capacityPtr, fourth))
            {
                printOutput("error, bug in adding to bytecode");
                return NULL;
            }
        }
    }

    *outLength = counter;

    free(words);
    return byteCode;
}