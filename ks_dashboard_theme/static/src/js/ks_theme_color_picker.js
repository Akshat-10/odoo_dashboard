/** @odoo-module **/

import { registry } from "@web/core/registry";
import core from 'web.core';
import { qweb } from 'web.core';
import { loadCSS,loadJS } from "@web/core/assets";
import { useAutofocus } from "@web/core/utils/hooks"
import { CharField } from "@web/views/fields/char/char_field";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
const { useEffect, useRef,onWillUpdateProps, useExternalListener} = owl;
import field_utils from 'web.field_utils';
import session from 'web.session';

class KsDashboardGradientTheme extends CharField{
       setup() {
        super.setup();
        const self = this;
        const inputRef = useRef("input");
        useEffect(
            (input) => {
                if (input) {
                self.color_render();
            }
            },
            () => [inputRef.el]

        );
        document.body.addEventListener('click', function(evt) {
        if ($(evt.target.parentElement).hasClass("ks_add_color_picker")) {
        self.ks_dashboard_add_color_picker(evt);
    }
}, false);
        document.body.addEventListener('click', function(evt) {
        if ($(evt.target.parentElement).hasClass("ks_remove_color_picker")) {
        self.ks_dashboard_remove_color_picker(evt);
    }
}, false);
        document.body.addEventListener('change', function(evt) {
        if ($(evt.target).hasClass("ks_color_picker")) {
        self.ksOnColorChange(evt);
    }
}, false);
   onWillUpdateProps((nextProps) => {

            const { record } = this.props;
            const { record: nextRecord } = nextProps;
            if (this.props.value !== nextProps.value) {
                this.props.record.data.ks_theme_color_picker = nextProps.value;
            }
            this.color_render()
        });

}
//    onWillUpdateProps(){
//    this.color_render()
//
//}


        color_render() {
        var self = this;
        $(this.input.el.parentElement).find('div').remove()
        $(this.input.el.parentElement).find('input').addClass('d-none')
            if (this.props.record.data.ks_theme_color_picker.length < 17){
                if (this.props.record.data.ks_theme_color_picker === '#ffffff,0.99'){
                    var field_colors = this.props.record.data.ks_theme_color_picker;
                }
                else{
                    var field_colors = JSON.parse(this.props.record.data.ks_theme_color_picker)[0];
                }
                if (field_colors) {
                    var ks_color_value = field_colors.split(',')[0];
                    var ks_color_opacity = field_colors.split(',')[1];
                };
                var $view = $(qweb.render('ks_color_picker_opacity_view_new', {
                    ks_color_value: ks_color_value,
                    ks_color_opacity: ks_color_opacity
                }));
                $(this.input.el.parentElement).append($view);
                $(this.input.el.parentElement).find('.ks_color_opacity').remove();
            }
            else{
                var colors = JSON.parse(this.props.record.data.ks_theme_color_picker);
                for (let i = 0; i < colors.length; i++){
                    var val = colors[i].split(',')[0];
                    var opc = colors[i].split(',')[1];
                    var $view = $(qweb.render('ks_color_picker_opacity_view_new', {
                        ks_color_value: val,
                        ks_color_opacity: opc
                    }));
                $(this.input.el.parentElement).append($view);
                $(this.input.el.parentElement).find('.ks_color_opacity').remove();
                }
            }
            $(this.input.el.parentElement).find('div').append('<button class="btn ks_remove_color_picker" style="position:absolute"><i class="fa fa-times"></i></button>');
            $(this.input.el.parentElement).find('div').first().find(".ks_remove_color_picker").remove()
            $(this.input.el.parentElement).find('div').first().append('<button class="btn ks_add_color_picker" style="position:absolute"><i class="fa fa-plus-circle"></i></button>');
}
        ks_dashboard_remove_color_picker(e){
            if (this.props.record.mode === 'edit'){
                $(this.input.el.parentElement).find(e.target.parentElement.closest('div')).siblings();
                var element_index = $(e.target.parentElement.closest('div')).index();
                var new_arr = JSON.parse(this.props.value);
                new_arr.splice(element_index-1, 1);
                this.props.update(JSON.stringify(new_arr));
            }
        }
        ks_dashboard_add_color_picker(e){
            if (this.props.record.mode === 'edit'){
                var ks_color_value = '#376CAE';
                var ks_color_opacity = '0.99';
                if (this.props.record.data.ks_theme_color_picker) {
                    if (this.props.record.data.ks_theme_color_picker === '#ffffff,0.99'){
                        var color_value = this.props.record.data.ks_theme_color_picker;
                    }
                    else{
                        var color_value = JSON.parse(this.props.record.data.ks_theme_color_picker)[0];
                    }
                    ks_color_value = color_value.split(',')[0];
                    ks_color_opacity = color_value.split(',')[1];
                };
                var $view = $(qweb.render('ks_color_picker_opacity_view_new', {
                    ks_color_value: ks_color_value,
                    ks_color_opacity: ks_color_opacity
                }));
                $(this.input.el.parentElement).append($view);
                $(this.input.el.parentElement).find('.ks_color_opacity').remove();
            }
        }

        ksOnColorChange(e) {
            if (e.target.value.concat("," + this.props.record.data.ks_theme_color_picker.split(',')[1]).length < 15 &&  ($(this.input.el.parentElement).find(".ks_color_picker").length < 2 || this.props.value === '#ffffff,0.99')){
                if (this.props.record.data.ks_theme_color_picker === '#ffffff,0.99'){
                    var field_colors = this.props.record.data.ks_theme_color_picker;
                }
                else{
                    var field_colors = JSON.parse(this.props.record.data.ks_theme_color_picker)[0];
                }
                var current_color = e.target.value.concat("," + field_colors.split(',')[1]);
                var arr = [];
                arr.push(current_color);
                this.props.update(JSON.stringify(arr));
            }
            else{
                var field_colors = JSON.parse(this.props.record.data.ks_theme_color_picker);
                var current_color = e.target.value.concat("," + field_colors[0].split(',')[1]);
                field_colors[$(e.target.closest('div')).index()-1] = current_color;
                var field_new= field_colors.filter(Boolean)
                this.props.update(JSON.stringify(field_colors));
            }
        }
}
 registry.category("fields").add('ks_dashboard_item_gradient_theme_owl', KsDashboardGradientTheme);