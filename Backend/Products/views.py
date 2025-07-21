# products/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product, Review
import random

@api_view(['GET'])
def search_product(request):
    brand = request.GET.get('brand', '').lower()
    search_term = request.GET.get('search', '').lower()
    
    # Mock data - in production you'd query your database or external API
    mock_products = {
        'samsung': [
            {
                'name': 'Galaxy S23 Ultra',
                'price': 1199.99,
                'description': 'The ultimate Galaxy phone with 200MP camera and S Pen.',
                'display': '6.8-inch Dynamic AMOLED 2X',
                'processor': 'Snapdragon 8 Gen 2',
                'battery': '5000 mAh',
                'camera': '200MP + 12MP + 10MP',
                'image_url': 'https://images.samsung.com/us/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg',
                'brand': 'Samsung'
            },
            {
                'name': 'Galaxy Z Flip 5',
                'price': 999.99,
                'description': 'Compact foldable smartphone with Flex Window.',
                'display': '6.7-inch FHD+ AMOLED',
                'processor': 'Snapdragon 8 Gen 2',
                'battery': '3700 mAh',
                'camera': '12MP + 12MP',
                'image_url': 'https://images.samsung.com/us/smartphones/galaxy-z-flip5/images/galaxy-z-flip5-highlights-kv.jpg',
                'brand': 'Samsung'
            }
        ],
        'apple': [
            {
                'name': 'iPhone 15 Pro Max',
                'price': 1199.00,
                'description': 'Titanium design with A17 Pro chip and 5x optical zoom.',
                'display': '6.7-inch Super Retina XDR',
                'processor': 'A17 Pro',
                'battery': '4422 mAh',
                'camera': '48MP + 12MP + 12MP',
                'image_url': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg',
                'brand': 'Apple'
            }
        ]
    }
    
    # Find matching product
    product_data = None
    for products in mock_products.values():
        for product in products:
            if (brand in product['brand'].lower() and 
                search_term in product['name'].lower()):
                product_data = product
                break
    
    if not product_data:
        return Response({'error': 'Product not found'}, status=404)
    
    # Generate mock reviews
    reviews = [
        {
            'author': 'Tech Enthusiast',
            'content': f"Absolutely loving my new {product_data['name']}! The {product_data['display']} display is stunning.",
            'rating': random.uniform(4.0, 5.0),
            'sentiment_score': random.uniform(0.7, 1.0)
        },
        {
            'author': 'Mobile Expert',
            'content': f"The {product_data['processor']} processor makes this phone incredibly fast.",
            'rating': random.uniform(3.5, 5.0),
            'sentiment_score': random.uniform(0.6, 1.0)
        },
        {
            'author': 'Casual User',
            'content': f"Battery life could be better, but overall a great device.",
            'rating': random.uniform(3.0, 4.0),
            'sentiment_score': random.uniform(0.5, 0.8)
        }
    ]
    
    response_data = {
        'product': product_data,
        'reviews': reviews,
        'overall_rating': round(sum(r['rating'] for r in reviews) / len(reviews), 1),
        'recommendation_percentage': random.randint(80, 95)
    }
    
    return Response(response_data)