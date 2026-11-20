#include <stdbool.h>
#include <string.h>
#include "particle.h"

int* buildEnergy(
    char *rawText,
    void (*printOutput)(const char[])
) {
    printOutput("particle running");
    printOutput(rawText);

    return NULL;
}