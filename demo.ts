import { Minilzo, libName } from  "./main.ts"
import * as path from "jsr:@std/path"

const minilzo = new Minilzo(path.join(import.meta.dirname!, "bin", libName()));
const input = new Uint8Array(new TextEncoder().encode("Hello, world!"));
const output = new Uint8Array(input.length*4);

try {
    const compressedSize = minilzo.compress(input, output);
    console.log(`Compressed size: ${compressedSize}`);

    const decompressedOutput = new Uint8Array(1024);
    const decompressedSize = minilzo.decompress(output.slice(0, compressedSize), decompressedOutput);
    console.log(`Decompressed size: ${decompressedSize}`);
} catch (error) {
    console.error(error);
} finally {
    minilzo.closeLibrary();
}

