"""
ckanext.vigan.plugin
~~~~~~~~~~~~~~~~~~~~
Vigan City Open Data Portal — CKAN Theme Extension

Implements:
  - IConfigurer  : register templates, static files, fanstatic resources
  - ITemplateHelpers : expose custom Jinja2 helpers to templates
"""

import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit


class ViganPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.ITemplateHelpers)

    # ──────────────────────────────────────────────────────────────────────────
    # IConfigurer
    # ──────────────────────────────────────────────────────────────────────────

    def update_config(self, config_):
        """Register the extension's templates, public assets, and fanstatic."""
        # Jinja2 template overrides (searched before CKAN's own templates)
        toolkit.add_template_directory(config_, "templates")

        # Static files: CSS, JS, images (served at /vigan-static/...)
        toolkit.add_public_directory(config_, "public")

        # Fanstatic resource library for minification / bundling
        toolkit.add_resource("fanstatic", "vigan")

    # ──────────────────────────────────────────────────────────────────────────
    # ITemplateHelpers
    # ──────────────────────────────────────────────────────────────────────────

    def get_helpers(self):
        """Expose helper functions to Jinja2 templates via h.* namespace."""
        return {
            "vigan_site_title": _site_title,
            "vigan_year": _current_year,
            "vigan_departments": _department_list,
        }


# ── Helper implementations ─────────────────────────────────────────────────────

def _site_title():
    return toolkit.config.get(
        "ckan.site_title", "Vigan City Open Data Portal"
    )


def _current_year():
    import datetime
    return datetime.datetime.now().year


def _department_list():
    """Return the canonical list of Vigan City departments."""
    return [
        {
            "id": "city-planning",
            "name": "City Planning & Development Office",
            "short": "CPDO",
            "icon": "🏛️",
            "color": "#065F46",
        },
        {
            "id": "tourism-office",
            "name": "Vigan City Tourism Office",
            "short": "Tourism",
            "icon": "🏺",
            "color": "#047857",
        },
        {
            "id": "drrmo",
            "name": "Disaster Risk Reduction & Management Office",
            "short": "DRRMO",
            "icon": "🛡️",
            "color": "#065F46",
        },
        {
            "id": "city-health",
            "name": "City Health Office",
            "short": "CHO",
            "icon": "🏥",
            "color": "#047857",
        },
        {
            "id": "business-permits",
            "name": "Business Permits & Licensing Office",
            "short": "BPLO",
            "icon": "📋",
            "color": "#065F46",
        },
        {
            "id": "city-budget",
            "name": "City Budget Office",
            "short": "CBO",
            "icon": "💰",
            "color": "#047857",
        },
        {
            "id": "cenro",
            "name": "City Environment & Natural Resources Office",
            "short": "CENRO",
            "icon": "🌿",
            "color": "#065F46",
        },
    ]
