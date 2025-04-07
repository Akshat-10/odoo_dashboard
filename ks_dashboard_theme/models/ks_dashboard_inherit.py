# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
import json


class KsDashboardNinjaTheme(models.Model):
    _inherit = 'ks_dashboard_ninja.item'

    def get_default(self):
        try:
            if self.ks_chart_item_color:
                return self.env.ref("ks_dashboard_theme.ks_chart_theme_" + self.ks_chart_item_color)
            elif self.env.ref("ks_dashboard_theme.ks_chart_theme_default"):
                return self.env.ref("ks_dashboard_theme.ks_chart_theme_default")
        except Exception as e:
            return False

    # ks_chart_item_theme = fields.Char(string='Chart Theme')
    ks_chart_theme_type = fields.Selection(related='ks_chart_theme_id.ks_chart_theme_type', string='Theme Style')
    ks_chart_item_theme_type = fields.Selection([('pallet', 'Pallet'),
                                                 ('theme', 'Theme')], string='Chart Theme Type', default='theme')
    ks_chart_theme_id = fields.Many2one('ks_dashboard_ninja.theme',
                                        domain="[('ks_theme_item_type', '=', 'charts')]", string='Chart Color Palette',
                                        default=get_default)
    ks_chart_theme_data = fields.Char(related='ks_chart_theme_id.ks_theme_color_picker')
    ks_chart_theme_int_id = fields.Integer(related='ks_chart_theme_id.id')

    # ks_tile_ids= fields.Many2many('ks_dashboard_ninja.theme',domain="[('ks_theme_item_type', '=', 'tile_kpi')]")
    # ks_code= fields.Char(string="code",compute='_compute_tile_code',store=True)

    # @api.onchange('ks_tile_ids')
    # @api.depends('ks_tile_ids')
    # def _compute_tile_code(self):
    #     code=[]
    #     value= self.env['ks_dashboard_ninja.theme'].search([('ks_theme_item_type', '=', 'tile_kpi')]).ids
    #     for i in value:
    #         code.append(self.env['ks_dashboard_ninja.theme'].search([('ks_theme_item_type', '=', 'tile_kpi')]).browse(i).ks_theme_color_code)
    #     self.ks_code=json.dumps(code)



class KsDashboardNinjaThemeBoard(models.Model):
    _inherit = 'ks_dashboard_ninja.board'

    ks_dark_mode_enable = fields.Boolean("Dark Mode", default=False)

    ks_header_background_color = fields.Char(string='Header Background Color', default='#ffffff')
    ks_dashboard_background_color = fields.Char(string='Dashboard Background Color', default='#ffffff')
    ks_item_background_color = fields.Char(string='Item Background Color', default='#ffffff')
    ks_font_background_color = fields.Char(string='Font Color', default='#000000')

    def ks_fetch_item_data(self, rec, params={}):
        item = super(KsDashboardNinjaThemeBoard, self).ks_fetch_item_data(rec, params)
        item.update({
            'background_image_gradient': rec.ks_dashboard_item_theme,
            'ks_chart_item_theme_type': rec.ks_chart_item_theme_type,
            'ks_chart_theme_type': rec.ks_chart_theme_type,
            'ks_chart_theme_data': rec.ks_chart_theme_data,
            'ks_chart_theme_int_id': rec.ks_chart_theme_int_id,
        })
        return item

    @api.model
    def ks_fetch_dashboard_data(self, ks_dashboard_id, ks_item_domain=False):
        dashboard_data = super(KsDashboardNinjaThemeBoard, self).ks_fetch_dashboard_data(ks_dashboard_id, ks_item_domain=ks_item_domain)
        ks_dashboard_rec = self.browse(ks_dashboard_id)
        # dashboard_data['ks_dark_mode_enable'] = ks_dashboard_rec.ks_dark_mode_enable
        dashboard_data.update({
            'ks_dark_mode_enable': ks_dashboard_rec.ks_dark_mode_enable,
            'ks_header_background_color': ks_dashboard_rec.ks_header_background_color,
            'ks_dashboard_background_color': ks_dashboard_rec.ks_dashboard_background_color,
            'ks_item_background_color': ks_dashboard_rec.ks_item_background_color,
            'ks_font_background_color': ks_dashboard_rec.ks_font_background_color,
        })
        return dashboard_data
