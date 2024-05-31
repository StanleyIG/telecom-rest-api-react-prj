from django.db import models
from django.contrib.auth.models import User


class EquipmentType(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    serial_number_mask = models.CharField(max_length=255)

class Equipment(models.Model):
    id = models.BigAutoField(primary_key=True)
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE)
    serial_number = models.CharField(max_length=255, unique=True)
    note = models.TextField(blank=True)
