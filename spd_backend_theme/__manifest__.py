{
    "name" : "Backend theme in Odoo16",
    "version" : "16.0.0.1",
    "category" : "theme",
    'summary': 'Change backend colors',
    "description": """
    This module for changing backend colors
    """,
    "depends" : ['base'],
    'assets': {
        'web.assets_backend': [
            'spd_backend_theme/static/src/css/backend.css',
        ],
    },
    'qweb': [],
    'author': 'SPD Solutions Pvt. Ltd.',
    'company': 'SPD Solutions Pvt. Ltd.',
    'maintainer': 'SPD Solutions Pvt. Ltd.',
    'license':'LGPL-3',
    'images': ["static/description/banner.png"],
    "auto_install": False,
    "installable": True,
}
