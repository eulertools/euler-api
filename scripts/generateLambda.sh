#!/usr/bin/env bash

echo Select a camelized lambda name:
read varname

cp -R scripts/generators/integrationLambda src/$varname
(cd src/$varname ; npm install )
(cd src/$varname ; ln -sf ../utils ./)
