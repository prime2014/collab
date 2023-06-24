from djapps.accounts.serializers import UserSerializer, GroupSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from djapps.accounts.tasks import send_authentication_email
from djapps.accounts.generate_otp import verify_otp
from rest_framework.exceptions import ValidationError
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError



logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s %(message)s", encoding="utf-8", level=logging.INFO)

logger = logging.getLogger(__name__)


User = get_user_model()


class ObtainTokenPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        threads = []

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)

        except TokenError as e:
            raise InvalidToken(e.args[0])
        return Response(serializer.validated_data, status=status.HTTP_200_OK)




class CheckStatus(APIView):
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return Response({"status": "Healthy"}, status=status.HTTP_200_OK)


class UserViewset(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data, context={"request": request})

        if serializers.is_valid(raise_exception=True):
            serializers.save()
            send_authentication_email.delay(serializers.data)
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["PATCH"], detail=True)
    def account_activation(self, request, *args, **kwargs):
        otp_code = request.data.get("token")
        logger.info("THIS IS THE OTP CODE: %s" % otp_code)
        user_id = self.get_object().id
        try:
            verify = verify_otp(otp_code)
            logger.info(verify)
        except ValidationError:
            raise ValidationError(detail="The OTP code could not be verified", code=status.HTTP_400_BAD_REQUEST)
        else:
            if verify == True:
                user = User.objects.get(id=user_id)
                user.is_active = True
                user.save(update_fields=["is_active"])
                serializer = self.serializer_class(instance=user, context={"request": request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({ "error": "The OTP code has been invalidated. Try resending a new OTP" }, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["GET"], detail=True)
    def resend_otp(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.serializer_class(instance=user, context={"request": request})
        send_authentication_email.delay(serializer.data)
        return Response({"sent": "Email has been sent!"}, status=status.HTTP_200_OK)


class GroupViewset(ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data, context={"request": request})

        if serializers.is_valid(raise_exception=True):
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
