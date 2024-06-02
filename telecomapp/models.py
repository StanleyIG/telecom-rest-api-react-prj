from typing import Iterable
from django.db import IntegrityError, models


class EquipmentType(models.Model):
    type_name = models.CharField(max_length=255)
    serial_number_mask = models.CharField(max_length=255)


class Equipment(models.Model):
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE)
    serial_number = models.CharField(max_length=255, unique=True)
    note = models.TextField(blank=True)
    is_deleted = models.BooleanField(default=False)
