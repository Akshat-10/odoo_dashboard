# -*- coding: utf-8 -*-
from odoo import models, fields, tools
from odoo.modules.module import get_resource_path
import base64
import io
from PIL import Image
from random import randrange


class Company(models.Model):
    _inherit = 'res.company'

    def _get_default_favicon(self, original=False):
        # Use the custom favicon path from the asd_logo module
        img_path = get_resource_path('asd_logo', 'static/description/icon/asd_logo.ico')
        if not img_path:
            raise Exception("Favicon file not found at 'asd_logo/static/description/icon/asd_logo.ico'")
        with open(img_path, 'rb') as f:
            if original:
                # Return the original ICO file as base64
                return base64.b64encode(f.read())
            # Open the ICO file and modify it
            original_img = Image.open(f)
            # Ensure the image is in RGBA mode for consistency
            original_img = original_img.convert('RGBA')
            new_image = Image.new('RGBA', original_img.size)
            height = original_img.size[1]
            width = original_img.size[0]
            bar_size = 1
            color = (randrange(32, 224, 24), randrange(32, 224, 24), randrange(32, 224, 24))
            for y in range(height):
                for x in range(width):
                    pixel = original_img.getpixel((x, y))
                    # Add colored bar at the bottom
                    if y >= height - bar_size:
                        new_image.putpixel((x, y), (color[0], color[1], color[2], 255))
                    else:
                        new_image.putpixel((x, y), pixel)
            stream = io.BytesIO()
            new_image.save(stream, format="ICO")  # Save as ICO for browser compatibility
            return base64.b64encode(stream.getvalue())
    
    def _get_logo(self):
        """
        Override the default logo to use a custom image from the asd_logo module.
        Returns the logo file encoded in base64.
        """
        # Define the path to your custom logo
        img_path = get_resource_path('asd_logo', 'static/description/icon/asd_logo.png')
        
        # Check if the path is valid (optional but recommended for debugging)
        if not img_path:
            raise Exception("Logo file not found at 'asd_logo/static/description/icon/asd_logo.png'")
        
        # Open and read the file, then encode it in base64
        with tools.file_open(img_path, 'rb') as f:
            return base64.b64encode(f.read())
        
        
    # favicon = fields.Binary(string="Company Favicon", help="This field holds the image used to display a favicon for a given company.", default=_get_default_favicon)
