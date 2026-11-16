#include <stdio.h>
#include "VM.h"

void stellaVM(
    const uint8_t* instructions,
    int length,
    void (*output)(uint16_t)
) {
    printf("VM initialized.\n");

    printf("instuction length: %d\n", length);

    for(int i = 0; i < length; i++) {
        printf("instruction byte: %d\n", instructions[i]);
    }

    output(123);
}