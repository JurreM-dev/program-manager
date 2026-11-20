#ifndef PARTICLE_H
#define PARTICLE_H

#include <stdbool.h>

int* buildEnergy(
    char *rawText,
    int *outLength,
    void (*printOutput)(const char[])
);

#endif // PARTICLE_H