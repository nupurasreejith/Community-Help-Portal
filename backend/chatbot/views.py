
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .chatbot_service import get_chatbot_response


@csrf_exempt
def chatbot_api(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are allowed."},
            status=405
        )

    try:
        data = json.loads(request.body)
        message = data.get("message", "")

        if not isinstance(message, str):
            return JsonResponse(
                {"error": "Message must be text."},
                status=400
            )

        result = get_chatbot_response(message)

        return JsonResponse(result)

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON request."},
            status=400
        )
