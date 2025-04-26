# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Required Module Installer (ASD)',
    'version': '16.0.1.0.0',
    'sequence': 1,
    'summary': """
        Install all (depends) modules by one click 
    """,
    'description': "Install all (depends) modules by one click ",
    'author': 'Akshat Gupta',
    'maintainer': 'Akshat Gupta',
    'price': '100',
    'currency': 'IND',
    'license': 'LGPL-3',
    'depends': [
        'hide_powered_by_odoo', 'customize_title_header', 'legion_hide_odoo', 'login_bg_img_knk', 'widget_toggle_switch', 'asd_logo',
    ],
    'installable': True,
    'auto_install': True,
    'application': False,
}
