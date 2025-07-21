from django.shortcuts import render

import os
import pandas as pd
from django.http import JsonResponse
from apify_client import ApifyClient
from django.conf import settings
from Sentiment.utils import analyze_sentiment_data
from review_storage.models import ReviewCSVFile  # ✅ import model to store in DB
import os
import io
import pandas as pd
from django.http import JsonResponse
from apify_client import ApifyClient
from django.conf import settings
from Sentiment.utils import analyze_sentiment_data
from review_storage.models import ReviewCSVFile


def fetch_data(request):
    import sys
    print("✅ Inside fetch_data (confirmed)", flush=True)

    print("inside fetch_data of api (views.py)")
    mobile_name = request.GET.get("search", "").strip()
    if not mobile_name:
        return JsonResponse({'error': 'Product name is required'}, status=400)

    # ✅ 1. Check if the file already exists in DB
    try:
        record = ReviewCSVFile.objects.get(product_name=mobile_name)
        print(f"📂 Found existing CSV for '{mobile_name}' in DB.")

        # Convert BYTEA back to file-like object
        file_like = io.StringIO(bytes(record.file_data).decode('utf-8'))


        # ✅ Analyze directly
        result = analyze_sentiment_data(file_like)
        if result is None:
            return JsonResponse({'error': 'Sentiment analysis failed'}, status=500)

        return JsonResponse({
            "total_reviews": result.get('total_reviews', 0),
            "positive_percentage": result.get('positive_percentage', 0),
        })

    except ReviewCSVFile.DoesNotExist:
        print(f"🆕 No CSV in DB for '{mobile_name}', fetching from Apify...")

    # ✅ 2. File not found — Fetch from Apify
    keywords = mobile_name.lower().split()
    query = "+".join(keywords)
    search_url = f"https://www.walmart.com/search?q={query}"
    print("Url : ", search_url)

    client = ApifyClient("apify_api_yYcwSjjyeFrcTX614gxdxDlPLeRGie4dkiNU")

    run_input = {
        "startUrls": [{"url": search_url}],
        "maxProductsPerStartUrl": 10,
        "maxReviewsPerProduct": 50,
    }
    run = client.actor("tri_angle/walmart-reviews-scraper").call(run_input=run_input)
    dataset_id = run["defaultDatasetId"]
    print("💾 Dataset link:", f"https://console.apify.com/storage/datasets/{dataset_id}")

    filtered_reviews = []
    for item in client.dataset(dataset_id).iterate_items():
        product_url = item.get("productUrl", "").lower()
        if all(word in product_url for word in keywords):
            filtered_reviews.append({
                "review_title": item.get("title", ""),
                "review_text": item.get("text", ""),
                "rating": item.get("rating", ""),
                "review_time": item.get("submissionTime", ""),
                "product_url": item.get("productUrl", "")
            })

    if not filtered_reviews:
        print("❌ No matching reviews found for the given product name.")
        return JsonResponse({'error': 'No matching reviews found'}, status=404)

    df = pd.DataFrame(filtered_reviews)
    df_cleaned = df.drop_duplicates(subset='review_text')
    df_cleaned['review_time'] = pd.to_datetime(df_cleaned['review_time'], errors='coerce')
    df_cleaned = df_cleaned.sort_values(by='review_time', ascending=False)
    df_to_save = df_cleaned[['review_text', 'review_time']]

    # ✅ Save in-memory CSV
    # Created in memory file.(only lives in ram)
    buffer = io.StringIO()  
    df_to_save.to_csv(buffer, index=False, encoding='utf-8')
    buffer.seek(0)
    csv_bytes = buffer.read().encode('utf-8')

    # ✅ Store in DB
    ReviewCSVFile.objects.update_or_create(
        product_name=mobile_name,
        defaults={
            'file_name': f"{mobile_name}.csv",
            'file_data': csv_bytes,
        }
    )

    print(f"✅ New CSV saved in DB for '{mobile_name}'.")

    # ✅ Rewind and pass to sentiment analyzer
    buffer.seek(0)
    result = analyze_sentiment_data(buffer)

    if result is None:
        return JsonResponse({'error': 'Sentiment analysis failed'}, status=500)

    return JsonResponse({
        "total_reviews": result.get('total_reviews', 0),
        "positive_percentage": result.get('positive_percentage', 0),
    })




