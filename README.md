## minilzo for deno ffi
- compatible with deno2
- uses minilzo 2.10 from http://www.oberhumer.com/opensource/lzo/

## Usage
see the [demo](./demo.ts) file

## Building
since minilzo is a C library, we need to build it for each architecture. Most of end-consumers do not want to build it, thats why this library has pre-built binaries for Linux, MacOS (arm64). I suggest you to compile it on your own anyways, not to trust pre-built binaries generally.

### Linux arm64, armv7l, x86_64
this will build the minilzo library for each architecture and copy it to the bin/ folder. You will need docker installed.
```
docker build -t minilzo-builder .
docker run --rm -v $(pwd)/bin:/output minilzo-builder
```
### MacOS(arm64, x86_64), Windows(x86_64)
Native Makefile detects the architecture and available compiler and builds the library. Makefile supports gcc and clang compilers. Make sure you have the necessary compilers installed.
```
make
```

### Precompiled binaries
you can download precompiled binaries from [./bin folder](https://github.com/7c/minilzo/tree/main/bin). Create a new folder and wget/curl the binaries into the folder. and use libName() function to get the correct library name. Use with caution. I am putting them here for myself as cheatsheet, you should be compiling them yourself.
```
test -e ./bin || mkdir ./bin
## MacOS Arm64
wget https://github.com/7c/minilzo/raw/refs/heads/main/bin/minilzo-arm64.dylib -O ./bin/minilzo-arm64.dylib
## MacOS x86_64
...coming soon....
## Linux Arm64
wget https://github.com/7c/minilzo/raw/refs/heads/main/bin/minilzo-arm64.so -O ./bin/minilzo-arm64.so
## Linux Armv7l
wget https://github.com/7c/minilzo/raw/refs/heads/main/bin/minilzo-armv7l.so -O ./bin/minilzo-armv7l.so
## Linux x86_64
wget https://github.com/7c/minilzo/raw/refs/heads/main/bin/minilzo-x86_64.so -O ./bin/minilzo-x86_64.so
## Windows x86_64
...coming soon....
## Windows Arm64
...coming soon....
```

## Install
### JSR
```
import { Minilzo, libName } from "jsr:@7c/minilzo"
```


## Copyright
```
 ============================================================================
 miniLZO -- mini subset of the LZO real-time data compression library
 ============================================================================

 Author  : Markus Franz Xaver Johannes Oberhumer
           <markus@oberhumer.com>
           http://www.oberhumer.com/opensource/lzo/
 Version : 2.10
 Date    : 01 Mar 2017

 
 LZO and miniLZO are Copyright (C) 1996-2017 Markus Franz Xaver Oberhumer
 All Rights Reserved.

 LZO and miniLZO are distributed under the terms of the GNU General
 Public License (GPL).  See the file COPYING.

 Special licenses for commercial and other applications which
 are not willing to accept the GNU General Public License
 are available by contacting the author.

```
