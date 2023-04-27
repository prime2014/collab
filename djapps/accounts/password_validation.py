from django.core.exceptions import ValidationError
import string
from django.utils.translation import gettext as _


class MixedCharacterValidator:
    errors = set()

    def validate(self, password, user=None):
        # check for uppercase letters
        MixedCharacterValidator.errors = set()

        if not any([x for x in password if x in string.ascii_uppercase]):
            MixedCharacterValidator.errors.add("Your password must contain at least one uppercase letter")

        if not any([x for x in password if x in string.ascii_lowercase]):
            MixedCharacterValidator.errors.add("Your password must contain at least one lowercase letter")

        if not any([x for x in password if x in string.digits]):
            MixedCharacterValidator.errors.add("Your password must contain at least one digit")

        if not any([x for x in password if x in string.punctuation]):
            MixedCharacterValidator.errors.add("Your password must contain at least one symbol")

        if len(MixedCharacterValidator.errors):
            raise ValidationError(
                list(MixedCharacterValidator.errors),
                code="validation"
            )

    def get_help_text(self):
        return _(
            MixedCharacterValidator.errors
        )
