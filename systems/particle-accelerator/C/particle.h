#ifndef PARTICLE_H
#define PARTICLE_H

#include <stdbool.h>

int* buildEnergy(
    char *rawText,
    void (*printOutput)(const char[])
);

#endif // PARTICLE_H