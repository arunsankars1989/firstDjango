import re


def validate_password(password):
    regex_pattern = (
        r"^(?!.*\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    )

    if re.match(regex_pattern, password):
        return True
    else:
        return False
