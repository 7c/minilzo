import debug from "debug";
const dbg = debug("_Minilzo");

export class Minilzo {
    public LZO1X_1_MEM_COMPRESS = 16384; // LZO1X_1_MEM_COMPRESS constant from the minilzo.h
    private wrkmem = new Uint8Array(this.LZO1X_1_MEM_COMPRESS);

    private dylib: Deno.DynamicLibrary<Deno.ForeignLibraryInterface>;

    constructor(libPath: string) {
        dbg("Minilzo constructor");
        // minilzo is exposing only these 3 functions
        this.dylib = Deno.dlopen(libPath, {
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
            }
        }) as Deno.DynamicLibrary<Deno.ForeignLibraryInterface>;
    }

    /**
 * Compress the input data and return the compressed size.
 * @param input - The input data to compress.
 * @param output - The output buffer to store the compressed data.
 * @returns The size of the compressed data.
 */
    compress(input: Uint8Array, output: Uint8Array): number {
        dbg(`compress ${input.length} bytes`);
        if (!this.dylib.symbols.lzo1x_1_compress) 
            throw new Error("lzo1x_1_compress symbol not found");
        const inputPtr = Deno.UnsafePointer.of(input);
        const outputPtr = Deno.UnsafePointer.of(output);

        const outputLength = new Uint32Array([output.length]);
        const outputLengthPtr = Deno.UnsafePointer.of(outputLength);

        const wrkmemPtr = Deno.UnsafePointer.of(this.wrkmem);

        const lzo1x_1_compress = this.dylib.symbols.lzo1x_1_compress as (...args: unknown[]) => number;

        const result = lzo1x_1_compress(
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
    decompressUnsafe(input: Uint8Array, output: Uint8Array): number {
        dbg(`decompress ${input.length} bytes`);
        const inputPtr = Deno.UnsafePointer.of(input);
        const outputPtr = Deno.UnsafePointer.of(output);

        const outputLength = new Uint32Array([output.length]);
        const outputLengthPtr = Deno.UnsafePointer.of(outputLength);

        const lzo1x_decompress = this.dylib.symbols.lzo1x_decompress as (...args: unknown[]) => number;

        const result = lzo1x_decompress(
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
    decompress(input: Uint8Array, output: Uint8Array): number {
        dbg(`decompress ${input.length} bytes`);
        const inputPtr = Deno.UnsafePointer.of(input);
        const outputPtr = Deno.UnsafePointer.of(output);

        const outputLength = new Uint32Array([output.length]);
        const outputLengthPtr = Deno.UnsafePointer.of(outputLength);

        const lzo1x_decompress_safe = this.dylib.symbols.lzo1x_decompress_safe as (...args: unknown[]) => number;

        const result = lzo1x_decompress_safe(
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

    /**
     * Close the dynamic library.
     */
    closeLibrary() {
        this.dylib.close();
    }
}
