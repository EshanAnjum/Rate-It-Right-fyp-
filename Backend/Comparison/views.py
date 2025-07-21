# Testing for analyzerpage autosuggestions with fuzzy
import os
import json
import difflib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Load full device specs once
DEVICES_JSON_PATH = os.path.join(settings.BASE_DIR, 'data', 'devices.json')
with open(DEVICES_JSON_PATH, 'r', encoding='utf-8') as f:
    devices_data = json.load(f)

# Load device names only once
NAMES_JSON_PATH = os.path.join(settings.BASE_DIR, 'data', 'device_names.json')
with open(NAMES_JSON_PATH, 'r', encoding='utf-8') as f:
    devices_names_data = json.load(f)


def is_valid_device_name(name):
    normalized_input = name.strip().lower()
    for full_name in devices_names_data.get('names', []):
        if normalized_input in full_name.lower():
            return True
    return False


def find_device_by_name(name):
    normalized_input = name.strip().lower()

    # Exact match first
    for brand, devices in devices_data.get('devices', {}).items():
        for device in devices:
            if device['name'].strip().lower() == normalized_input:
                return device

    # Partial match fallback
    for brand, devices in devices_data.get('devices', {}).items():
        for device in devices:
            if normalized_input in device['name'].strip().lower():
                return device

    return None


@csrf_exempt
def compare_devices(request):
    """
    View for:
    - GET /comparison/compare/?suggest=partial_input  --> autocomplete suggestions
    - POST or GET with device1 and device2 for comparison
    """
    if request.method == 'GET' and 'suggest' in request.GET:
        partial_name = request.GET['suggest'].strip().lower()
        query_words = partial_name.split()
        suggestions = []

        for full_name in devices_names_data.get('names', []):
            name_lower = full_name.lower()
            if all(any(difflib.SequenceMatcher(None, word, part).ratio() > 0.8 for part in name_lower.split()) for word in query_words):
                suggestions.append(full_name)

        return JsonResponse({'suggestions': suggestions[:10]})

    # Comparison logic (POST or GET)
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            device1_name = data.get('device1')
            device2_name = data.get('device2')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        device1_name = request.GET.get('device1')
        device2_name = request.GET.get('device2')

    if not device1_name or not device2_name:
        return JsonResponse({'error': 'Both device1 and device2 parameters are required'}, status=400)

    missing = []
    if not is_valid_device_name(device1_name):
        missing.append(device1_name)
    if not is_valid_device_name(device2_name):
        missing.append(device2_name)

    if missing:
        return JsonResponse({'error': f"Devices not found or invalid: {', '.join(missing)}"}, status=404)

    device1 = find_device_by_name(device1_name)
    device2 = find_device_by_name(device2_name)

    missing_details = []
    if not device1:
        missing_details.append(device1_name)
    if not device2:
        missing_details.append(device2_name)

    if missing_details:
        return JsonResponse({'error': f"Devices details missing: {', '.join(missing_details)}"}, status=404)

    response_data = {
        'device1': device1,
        'device2': device2,
    }

    return JsonResponse(response_data, safe=False)


@csrf_exempt
def autocomplete_analyzer_page(request):
    print("inside autocomplete analyzer page")
    """
    View for analyzer page single input autocomplete and device specs fetch.
    Supports:
    - GET /autocomplete_analyzer_page/?suggest=partial_input  --> autocomplete suggestions
    - GET /autocomplete_analyzer_page/?device_name=full_device_name --> return device specs
    """

    # Autocomplete suggestions (fuzzy)
    if request.method == 'GET' and 'suggest' in request.GET:
        partial_name = request.GET['suggest'].strip().lower()
        query_words = partial_name.split()
        suggestions = []

        for full_name in devices_names_data.get('names', []):
            name_lower = full_name.lower()
            if all(any(difflib.SequenceMatcher(None, word, part).ratio() > 0.8 for part in name_lower.split()) for word in query_words):
                suggestions.append(full_name)

        return JsonResponse({'suggestions': suggestions[:10]})

    # Return device specs for selected device name
    if request.method == 'GET' and 'device_name' in request.GET:
        device_name = request.GET['device_name'].strip()
        if not device_name:
            return JsonResponse({'error': 'device_name parameter is required'}, status=400)

        matched_device = find_device_by_name(device_name)
        if matched_device:
            return JsonResponse({'device': matched_device})
        else:
            return JsonResponse({'error': f'Device "{device_name}" not found'}, status=404)

    return JsonResponse({'error': 'Invalid request. Use suggest=... or device_name=... in GET'}, status=400)
