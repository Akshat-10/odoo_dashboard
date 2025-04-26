# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Asd Logo',
    'version': '16.0.1.0.0',
    'sequence': 1,
    'summary': """
        Add Asd Logo
    """,
    'description': "Asd Logo",
    'author': 'Akshat Gupta',
    'price': '0',
    'currency': 'IND',
    'website': 'https://asdsoftwares.com/',
    'license': 'LGPL-3',
    'images': [
        'static/description/icon/asd_logo.ico',
    ],
    'depends': [
        'web'
    ],
    'data': [
        'views/odoo_icon.xml',
        # 'views/database_manager_inherit.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': True,

}