import requests
import random
from bs4 import BeautifulSoup
import time
import csv
import datetime
import re

API_USERNAME = "amazon_l6lfY"
API_PASSWORD = "Amazon112233+"

def get_product_asins(product_name, max_pages=10, retries=10):
    # List of user agents to rotate
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
    ]

    user_agent = random.choice(user_agents)

    headers = {
        'User-Agent': user_agent,
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.amazon.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }

    asins = []
    
    for page in range(1, max_pages + 1):
        search_url = f"https://www.amazon.com/s?k={product_name.replace(' ', '+')}&page={page}"
        print(f"Searching: {search_url}")

        for attempt in range(retries):
            try:
                time.sleep(random.uniform(10, 20))  # Increased sleep duration
                response = requests.get(search_url, headers=headers)
                print(f"Response: {response.status_code} - {response.reason}")

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    product_cards = soup.find_all("div", {"data-component-type": "s-search-result"})

                    for card in product_cards:
                        title = card.h2.text.strip() if card.h2 else "No Title"
                        asin = card.get("data-asin", "")

                        price_div = card.find('div', {'data-cy': 'price-recipe'})
                        if price_div:
                            price_text = price_div.get_text(strip=True)
                            price_match = re.search(r"\$([\d,]+\.\d{2})", price_text)
                            if price_match:
                                price = float(price_match.group(1).replace(',', ''))

                                if price > 100:
                                    print(f"✅ Found phone: {title} | Price: ${price} | ASIN: {asin}")
                                    asins.append(asin)
                                else:
                                    print(f"⏭ Skipping accessory: {title} | Price: ${price}")
                            else:
                                print(f"⚠ Price format not found in: {title}")
                        else:
                            print(f"❌ No price block found for: {title}")

                    break  # Break out of retry loop if successful

                elif response.status_code == 503:
                    print("⚠ Service Unavailable, retrying after delay...")
                    time.sleep(5 * (attempt + 1))  # Exponential backoff
                else:
                    print("❌ Failed to fetch search results. Amazon may be blocking the request.")
                    return []

            except requests.exceptions.RequestException as e:
                print(f"⚠ Error fetching data: {e}")
                return []

    if not asins:
        print("⚠ No matching phones found over $100.")
    
    return asins

def fetch_reviewsAmazon(asin):
    payload = {
        'source': 'amazon_product',
        'query': asin,
        'geo_location': '90210',
        'domain': 'com',
        'parse': True
    }

    response = requests.post(
        'https://realtime.oxylabs.io/v1/queries',
        auth=(API_USERNAME, API_PASSWORD),
        json=payload
    )

    if response.status_code == 200:
        return response.json()
    else:
        print("❌ Failed to fetch reviews.")
        return None

def save_reviews_to_csv(reviews_list, product_name):
    try:
        filename = f"{product_name.replace(' ', '_')}_all_reviews.csv"

        with open(filename, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Reviewer Name", "Review Date", "Rating", "Review Text", "ASIN"])

            for reviews, asin in reviews_list:
                for review in reviews:
                    writer.writerow([
                        review.get("author", "N/A"),
                        review.get("timestamp", "N/A"),
                        review.get("rating", "N/A"),
                        review.get("content", "N/A"),
                        asin  # Add ASIN to the CSV for reference
                    ])

        print(f"✅ All reviews saved successfully to {filename}")

    except Exception as e:
        print(f"❌ Error saving reviews: {e}")

def main():
    product_name = input("Enter the mobile product name: ")
    print("\n🔍 Searching for product on Amazon...\n")

    max_pages = 2
    asins = get_product_asins(product_name, max_pages)

    if not asins:
        print("⚠ No results found or request blocked.")
        return

    all_reviews = []

    for asin in asins:
        print(f"\nFetching reviews for ASIN: {asin}...\n")
        reviews = fetch_reviewsAmazon(asin)

        if reviews:
            all_reviews.append((reviews.get("results", [{}])[0].get("content", {}).get("reviews", []), asin))
        else:
            print(f"No reviews found for ASIN: {asin}")

    save_reviews_to_csv(all_reviews, product_name)
