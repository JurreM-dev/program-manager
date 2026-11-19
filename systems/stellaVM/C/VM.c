#include <stdio.h>
#include <stdbool.h>
#include "VM.h"

// opcodes
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
    JMP = 0x0A,
    JEQ = 0x0B,
    JNE = 0x0C
} Opcodes;

// flags
typedef struct {
    bool Z;
    bool S;
} Flags;

// function to check registers
bool checkRegister(uint8_t registerIndex) {
    return registerIndex < 8;
}

bool checkBounds(int length, int pc, int reserved) {
    if(pc + reserved > length) {
        return false;
    }
    return true;
}

// main VM execution
void stellaVM(
    const uint8_t *instructions,
    int length,
    void (*output)(uint16_t))
{
    // define registers
    uint16_t registers[8] = {0};

    // define flags
    Flags flags = {};

    bool running = true;
    int i = 0;
    while (running && i < length)
    {
        uint8_t command = instructions[i++];

        switch (command)
        {
        case HLT:
        {
            running = false;
            break;
        }
        case SET: 
        {
            if(!checkBounds(length, i, 3)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t registerIndex = instructions[i++];
            if(!checkRegister(registerIndex)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t value1 = instructions[i++];
            uint8_t value2 = instructions[i++];
            uint16_t written = (value1 * 256) + value2;
            registers[registerIndex] = written;
            break;
        }
        case OUT: 
        {
            if(!checkBounds(length, i, 1)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
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
        case MOV: 
        {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t locationRegister = instructions[i++];
            if(!checkRegister(locationRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t inputRegister = instructions[i++];
            if(!checkRegister(inputRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            registers[locationRegister] = registers[inputRegister];
            break;
        }
        
        // numeric operations
        case ADD:
        {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t locationRegister = instructions[i++];
            if(!checkRegister(locationRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t addedRegister = instructions[i++];
            if(!checkRegister(addedRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            registers[locationRegister] += registers[addedRegister];
            break;
        }
        case SUB:
        {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t locationRegister = instructions[i++];
            if(!checkRegister(locationRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t subRegister = instructions[i++];
            if(!checkRegister(subRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            registers[locationRegister] -= registers[subRegister];
            break;
        }
        case MUL:
        {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t locationRegister = instructions[i++];
            if(!checkRegister(locationRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t mulRegister = instructions[i++];
            if(!checkRegister(mulRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            registers[locationRegister] *= registers[mulRegister];
            break;
        }
        case DIV: 
        {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t locationRegister = instructions[i++];
            if(!checkRegister(locationRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t divRegister = instructions[i++];
            if(!checkRegister(divRegister)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            if(registers[divRegister] == 0) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            registers[locationRegister] /= registers[divRegister];
            break;
        }

        // comparisons
        case CMP:
        {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t reg1 = instructions[i++];
            if(!checkRegister(reg1)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t reg2 = instructions[i++];
            if(!checkRegister(reg2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }

            flags.Z = registers[reg1] == registers[reg2];
            flags.S = registers[reg1] > registers[reg2];
            break;
        }

        // jumps
        case JMP: {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t value1 = instructions[i++];
            uint8_t value2 = instructions[i++];
            uint16_t jumpTo = (value1 * 256) + value2;
            if(jumpTo > length) {
                output(1);
                output(i - 3);
                running = false;
                break;
            }
            i = jumpTo;
            break;
        }
        case JEQ: {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t value1 = instructions[i++];
            uint8_t value2 = instructions[i++];
            uint16_t jumpTo = (value1 * 256) + value2;
            if(jumpTo > length) {
                output(1);
                output(i - 3);
                running = false;
                break;
            }
            if(flags.Z) {
                i = jumpTo;
            }
            break;
        }
        case JNE: {
            if(!checkBounds(length, i, 2)) {
                output(1);
                output(i - 1);
                running = false;
                break;
            }
            uint8_t value1 = instructions[i++];
            uint8_t value2 = instructions[i++];
            uint16_t jumpTo = (value1 * 256) + value2;
            if(jumpTo > length) {
                output(1);
                output(i - 3);
                running = false;
                break;
            }
            if(!flags.Z) {
                i = jumpTo;
            }
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