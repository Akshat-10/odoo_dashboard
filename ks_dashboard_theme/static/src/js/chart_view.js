/** @odoo-module */

import { formatDate, parseDateTime } from "@web/core/l10n/dates";
import { CharField } from "@web/views/fields/char/char_field";
import { registry } from "@web/core/registry";
import field_utils from 'web.field_utils';
import { loadCSS,loadJS } from "@web/core/assets";
import { qweb } from 'web.core';
import core from 'web.core';
import session from 'web.session';

const { useEffect, useRef, xml, onWillUpdateProps,onMounted,onWillStart} = owl;

export class KsGraphPreview extends CharField{
setup() {
        super.setup();
        const self = this;
         loadJS('/ks_dashboard_ninja/static/lib/js/Chart.bundle.min.js');
         loadJS('/ks_dashboard_ninja/static/lib/js/chartjs-plugin-datalabels.js');
         loadCSS('/ks_dashboard_ninja/static/lib/css/Chart.min.css') ;
        const inputRef = useRef("input");
//        onMounted(this.onMounted);
        useEffect(
            (input) => {
                if (input) {
                    this.Ks_render();
                }
            },
            () => [inputRef.el]

        );

        onWillUpdateProps((nextProps) => {
            this.props.record.data.ks_theme_color_picker = nextProps.record.data.ks_theme_color_picker
            this.props.record.data.ks_chart_theme_type = nextProps.record.data.ks_chart_theme_type
            this.Ks_render()
        });
        onWillStart(this.onWillStart);

    }

//    onWillUpdateProps(){
//    this.Ks_render()
//}
        onWillStart() {
        var self = this;
        core.bus.on("DOM_updated", this, function() {
            if (self.shouldRenderChart && $(this.input.el.parentElement).find('#ksMyChart').length > 0) self.ks_set_chart_preview();
        });
    }
    Ks_render(){
        var self=this;
        $(this.input.el.parentElement).find('div').remove()
        $(this.input.el.parentElement).find('input').addClass('d-none')
        this.shouldRenderChart = true;
        var $chartPreview = $(qweb.render('ks_chart_theme_preview_container', {}));
        $(this.input.el.parentElement).append($chartPreview);
        this.ks_set_chart_preview();
        }
    ks_set_chart_preview(){
            if (this.props.record.data.ks_theme_color_picker != false && this.props.record.data.ks_theme_color_picker != '#ffffff,0.99'){
                var theme = this.ks_chart_color_pallet();
                this.ksChartPreview = new Chart($(this.input.el.parentElement).find('#ksChartPreview')[0], {
                    type: 'bar',
                    data: {
                        labels: ["Quotation", "Sales Order", "Quotation Sent"],
                        datasets: [
                            {
                                "label": "Deco Addict Total",
                                "data": [
                                    9000,
                                    5000,
                                    3000
                                ],
                                'backgroundColor': theme[0],
                                'borderColor': "rgba(255,255,255,0)"
                            },
                            {
                                "label": "Ready Mat Total",
                                "data": [
                                    1800,
                                    5947.5,
                                    7100
                                ],
                                'backgroundColor': theme[1],
                                'borderColor': "rgba(255,255,255,0)"
                            },
                            {
                                "label": "Gemini Furniture Total",
                                "data": [
                                    4000,
                                    13973,
                                    2000
                                ],
                                'backgroundColor': theme[2],
                                'borderColor': "rgba(255,255,255,0)"
                            },
                            {
                                "label": "Lumber Inc Total",
                                "data": [
                                    5600,
                                    3750,
                                    6100
                                ],
                                'backgroundColor': theme[3],
                                'borderColor': "rgba(255,255,255,0)"
                            },
                            {
                                "label": "YourCompany, Joel Willis Total",
                                "data": [
                                    4000,
                                    2947.5,
                                    4740
                                ],
                                'backgroundColor': theme[4],
                                'borderColor': "rgba(255,255,255,0)"
                            },
                            {
                                "label": "Azure Interior Total",
                                "data": [
                                    1750,
                                    4533,
                                    2311
                                ],
                                'backgroundColor': theme[5],
                                'borderColor': "rgba(255,255,255,0)"
                            }
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        animation: {
                            easing: 'easeInQuad',
                        },
                        legend: {
                                display: true
                            },
                        layout: {
                            padding: {
                                bottom: 0,
                            }
                        },
                        }
                });
            }
        }
    ks_chart_color_pallet(){
            if (this.props.record.data.ks_chart_theme_type === 'gradient' && this.props.record.data.ks_theme_color_picker != '#ffffff,0.99'){
                var dataset_count = 6;
                const theme_obj = this.ks_gradient_obj_create(JSON.parse(this.props.record.data.ks_theme_color_picker));
                var theme = this.ks_dashboard_theme_color_sets(theme_obj, 6);
                return theme;
            }
            else if(this.props.record.data.ks_chart_theme_type === 'static' && this.props.record.data.ks_theme_color_picker != '#ffffff,0.99'){
                var color_set = JSON.parse(this.props.record.data.ks_theme_color_picker);
                var chartColors = [];
                for (var i = 0, counter = 0; i < 6; i++, counter++) {
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
        }
    ks_hex_to_rgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

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
        }

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
        }

}
registry.category("fields").add("ks_dashboard_theme_chart_preview", KsGraphPreview);