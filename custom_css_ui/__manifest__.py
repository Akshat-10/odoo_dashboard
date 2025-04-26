{
    'name': 'Custom UI',
    'version': '16.0.1.0',
    'category': 'Website',
    'summary': 'For Frontent UI',
    'description': """""",
    'author': 'ASD',
    'price': 0,
    'license': 'LGPL-3',
    'sequence': 1,
    'currency': "INR",
    'website': 'https://asdsoftwares.com/',
    'depends': ['web'],
    "assets": {
        "web.assets_backend": [
            "custom_css_ui/static/src/css/custom_styles.css",
        ],
        # Or use "web.assets_frontend" for public website
    },
    'installable': True,
    'auto_install': False,
    'application': True,
}
