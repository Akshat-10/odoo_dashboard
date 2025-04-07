# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import json


class KsDashboardNinjaTheme(models.Model):
    _name = 'ks_dashboard_ninja.theme'
    _description = 'Dashboard Ninja Theme'

    @api.depends('ks_theme_color_picker')
    def _compute_gradient_color_code(self):
        for rec in self:
            if rec.ks_theme_item_type == 'charts' and rec.ks_theme_color_picker != '#ffffff,0.99':
                rec.ks_theme_color_code = rec.ks_theme_color_picker
            elif rec.ks_theme_item_type == 'tile_kpi' and rec.ks_theme_color_picker != '#ffffff,0.99':
                gradient_code = ''
                for i, color in enumerate(json.loads(rec.ks_theme_color_picker)):
                    if i < len(json.loads(rec.ks_theme_color_picker)) - 1:
                        gradient_code += color.split(',')[0] + ','
                    else:
                        gradient_code += color.split(',')[0]
                rec.ks_theme_color_code = 'linear-gradient(' + str(
                    rec.ks_gradient_slider) + 'deg,' + gradient_code + ')'
            else:
                rec.ks_theme_color_code = [
                    rec.ks_theme_color_picker] if rec.ks_theme_item_type == 'charts' else 'linear-gradient(' + str(
                    rec.ks_gradient_slider) + 'deg,' + rec.ks_theme_color_picker.split(',')[0] + ')'

    name = fields.Char(string="Name")
    ks_theme_item_type = fields.Selection([('tile_kpi', 'Tile/KPI'),
                                           ('charts', 'Charts')], string='Item Type', default='tile_kpi')
    ks_chart_theme_type = fields.Selection([('static', 'Fix Color Set'), ('gradient', 'Generated Color Set')],
                                           string='Theme Style', default='static')
    ks_theme_color_code = fields.Text(string='Color Code', compute='_compute_gradient_color_code', store=True)
    ks_theme_color_picker = fields.Char(string='Color Picker', default="#ffffff,0.99")
    ks_theme_gradient_view = fields.Char(string='Gradient Color View')
    ks_gradient_slider = fields.Integer(string='Gradient Angle Slider', default=180)
    ks_theme_chart_view = fields.Char(string='Chart View')
    # ks_tile_code =fields.Char(string="code",compute='_compute_gradient_tile_code',store=True)
    # ks_relation_id = fields.Many2one("ks_dashboard_ninja.item")
    ks_code=fields.Char(string="tile_image",compute='_compute_gradient_tile_code')

    _sql_constraints = [
        ('ks_theme_color_picker_unique', 'unique(ks_theme_color_picker, ks_theme_item_type)',
         "Similar theme already exists.")
    ]

    @api.constrains('ks_theme_color_picker')
    def _check_ks_theme_color_picker(self):
        for rec in self:
            if len(rec.ks_theme_color_picker) <= 16 and rec.ks_theme_item_type=='tile_kpi':
                raise ValidationError(_('Please select one more color to make gradient.'))

    @api.model
    def ks_set_chart_themes(self, item_id, chart_theme):
        theme = self.search([('name', '=', chart_theme)], limit=1)
        item = self.env['ks_dashboard_ninja.item'].browse(item_id)
        item.write({
            'ks_chart_theme_id': theme.id
        })

    @api.model
    def ks_fetch_chart_themes(self):
        chart_data = []
        chart_id = []
        chart_themes = self.search([('ks_theme_item_type', '=', 'charts')])
        for rec in chart_themes:
            chart_data.append(rec.name)
            chart_id.append(rec.id)
        return chart_data, chart_id

    @api.model
    def ks_fetch_gradient_code(self, type):
        gradient_code = []
        if type == 'chart':
            chart_theme = self.search([('ks_theme_item_type', '=', 'charts')])
            for rec in chart_theme:
                gradient_code.append(rec.ks_theme_color_code)
            return gradient_code
        elif type == 'tile_kpi':
            tile_kpi_theme = self.search([('ks_theme_item_type', '=', 'tile_kpi')])
            for rec in tile_kpi_theme:
                gradient_code.append(rec.ks_theme_color_code)
            return gradient_code

    @api.onchange('ks_theme_item_type','ks_gradient_slider','ks_theme_color_picker')
    @api.depends('ks_theme_item_type','ks_gradient_slider','ks_theme_color_picker')
    def _compute_gradient_tile_code(self):
        code=[]
        tile_kpi_theme = self.search([('ks_theme_item_type', '=', 'tile_kpi')])
        for rec in tile_kpi_theme:
            code.append(rec.ks_theme_color_code)
        self.ks_code=json.dumps(code)

    def unlink(self):
        default_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_default').id
        warm_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_warm').id
        cool_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_cool').id
        neon_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_neon').id
        if default_theme in self.ids or warm_theme in self.ids or cool_theme in self.ids or neon_theme in self.ids:
            raise ValidationError(_("Default Themes can't be deleted."))
        res = super(KsDashboardNinjaTheme, self).unlink()
        return res

    def write(self, vals):
        default_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_default').id
        warm_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_warm').id
        cool_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_cool').id
        neon_theme = self.env.ref('ks_dashboard_theme.ks_chart_theme_neon').id
        if default_theme in self.ids or warm_theme in self.ids or cool_theme in self.ids or neon_theme in self.ids:
            raise ValidationError(_("Default Themes can't be edited."))
        record = super(KsDashboardNinjaTheme, self).write(vals)
        return record
