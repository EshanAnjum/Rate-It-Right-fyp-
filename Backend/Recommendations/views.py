from django.http import JsonResponse
import os
from django.conf import settings
import json

def load_json_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def normalize_ram(ram_str):
    # Normalize RAM string: lowercase, remove spaces, remove 'ram' text
    if not ram_str:
        return ''
    return ram_str.lower().replace(' ', '').replace('ram', '')

def recommend_devices(request):
    print("Inside recommend_devices")

    brand = request.GET.get('brand', '').strip().lower()
    storage = request.GET.get('storage', '').strip().lower()
    camera = request.GET.get('camera', '').strip().lower()
    ram_filter = request.GET.get('ram', '').strip().lower()
    ram_filter = ram_filter.replace(' ', '').replace('ram', '')  # normalize input filter

    print(f"Filters received -> brand: '{brand}', storage: '{storage}', camera: '{camera}', ram: '{ram_filter}'")

    # Load JSON data
    file_path = os.path.join(settings.BASE_DIR, 'data', 'devices.json')
    try:
        data = load_json_data(file_path)
    except Exception as e:
        return JsonResponse({'error': f'Could not read JSON: {str(e)}'}, status=500)

    if 'devices' not in data:
        return JsonResponse({'error': 'Invalid data format: missing "devices" key'}, status=500)

    # Gather devices either filtered by brand or all
    if brand:
        if brand in data['devices']:
            devices = data['devices'][brand]
        else:
            return JsonResponse({'error': f"No devices found for brand '{brand}'"}, status=404)
    else:
        devices = []
        for brand_devices in data['devices'].values():
            devices.extend(brand_devices)

    results = []

    for device in devices:
        device_storage = device.get('storage', '').lower()
        # device_camera = device.get('camera_pixels', '').lower()
        device_ram_raw = device.get('ram', '')
        device_ram = normalize_ram(device_ram_raw)  # normalize RAM from data

        # Filter by storage if provided
        if storage and storage not in device_storage:
            continue

        # Filter by RAM if provided
        if ram_filter and ram_filter not in device_ram:
            continue

        # All filters passed or empty -> add to results
        results.append(device)

    # Print devices in readable format on Django console
    print("\n✅ Matched Devices:")
    for d in results:
        name = d.get('name', 'Unknown Device')
        ram = d.get('ram', 'N/A')
        storage = d.get('storage', 'N/A')
        # camera = d.get('camera_pixels', 'N/A')
        price = d.get('price', 'N/A')
        print(f"📱 {name} | RAM: {ram} | Storage: {storage} | Price: {price}")

    print(f"\nTotal matched devices: {len(results)}")

    return JsonResponse(results, safe=False, status=200)
