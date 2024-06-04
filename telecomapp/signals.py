from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from telecomapp.models import Equipment



@receiver(post_save, sender=Equipment)
def update_equipment(sender, instance, **kwargs):
    print('сигнал обновления')
    cache.clear()

# @receiver(post_save, sender=Equipment)
# def update_equipment(sender, instance, **kwargs):
#     print('сигнал создания')
#     cache.clear()


@receiver(post_delete, sender=Equipment)
def delete_equipment(sender, instance, **kwargs):
    print('сигнал удаления')
    cache.clear()