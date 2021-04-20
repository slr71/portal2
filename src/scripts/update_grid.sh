#!/bin/bash
set -e

ID=`curl -sL https://api.figshare.com/v2/collections/3812929/articles | jq ".[0].id"`
URL=`curl -sL https://api.figshare.com/v2/articles/$ID | jq -r ".files[0].download_url"`
mkdir -p /tmp/grid
wget -O /tmp/grid/grid.zip $URL
unzip -d /tmp/grid /tmp/grid/grid.zip grid.csv
./src/scripts/import_grid_institutions.py /tmp/grid/grid.csv -v
rm -rf /tmp/grid