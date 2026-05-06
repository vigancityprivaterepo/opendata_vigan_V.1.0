#!/bin/bash
# ==============================================================================
# seed-data.sh — Vigan City Open Data Portal Seeder
# Creates default CKAN organizations and seed datasets.
# Must be executed from within the CKAN container or via docker-compose exec.
# ==============================================================================

set -e

# API Base URL and Admin Token inside the container network
CKAN_URL="http://localhost:5000"
API_KEY=$(ckan -c /etc/ckan/ckan.ini user token add vigancity_admin setup_token | tail -n 1 | tr -d '\t \r\n')

echo "🔑 Generated Temp API Key: ${API_KEY:0:10}..."

# ------------------------------------------------------------------------------
# 1. Create Organizations (Departments)
# ------------------------------------------------------------------------------
declare -A ORGS=(
  ["city-planning"]="City Planning & Development"
  ["tourism-office"]="Vigan City Tourism Office"
  ["drrmo"]="Disaster Risk Reduction & Mgmt"
  ["city-health"]="City Health Office"
  ["business-permits"]="Business Permits & Licensing"
  ["city-budget"]="City Budget Office"
  ["cenro"]="City Environment & Natural Resources"
)

echo "🏢 Creating Organizations..."
for sysname in "${!ORGS[@]}"; do
  title="${ORGS[$sysname]}"
  
  # Check if exists
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: $API_KEY" "${CKAN_URL}/api/3/action/organization_show?id=${sysname}")
  
  if [ "$STATUS" -eq 200 ]; then
    echo "  [SKIP] Organization '${title}' already exists."
  else
    curl -s -X POST "${CKAN_URL}/api/3/action/organization_create" \
      -H "Authorization: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"name\": \"${sysname}\",
        \"title\": \"${title}\",
        \"description\": \"Official data published by the ${title}.\"
      }" > /dev/null
    echo "  [OK] Created '${title}'"
  fi
done

# ------------------------------------------------------------------------------
# 2. Create Datasets (Packages)
# ------------------------------------------------------------------------------
echo "📦 Creating Seed Datasets..."

create_dataset() {
  local name=$1
  local title=$2
  local org=$3
  local notes=$4
  local tags=$5  # comma separated e.g. "{"name":"tag1"},{"name":"tag2"}"
  
  # Check if exists
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: $API_KEY" "${CKAN_URL}/api/3/action/package_show?id=${name}")
  if [ "$STATUS" -eq 200 ]; then
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
    
  echo "  [OK] Created Dataset '${title}'"
}

# --- Tourist Sites ---
create_dataset "heritage-sites-vigan" "Vigan Heritage Sites Directory" "tourism-office" \
  "Complete registry of ancestral houses and historic landmarks protected by UNESCO in the Vigan conservation zone." \
  "{\"name\":\"tourism\"},{\"name\":\"heritage\"}"

# --- Business Permits ---
create_dataset "registered-businesses-2025" "Registered Businesses 2025" "business-permits" \
  "Annual list of all active business permits issued by the City of Vigan." \
  "{\"name\":\"business\"},{\"name\":\"permits\"}"

# --- Health ---
create_dataset "public-health-facilities" "Public Health Facilities" "city-health" \
  "Locations and contact capacities of all Barangay Health Centers and the main City Health Office." \
  "{\"name\":\"health\"},{\"name\":\"facilities\"}"

# --- DRRMO ---
create_dataset "flood-hazard-maps" "Flood Hazard Maps" "drrmo" \
  "Geospatial data showing 100-year flood susceptibility zones across Vigan City barangays." \
  "{\"name\":\"drrm\"},{\"name\":\"geojson\"},{\"name\":\"hazard\"}"

# --- Budget ---
create_dataset "city-annual-budget-2025" "City Annual Budget 2025" "city-budget" \
  "Detailed breakdown of the approved city budget for the fiscal year 2025." \
  "{\"name\":\"budget\"},{\"name\":\"finance\"}"

# --- CENRO ---
create_dataset "solid-waste-collection" "Solid Waste Collection Routes" "cenro" \
  "Schedule and routes for solid waste collection per barangay." \
  "{\"name\":\"environment\"},{\"name\":\"waste\"}"

# --- Planning ---
create_dataset "barangay-boundaries" "Barangay Boundaries (GeoJSON)" "city-planning" \
  "Administrative boundaries for all 39 barangays of Vigan City." \
  "{\"name\":\"planning\"},{\"name\":\"geojson\"},{\"name\":\"barangay\"}"

echo "✅ Seeding Complete."
