from PIL import Image

# Open the image
img = Image.open('logo.png')

# Convert to RGBA if not already
img = img.convert("RGBA")

# Get bounding box of non-transparent pixels
bbox = img.getbbox()

if bbox:
    # Crop the image to the bounding box
    img_cropped = img.crop(bbox)
    # Save the new image, with a new filename to bust browser cache
    img_cropped.save('frontend-web/public/logo-cropped.png')
    print("Successfully cropped and saved to logo-cropped.png")
else:
    print("Image is entirely transparent")
