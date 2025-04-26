from odoo import http
from odoo.addons.web.controllers.database import Database

class DatabaseCustom(Database):
    @http.route('/web/database/manager', type='http', auth="none")
    def manager(self, **kw):
        # Call the parent method to get the response
        response = super(DatabaseCustom, self).manager(**kw)
        # Modify the response to replace the favicon
        if isinstance(response, http.Response):
            response.qcontext.update({
                'favicon': '/asd_logo/static/description/icon/asd_logo.ico'
            })
        return response
    

# class DatabaseCustom(Database):
#     @http.route('/web/database/manager', type='http', auth="none")s
#     def manager(self, **kw):
#         # Get the original response data
#         response = super(DatabaseCustom, self).manager(**kw)
#         if isinstance(response, http.Response):
#             # Re-render with custom template
#             return http.request.render('asd_logo.database_manager_custom', response.qcontext)
#         return response