#!/bin/bash
GEOAPI_DATA_BASE_URL=https://storage.gra1.cloud.ovh.net/v1/AUTH_a9f396d3ab3e49838ec561c23de6c669/geoapi-data
echo "Create data directory"
mkdir -p data
echo "Retrieve datasets"
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/laposte_hexasmal.json
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/communes-dp25.json
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/osm_arrondissements_municipaux_2016.json
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/insee_cog_france2016.tsv
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/insee_cog_arrond2016.tsv
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/insee_cog_depts2016.tsv
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/insee_cog_reg2016.tsv
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/insee_population_metropole.csv
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/insee_population_dom.csv
wget -N -P data/ $GEOAPI_DATA_BASE_URL/communes/insee_population_arrondissements.csv
echo "Completed"
