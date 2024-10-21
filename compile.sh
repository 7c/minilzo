#!/bin/bash

cd minilzo-2.10/
gcc -I.  -Wall -O2 -fomit-frame-pointer -shared -o ../bin/minilzo.dylib minilzo.c
