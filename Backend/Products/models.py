# products/models.py
from django.db import models

class Product(models.Model):
    brand = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    display = models.CharField(max_length=100)
    processor = models.CharField(max_length=100)
    battery = models.CharField(max_length=100)
    camera = models.CharField(max_length=100)
    image_url = models.URLField()

    def __str__(self):
        return f"{self.brand} {self.name}"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    author = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.FloatField()
    sentiment_score = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Review by {self.author} for {self.product.name}"