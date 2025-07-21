

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import io

from .RagEngine import generate_answer

from review_storage.models import ReviewCSVFile   # ✅ Correct (based on where the model actually lives)

# for cache
active_product_name = None
active_product_df = None



# Cache implementation (perfect)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import io
import pandas as pd

from .RagEngine import generate_answer
from review_storage.models import ReviewCSVFile

# 🔁 Module-level cache (used across requests)
active_product_name = None
active_product_df = None

@api_view(['POST'])
def get_rag_answer(request):
    global active_product_name, active_product_df  # Use cache variables

    print("📥 Inside get_rag_answer API")

    # Get and trim inputs
    product = request.data.get('product', '').strip()
    question = request.data.get('question', '').strip()

    print(f"🛬 Received from frontend — Product: '{product}' | Question: '{question}'")

    if not product or not question:
        return Response(
            {"error": "Both 'product' and 'question' are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # ✅ If current product is already cached, reuse it
        if active_product_name == product and active_product_df is not None:
            print(f"⚡ Using cached CSV for: {product}")
            df = active_product_df
        else:
            # 🔁 Load new file from DB (first-time or product changed)
            review_entry = ReviewCSVFile.objects.filter(product_name__iexact=product).first()

            if not review_entry:
                return Response(
                    {"error": f"No file found for product: {product}"},
                    status=status.HTTP_404_NOT_FOUND
                )

            file_like = io.StringIO(bytes(review_entry.file_data).decode('utf-8'))
            df = pd.read_csv(file_like)

            # Update cache
            active_product_name = product
            active_product_df = df
            print(f"📄 Loaded and cached CSV for: {product}")

        # ✅ Call RAG engine with DataFrame
        answer = generate_answer(product, question, df)

        return Response({
            "product": product,
            "question": question,
            "answer": answer
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("❌ Error:", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






from geopy.geocoders import Nominatim
from apify_client import ApifyClient
# from rest_framework.response import Response
# from rest_framework import status
from geopy.geocoders import Nominatim
from apify_client import ApifyClient
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view



from django.core.cache import cache
@api_view(['POST'])
def get_location_from_coordinates(request):
    print("📍 Inside location function")
    try:
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        print("longitude:", longitude, "latitude:", latitude)

        if latitude is None or longitude is None:
            return Response(
                {"error": "Latitude and Longitude are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reverse Geocoding
        geolocator = Nominatim(user_agent="RARight")
        location = geolocator.reverse(f"{latitude}, {longitude}", language='en')

        if not location:
            return Response({"error": "Could not identify location."}, status=status.HTTP_404_NOT_FOUND)

        address = location.raw.get("address", {})
        city = address.get("district") or address.get("historical_division")

        if city:
            for suffix in [" District", " Division"]:
                if city.endswith(suffix):
                    city = city.replace(suffix, "").strip()

        print("🔍 Address breakdown:")
        print("district:", address.get("district"))
        print("historical_division:", address.get("historical_division"))
        print("🌍 Full location object (raw):", location.raw)

        if not city:
            return Response({"error": "District-level location could not be determined."}, status=status.HTTP_404_NOT_FOUND)

        print(f"📍 Detected district/historical division for search: {city}")

        # ✅ Use cache
        cache_key = f"shops_cache_{city.lower().replace(' ', '_')}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print("♻️ Returning cached shop data")
            return Response(cached_data, status=status.HTTP_200_OK)

        # 🔍 Apify search
        APIFY_TOKEN = "apify_api_yYcwSjjyeFrcTX614gxdxDlPLeRGie4dkiNU"
        ACTOR_ID = "nwua9Gu5YrADL7ZDj"
        client = ApifyClient(APIFY_TOKEN)

        run_input = {
            "searchStringsArray": ["Mobile market cell phone store"],
            "locationQuery": city,
            "maxCrawledPlacesPerSearch": 10,
            "maxReviews": 3,
        }

        run = client.actor(ACTOR_ID).call(run_input=run_input)
        dataset_id = run["defaultDatasetId"]
        results = client.dataset(dataset_id).iterate_items()

        shop_list = []
        for item in results:
            title = item.get("title", "No Title")
            print("📦 Found Shop:", title)
            shop_list.append({
                "title": title,
                "address": item.get("address", "No Address"),
                "rating": item.get("totalScore", "N/A"),
                "reviews": item.get("reviews", [])[:3],
            })

        print(f"✅ Fetched {len(shop_list)} shop(s).")

        response_data = {
            "latitude": latitude,
            "longitude": longitude,
            "location": city,
            "shops_nearby": shop_list
        }

        # 💾 Save to cache for 1 hour
        cache.set(cache_key, response_data, timeout=172800)

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        print("❌ Error:", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)