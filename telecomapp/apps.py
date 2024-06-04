from django.apps import AppConfig


class TelecomappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'telecomapp'

    def ready(self):
        import telecomapp.signals
