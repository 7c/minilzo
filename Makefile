OS := $(shell uname -s)
ARCH := $(shell uname -m)

CXX := $(shell which clang > /dev/null 2>&1 && echo clang || echo gcc)

CFLAGS := -I. -Wall -O2 -fomit-frame-pointer
LDFLAGS := -shared

# Output directory
BIN_DIR := ./bin

# Source file
SRC := minilzo-2.10/minilzo.c

# Default target
all: build

# Build based on the detected OS
build: $(OS)
	@echo "Building for $(OS) on $(ARCH) architecture with $(CXX)..."

# macOS target (Darwin)
Darwin:
	$(CXX) $(CFLAGS) $(LDFLAGS) -o $(BIN_DIR)/minilzo-$(ARCH).dylib $(SRC)

# Linux target
Linux:
	$(CXX) $(CFLAGS) $(LDFLAGS) -o $(BIN_DIR)/minilzo-$(ARCH).so $(SRC)

# Windows target (MSYS or Git Bash)
MINGW32_NT:
	$(CXX) $(CFLAGS) $(LDFLAGS) -o $(BIN_DIR)/minilzo-$(ARCH).dll $(SRC)

MINGW64_NT:
	$(CXX) $(CFLAGS) $(LDFLAGS) -o $(BIN_DIR)/minilzo-$(ARCH).dll $(SRC)

# If OS is not detected
.PHONY: unsupported
unsupported:
	@echo "Unsupported OS: $(OS)"
	@exit 1

# Clean target
clean:
	@echo "Cleaning up..."
	rm -f $(BIN_DIR)/minilzo-$(ARCH).*
