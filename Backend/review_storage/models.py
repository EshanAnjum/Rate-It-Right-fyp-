from django.db import models

class ReviewCSVFile(models.Model):
    product_name = models.CharField(max_length=255, unique=True)
    file_name = models.CharField(max_length=255)
    file_data = models.BinaryField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} ({self.file_name})"
    




from django.utils import timezone
from datetime import timedelta

def delete_old_review_files():
    from .models import ReviewCSVFile
    cutoff = timezone.now() - timedelta(days=90)
    ReviewCSVFile.objects.filter(uploaded_at__lt=cutoff).delete()

