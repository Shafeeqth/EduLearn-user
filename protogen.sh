#!/bin/bash

# Define paths
PROTOC_GEN_TS_PROTO="C:/Users/pro/OneDrive/Desktop/EduLearn/api-gateway/node_modules/.bin/protoc-gen-ts_proto.cmd"
PROTO_DIR="./src/infrastructure/frameworks/gRPC/protos"
OUT_DIR="./src/infrastructure/frameworks/gRPC/generated"

# Ensure the output directory exists
mkdir -p "$OUT_DIR"

# Compile all .proto files in the proto directory
npx protoc \
  --plugin=protoc-gen-ts_proto="$PROTOC_GEN_TS_PROTO" \
  --ts_proto_out="$OUT_DIR" \
  --ts_proto_opt=outputServices=grpc-js,esModuleInterop=true \
  -I "$PROTO_DIR" \
  -I ./node_modules \
  "$PROTO_DIR"/*.proto

echo "Proto files compiled successfully to $OUT_DIR"
