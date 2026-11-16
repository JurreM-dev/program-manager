#include <stdio.h>
#include <stdbool.h>
#include "VM.h"

// opcodes
typedef enum
{
    HLT = 0x00,
    SET = 0x01,
    OUT = 0x02
} Opcodes;

// function to check registers
bool checkRegister(uint8_t registerIndex) {
    if(registerIndex < 0 || registerIndex > 7) {
        return false;
    } else {
        return true;
    }
}

// main VM execution
void stellaVM(
    const uint8_t *instructions,
    int length,
    void (*output)(uint16_t))
{
    // define registers
    uint8_t registers[8];

    bool running = true;
    int i = 0;
    while (running && i < length)
    {
        uint8_t command = instructions[i++];

        switch (command)
        {
        case HLT:
        {
            output(0);
            running = false;
            break;
        }
        case SET: 
        {
            uint8_t registerIndex = instructions[i++];
            if(!checkRegister(registerIndex)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t value = instructions[i++];
            registers[registerIndex] = value;
            break;
        }
        case OUT: {
            uint8_t registerIndex = instructions[i++];
            if(!checkRegister(registerIndex)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            output(registers[registerIndex]);
            break;
        }
        default:
        {
            output(1);
            break;
        }
        }
    }
}