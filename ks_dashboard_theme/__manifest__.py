# -*- coding: utf-8 -*-
{
    'name': 'Dashboard Ninja Theme',

    'summary': """
       Dashboard Ninja Theme

        Make Informed & Rewarding Decisions With Dashboard Ninja Theme
        
        Transform your most valuable information into a powerful decision-making report with customized dashboard themes. Make business analytics details stand out with different color palettes using the Dashboard Ninja Theme application. 
        
        Dashboard Ninja Theme is a module of the Dashboard Ninja App for Odoo. It helps a user to customize and enhance the look and feel of the dashboard and its items (Tiles/KPIs, and Charts). 
        
        Modify specific graphic aspects of your reports and dashboards to make them look professional and unique using different color patterns. Switch from light to dark mode as per your comfort while working.
        
        Create effective business stories with customized dashboard themes to improvise data readability, productivity, and efficiency. 

    """,

    'description': """
        Dashboard Ninja Theme

            Make Informed & Rewarding Decisions With Dashboard Ninja Theme
            
            Transform your most valuable information into a powerful decision-making report with customized dashboard themes. Make business analytics details stand out with different color palettes using the Dashboard Ninja Theme application. 
            
            Dashboard Ninja Theme is a module of the Dashboard Ninja App for Odoo. It helps a user to customize and enhance the look and feel of the dashboard and its items (Tiles/KPIs, and Charts). 
            
            Modify specific graphic aspects of your reports and dashboards to make them look professional and unique using different color patterns. Switch from light to dark mode as per your comfort while working.
            
            Create effective business stories with customized dashboard themes to improvise data readability, productivity, and efficiency. 

""",

    'author': 'Ksolves India Ltd.',

    'license': 'OPL-1',

    'currency': 'EUR',

    'price': 39.2,

    'website': 'https://store.ksolves.com/',

    'maintainer': 'Ksolves India Ltd.',

    'live_test_url': 'https://dn15demo.kappso.com/web#cids=1&menu_id=599&ks_dashboard_id=135&action=975',

    'category': 'Tools',

    'version': '16.0.1.0.0',

    'support': 'sales@ksolves.com',

    'images': ['static/description/Spring sale horizontal Odoo Video.gif'],

    'depends': ['ks_dashboard_ninja'],

    'data': ['security/ir.model.access.csv', 'data/ks_theme_default_data.xml',
             'views/ks_dashboard_item_theme.xml',
             'views/ks_dashboard_ninja_item_view_inherit.xml'],

    'assets': {'web.assets_backend': ['ks_dashboard_ninja/static/lib/js/spectrum.js',
                                      'ks_dashboard_ninja/static/lib/css/spectrum.css',
        'ks_dashboard_theme/static/src/scss/ks_dn_background.scss',
                                      'ks_dashboard_theme/static/src/css/ks_dn_theme.css',
                                      'ks_dashboard_theme/static/src/js/ks_dashboard_item_gradient_theme.js',
                                      'ks_dashboard_theme/static/src/js/ks_theme_color_picker.js',
                                      'ks_dashboard_theme/static/src/js/ks_dn_theme.js',
                                      'ks_dashboard_theme/static/src/js/ks_int_slider.js',
                                      'ks_dashboard_theme/static/src/js/ks_dashboard_gradient_view.js',
                                      'ks_dashboard_theme/static/src/js/chart_view.js',
                                      'ks_dashboard_theme/static/src/js/Ks_theme_graph_view.js',
                                      'ks_dashboard_theme/static/src/xml/**/*',],
               'web.assets_frontend': [],
               },

    # 'uninstall_hook': 'ks_dna_uninstall_hook',
}
