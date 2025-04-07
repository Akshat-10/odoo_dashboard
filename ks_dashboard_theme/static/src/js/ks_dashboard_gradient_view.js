/** @odoo-module **/


import { registry } from "@web/core/registry";
import core from 'web.core';
import { qweb } from 'web.core';
import { CharField } from "@web/views/fields/char/char_field";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
const { useEffect, useRef,onWillUpdateProps} = owl;

class KsDashboardGradientView extends CharField{
       setup() {
        super.setup();
        const self = this;
        const inputRef = useRef("input");
        useEffect(
            (input) => {
                if (input) {
                self.gradient_render();
            }
            },
            () => [inputRef.el]

        );

   onWillUpdateProps((nextProps) => {
           this.props.record.data.ks_theme_color_picker = nextProps.record.data.ks_theme_color_picker
           this.props.record.data.ks_gradient_slider = nextProps.record.data.ks_gradient_slider
            this.gradient_render()
        });

}
//    onWillUpdateProps(){
//    this.gradient_render()
//
//}
            gradient_render(){
            $(this.input.el.parentElement).find('div').remove()
            $(this.input.el.parentElement).find('input').addClass('d-none')
            if (this.props.record.data.ks_theme_color_picker.length < 13){
                var colors = this.props.record.data.ks_theme_color_picker;
            }
            else{
                var colors = JSON.parse(this.props.record.data.ks_theme_color_picker);
            }
            var gradient_str = ''
            for (let i=0; i<colors.length; i++){
                if (i < colors.length - 1){
                    gradient_str = gradient_str + colors[i].split(',')[0] + ','
                }
                else{
                    gradient_str = gradient_str + colors[i].split(',')[0]
                }
            }
            var gradient_angle = this.props.record.data.ks_gradient_slider + 'deg,';
            var gradient_color = "linear-gradient(" + gradient_angle + gradient_str + ')';
            $(this.input.el.parentElement).css("background-image",gradient_color);

            if (this.props.record.__viewType === 'form'){
                $(this.input.el.parentElement).css("height","150px");
                $(this.input.el.parentElement).css("width","300px");
            }
            }
    }
registry.category("fields").add('ks_dashboard_item_gradient_view', KsDashboardGradientView);
