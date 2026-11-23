#ifndef VM_H
#define VM_H

#include <stdint.h>

void stellaVM(
    const uint8_t* instructions,
    int length,
    void (*output)(uint16_t),
    void (*outputChar)(uint8_t)
);

#endif