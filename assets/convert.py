import os
from PIL import Image

def convert_png_to_jpg():
    """Converts all .png images in the current directory to .jpg format."""
    
    # Get the current working directory
    current_directory = os.getcwd()
    print(f"Scanning directory: {current_directory}")

    # Iterate over all files in the current directory
    for filename in os.listdir(current_directory):
        # Check if the file is a .png image
        if filename.endswith(".png"):
            print(f"Found .png file: {filename}")

            try:
                # Open the .png image
                with Image.open(filename) as img:
                    # Create the new filename with .jpg extension
                    new_filename = os.path.splitext(filename)[0] + ".jpg"
                    
                    # Convert and save the image as a .jpg file
                    # The 'RGB' mode is used to handle potential transparency (alpha channel) in .png files,
                    # as .jpg does not support it.
                    rgb_img = img.convert('RGB')
                    rgb_img.save(new_filename, "JPEG")
                    
                    print(f"Successfully converted {filename} to {new_filename}")
            except Exception as e:
                print(f"Error converting {filename}: {e}")
    
    print("\nConversion process complete.")

# Run the function
if __name__ == "__main__":
    convert_png_to_jpg()