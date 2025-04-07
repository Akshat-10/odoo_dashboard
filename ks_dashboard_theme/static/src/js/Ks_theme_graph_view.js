/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import field_utils from 'web.field_utils';
import { qweb } from 'web.core';
import utils from 'web.utils';
import session from 'web.session';
import {KsGraphPreview} from '@ks_dashboard_ninja/js/ks_dashboard_ninja_graph_preview';
import {KsKpiPreviewowl} from '@ks_dashboard_ninja/js/ks_dashboard_ninja_kpi_preview';
import {KsItemPreview} from '@ks_dashboard_ninja/js/ks_dashboard_ninja_item_preview';
import {KsDashboardTheme} from '@ks_dashboard_ninja/js/ks_dashboard_item_theme_old';
const {onWillStart} = owl;

patch(KsGraphPreview.prototype,"ks_dashboard_theme",{
    ks_chart_color_pallet(gradient, setsCount, palette){
            if (this.props.record.data.ks_chart_item_theme_type === 'theme' && this.props.record.data.ks_chart_theme_data != false  && this.props.record.data.ks_chart_theme_type === 'gradient'){
//                const theme = JSON.parse(this.recordData.ks_chart_item_theme.split('+')[0]);
                var dataset_count = JSON.parse(this.props.record.data.ks_chart_data).datasets.length;
                var circle_type_charts = ['ks_pie_chart', 'ks_doughnut_chart', 'ks_polarArea_chart'];
                if (circle_type_charts.includes(this.props.record.data.ks_dashboard_item_type)){
                    var dataset_count = JSON.parse(this.props.record.data.ks_chart_data).labels.length;
                }
                const theme_obj = this.ks_gradient_obj_create(JSON.parse(this.props.record.data.ks_chart_theme_data));
                var theme_2 = this.ks_dashboard_theme_color_sets(theme_obj, dataset_count);
                return theme_2;
            }
            else if(this.props.record.data.ks_chart_item_theme_type === 'theme' && this.props.record.data.ks_chart_theme_data != false && this.props.record.data.ks_chart_theme_type === 'static'){
                var color_set = JSON.parse(this.props.record.data.ks_chart_theme_data);
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

        ks_hex_to_rgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        ks_gradient_obj_create(theme_data){
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

        ks_dashboard_theme_color_sets(gradient, dataset_count){
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
patch(KsKpiPreviewowl.prototype,"ks_dashboard_theme",{
        ks_kpi_preview_background_style($kpi_preview, ks_rgba_background_color, ks_rgba_font_color){
            var primary_color = ['white', 'blue', 'green', 'red','yellow']
            if (primary_color.includes(this.props.record.data.ks_dashboard_item_theme)){
                return this._super.apply(this, arguments);
            }
            else{
                $kpi_preview.css({
                    "background-image": this.props.record.data.ks_dashboard_item_theme,
                    "color": ks_rgba_font_color,
                 });
            }
        },
});
patch(KsItemPreview.prototype,"ks_dashboard_theme",{
            tile_render() {
            var self = this;
            var field = self.props.record.data;
            var $val;
            var item_info;
            var ks_rgba_background_color, ks_rgba_font_color, ks_rgba_icon_color;
            $(this.input.el.parentElement).find('div').remove()
            $(this.input.el.parentElement).find('input').addClass('d-none')
            ks_rgba_background_color = self._get_rgba_format(field.ks_background_color);
            var gradient_color = field.ks_dashboard_item_theme;
            var primary_color = ['white', 'blue', 'green', 'red','yellow'];
            ks_rgba_font_color = self._get_rgba_format(field.ks_font_color)
            ks_rgba_icon_color = self._get_rgba_format(field.ks_default_icon_color)
            item_info = {
                name: field.name,
                //                    count: self.record.specialData.ks_domain.nbRecords.toLocaleString('en', {useGrouping:true}),
                count: self.ksNumFormatter(field.ks_record_count, 1),
                icon_select: field.ks_icon_select,
                default_icon: field.ks_default_icon,
                icon_color: ks_rgba_icon_color,
                count_tooltip: field_utils.format.float(field.ks_record_count, Float64Array, {digits: [0, field.ks_precision_digits]}),
            }

            if (field.ks_icon) {

                if (!utils.is_bin_size(field.ks_icon)) {
                    // Use magic-word technique for detecting image type
                    item_info['img_src'] = 'data:image/' + (self.file_type_magic_word[field.ks_icon] || 'png') + ';base64,' + field.ks_icon;
                } else {
                    item_info['img_src'] = session.url('/web/image', {
                        model: self.env.model.root.resModel,
                        id: JSON.stringify(this.props.record.data.id),
                        field: "ks_icon",
                        // unique forces a reload of the image when the record has been updated
                        unique: String(this.props.record.data.__last_update.ts),
                    });
                }

            }
            if (!field.name) {
                if (field.ks_model_name) {
                    item_info['name'] = field.ks_model_id[1];
                } else {
                    item_info['name'] = "Name";
                }
            }

            if (field.ks_multiplier_active){
                var ks_record_count = field.ks_record_count * field.ks_multiplier
                item_info['count'] = self._onKsGlobalFormatter(ks_record_count, field.ks_data_format, field.ks_precision_digits);
                item_info['count_tooltip'] = ks_record_count;
            }else{
                item_info['count'] = self._onKsGlobalFormatter(field.ks_record_count, field.ks_data_format, field.ks_precision_digits);
            }

//            count_tooltip

            switch (field.ks_layout) {
                case 'layout1':
                    $val = $(qweb.render('ks_db_list_preview_layout1', item_info));
                    if (primary_color.includes(field.ks_dashboard_item_theme)){
                        $val.css({
                            "background-color": ks_rgba_background_color,
//                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    else{
                        $val.css({
    //                        "background-color": ks_rgba_background_color,
                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }
//                    $val.css({
////                        "background-color": ks_rgba_background_color,
//                        "background-image": gradient_color,
//                        "color": ks_rgba_font_color
//                    });
                    break;

                case 'layout2':
                    $val = $(qweb.render('ks_db_list_preview_layout2', item_info));
                    var ks_rgba_dark_background_color_l2 = self._get_rgba_format(self.ks_get_dark_color(field.ks_background_color.split(',')[0], field.ks_background_color.split(',')[1], -10));
//                    $val.find('.ks_dashboard_icon_l2').css({
//                        "background-color": ks_rgba_dark_background_color_l2,
//                    });
                    if (primary_color.includes(field.ks_dashboard_item_theme)){
                        $val.find('.ks_dashboard_icon_l2').css({
                            "background-color": ks_rgba_dark_background_color_l2,
                        });
                    }
                    else{
                        if (gradient_color[17]=='8'){
                        $val.find('.ks_dashboard_icon_l2').css({
                            "background-image": gradient_color.substring(0, 17) + "5" + gradient_color.substring(17 + "5".length)
                        });
                        }else{
                        $val.find('.ks_dashboard_icon_l2').css({
                            "background-image": gradient_color
                        });
                    }
                    }
                    if (primary_color.includes(field.ks_dashboard_item_theme)){
                        $val.css({
                            "background-color": ks_rgba_background_color,
//                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    else{
                        $val.css({
    //                        "background-color": ks_rgba_background_color,
                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }
//                    $val.css({
//                        "background-color": ks_rgba_background_color,
//                        "color": ks_rgba_font_color
//                    });
                    break;

                case 'layout3':
                    $val = $(qweb.render('ks_db_list_preview_layout3', item_info));
                    if (primary_color.includes(field.ks_dashboard_item_theme)){
                        $val.css({
                            "background-color": ks_rgba_background_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    else{
                        $val.css({
                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    break;

                case 'layout4':
                    $val = $(qweb.render('ks_db_list_preview_layout4', item_info));
                    if (primary_color.includes(field.ks_dashboard_item_theme)){
                        $val.find('.ks_dashboard_icon_l4').css({
                            "background-color": ks_rgba_background_color,
                            "color": ks_rgba_font_color
                        });

                    }
                    else{
                        $val.find('.ks_dashboard_icon_l4').css({
                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    $val.find('.ks_dashboard_item_main_body_l2').css({
                            "background-color": 'rgba(0,0,0,0)',
                            "color": ks_rgba_font_color
                        });
                    $val.find('.ks_dashboard_item_preview_customize').css({
                        "color": ks_rgba_background_color,
                    });
                    $val.find('.ks_dashboard_item_preview_delete').css({
                        "color": ks_rgba_background_color,
                    });
                    $val.css({
                        "color": ks_rgba_font_color,
                        "border":'solid',
                        "border-width":"1px",
                    });
                    break;

                case 'layout5':
                    $val = $(qweb.render('ks_db_list_preview_layout5', item_info));
//                    $val.css({
//                        "background-color": ks_rgba_background_color,
//                        "color": ks_rgba_font_color
//                    });
                    if (primary_color.includes(field.ks_dashboard_item_theme)){
                        $val.css({
                            "background-color": ks_rgba_background_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    else{
                        $val.css({
                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    break;

                case 'layout6':
                    //                        item_info['icon_color'] = self._get_rgba_format(self.ks_get_dark_color(field.ks_background_color.split(',')[0],field.ks_background_color.split(',')[1],-10));
                    $val = $(qweb.render('ks_db_list_preview_layout6', item_info));
//                    $val.css({
//                        "background-color": ks_rgba_background_color,
//                        "color": ks_rgba_font_color
//                    });
                    if (primary_color.includes(field.ks_dashboard_item_theme)){
                        $val.css({
                            "background-color": ks_rgba_background_color,
                            "color": ks_rgba_font_color
                        });
                    }
                    else{
                        $val.css({
                            "background-image": gradient_color,
                            "color": ks_rgba_font_color
                        });
                    }

                    break;

                default:
                    $val = $(qweb.render('ks_db_list_preview'));
                    break;

            }

            $(this.input.el.parentElement).append($val);
            $(this.input.el.parentElement).append(qweb.render('ks_db_item_preview_footer_note'));
        },

});
patch(KsDashboardTheme.prototype,"ks_dashboard_theme",{
    async theme_render(){
    var color_new = await this.env.model.orm.searchRead('ks_dashboard_ninja.theme',[],['ks_code']);
    var color= JSON.parse(color_new[0].ks_code);
    var self = this;
    $(this.input.el.parentElement).find('div').remove()
    $(this.input.el.parentElement).find('input').addClass('d-none')
    var $view = $(qweb.render('ks_dashboard_image_theme', {color:color}));
    if (self.props.record.data.ks_dashboard_item_theme) {
        $view.find("input[value='" + self.props.record.data.ks_dashboard_item_theme + "']").prop("checked", true);
            }
    $(this.input.el.parentElement).append($view)
    }


});



