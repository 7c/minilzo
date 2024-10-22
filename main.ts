let libPath: string;
let arch:string = Deno.build.arch
const os = Deno.build.os

if (arch === "aarch64") arch = "arm64";

// Use import.meta.url to get the current directory of the module
console.log(import.meta)
const basePath = new URL('.', import.meta.url).pathname;

// Determine the correct path to the binary
switch(os) {
  case "linux":
    libPath = `${basePath}bin/minilzo-${arch}.so`;
    break;
  case "darwin":
    libPath = `${basePath}bin/minilzo-${arch}.dylib`;
    break;
  case "windows":
    libPath = `${basePath}bin/minilzo-${arch}.dll`;
    break;
  default:
    throw new Error(`Unsupported OS: ${os}`);
}

console.log(`Loading library from: ${libPath}`);


// minilzo is exposing only these 3 functions
const dylib = Deno.dlopen(libPath, {
  lzo1x_1_compress: {
    parameters: ["pointer", "usize", "pointer", "pointer", "pointer"],
    result: "i32",
  },
  lzo1x_decompress: {
    parameters: ["pointer", "usize", "pointer", "pointer"],
    result: "i32",
  },
  lzo1x_decompress_safe: {
    parameters: ["pointer", "usize", "pointer", "pointer"],
    result: "i32",
  },
});

// LZO1X_1_MEM_COMPRESS constant from the minilzo.h
const LZO1X_1_MEM_COMPRESS = 16384;

const wrkmem = new Uint8Array(LZO1X_1_MEM_COMPRESS);

/**
 * Compress the input data and return the compressed size.
 * @param input - The input data to compress.
 * @param output - The output buffer to store the compressed data.
 * @returns The size of the compressed data.
 */
export function compress(input: Uint8Array, output: Uint8Array): number {
  const inputPtr = Deno.UnsafePointer.of(input);
  const outputPtr = Deno.UnsafePointer.of(output);
  
  const outputLength = new Uint32Array([output.length]);
  const outputLengthPtr = Deno.UnsafePointer.of(outputLength);

  const wrkmemPtr = Deno.UnsafePointer.of(wrkmem);

  const result = dylib.symbols.lzo1x_1_compress(
    inputPtr!,
    BigInt(input.length),
    outputPtr!,
    outputLengthPtr!,
    wrkmemPtr!
  );

  if (result !== 0) throw new Error(`Compression failed with code: ${result}`);
  

  const compressedSize = new DataView(Deno.UnsafePointerView.getArrayBuffer(outputLengthPtr!, 4)).getUint32(0, true);
  
  return compressedSize;
}


/**
 * Decompress the input data and return the decompressed size.
 * This function is unsafe and does not check the result of the decompression.
 * @param input - The input data to decompress.
 * @param output - The output buffer to store the decompressed data.
 * @returns The size of the decompressed data.
 */
export function decompressUnsafe(input: Uint8Array, output: Uint8Array): number {
  const inputPtr = Deno.UnsafePointer.of(input);
  const outputPtr = Deno.UnsafePointer.of(output);

  const outputLength = new Uint32Array([output.length]);
  const outputLengthPtr = Deno.UnsafePointer.of(outputLength);

  const result = dylib.symbols.lzo1x_decompress(
    inputPtr!,
    BigInt(input.length),
    outputPtr!,
    outputLengthPtr!
  );
  
  if (result !== 0) {
    throw new Error(`Decompression failed with code: ${result}`);
  }

  const decompressedSize = new DataView(Deno.UnsafePointerView.getArrayBuffer(outputLengthPtr!, 4)).getUint32(0, true);
  return decompressedSize;
}



/**
 * Decompress the input data and return the decompressed size.
 * uses lzo1x_decompress_safe version of the decompression function
 * @param input - The input data to decompress.
 * @param output - The output buffer to store the decompressed data.
 * @returns The size of the decompressed data.
 */
export function decompress(input: Uint8Array, output: Uint8Array): number {
  const inputPtr = Deno.UnsafePointer.of(input);
  const outputPtr = Deno.UnsafePointer.of(output);

  const outputLength = new Uint32Array([output.length]);
  const outputLengthPtr = Deno.UnsafePointer.of(outputLength);

  const result = dylib.symbols.lzo1x_decompress_safe(
    inputPtr!,
    BigInt(input.length),
    outputPtr!,
    outputLengthPtr!
  );

  if (result !== 0) {
    throw new Error(`Safe decompression failed with code: ${result}`);
  }

  const decompressedSize = new DataView(Deno.UnsafePointerView.getArrayBuffer(outputLengthPtr!, 4)).getUint32(0, true);
  return decompressedSize;
}


export function closeLibrary() {
  dylib.close();
}
