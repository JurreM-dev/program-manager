#ifndef PARTICLE_H
#define PARTICLE_H

#include <stdbool.h>

uint8_t* buildEnergy(
    char *rawText,
    int *outLength,
    void (*printOutput)(const char[])
);

#endif // PARTICLE_H