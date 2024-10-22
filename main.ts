
export function libName(): string {
  let libName: string;
  let arch: string = Deno.build.arch
  const os = Deno.build.os
  if (arch === "aarch64") arch = "arm64";

  // Determine the correct path to the binary
  switch (os) {
    case "linux":
      libName = `minilzo-${arch}.so`;
      break;
    case "darwin":
      libName = `minilzo-${arch}.dylib`;
      break;
    case "windows":
      libName = `minilzo-${arch}.dll`;
      break;
    default:
      throw new Error(`Unsupported OS: ${os}`);
  }

  return libName;
}

export * from "./Minilzo.ts";
