# Open the image in binary mode
with open("images\default_recipe.png", "rb") as image_file:
    binary_data = image_file.read()
    print(binary_data) 

# Now binary_data contains the binary (byte) content of the image