# Minecraft Block Renderer

A headless Node.js application for rendering Minecraft block states into isometric PNG images using vanilla assets. Supports downloading client.jar, parsing blockstates/models/textures, and generating ZIP artifacts with metadata.

## Features

- Downloads and extracts Minecraft client.jar assets
- Parses blockstates, models, and textures
- Renders blocks to isometric PNGs with directional shading
- Supports variants and multipart blockstates
- Generates blockData.json with hashes and metadata
- Packages all outputs into a single ZIP file
- GitHub Actions workflow for CI rendering

## Installation

```bash
npm install
```

## Usage

### Local Run

```bash
# Generate all blocks
npm run generate

# Generate specific block (e.g., stone)
BLOCK_ID_FILTER=stone npm run generate

# Smoke test
npm run smoke-test
```

### Environment Variables

- `MC_VERSION`: Minecraft version (default: 1.20.1)
- `BLOCK_ID_FILTER`: Filter by block ID
- `PROP_INCLUDE`: Include specific properties
- `LIMIT`: Limit number of blocks to generate
- `KEEP_EXISTING`: Keep existing blockData.json (1 to enable)

### CI Usage

Use the GitHub Actions workflow with workflow_dispatch to trigger rendering in CI.

## Output

- `output/`: Directory containing generated PNG files
- `blockData.json`: Metadata for each block state
- `minecraft-blocks.zip`: ZIP containing all PNGs and blockData.json

## Future Enhancements

- Weighted variants support
- Biome tinting
- Precise UV mapping
- Caching mechanisms
- Multipart optimization
