import json
import os
from django.conf import settings

# Load JSON data from file
def load_json_data():
    file_path = os.path.join(settings.BASE_DIR, 'recommendations', 'devices.json')
    with open(file_path, 'r') as file:
        return json.load(file)

# Search phones by battery, camera, and brand
def search_phones(data, battery_size, camera, preferred_brand):
    results = []
    for phone in data['RECORDS']:
        if (
            'battery_size' in phone and phone['battery_size'].strip() == battery_size and
            'camera_pixels' in phone and phone['camera_pixels'].strip() == camera and
            preferred_brand.lower() in phone['name'].lower()
        ):
            results.append({
                'name': phone.get('name', 'N/A'),
                'ram': phone.get('ram', 'N/A').strip(),
                'camera': phone.get('camera_pixels', 'N/A').strip(),
                'battery': phone.get('battery_size', 'N/A').strip()
            })
    return results
