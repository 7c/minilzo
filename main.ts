
const basePath = new URL('.', import.meta.url).pathname;
export async function ensureBinariesExist() {
  try {
    await Deno.stat(`${basePath}bin/minilzo-arm64.so`);
    await Deno.stat(`${basePath}bin/minilzo-x86_64.so`);
    await Deno.stat(`${basePath}bin/minilzo-armv7l.so`);
    console.log('Binaries are available.');
  } catch (error) {
    console.error('Error: Some binaries are missing!', error);
  }
}
export function libPath(): string {
  let libPath: string;
  let arch: string = Deno.build.arch
  const os = Deno.build.os
  if (arch === "aarch64") arch = "arm64";

  // Use import.meta.url to get the current directory of the module
  

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

  return libPath;
}

export * from "./Minilzo.ts";

ensureBinariesExist();
