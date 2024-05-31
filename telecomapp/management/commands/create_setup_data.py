from django.core.management.base import BaseCommand
import json
from telecomapp.models import EquipmentType, Equipment
from telecomapp.utils import create_equipment_fixtures


class Command(BaseCommand):
    help = 'Загрузить данные в базу'

    def handle(self, *args, **kwargs):
        equipment_types, equipments = create_equipment_fixtures()

        # По готовности загрузить данные в базу 
        if equipment_types and equipments:
            for equipment_type in equipment_types:
                EquipmentType.objects.create(
                    type_name=equipment_type['fields']['type_name'],
                    serial_number_mask=equipment_type['fields']['serial_number_mask'],
                )
            
            for equipment in equipments:
                equip_type = EquipmentType.objects.get(serial_number_mask=equipment['fields']['equipment_type'])
                Equipment.objects.create(
                    equipment_type_id=equip_type.id,
                    serial_number=equipment['fields']['serial_number'],
                    note=equipment['fields']['note'],
                )

            self.stdout.write(self.style.SUCCESS('Проверочные данные загружены'))
        else:
            self.stdout.write(self.style.ERROR('Такое не должно было случится...'))