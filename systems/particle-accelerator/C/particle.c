#include <stdbool.h>
#include <string.h>
#include <stdlib.h>
#include "particle.h"

int* buildEnergy(
    char *rawText,
    int *outLength,
    void (*printOutput)(const char[])
) {
    int count = 3;
    printOutput("particle running");
    printOutput(rawText);

    *outLength = count;

    int *result = (int*)malloc(sizeof(int) * count);
    if(result == NULL) return NULL;

    result[0] = 10;
    result[1] = 20;
    result[2] = 30;

    return result;
}