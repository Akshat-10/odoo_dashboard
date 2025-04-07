# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import json


class KsDashboardNinjalive(models.Model):
    _inherit = 'ks_dashboard_ninja.board'

    ks_auto_update_type = fields.Selection(
        [('ks_live_update', 'Update at every change.'),
         ('ks_update_interval', 'Update after the selected interval')],
        string='Auto Update Type',
        default='ks_live_update',
        help='Select the update type.')
    ks_show_live_pop_up = fields.Boolean(string='Show Live Update Pop Up',
                                         help='Checkbox to enable notification after every update.')

    @api.model
    def ks_fetch_dashboard_data(self, ks_dashboard_id, ks_item_domain=False):
        dashboard_data = super(KsDashboardNinjalive, self).ks_fetch_dashboard_data(ks_dashboard_id, ks_item_domain)
        ks_dashboard_rec = self.browse(ks_dashboard_id)
        dashboard_data['ks_auto_update_type'] = ks_dashboard_rec.ks_auto_update_type
        dashboard_data['ks_show_live_pop_up'] = ks_dashboard_rec.ks_show_live_pop_up
        if ks_dashboard_rec.ks_auto_update_type == 'ks_live_update':
            dashboard_data['ks_set_interval'] = False
        return dashboard_data


    @api.model
    def ks_prepare_export_data_vals(self,ks_dashboard_rec, grid_conf=None):
        super_rec_data = super(KsDashboardNinjalive, self).ks_prepare_export_data_vals(ks_dashboard_rec, grid_conf=grid_conf)
        super_rec_data['ks_auto_update_type'] = ks_dashboard_rec['ks_auto_update_type']
        super_rec_data['ks_show_live_pop_up'] = ks_dashboard_rec['ks_show_live_pop_up']
        return super_rec_data



    def ks_prepare_import_data_vals(self, data, menu_id):
        super_rec_data = super(KsDashboardNinjalive, self).ks_prepare_import_data_vals(data, menu_id)
        super_rec_data['ks_auto_update_type'] = data['ks_auto_update_type']
        super_rec_data['ks_show_live_pop_up'] = data['ks_show_live_pop_up']
        return super_rec_data

