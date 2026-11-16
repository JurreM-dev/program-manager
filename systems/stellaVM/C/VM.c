#include <stdio.h>
#include <stdbool.h>
#include "VM.h"

typedef enum {
    HLT = 0x00
} Opcodes;

void stellaVM(
    const uint8_t* instructions,
    int length,
    void (*output)(uint16_t)
) {
    bool running = true;
    int i = 0;
    while(running && i < length) {
        uint8_t command = instructions[i++];

        switch(command) {
            case HLT: {
                output(0);
                running = false;
                break;
            }
            default: {
                output(1);
                break;
            }
        }
    }
}