odoo.define('ks_dashboard_theme.ks_dashboard_item_gradient_theme', function(require) {
    "use strict";

    var registry = require('web.field_registry');
    var AbstractField = require('web.AbstractField');
    var core = require('web.core');
//    var ksColorPicker = require('ks_dashboard_ninja_list.ks_color_picker');
    var KsDashboardThemeold = require('ks_dashboard_ninja_list.ks_dashboard_item_theme');
//    var KsTilePreview = require('ks_dashboard_ninja_list.ks_dashboard_item_preview');
//    var KsKPIPreview = require('ks_dashboard_ninja_list.ks_dashboard_kpi_preview');
//    var KsGraphPreview = require('ks_dashboard_ninja_list.ks_dashboard_graph_preview');
    var field_utils = require('web.field_utils');
    var KsDashboardNinja = require('ks_dashboard_ninja.ks_dashboard');
    var KsDashboardQuickEdit = require('ks_dashboard_ninja.quick_edit_view');
    var utils = require('web.utils');
    var session = require('web.session');


    var QWeb = core.qweb;

    KsDashboardThemeold.KsDashboardThemeold.include({

        willStart: function() {
            var self = this;
            this._super.apply(this, arguments);
            var def = this._rpc({
                model: 'ks_dashboard_ninja.theme',
                method: 'ks_fetch_gradient_code',
                args: ['tile_kpi'],
            });
            return $.when(def, this._super()).then(function(res) {
                self.extra_gradients_list = res;
            });
        },

    });

    KsDashboardNinja.include({

        _ksMainBodyStyle: function(ks_rgba_background_color, ks_rgba_font_color, tile){
            var primary_color = ['white', 'blue', 'green', 'red','yellow']
            if (primary_color.includes(tile.background_image_gradient)){
                return this._super.apply(this, arguments);
            }
            else{
                var background_image = "background-image:" + tile.background_image_gradient + ";color : " + ks_rgba_font_color + ";";
                var ks_rgba_dark_background_color_l2 = this._ks_get_rgba_format(this.ks_get_dark_color(tile.ks_background_color.split(',')[0], tile.ks_background_color.split(',')[1], -10));
//                var style_image_body_l2 = "background-color:" + ks_rgba_dark_background_color_l2 + ";";
                if (tile.background_image_gradient[17]=='8'){
                var style_image_body_l2 = background_image.substring(0, 34) + "5" + background_image.substring(34 + "5".length)
                }else{
                var style_image_body_l2 = background_image
                }
                return {
                    'background_style': background_image,
                    'style_image_body_l2': style_image_body_l2
                }
            }
        },

        ks_kpi_preview_background_style: function($kpi_preview, ks_rgba_background_color, ks_rgba_font_color, field){
            var primary_color = ['white', 'blue', 'green', 'red','yellow']
            if (primary_color.includes(field.background_image_gradient)){
                return this._super.apply(this, arguments);
            }
            else{
                $kpi_preview.children().css({
                    "background-image": field.background_image_gradient,
                    "color": ks_rgba_font_color,
                 });
            }
        },

        ks_chart_color_pallet: function(gradient, setsCount, palette, item){
            if (item.ks_chart_item_theme_type === 'theme' && item.ks_chart_theme_type === 'gradient'){
//                const theme = JSON.parse(item.ks_chart_item_theme.split('+')[0]);
                var dataset_count = JSON.parse(item.ks_chart_data).datasets.length;
                var circle_type_charts = ['ks_pie_chart', 'ks_doughnut_chart', 'ks_polarArea_chart'];
                if (circle_type_charts.includes(item.ks_dashboard_item_type)){
                    var dataset_count = JSON.parse(item.ks_chart_data).labels.length;
                }
                const theme_obj = this.ks_gradient_obj_create(JSON.parse(item.ks_chart_theme_data));
                var theme_2 = this.ks_dashboard_theme_color_sets(theme_obj, dataset_count);
                return theme_2;
            }
            else if(item.ks_chart_item_theme_type === 'theme' && item.ks_chart_theme_type === 'static'){
                var color_set = JSON.parse(item.ks_chart_theme_data);
                var chartColors = [];
                for (var i = 0, counter = 0; i < setsCount; i++, counter++) {
                    if (counter >= color_set.length) counter = 0; // reset back to the beginning
                    chartColors.push(color_set[counter]);
                }
                var theme = [];
                var rgb_obj
                for (var i = 0; i < chartColors.length; i++) {
                    rgb_obj = this.ks_hex_to_rgb(chartColors[i].split(',')[0])
                    theme.push(`rgba(${rgb_obj.r},${rgb_obj.g},${rgb_obj.b},1)`);
                }
                return theme;
            }
            else{
                var color = this._super.apply(this, arguments);
                return color;
            }
        },

        ks_hex_to_rgb: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        ks_gradient_obj_create: function(theme_data){
            var gradient_count = theme_data.length;
            var gradient = {0: [255, 255, 255, 1]};
            var key_diff = 100/(gradient_count+1);
            var key_val = key_diff;
            for(let i=0;i<theme_data.length;i++){
                var rgb_val = this.ks_hex_to_rgb(theme_data[i].split(',')[0]);
                gradient[key_val] = [rgb_val.r, rgb_val.g, rgb_val.b, 1];
                key_val = key_val+key_diff;
            }
            gradient[100] = [0, 0, 0, 1]
            return gradient;
        },

        ks_dashboard_theme_color_sets: function(gradient, dataset_count){
            var chartColors = [];
            var setsCount = dataset_count;
            var gradientKeys = Object.keys(gradient);
                gradientKeys.sort(function(a, b) {
                    return +a - +b;
                });
                for (var i = 0; i < setsCount; i++) {
                    var gradientIndex = (i + 1) * (100 / (setsCount + 1)); //Find where to get a color from the gradient
                    for (var j = 0; j < gradientKeys.length; j++) {
                        var gradientKey = gradientKeys[j];
                        if (gradientIndex === +gradientKey) { //Exact match with a gradient key - just get that color
                            chartColors[i] = 'rgba(' + gradient[gradientKey].toString() + ')';
                            break;
                        } else if (gradientIndex < +gradientKey) { //It's somewhere between this gradient key and the previous
                            var prevKey = gradientKeys[j - 1];
                            var gradientPartIndex = (gradientIndex - prevKey) / (gradientKey - prevKey); //Calculate where
                            var color = [];
                            for (var k = 0; k < 4; k++) { //Loop through Red, Green, Blue and Alpha and calculate the correct color and opacity
                                color[k] = gradient[prevKey][k] - ((gradient[prevKey][k] - gradient[gradientKey][k]) * gradientPartIndex);
                                if (k < 3) color[k] = Math.round(color[k]);
                            }
                            chartColors[i] = 'rgba(' + color.toString() + ')';
                            break;
                        }
                    }
                }
            return chartColors;
        },
    });

    KsDashboardQuickEdit.QuickEditView.include({
        ks_Update_item: function() {
            var self = this;
            var ksChanges = this.controller.renderer.state.data;

            if (ksChanges['name']) this.item['name'] = ksChanges['name'];

            self.item['ks_font_color'] = ksChanges['ks_font_color'];
            self.item['ks_icon_select'] = ksChanges['ks_icon_select'];
//            self.item['ks_icon'] = ksChanges['ks_icon'];
            self.item['ks_background_color'] = ksChanges['ks_background_color'];
            self.item['ks_default_icon_color'] = ksChanges['ks_default_icon_color'];
            self.item['ks_layout'] = ksChanges['ks_layout'];
            self.item['ks_record_count'] = ksChanges['ks_record_count'];
            self.item['background_image_gradient'] = ksChanges['ks_dashboard_item_theme'];

            if (ksChanges['ks_list_view_data']) self.item['ks_list_view_data'] = ksChanges['ks_list_view_data'];

            if (ksChanges['ks_chart_data']) self.item['ks_chart_data'] = ksChanges['ks_chart_data'];

            if (ksChanges['ks_kpi_data']) self.item['ks_kpi_data'] = ksChanges['ks_kpi_data'];

            if (ksChanges['ks_list_view_type']) self.item['ks_list_view_type'] = ksChanges['ks_list_view_type'];

            if (ksChanges['ks_chart_item_color']) self.item['ks_chart_item_color'] = ksChanges['ks_chart_item_color'];

            self.ksUpdateItemView();

        },

    });
});