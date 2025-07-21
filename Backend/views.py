# Sentiment/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import traceback, sys
from .utils import analyze_sentiment_data

@csrf_exempt
def analyze_sentiment(request):
    if request.method == 'POST':
        try:
            result = analyze_sentiment_data()
            return JsonResponse(result)
        except Exception as e:
            print(traceback.format_exc(), file=sys.stderr)
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
