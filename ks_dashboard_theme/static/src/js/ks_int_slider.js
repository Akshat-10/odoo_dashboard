/** @odoo-module **/

import "web.dom_ready";
import { registry } from "@web/core/registry";
import core from 'web.core';
import { qweb } from 'web.core';
import { CharField } from "@web/views/fields/char/char_field";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
const { Component,useState,onWillUpdateProps} = owl;


export class KsDashboardIntSlider extends Component{
        setup(){
        var self=this.props;
         this.state = useState({
           ks_value: this.props.value
        });
        onWillUpdateProps((nextProps) => {
            this.state.ks_value = nextProps.value
        });

        }


        _ksOnSliderChange(e){
          var new_value=e.currentTarget.value;
          this.props.update(new_value)
        }

        _ksOnSliderInputChange(e){
           var new_value=e.currentTarget.value;
          this.props.update(new_value)
        }
}
KsDashboardIntSlider.template="ks_slider";
 KsDashboardIntSlider.props = {
    ...standardFieldProps,
};
 KsDashboardIntSlider.supportedTypes = ["Integer"];
 registry.category("fields").add('ks_dashboard_int_slider', KsDashboardIntSlider);