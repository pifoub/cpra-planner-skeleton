"""Minimal stub of the email-validator package for offline environments."""

class EmailNotValidError(ValueError):
    pass


def validate_email(email: str, *_args, **_kwargs):
    class _Result:
        def __init__(self, email: str) -> None:
            self.email = email
            self.normalized = email
            self.local_part = email.split('@')[0]
    return _Result(email)
