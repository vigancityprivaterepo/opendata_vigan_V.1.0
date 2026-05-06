# fanstatic — CKAN resource library registration
# This directory registers the Vigan extension's CSS/JS as a fanstatic resource
# so CKAN can handle bundling, minification, and cache-busting.
#
# The actual assets live in ../public/css/ and ../public/js/
# plugin.py registers this directory via:
#   toolkit.add_resource('fanstatic', 'vigan')
