#!/bin/bash
# ==============================================================================
# seed-data.sh - Vigan City Open Data Portal Seeder
# Creates default CKAN organizations and seed datasets.
# Must be executed from within the CKAN container or via docker compose exec.
# ==============================================================================

set -euo pipefail

CKAN_URL="http://localhost:5000"
CKAN_INI="${CKAN_INI:-/srv/app/ckan.ini}"
SAMPLE_DATA_DIR="${SAMPLE_DATA_DIR:-/tmp/sample-datasets}"
API_KEY=$(
  ckan -c "$CKAN_INI" user token add vigancity_admin setup_token \
    | tail -n 1 \
    | tr -d '\t \r\n'
)

echo "Generated temp API key: ${API_KEY:0:10}..."

declare -A ORGS=(
  ["city-planning"]="City Planning & Development"
  ["tourism-office"]="Vigan City Tourism Office"
  ["drrmo"]="Disaster Risk Reduction & Mgmt"
  ["city-health"]="City Health Office"
  ["business-permits"]="Business Permits & Licensing"
  ["city-budget"]="City Budget Office"
  ["cenro"]="City Environment & Natural Resources"
)

echo "Creating organizations..."
for sysname in "${!ORGS[@]}"; do
  title="${ORGS[$sysname]}"
  status=$(
    curl -s -o /dev/null -w "%{http_code}" \
      -H "Authorization: $API_KEY" \
      "${CKAN_URL}/api/3/action/organization_show?id=${sysname}"
  )

  if [ "$status" -eq 200 ]; then
    echo "  [SKIP] Organization '${title}' already exists."
    continue
  fi

  curl -s -X POST "${CKAN_URL}/api/3/action/organization_create" \
    -H "Authorization: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"${sysname}\",
      \"title\": \"${title}\",
      \"description\": \"Official data published by the ${title}.\"
    }" > /dev/null

  echo "  [OK] Created '${title}'"
done

echo "Creating seed datasets..."

create_dataset() {
  local name=$1
  local title=$2
  local org=$3
  local notes=$4
  local tags=$5

  local status
  status=$(
    curl -s -o /dev/null -w "%{http_code}" \
      -H "Authorization: $API_KEY" \
      "${CKAN_URL}/api/3/action/package_show?id=${name}"
  )

  if [ "$status" -eq 200 ]; then
    echo "  [SKIP] Dataset '${name}' already exists."
    return
  fi

  curl -s -X POST "${CKAN_URL}/api/3/action/package_create" \
    -H "Authorization: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"${name}\",
      \"title\": \"${title}\",
      \"owner_org\": \"${org}\",
      \"notes\": \"${notes}\",
      \"private\": false,
      \"tags\": [${tags}]
    }" > /dev/null

  echo "  [OK] Created dataset '${title}'"
}

create_resource() {
  local dataset_name=$1
  local resource_name=$2
  local format=$3
  local description=$4
  local file_path=$5

  if [ ! -f "$file_path" ]; then
    echo "  [WARN] Sample file not found for '${dataset_name}': ${file_path}"
    return
  fi

  local payload
  payload=$(
    curl -s \
      -H "Authorization: $API_KEY" \
      "${CKAN_URL}/api/3/action/package_show?id=${dataset_name}"
  )

  local resource_id
  resource_id=$(
    printf '%s' "$payload" | python3 -c '
import json
import sys

target_name = sys.argv[1]
data = json.load(sys.stdin)
for resource in data.get("result", {}).get("resources", []):
    if resource.get("name") == target_name:
        print(resource.get("id", ""))
        break
' "$resource_name"
  )

  if [ -n "$resource_id" ]; then
    curl -s -X POST "${CKAN_URL}/api/3/action/resource_update" \
      -H "Authorization: $API_KEY" \
      -F "id=${resource_id}" \
      -F "package_id=${dataset_name}" \
      -F "name=${resource_name}" \
      -F "description=${description}" \
      -F "format=${format}" \
      -F "upload=@${file_path}" > /dev/null

    echo "  [OK] Updated resource '${resource_name}' in '${dataset_name}'"
    return
  fi

  curl -s -X POST "${CKAN_URL}/api/3/action/resource_create" \
    -H "Authorization: $API_KEY" \
    -F "package_id=${dataset_name}" \
    -F "name=${resource_name}" \
    -F "description=${description}" \
    -F "format=${format}" \
    -F "upload=@${file_path}" > /dev/null

  echo "  [OK] Uploaded resource '${resource_name}' to '${dataset_name}'"
}

