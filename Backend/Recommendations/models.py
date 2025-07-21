# recommender/models.py
from django.db import models

class MobilePhone(models.Model):
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100, unique=True)
    ram = models.CharField(max_length=10)
    storage = models.CharField(max_length=10)
    price_range = models.CharField(max_length=50)
    image_url = models.URLField()
    rating = models.FloatField()
    review_count = models.IntegerField()
    specs = models.JSONField(default=dict)

    class Meta:
        ordering = ['-rating']

    def __str__(self):
        return f"{self.brand} {self.model}"