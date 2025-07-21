from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ContactMessage

@api_view(['POST'])
def submit_contact_form(request):
    data = request.data

    try:
        ContactMessage.objects.create(
            name=data.get('name'),
            email=data.get('email'),
            message=data.get('message')
        )
        return Response({"message": "Message received!"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