create_dataset "heritage-sites-vigan" "Vigan Heritage Sites Directory" "tourism-office" \
  "Complete registry of ancestral houses and historic landmarks protected by UNESCO in the Vigan conservation zone." \
  "{\"name\":\"tourism\"},{\"name\":\"heritage\"}"

create_dataset "monthly-tourist-arrivals-2025" "Monthly Tourist Arrivals 2025" "tourism-office" \
  "Monthly tourism arrivals, hotel occupancy, and featured visitor drivers reported by the Vigan City Tourism Office for 2025." \
  "{\"name\":\"tourism\"},{\"name\":\"visitors\"},{\"name\":\"arrivals\"}"

create_dataset "registered-businesses-2025" "Registered Businesses 2025" "business-permits" \
  "Annual list of all active business permits issued by the City of Vigan." \
  "{\"name\":\"business\"},{\"name\":\"permits\"}"

create_dataset "public-health-facilities" "Public Health Facilities" "city-health" \
  "Locations and contact capacities of all Barangay Health Centers and the main City Health Office." \
  "{\"name\":\"health\"},{\"name\":\"facilities\"}"

create_dataset "flood-hazard-maps" "Flood Hazard Maps" "drrmo" \
  "Geospatial data showing 100-year flood susceptibility zones across Vigan City barangays." \
  "{\"name\":\"drrm\"},{\"name\":\"geojson\"},{\"name\":\"hazard\"}"

create_dataset "city-annual-budget-2025" "City Annual Budget 2025" "city-budget" \
  "Detailed breakdown of the approved city budget for the fiscal year 2025." \
  "{\"name\":\"budget\"},{\"name\":\"finance\"}"

create_dataset "solid-waste-collection" "Solid Waste Collection Routes" "cenro" \
  "Schedule and routes for solid waste collection per barangay." \
  "{\"name\":\"environment\"},{\"name\":\"waste\"}"

create_dataset "barangay-boundaries" "Barangay Boundaries (GeoJSON)" "city-planning" \
  "Administrative boundaries for all 39 barangays of Vigan City." \
  "{\"name\":\"planning\"},{\"name\":\"geojson\"},{\"name\":\"barangay\"}"

echo "Uploading sample resources..."

create_resource "heritage-sites-vigan" "Vigan Heritage Sites" "CSV" \
  "Sample heritage site registry for frontend preview and download." \
  "${SAMPLE_DATA_DIR}/tourism-office/vigan-heritage-sites.csv"

create_resource "monthly-tourist-arrivals-2025" "Monthly Tourist Arrivals 2025" "CSV" \
  "Sample monthly tourism arrivals report for frontend preview and download." \
  "${SAMPLE_DATA_DIR}/tourism-office/monthly-tourist-arrivals-2025.csv"

create_resource "registered-businesses-2025" "Registered Businesses 2025" "CSV" \
  "Sample business permit registry for frontend preview and download." \
  "${SAMPLE_DATA_DIR}/business-permits/registered-businesses-2025.csv"

create_resource "public-health-facilities" "Public Health Facilities" "CSV" \
  "Sample health facilities directory for frontend preview and download." \
  "${SAMPLE_DATA_DIR}/city-health/public-health-facilities.csv"

create_resource "flood-hazard-maps" "Flood Hazard Priority Areas" "GeoJSON" \
  "Sample flood hazard GeoJSON for map-based datasets." \
  "${SAMPLE_DATA_DIR}/drrmo/flood-hazard-priority-areas.geojson"

create_resource "city-annual-budget-2025" "City Annual Budget 2025" "CSV" \
  "Sample city budget breakdown for frontend preview and download." \
  "${SAMPLE_DATA_DIR}/city-budget/city-annual-budget-2025.csv"

create_resource "solid-waste-collection" "Solid Waste Collection Routes" "CSV" \
  "Sample CENRO route table for frontend preview and download." \
  "${SAMPLE_DATA_DIR}/cenro/solid-waste-collection-routes.csv"

create_resource "barangay-boundaries" "Barangay Boundaries" "GeoJSON" \
  "Sample barangay boundary GeoJSON for planning datasets." \
  "${SAMPLE_DATA_DIR}/city-planning/barangay-boundaries.geojson"

echo "Ensuring CKAN default resource views exist..."
ckan -c "$CKAN_INI" views create -y

echo "Seeding complete."
