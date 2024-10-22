# Dockerfile
FROM ubuntu:20.04

# Install the necessary packages
RUN apt-get update && \
    apt-get install -y \
    gcc make \
    gcc-aarch64-linux-gnu \
    gcc-arm-linux-gnueabi \
    gcc-x86-64-linux-gnu \
    qemu-user-static \
    nano \
    binfmt-support \
    curl \
    && apt-get clean

# Copy the MiniLZO source into the container
RUN echo $(pwd)
RUN mkdir -p /src
COPY ./minilzo-2.10 /src/minilzo-2.10

# Set the working directory
WORKDIR /src

# Define the target architectures for cross-compilation
ENV TARGET_ARCHS="x86_64 aarch64 armv7l"


# Make sure the /temp_output directory exists (we'll use this for internal compilation)
RUN mkdir -p /temp_output

# Build the library for each target architecture
RUN for arch in $TARGET_ARCHS; do \
    case "$arch" in \
        x86_64) \
            CC="x86_64-linux-gnu-gcc"; OUTPUT="minilzo-x86_64.so" ;; \
        aarch64) \
            CC="aarch64-linux-gnu-gcc"; OUTPUT="minilzo-arm64.so" ;; \
        armv7l) \
            CC="arm-linux-gnueabi-gcc"; OUTPUT="minilzo-armv7l.so" ;; \
        *) \
            echo "Unsupported architecture: $arch"; exit 1 ;; \
    esac; \
    $CC -I/src/minilzo-2.10/ -Wall -O2 -fomit-frame-pointer -shared -o /temp_output/$OUTPUT /src/minilzo-2.10/minilzo.c; \
done


ENTRYPOINT cp /temp_output/* /output/
