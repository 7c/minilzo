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

## Install
### JSR
```
import * as minilzo from "jsr:@7c/minilzo"
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
