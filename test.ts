let libPath: string;
let arch: string = Deno.build.arch
const os = Deno.build.os

if (arch === "aarch64") arch = "arm64";

// Use import.meta.url to get the current directory of the module
console.log(import.meta)
const basePath = new URL('.', import.meta.url).pathname;

// Determine the correct path to the binary
switch (os) {
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
libPath = "./bin/minilzo-arm64.dylib"
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