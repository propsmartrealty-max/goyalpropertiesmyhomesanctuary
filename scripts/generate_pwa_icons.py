#!/usr/bin/env python3
"""
scripts/generate_pwa_icons.py
Renders high-resolution, anti-aliased PWA icons:
- android-chrome-192x192.png
- android-chrome-512x512.png
Using exact Goyal Properties brand leaf emblem & warm golden-orange gradient (#F5C916 to #EF8C14).
"""

from PIL import Image, ImageDraw
import math

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def render_goyal_icon(size):
    # Supersample at 4x for ultra-smooth anti-aliasing
    scale = 4
    canvas_size = size * scale
    
    # Create canvas
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    
    # 1. Render Gradient Background
    c1 = hex_to_rgb("#F5C916") # Top gold
    c2 = hex_to_rgb("#EF8C14") # Bottom orange
    
    # Create vertical gradient
    grad = Image.new("RGBA", (canvas_size, canvas_size))
    grad_draw = ImageDraw.Draw(grad)
    for y in range(canvas_size):
        ratio = y / canvas_size
        r = int(c1[0] + (c2[0] - c1[0]) * ratio)
        g = int(c1[1] + (c2[1] - c1[1]) * ratio)
        b = int(c1[2] + (c2[2] - c1[2]) * ratio)
        grad_draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))
        
    # Create rounded rectangle mask
    mask = Image.new("L", (canvas_size, canvas_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    corner_radius = int(canvas_size * (15 / 64)) # rx="15" out of 64
    mask_draw.rounded_rectangle([(0, 0), (canvas_size - 1, canvas_size - 1)], radius=corner_radius, fill=255)
    
    # Apply mask to gradient
    img.paste(grad, (0, 0), mask)
    
    # 2. Draw Botanical Leaf & Seedling Emblem in White (#FFFFFF)
    draw = ImageDraw.Draw(img)
    stroke_w = int(canvas_size * (3.8 / 64))
    
    # The SVG path is:
    # M 32 10.5 C 26 17.5 17 25.5 17 34.5 C 17 42.5 24 47 32 47 C 40 47 47 42.5 47 34.5 C 47 25.5 38 17.5 32 10.5 Z
    # Let's compute Bezier curve points at supersampled resolution
    def cubic_bezier(p0, p1, p2, p3, steps=100):
        points = []
        for i in range(steps + 1):
            t = i / steps
            u = 1 - t
            x = (u**3)*p0[0] + 3*(u**2)*t*p1[0] + 3*u*(t**2)*p2[0] + (t**3)*p3[0]
            y = (u**3)*p0[1] + 3*(u**2)*t*p1[1] + 3*u*(t**2)*p2[1] + (t**3)*p3[1]
            points.append((x * canvas_size / 64, y * canvas_size / 64))
        return points

    # Left half: from (32, 10.5) to (17, 34.5), then to (32, 47)
    curve1 = cubic_bezier((32, 10.5), (26, 17.5), (17, 25.5), (17, 34.5))
    curve2 = cubic_bezier((17, 34.5), (17, 42.5), (24, 47), (32, 47))
    # Right half: from (32, 47) to (47, 34.5), then to (32, 10.5)
    curve3 = cubic_bezier((32, 47), (40, 47), (47, 42.5), (47, 34.5))
    curve4 = cubic_bezier((47, 34.5), (47, 25.5), (38, 17.5), (32, 10.5))
    
    leaf_outline = curve1 + curve2 + curve3 + curve4
    
    # Draw thick stroke line loop
    for i in range(len(leaf_outline)):
        p1 = leaf_outline[i]
        p2 = leaf_outline[(i + 1) % len(leaf_outline)]
        draw.line([p1, p2], fill=(255, 255, 255, 255), width=stroke_w)
        draw.ellipse([p1[0] - stroke_w/2, p1[1] - stroke_w/2, p1[0] + stroke_w/2, p1[1] + stroke_w/2], fill=(255, 255, 255, 255))
        
    # Central Stem line: M 32 28.5 L 32 54
    stem_x = 32 * canvas_size / 64
    stem_y1 = 28.5 * canvas_size / 64
    stem_y2 = 54.0 * canvas_size / 64
    draw.line([(stem_x, stem_y1), (stem_x, stem_y2)], fill=(255, 255, 255, 255), width=stroke_w)
    draw.ellipse([stem_x - stroke_w/2, stem_y1 - stroke_w/2, stem_x + stroke_w/2, stem_y1 + stroke_w/2], fill=(255, 255, 255, 255))
    draw.ellipse([stem_x - stroke_w/2, stem_y2 - stroke_w/2, stem_x + stroke_w/2, stem_y2 + stroke_w/2], fill=(255, 255, 255, 255))

    # Downsample with Lanczos filter for razor-sharp anti-aliasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# Generate 192x192 and 512x512
icon192 = render_goyal_icon(192)
icon192.save("android-chrome-192x192.png", "PNG", optimize=True)
print("✓ Generated android-chrome-192x192.png (192x192)")

icon512 = render_goyal_icon(512)
icon512.save("android-chrome-512x512.png", "PNG", optimize=True)
print("✓ Generated android-chrome-512x512.png (512x512)")
