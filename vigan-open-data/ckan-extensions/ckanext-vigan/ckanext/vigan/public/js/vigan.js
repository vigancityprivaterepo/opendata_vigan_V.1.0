(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  // ─── Mobile nav toggle ────────────────────────────────────────────────────────

  ready(function () {
    var toggle = document.getElementById("vigan-nav-toggle");
    var menu = document.getElementById("vigan-mobile-menu");

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      menu.hidden = expanded;
    });

    document.addEventListener("click", function (event) {
      if (toggle.contains(event.target) || menu.contains(event.target)) {
        return;
      }
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // ─── Header scroll shadow ─────────────────────────────────────────────────────

  ready(function () {
    var header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    function syncShadow() {
      header.style.boxShadow = window.scrollY > 6
        ? "0 10px 24px rgba(13, 74, 47, 0.08)"
        : "none";
    }

    window.addEventListener("scroll", syncShadow, { passive: true });
    syncShadow();
  });

  // ─── Resource preview dispatcher ─────────────────────────────────────────────

  ready(function () {
    var preview = document.querySelector("[data-vigan-preview]");
    if (!preview) {
      return;
    }

    var previewType    = preview.getAttribute("data-vigan-preview");
    var resourceUrl    = preview.getAttribute("data-resource-url");
    var resourceId     = preview.getAttribute("data-resource-id");
    var resourceFormat = (preview.getAttribute("data-resource-format") || "").toLowerCase();

    // ── Shared helpers ──────────────────────────────────────────────────────────

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function loadStylesheet(href) {
      return new Promise(function (resolve, reject) {
        if (document.querySelector('link[href="' + href + '"]')) {
          resolve();
          return;
        }
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = resolve;
        link.onerror = function () { reject(new Error("Could not load stylesheet: " + href)); };
        document.head.appendChild(link);
      });
    }

    function loadScriptOnce(src, globalKey) {
      return new Promise(function (resolve, reject) {
        if (window[globalKey]) { resolve(window[globalKey]); return; }
        var existing = document.querySelector('script[src="' + src + '"]');
        if (existing) {
          existing.addEventListener("load",  function () { resolve(window[globalKey]); }, { once: true });
          existing.addEventListener("error", function () { reject(new Error("Script failed: " + src)); }, { once: true });
          return;
        }
        var script = document.createElement("script");
        script.src = src;
        script.onload  = function () { resolve(window[globalKey]); };
        script.onerror = function () { reject(new Error("Script failed: " + src)); };
        document.head.appendChild(script);
      });
    }

    function ensureLeaflet() {
      if (window.L) { return Promise.resolve(window.L); }
      return loadStylesheet("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css")
        .then(function () { return loadScriptOnce("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "L"); })
        .then(function (L) {
          if (!L) { throw new Error("Leaflet did not initialize."); }
          return L;
        });
    }

    function ensureChartJs() {
      if (window.Chart) { return Promise.resolve(window.Chart); }
      return loadScriptOnce(
        "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js",
        "Chart"
      ).then(function (Chart) {
        if (!Chart) { throw new Error("Chart.js did not initialize."); }
        return Chart;
      });
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  TABLE + CHART PREVIEW
    // ════════════════════════════════════════════════════════════════════════════

    if (previewType === "table" && resourceId) {

      var PAGE_SIZE     = 100;
      var currentOffset = 0;
      var totalRecords  = 0;
      var allFields     = [];
      var lastRecords   = [];
      var currentQuery  = "";
      var searchTimer   = null;
      var chartRendered = false;

      var tablePane  = preview.querySelector("[data-vigan-table-pane]");
      var chartPane  = preview.querySelector("[data-vigan-chart-pane]");
      var tabButtons = preview.querySelectorAll(".vigan-preview-tab");

      // ── Tab switching ───────────────────────────────────────────────────────
      tabButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var tab = btn.getAttribute("data-tab");

          tabButtons.forEach(function (b) {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");

          if (tab === "table") {
            tablePane.hidden = false;
            chartPane.hidden = true;
          } else {
            tablePane.hidden = true;
            chartPane.hidden = false;
            if (!chartRendered) {
              chartRendered = true;
              initChartPreview(allFields, lastRecords);
            }
          }
        });
      });

      // ── DataStore fetch ─────────────────────────────────────────────────────
      function fetchRecords(offset, query) {
        var params = new URLSearchParams({
          resource_id: resourceId,
          limit: PAGE_SIZE,
          offset: offset
        });
        if (query) { params.set("q", query); }

        return fetch("/api/3/action/datastore_search?" + params.toString(), {
          credentials: "same-origin"
        }).then(function (resp) {
          if (!resp.ok) { throw new Error("DataStore API returned HTTP " + resp.status); }
          return resp.json();
        }).then(function (json) {
          if (!json.success) {
            throw new Error(json.error && json.error.message ? json.error.message : "DataStore search failed");
          }
          return json.result;
        });
      }

      // ── Table renderer ──────────────────────────────────────────────────────
      function renderTablePane(fields, records, total, offset) {
        var fieldNames = fields
          .filter(function (f) { return f.id !== "_id"; })
          .map(function (f) { return f.id; });

        var startRow = total === 0 ? 0 : offset + 1;
        var endRow   = Math.min(offset + PAGE_SIZE, total);

        var countHtml =
          '<div class="vigan-table-preview__toolbar">' +
          '<span class="vigan-table-preview__count">Showing <strong>' +
            startRow + '&ndash;' + endRow +
          '</strong> of <strong>' + total + '</strong> record' + (total !== 1 ? 's' : '') + '</span>' +
          '<div class="vigan-table-preview__search">' +
          '<input type="search" id="vigan-table-search" placeholder="Search&hellip;" ' +
            'value="' + escapeHtml(currentQuery) + '" aria-label="Search records">' +
          '</div>' +
          '</div>';

        var thead = '<thead><tr>' +
          fieldNames.map(function (name) {
            return '<th scope="col">' + escapeHtml(name) + '</th>';
          }).join('') +
          '</tr></thead>';

        var tbody;
        if (records.length === 0) {
          tbody = '<tbody><tr><td colspan="' + fieldNames.length +
            '" style="text-align:center;padding:28px;color:var(--vig-muted)">No records found.</td></tr></tbody>';
        } else {
          tbody = '<tbody>' +
            records.map(function (row) {
              return '<tr>' +
                fieldNames.map(function (name) {
                  var val = row[name];
                  var display = val === null || val === undefined ? '' : String(val);
                  return '<td data-label="' + escapeHtml(name) + '" title="' + escapeHtml(display) + '">' +
                    escapeHtml(display) + '</td>';
                }).join('') +
              '</tr>';
            }).join('') +
          '</tbody>';
        }

        var prevDisabled = offset <= 0 ? ' disabled' : '';
        var nextDisabled = (offset + PAGE_SIZE) >= total ? ' disabled' : '';
        var pagination =
          '<div class="vigan-table-preview__pagination">' +
          '<span class="vigan-table-preview__page-info">Page ' +
            Math.ceil((offset + 1) / PAGE_SIZE) + ' of ' + Math.max(1, Math.ceil(total / PAGE_SIZE)) +
          '</span>' +
          '<div class="vigan-table-preview__page-btns">' +
          '<button class="vigan-table-preview__page-btn" id="vigan-table-prev"' + prevDisabled + '>&larr; Previous</button>' +
          '<button class="vigan-table-preview__page-btn" id="vigan-table-next"' + nextDisabled + '>Next &rarr;</button>' +
          '</div>' +
          '</div>';

        tablePane.innerHTML =
          countHtml +
          '<div class="vigan-table-preview__wrap">' +
          '<table class="vigan-table-preview__table">' + thead + tbody + '</table>' +
          '</div>' +
          pagination;

        var prevBtn = document.getElementById("vigan-table-prev");
        var nextBtn = document.getElementById("vigan-table-next");

        if (prevBtn) {
          prevBtn.addEventListener("click", function () {
            if (currentOffset > 0) {
              currentOffset = Math.max(0, currentOffset - PAGE_SIZE);
              loadPage(currentOffset);
            }
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener("click", function () {
            if (currentOffset + PAGE_SIZE < total) {
              currentOffset = currentOffset + PAGE_SIZE;
              loadPage(currentOffset);
            }
          });
        }

        var searchInput = document.getElementById("vigan-table-search");
        if (searchInput) {
          searchInput.addEventListener("input", function () {
            clearTimeout(searchTimer);
            var q = searchInput.value.trim();
            searchTimer = setTimeout(function () {
              currentQuery  = q;
              currentOffset = 0;
              loadPage(0);
            }, 350);
          });
          if (window.innerWidth > 768) {
            searchInput.focus();
          }
        }
      }

      // ── Load a page ─────────────────────────────────────────────────────────
      function loadPage(offset) {
        tablePane.innerHTML = '<div class="vigan-resource-preview__loading">Loading&hellip;</div>';
        fetchRecords(offset, currentQuery)
          .then(function (result) {
            allFields    = result.fields   || [];
            lastRecords  = result.records  || [];
            totalRecords = result.total    || 0;
            renderTablePane(allFields, lastRecords, totalRecords, offset);
          })
          .catch(function (err) {
            tablePane.innerHTML =
              '<div class="vigan-resource-preview__error">Could not load data: ' +
              escapeHtml(err.message) + '</div>';
          });
      }

      loadPage(0);

      // ════════════════════════════════════════════════════════════════════════
      //  CHART PREVIEW (lazy — only init when Chart tab is first activated)
      // ════════════════════════════════════════════════════════════════════════

      function initChartPreview(fields, records) {
        chartPane.innerHTML = '<div class="vigan-resource-preview__loading">Loading chart&hellip;</div>';

        if (!fields || fields.length === 0 || !records || records.length === 0) {
          chartPane.innerHTML = '<div class="vigan-resource-preview__error">No data available to chart.</div>';
          return;
        }

        var colNames = fields
          .filter(function (f) { return f.id !== "_id"; })
          .map(function (f) { return f.id; });

        function isNumericCol(name) {
          var sample  = records.slice(0, 20);
          var numeric = 0;
          sample.forEach(function (row) {
            var v = row[name];
            if (v !== null && v !== undefined && v !== "" && !isNaN(parseFloat(v))) {
              numeric += 1;
            }
          });
          return numeric >= Math.ceil(sample.length * 0.6);
        }

        var numericCols = colNames.filter(isNumericCol);
        var defaultX    = colNames[0]     || "";
        var defaultY    = numericCols[0]  || colNames[1] || "";

        ensureChartJs().then(function (Chart) {

          var xOptions = colNames.map(function (c) {
            return '<option value="' + escapeHtml(c) + '"' + (c === defaultX ? ' selected' : '') + '>' + escapeHtml(c) + '</option>';
          }).join('');

          var yOptions = (numericCols.length > 0 ? numericCols : colNames).map(function (c) {
            return '<option value="' + escapeHtml(c) + '"' + (c === defaultY ? ' selected' : '') + '>' + escapeHtml(c) + '</option>';
          }).join('');

          chartPane.innerHTML =
            '<div class="vigan-chart-preview__controls">' +
              '<div class="vigan-chart-preview__control-group">' +
                '<label class="vigan-chart-preview__label" for="vigan-chart-type">Type</label>' +
                '<select class="vigan-chart-preview__select" id="vigan-chart-type">' +
                  '<option value="bar" selected>Bar</option>' +
                  '<option value="line">Line</option>' +
                '</select>' +
              '</div>' +
              '<div class="vigan-chart-preview__control-group">' +
                '<label class="vigan-chart-preview__label" for="vigan-chart-x">X axis</label>' +
                '<select class="vigan-chart-preview__select" id="vigan-chart-x">' + xOptions + '</select>' +
              '</div>' +
              '<div class="vigan-chart-preview__control-group">' +
                '<label class="vigan-chart-preview__label" for="vigan-chart-y">Y axis</label>' +
                '<select class="vigan-chart-preview__select" id="vigan-chart-y">' + yOptions + '</select>' +
              '</div>' +
            '</div>' +
            '<div class="vigan-chart-preview__canvas-wrap">' +
              '<canvas class="vigan-chart-preview__canvas" id="vigan-chart-canvas" aria-label="Data chart"></canvas>' +
            '</div>';

          var typeSelect = document.getElementById("vigan-chart-type");
          var xSelect    = document.getElementById("vigan-chart-x");
          var ySelect    = document.getElementById("vigan-chart-y");
          var canvas     = document.getElementById("vigan-chart-canvas");
          var chartInst  = null;

          var style    = getComputedStyle(document.documentElement);
          var primary  = (style.getPropertyValue("--vig-primary")   || "#0D4A2F").trim();
          var accent   = (style.getPropertyValue("--vig-accent")    || "#2DB87A").trim();
          var primary2 = (style.getPropertyValue("--vig-primary-2") || "#1A7A4A").trim();

          function hexToRgba(hex, alpha) {
            var r = parseInt(hex.slice(1, 3), 16);
            var g = parseInt(hex.slice(3, 5), 16);
            var b = parseInt(hex.slice(5, 7), 16);
            return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
          }

          function buildChart() {
            var xCol      = xSelect.value;
            var yCol      = ySelect.value;
            var chartType = typeSelect.value;
            var dataRows  = records.slice(0, 200);
            var isLine    = chartType === "line";

            var labels = dataRows.map(function (row) {
              var v = row[xCol];
              return v === null || v === undefined ? "" : String(v);
            });
            var values = dataRows.map(function (row) {
              var n = parseFloat(row[yCol]);
              return isNaN(n) ? 0 : n;
            });

            var dataset = {
              label: yCol,
              data: values,
              backgroundColor: isLine ? hexToRgba(accent, 0.18)  : hexToRgba(accent, 0.76),
              borderColor:     isLine ? accent                    : primary2,
              borderWidth:     isLine ? 2 : 1,
              borderRadius:    isLine ? 0 : 6,
              fill:            isLine,
              tension:         0.38,
              pointBackgroundColor: accent,
              pointRadius: isLine ? (dataRows.length > 60 ? 2 : 4) : 0
            };

            if (chartInst) { chartInst.destroy(); }

            chartInst = new Chart(canvas, {
              type: chartType,
              data: { labels: labels, datasets: [dataset] },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 280 },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: primary,
                    titleColor: "#fff",
                    bodyColor: "rgba(255,255,255,0.88)",
                    cornerRadius: 10,
                    padding: 10,
                    callbacks: {
                      title: function (items) {
                        return items[0] ? String(items[0].label).slice(0, 48) : "";
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: primary, font: { size: 11 },
                      maxRotation: 40, autoSkip: true, maxTicksLimit: 18
                    },
                    grid: { color: "rgba(13,74,47,0.07)" }
                  },
                  y: {
                    ticks: { color: primary, font: { size: 11 } },
                    grid: { color: "rgba(13,74,47,0.07)" }
                  }
                }
              }
            });
          }

          buildChart();

          [typeSelect, xSelect, ySelect].forEach(function (sel) {
            sel.addEventListener("change", buildChart);
          });

          if (typeof ResizeObserver !== "undefined") {
            var ro = new ResizeObserver(function () {
              if (chartInst) { chartInst.resize(); }
            });
            ro.observe(canvas.parentElement);
          } else {
            window.addEventListener("resize", function () {
              if (chartInst) { chartInst.resize(); }
            }, { passive: true });
          }

        }).catch(function (err) {
          chartPane.innerHTML =
            '<div class="vigan-resource-preview__error">Chart could not be loaded: ' +
            escapeHtml(err.message) + '</div>';
        });
      }

      return; // Table/chart handled — stop here
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  GeoJSON + Raw document previews
    // ════════════════════════════════════════════════════════════════════════════

    if (!resourceUrl) {
      return;
    }

    function setError(message) {
      preview.innerHTML = '<div class="vigan-resource-preview__error">' + message + "</div>";
    }

    function formatXml(xml) {
      var formatted = "";
      var xmlText = xml.replace(/(>)(<)(\/*)]/g, "$1\r\n$2$3");
      var pad = 0;
      xmlText.split("\r\n").forEach(function (node) {
        var indent = 0;
        if (/^<\/\w/.test(node)) {
          if (pad > 0) { pad -= 1; }
        } else if (/^<[^!?][^>]*[^/]>/.test(node) && !/<\/\w/.test(node)) {
          indent = 1;
        }
        formatted += new Array(pad + 1).join("  ") + node + "\n";
        pad += indent;
      });
      return formatted.trim();
    }

    function featureCount(geojson) {
      if (!geojson) { return 0; }
      if (geojson.type === "FeatureCollection") { return geojson.features.length; }
      return 1;
    }

    function collectCoordinates(node, coords) {
      if (!node) { return; }
      if (typeof node[0] === "number" && typeof node[1] === "number") { coords.push(node); return; }
      for (var i = 0; i < node.length; i += 1) { collectCoordinates(node[i], coords); }
    }

    function featureToSvgPath(geometry, bounds, width, height, padding) {
      if (!geometry || !geometry.coordinates) { return ""; }

      function project(coord) {
        var spanX   = Math.max(bounds.maxX - bounds.minX, 1e-9);
        var spanY   = Math.max(bounds.maxY - bounds.minY, 1e-9);
        var scale   = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY);
        var offsetX = (width  - spanX * scale) / 2;
        var offsetY = (height - spanY * scale) / 2;
        return {
          x: (coord[0] - bounds.minX) * scale + offsetX,
          y: height - ((coord[1] - bounds.minY) * scale + offsetY)
        };
      }

      function ringToPath(ring) {
        return ring.map(function (c, i) {
          var p = project(c);
          return (i === 0 ? "M" : "L") + p.x.toFixed(2) + " " + p.y.toFixed(2);
        }).join(" ") + " Z";
      }

      function lineToPath(line) {
        return line.map(function (c, i) {
          var p = project(c);
          return (i === 0 ? "M" : "L") + p.x.toFixed(2) + " " + p.y.toFixed(2);
        }).join(" ");
      }

      switch (geometry.type) {
        case "Point": {
          var pt = project(geometry.coordinates);
          return '<circle cx="' + pt.x.toFixed(2) + '" cy="' + pt.y.toFixed(2) + '" r="4"></circle>';
        }
        case "MultiPoint":
          return geometry.coordinates.map(function (c) {
            var p = project(c);
            return '<circle cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="3"></circle>';
          }).join("");
        case "LineString":
          return '<path d="' + lineToPath(geometry.coordinates) + '" fill="none"></path>';
        case "MultiLineString":
          return geometry.coordinates.map(function (l) {
            return '<path d="' + lineToPath(l) + '" fill="none"></path>';
          }).join("");
        case "Polygon":
          return geometry.coordinates.map(function (r) {
            return '<path d="' + ringToPath(r) + '"></path>';
          }).join("");
        case "MultiPolygon":
          return geometry.coordinates.map(function (polygon) {
            return polygon.map(function (r) {
              return '<path d="' + ringToPath(r) + '"></path>';
            }).join("");
          }).join("");
        default:
          return "";
      }
    }

    function renderGeoJsonFallback(geojson) {
      var mapEl     = preview.querySelector("[data-vigan-geojson-map]");
      var summaryEl = preview.querySelector("[data-vigan-geojson-summary]");
      if (!mapEl) { return; }

      var features = geojson.type === "FeatureCollection"
        ? geojson.features
        : [geojson.type === "Feature" ? geojson : { type: "Feature", geometry: geojson, properties: {} }];
      var coords = [];
      features.forEach(function (f) {
        if (f && f.geometry) { collectCoordinates(f.geometry.coordinates, coords); }
      });

      if (!coords.length) { setError("GeoJSON loaded, but no renderable coordinates were found."); return; }

      var bounds = {
        minX: Math.min.apply(null, coords.map(function (c) { return c[0]; })),
        maxX: Math.max.apply(null, coords.map(function (c) { return c[0]; })),
        minY: Math.min.apply(null, coords.map(function (c) { return c[1]; })),
        maxY: Math.max.apply(null, coords.map(function (c) { return c[1]; }))
      };

      var svg = features.map(function (f) {
        return featureToSvgPath(f.geometry, bounds, 880, 420, 36);
      }).join("");

      mapEl.innerHTML =
        '<svg viewBox="0 0 880 420" class="vigan-geojson-preview__svg" role="img" aria-label="GeoJSON preview map" preserveAspectRatio="xMidYMid meet">' +
        '<rect x="0" y="0" width="880" height="420" rx="18" ry="18"></rect>' +
        '<g class="vigan-geojson-preview__grid">' +
        '<line x1="220" y1="0" x2="220" y2="420"></line>' +
        '<line x1="440" y1="0" x2="440" y2="420"></line>' +
        '<line x1="660" y1="0" x2="660" y2="420"></line>' +
        '<line x1="0" y1="105" x2="880" y2="105"></line>' +
        '<line x1="0" y1="210" x2="880" y2="210"></line>' +
        '<line x1="0" y1="315" x2="880" y2="315"></line>' +
        '</g>' +
        '<g class="vigan-geojson-preview__layer">' + svg + '</g>' +
        '</svg>';

      if (summaryEl) {
        summaryEl.hidden = false;
        summaryEl.innerHTML =
          '<span><strong>Features:</strong> ' + featureCount(geojson) + '</span>' +
          '<span><strong>Bounds:</strong> ' +
          bounds.minX.toFixed(5) + ', ' + bounds.minY.toFixed(5) +
          ' to ' + bounds.maxX.toFixed(5) + ', ' + bounds.maxY.toFixed(5) + '</span>';
      }
    }

    function renderGeoJsonLeaflet(geojson) {
      var mapEl     = preview.querySelector("[data-vigan-geojson-map]");
      var summaryEl = preview.querySelector("[data-vigan-geojson-summary]");
      if (!mapEl) { return Promise.resolve(); }

      return ensureLeaflet().then(function (L) {
        mapEl.innerHTML = "";
        var map = L.map(mapEl, { scrollWheelZoom: true, attributionControl: true });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          subdomains: "abcd",
          maxZoom: 20,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        var layer = L.geoJSON(geojson, {
          style: function () {
            return { color: "#0D6B43", weight: 2, fillColor: "#2DB87A", fillOpacity: 0.28 };
          },
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 6, color: "#06452B", weight: 2, fillColor: "#16A765", fillOpacity: 0.95
            });
          },
          onEachFeature: function (feature, featureLayer) {
            var properties = feature && feature.properties ? feature.properties : {};
            var entries = Object.keys(properties).slice(0, 8).map(function (key) {
              return "<div><strong>" + escapeHtml(String(key)) + ":</strong> " +
                escapeHtml(String(properties[key])) + "</div>";
            });
            if (entries.length) { featureLayer.bindPopup(entries.join("")); }
          }
        }).addTo(map);

        var layerBounds = layer.getBounds();
        if (layerBounds.isValid()) {
          map.fitBounds(layerBounds, { padding: [24, 24] });
        } else {
          map.setView([17.574, 120.386], 13);
        }
        window.setTimeout(function () { map.invalidateSize(); }, 0);
        mapEl._viganLeafletMap = map;

        if (summaryEl && layerBounds.isValid()) {
          var sw = layerBounds.getSouthWest();
          var ne = layerBounds.getNorthEast();
          summaryEl.hidden = false;
          summaryEl.innerHTML =
            '<span><strong>Features:</strong> ' + featureCount(geojson) + '</span>' +
            '<span><strong>Bounds:</strong> ' +
            sw.lng.toFixed(5) + ', ' + sw.lat.toFixed(5) +
            ' to ' + ne.lng.toFixed(5) + ', ' + ne.lat.toFixed(5) + '</span>';
        }
      });
    }

    function setupMapActions() {
      var mapEl = preview.querySelector("[data-vigan-geojson-map]");
      var fullscreenButton = preview.querySelector("[data-vigan-map-fullscreen]");
      var embedButton = preview.querySelector("[data-vigan-map-embed]");
      var statusEl = preview.querySelector("[data-vigan-map-status]");
      if (!mapEl) { return; }

      function showStatus(message) {
        if (!statusEl) { return; }
        statusEl.textContent = message;
        window.clearTimeout(statusEl._viganStatusTimer);
        statusEl._viganStatusTimer = window.setTimeout(function () {
          statusEl.textContent = "";
        }, 2200);
      }

      function fullscreenTarget() {
        return document.fullscreenElement || document.webkitFullscreenElement || null;
      }

      function requestFullscreen(element) {
        if (element.requestFullscreen) { return element.requestFullscreen(); }
        if (element.webkitRequestFullscreen) { return element.webkitRequestFullscreen(); }
        return Promise.reject(new Error("Fullscreen is not supported by this browser."));
      }

      function exitFullscreen() {
        if (document.exitFullscreen) { return document.exitFullscreen(); }
        if (document.webkitExitFullscreen) { return document.webkitExitFullscreen(); }
        return Promise.resolve();
      }

      function refreshMapSize() {
        window.setTimeout(function () {
          if (mapEl._viganLeafletMap && mapEl._viganLeafletMap.invalidateSize) {
            mapEl._viganLeafletMap.invalidateSize();
          }
        }, 120);
      }

      if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function () {
          var action = fullscreenTarget() === mapEl ? exitFullscreen() : requestFullscreen(mapEl);
          action.then(refreshMapSize).catch(function (error) {
            showStatus(error.message || "Fullscreen could not be opened.");
          });
        });

        document.addEventListener("fullscreenchange", refreshMapSize);
        document.addEventListener("webkitfullscreenchange", refreshMapSize);
      }

      if (embedButton) {
        embedButton.addEventListener("click", function () {
          var embedPanel = preview.querySelector("[data-vigan-map-embed-panel]");
          var embedField = preview.querySelector("[data-vigan-map-embed-code]");
          var embedUrl = new URL(window.location.href);
          embedUrl.searchParams.set("embed", "1");
          if (embedUrl.pathname.indexOf("/api/ckan-proxy/") !== -1) {
            embedUrl.searchParams.set("vigan_frame", "1");
          }

          var embedCode = '<iframe src="' + embedUrl.toString() + '" width="100%" height="720" style="border:0;" allowfullscreen loading="lazy"></iframe>';
          if (embedPanel) { embedPanel.hidden = false; }
          if (embedField) {
            embedField.value = embedCode;
            embedField.focus();
            embedField.select();
          }

          function copied() { showStatus("Embed code copied"); }
          function manualCopy() { showStatus("Embed code ready to copy"); }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(embedCode).then(copied).catch(function () {
              try {
                if (embedField && document.execCommand("copy")) { copied(); return; }
              } catch (e) {}
              manualCopy();
            });
            return;
          }

          try {
            if (embedField && document.execCommand("copy")) { copied(); return; }
          } catch (e) {}
          manualCopy();
        });
      }
    }
    function renderRawDocument(text) {
      var pre        = preview.querySelector("[data-vigan-raw-preview]");
      var copyButton = preview.querySelector("[data-vigan-copy-preview]");
      if (!pre) { return; }

      var output = text;
      if (resourceFormat.indexOf("json") !== -1 || /\.json$/i.test(resourceUrl)) {
        try { output = JSON.stringify(JSON.parse(text), null, 2); } catch (e) { output = text; }
      } else if (resourceFormat.indexOf("xml") !== -1 || /\.xml$/i.test(resourceUrl)) {
        output = formatXml(text);
      }
      pre.innerHTML = escapeHtml(output);

      if (copyButton) {
        copyButton.addEventListener("click", function () {
          navigator.clipboard.writeText(output).then(function () {
            var original = copyButton.textContent;
            copyButton.textContent = "Copied";
            window.setTimeout(function () { copyButton.textContent = original; }, 1500);
          });
        });
      }
    }

    fetch(resourceUrl, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) { throw new Error("Preview request failed with status " + response.status); }
        return previewType === "geojson" ? response.json() : response.text();
      })
      .then(function (data) {
        if (previewType === "geojson") {
          setupMapActions();
          renderGeoJsonFallback(data);
          renderGeoJsonLeaflet(data).catch(function () { return null; });
          return;
        }
        renderRawDocument(data);
      })
      .catch(function (error) {
        setError("Preview could not be loaded: " + error.message);
      });
  });

})();
