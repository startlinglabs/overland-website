#!/bin/sh
set -e

# Move to directory of script
cd "$(dirname "$0")"

hugo server --disableFastRender
