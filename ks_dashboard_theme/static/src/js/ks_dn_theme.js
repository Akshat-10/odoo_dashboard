odoo.define('ks_dn_background_theme.ks_dashboard_ninja_board', function(require){

    var core = require('web.core');
    var qweb = core.qweb;
    var KSDashboardNinja = require('ks_dashboard_ninja.ks_dashboard');
    var KsGlobalFunction = require('ks_dashboard_ninja.KsGlobalFunction');
    var utils = require('web.utils');
    var config = require('web.config');
    var field_utils = require('web.field_utils');


    KSDashboardNinja.include({
        events : _.extend(KSDashboardNinja.prototype.events, {
            "change input#ks_dashboard_dark_mode": "_onKsDnInputChange",
//            "mouseenter div.ks-dashboard-switch": "_onKsDnMouseEnter",
//            "mouseleave div.ks-dashboard-switch": "_onKsDnMouseLeave",
        }),

        willStart: function() {
            var self = this;
            this._super.apply(this, arguments);
            var def = this._rpc({
                model: 'ks_dashboard_ninja.theme',
                method: 'ks_fetch_chart_themes',
                args: [],
            });
            return $.when(def, this._super()).then(function(res, id) {
                self.chart_themes_list = res[0];
                self.chart_themes_id_list = res[1];
            });
        },

        _onKsDnInputChange: function(ev){
            var self = this;
            var _value = ev.target.checked;
            var rec_id = self.ks_dashboard_id;
            self.ks_value  = _value;
            this._rpc({
                model: 'ks_dashboard_ninja.board',
                method: 'write',
                args: [rec_id, {
                    'ks_dark_mode_enable': _value
                }],
            }).then(function(){
                self._ksSetChartBackgroundColor();
            })

            if (_value){
                $("html").attr("data-color-mode", "ks-dn-dark");
                $('.ks_chart_heading').each(function() {
                    $(this).css({
                        "color": 'white'
                    });
                });
                $('.ks_list_view_heading').each(function() {
                    $(this).css({
                        "color": 'white'
                    });
                });
                $('.ks_dashboarditem_chart_container').each(function() {
                    $(this).removeAttr('style');
                });
                $('.ks_chart_card_body').each(function() {
                    $(this).removeAttr('style');
                });
                $('.ks_dashboard_header').removeAttr('style');
                $('.ks_dashboard_main_content').removeAttr('style');
                }
            else{
                $("html").attr("data-color-mode", "ks-dn-light");
                $('.ks_chart_heading').each(function() {
                    $(this).css({
                        "color": 'black'
                    });
                });
                $('.ks_list_view_heading').each(function() {
                    $(this).css({
                        "color": 'black'
                    });
                });
                $('.ks_dashboarditem_chart_container').each(function() {
                    $(this).css({
                        "background-color": self.ks_dashboard_data.ks_item_background_color
                    });
                });
                $('.ks_chart_card_body').each(function() {
                    $(this).attr('style', 'background-color:' + self.ks_dashboard_data.ks_item_background_color +'!important');
                });
                $('.ks_date_filter_dropdown').css({
                    "background-color": self.ks_dashboard_data.ks_header_background_color
                });
                $('#dropdownMenuButton').css({
                    "background-color": self.ks_dashboard_data.ks_header_background_color
                });
                $('.ks_dashboard_header').attr('style', 'background-color:' + self.ks_dashboard_data.ks_header_background_color +'!important');
                $('.ks_dashboard_main_content').attr('style', 'background-color:' + self.ks_dashboard_data.ks_dashboard_background_color +'!important');
            }
        },

        _ksSetChartBackgroundColor: function(){
            var self = this;
            self.ks_dashboard_data['ks_dark_mode_enable'] = self.ks_value;
            self.ks_set_default_chart_view();
            self.ks_dashboard_data.ks_item_data
            self.ks_dashboard_data.ks_dashboard_items_ids.forEach(function(item_id){
                var item_data = self.ks_dashboard_data.ks_item_data[item_id];
                if(['ks_bar_chart', 'ks_horizontalBar_chart', 'ks_line_chart', 'ks_area_chart','ks_pie_chart','ks_doughnut_chart','ks_polarArea_chart'].indexOf(item_data['ks_dashboard_item_type']) !== -1) {
                    $(self.$el.find(".grid-stack-item[gs-id=" + item_id + "]").children()[0]).find(".card-body").empty();
                    self._renderChart($(self.$el.find(".grid-stack-item[gs-id=" + item_id + "]").children()[0]), item_data);
                }
            })

        },

        ksRenderDashboard(){
            var self = this;
            self.ks_set_default_chart_view();
            this._super.apply(this, arguments);
            var ks_dark_mode_enable = self.ks_dashboard_data['ks_dark_mode_enable'];
            $('#ks_dashboard_dark_mode').attr('checked', ks_dark_mode_enable);
            if (ks_dark_mode_enable){
                $("html").attr("data-color-mode", "ks-dn-dark");
                $('.ks_chart_card_body').each(function() {
                    $(this).removeAttr('style');
                });
                $('.ks_chart_heading').each(function() {
                    $(this).css({
                        "color": 'white'
                    });
                });
                $('.ks_list_view_heading').each(function() {
                    $(this).css({
                        "color": 'white'
                    });
                });
            }else{
                $("html").attr("data-color-mode", "ks-dn-light");
                $('.ks_dashboarditem_chart_container').each(function() {
                    $(this).css({
                        "background-color": self.ks_dashboard_data.ks_item_background_color
                    });
                });
                $('.ks_chart_heading').each(function() {
                    $(this).css({
                        "color": 'black'
                    });
                });
                $('.ks_list_view_heading').each(function() {
                    $(this).css({
                        "color": 'black'
                    });
                });
                $('.ks_chart_card_body').each(function() {
                    $(this).attr('style', 'background-color:' + self.ks_dashboard_data.ks_item_background_color +'!important');
                });
                $('.ks_date_filter_dropdown').css({
                    "background-color": self.ks_dashboard_data.ks_header_background_color
                });
                $('#dropdownMenuButton').css({
                    "background-color": self.ks_dashboard_data.ks_header_background_color
                });
                $('.ks_dashboard_header').attr('style', 'background-color:' + self.ks_dashboard_data.ks_header_background_color +'!important');
                $('.ks_dashboard_main_content').attr('style', 'background-color:' + self.ks_dashboard_data.ks_dashboard_background_color +'!important');
            }
        },
//
        ks_set_default_chart_view: function() {
            Chart.plugins.unregister(ChartDataLabels);
            var self = this;
            var ks_dark_mode_enable = self.ks_dashboard_data['ks_dark_mode_enable'];
//            var backgroundColor = 'white';
            var backgroundColor = self.ks_dashboard_data.ks_item_background_color;
            Chart.defaults.global.defaultFontColor = self.ks_dashboard_data.ks_font_background_color;
            if (ks_dark_mode_enable) {
                var backgroundColor = '#2a2a2a';
                Chart.defaults.global.defaultFontColor = '#fff'
            }
            Chart.plugins.register({
                beforeDraw: function(c) {
                    var ctx = c.chart.ctx;
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, c.chart.width, c.chart.height);
                }
            });
            Chart.plugins.register({
            afterDraw: function(chart) {
                if (chart.data.labels.length === 0) {
                    // No data is present
                    var ctx = chart.chart.ctx;
                    var width = chart.chart.width;
                    var height = chart.chart.height
                    chart.clear();

                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = "3rem 'Lucida Grande'";
                    ctx.fillText('No data available', width / 2, height / 2);
                    ctx.restore();
                }
            }

        });

        Chart.Legend.prototype.afterFit = function() {
            var chart_type = this.chart.config.type;
            if (chart_type === "pie" || chart_type === "doughnut") {
                this.height = this.height;
            } else {
                this.height = this.height + 20;
            };
        };
        },

        on_detach_callback: function() {
            this._super.apply(this, arguments);
            $("html").removeAttr('data-color-mode');
            Chart.defaults.global.defaultFontColor = '#666';
            var backgroundColor = 'white';
            Chart.plugins.register({
                beforeDraw: function(c) {
                    var ctx = c.chart.ctx;
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, c.chart.width, c.chart.height);
                }
            });
        },

        ks_container_option: function(chart_title, ksIsDashboardManager, ksIsUser, ks_dashboard_list, chart_id, chart_family, chart_type, ksChartColorOptions){
            var self = this;
            var options = this._super.apply(this, arguments);
            options.ksChartColorOptions = self.chart_themes_list;
            options.ksChartColorID = self.chart_themes_id_list;
            return options;

        },

        ks_set_selected_color_pallet: function($ks_gridstack_container, item){
            $ks_gridstack_container.find('.ks_li_' + item.ks_chart_theme_int_id).addClass('ks_date_filter_selected');
        },

        ksRenderChartColorOptions: function(e) {
            var self = this;
            if (!$(e.currentTarget).parent().hasClass('ks_date_filter_selected')) {
                //            FIXME : Correct this later.
                var $parent = $(e.currentTarget).parent().parent();
                $parent.find('.ks_date_filter_selected').removeClass('ks_date_filter_selected')
                $(e.currentTarget).parent().addClass('ks_date_filter_selected')
                var item_data = self.ks_dashboard_data.ks_item_data[$parent.data().itemId];
                var chart_data = JSON.parse(item_data.ks_chart_data);
//                this.ksChartColors(e.currentTarget.dataset.chartColor, this.chart_container[$parent.data().itemId], $parent.data().chartType, $parent.data().chartFamily, item_data.ks_bar_chart_stacked, item_data.ks_semi_circle_chart, item_data.ks_show_data_value, chart_data, item_data)
                this._rpc({
                    model: 'ks_dashboard_ninja.theme',
                    method: 'ks_set_chart_themes',
                    args: [$parent.data().itemId, e.currentTarget.dataset.chartColor],
                }).then(function() {
                    self.ks_fetch_item_data($parent.data().itemId).then(function(){
                    self.ks_dashboard_data.ks_item_data[$parent.data().itemId]['ks_chart_item_color'] = e.currentTarget.dataset.chartColor;
                    self.ksUpdateDashboardItem([$parent.data().itemId]);
                    });
                })
            }
        },

        ks_fetch_item_data: function(item){
            var self = this;
            var item_id = [item];
            var items_promises = []
            items_promises.push(self._rpc({
                model: "ks_dashboard_ninja.board",
                method: "ks_fetch_item",
                context: self.getContext(),
                args : [[item_id], self.ks_dashboard_id, self.ksGetParamsForItemFetch(item_id)]
            }).then(function(result){
                self.ks_dashboard_data.ks_item_data[item_id] = result[item_id];
            }));
            return Promise.all(items_promises)
        },

    });

    return KSDashboardNinja;
});