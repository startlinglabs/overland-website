#!/bin/sh
set -e

# Move to directory of script
cd "$(dirname "$0")"

rm -rf public; hugo
aws s3 rm s3://www.overlandscience.com --recursive  --profile overland
aws s3 cp ./public s3://www.overlandscience.com/ --recursive --profile overland
aws cloudfront create-invalidation --distribution-id E3QWVVOZUVBVAU --paths "/*" --profile overland

echo "Deployed!"