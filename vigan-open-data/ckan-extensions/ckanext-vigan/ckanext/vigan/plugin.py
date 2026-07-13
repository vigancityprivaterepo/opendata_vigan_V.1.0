"""
ckanext.vigan.plugin
~~~~~~~~~~~~~~~~~~~~
Vigan City Open Data Portal — CKAN Theme Extension

Implements:
  - IConfigurer  : register templates, static files, fanstatic resources
  - ITemplateHelpers : expose custom Jinja2 helpers to templates
"""

import os

import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from ckan import model
from sqlalchemy import text

READ_ONLY_BLOCKED_ACTIONS = (
    "package_create",
    "package_update",
    "package_patch",
    "package_delete",
    "package_relationship_create",
    "package_relationship_delete",
    "package_owner_org_update",
    "resource_create",
    "resource_update",
    "resource_patch",
    "resource_delete",
    "organization_create",
    "organization_update",
    "organization_patch",
    "organization_delete",
    "group_create",
    "group_update",
    "group_patch",
    "group_delete",
    "member_create",
    "member_delete",
    "tag_create",
    "tag_delete",
)


class ViganPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IConfigurable)
    plugins.implements(plugins.ITemplateHelpers)
    plugins.implements(plugins.IAuthFunctions)
    plugins.implements(plugins.IActions)

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

    def configure(self, config_):
        """Keep Vigan templates ahead of plugin templates loaded later."""
        _promote_vigan_template_path(config_)

    # ──────────────────────────────────────────────────────────────────────────
    # ITemplateHelpers
    # ──────────────────────────────────────────────────────────────────────────

    def get_helpers(self):
        """Expose helper functions to Jinja2 templates via h.* namespace."""
        return {
            "vigan_site_title": _site_title,
            "vigan_year": _current_year,
            "vigan_departments": _department_list,
            "vigan_is_embedded": _is_embedded_request,
            "get_action": _get_action,
        }

    def get_auth_functions(self):
        """Keep the public Action API read-only while preserving web UI access."""
        auth_functions = {
            action_name: _build_read_only_auth(action_name)
            for action_name in READ_ONLY_BLOCKED_ACTIONS
        }
        auth_functions["vigan_total_downloads"] = _public_action_auth
        auth_functions["vigan_record_download"] = _public_action_auth
        return auth_functions

    def get_actions(self):
        return {
            "vigan_total_downloads": vigan_total_downloads,
            "vigan_record_download": vigan_record_download,
        }


# ── Helper implementations ─────────────────────────────────────────────────────


def _vigan_template_path():
    return os.path.join(os.path.dirname(__file__), "templates")


def _promote_path(paths, target):
    return [target] + [path for path in paths if path != target]


def _promote_vigan_template_path(config_):
    template_path = _vigan_template_path()
    config_["plugin_template_paths"] = _promote_path(
        config_.get("plugin_template_paths", []),
        template_path,
    )

    computed_paths = config_.get("computed_template_paths")
    if computed_paths:
        config_["computed_template_paths"] = _promote_path(
            computed_paths,
            template_path,
        )

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


def _is_embedded_request():
    try:
        return (
            toolkit.request.headers.get("X-Vigan-Embed") == "1"
            or toolkit.request.params.get("embed") == "1"
        )
    except Exception:
        return False


def _get_action(action_name):
    """Wrapper helper to call CKAN action functions from templates."""
    action = toolkit.get_action(action_name)
    def _call_action(data_dict=None):
        if data_dict is None:
            data_dict = {}
        context = {
            'model': model,
            'session': model.Session,
        }
        try:
            if hasattr(toolkit, 'c') and toolkit.c:
                context['user'] = getattr(toolkit.c, 'user', None)
                context['auth_user_obj'] = getattr(toolkit.c, 'userobj', None)
        except Exception:
            pass

        try:
            if hasattr(toolkit, 'g') and toolkit.g:
                if 'user' not in context or not context['user']:
                    context['user'] = getattr(toolkit.g, 'user', None)
                if 'auth_user_obj' not in context or not context['auth_user_obj']:
                    context['auth_user_obj'] = getattr(toolkit.g, 'userobj', None)
        except Exception:
            pass

        return action(context, data_dict)
    return _call_action


def _is_action_api_request():
    try:
        return toolkit.request.path.startswith("/api/3/action/")
    except Exception:
        return False


def _build_read_only_auth(action_name):
    @toolkit.auth_sysadmins_check
    @toolkit.chained_auth_function
    def _read_only_auth(next_auth, context, data_dict=None):
        if _is_action_api_request():
            return {
                "success": False,
                "msg": (
                    "The Vigan City Open Data Portal API is read-only. "
                    f"The action '{action_name}' is not available through /api/3/action/."
                ),
            }

        return next_auth(context, data_dict)

    return _read_only_auth


def _public_action_auth(context, data_dict=None):
    return {"success": True}


def _ensure_download_counter_table():
    model.Session.execute(text("""
        CREATE TABLE IF NOT EXISTS vigan_download_counts (
            resource_id TEXT PRIMARY KEY,
            download_count INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """))
    model.Session.commit()


def vigan_record_download(context, data_dict=None):
    """Increment the persisted download counter for a resource."""
    resource_id = toolkit.get_or_bust(data_dict or {}, "resource_id")
    _ensure_download_counter_table()
    model.Session.execute(
        text("""
            INSERT INTO vigan_download_counts (resource_id, download_count, updated_at)
            VALUES (:resource_id, 1, CURRENT_TIMESTAMP)
            ON CONFLICT (resource_id)
            DO UPDATE SET
                download_count = vigan_download_counts.download_count + 1,
                updated_at = CURRENT_TIMESTAMP
        """),
        {"resource_id": resource_id},
    )
    model.Session.commit()
    return {"success": True, "resource_id": resource_id}


def vigan_total_downloads(context, data_dict=None):
    """Return the aggregate total portal download count."""
    _ensure_download_counter_table()
    result = model.Session.execute(
        text("SELECT COALESCE(SUM(download_count), 0) AS total_downloads FROM vigan_download_counts")
    ).scalar()
    model.Session.commit()
    return int(result or 0)
