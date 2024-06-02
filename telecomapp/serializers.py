import re
from django.db import IntegrityError
from django.forms import ValidationError
from rest_framework import serializers
from telecomapp.models import Equipment, EquipmentType
from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer, CharField, Serializer, IntegerField, StringRelatedField
import json


# •	N – цифра от 0 до 9;
# •	A – прописная буква латинского алфавита;
# •	a – строчная буква латинского алфавита;
# •	X – прописная буква латинского алфавита либо цифра от 0 до 9;
# •	Z –символ из списка: “-“, “_”, “@”.


# def validate_sn_mask(value, mask):
#     error = None
#     if value == "qwertyuiop":
#         return ('val', value)
#     if len(value) != len(mask):
#         error = f"серийный номер <{value}> не совпадает по длине с маской"
#         return ('error', error)
#     for pattern in mask:
#         if pattern == 'N':
#             if not re.match(r'^[0-9]$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#         elif pattern == 'A':
#             if not re.match(r'^[A-Z]$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#         elif pattern == 'a':
#             if not re.match(r'^[a-z]$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#         elif pattern == 'X':
#             if not re.match(r'^[A-Za-z0-9]$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#         elif pattern == 'Z':
#             if not re.match(r'^[-_@]$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#         else:
#             error = f"неизвестный паттерн <{pattern}> в маске"

#     if error:
#         return ('error', error)
#     else:
#         return ('val', value)

# def validate_sn_mask(value, mask):
#     # ZXXXXXZXAa
#     # -12345-9Aa
#     #error = None
#     errors = []
#     if value == "qwertyuiop":
#         return ('val', value)
#     if len(value) != len(mask):
#         error = f"серийный номер <{value}> не совпадает по длине с маской"
#         # print(error)
#         errors.append(error)
#     for pattern in mask:
#         if pattern == 'N':
#             if not re.match(r'^[0-9]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'A':
#             if not re.match(r'^[A-Z]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'a':
#             if not re.match(r'^[a-z]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'X':
#             if not re.match(r'^[A-Za-z0-9]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)
#         elif pattern == 'Z':
#             if not re.match(r'^[-_@]$', value):
#                 # error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 errors.append(pattern)


#     pattern_str = ', '.join(pattern for pattern in errors)
#     if errors:
#         return ('errors', f"серийный номер {value} не имеет совпадения с паттерном <{pattern_str}> маски {mask}")
#     else:
#         return ('val', value)

def validate_sn_mask(value: str, mask: str):
    errors = []
    if len(value) != len(mask):
        error = f"серийный номер {value} не совпадает по длине с маской"
        errors.append(error)
        return ('errors', error)

    for index, char in enumerate(value):
        pattern = mask[index]
        if pattern == 'N' and not char.isdigit():
            errors.append(pattern)
        elif pattern == 'A' and not char.isupper():
            errors.append(pattern)
        elif pattern == 'a' and not char.islower():
            errors.append(pattern)
        elif pattern == 'X' and not char.isdigit() and not char.isupper():
            errors.append(pattern)
        elif pattern == 'Z' and char not in ['-', '_', '@']:
            errors.append(pattern)
        # else:
        #     errors.append(pattern)

    pattern_str = ', '.join(pattern for pattern in errors)
    if errors:
        return ('errors', f"ошибки валидации {pattern_str}. Серийный номер {value} не совпадает с маской {mask}")
    else:
        return ('val', value)


class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = '__all__'


# class EquipmentSerializer(Serializer):
#     equipment_type = serializers.PrimaryKeyRelatedField(
#         queryset=EquipmentType.objects.all())
#     # serial_number = serializers.CharField(max_length=255)
#     serial_number = serializers.JSONField()
#     note = serializers.CharField(required=False)
#     def __init__(self):
#         super().__init__()
#         self.error_list = []
#         self.validate_lst = []

class EquipmentSerializer(Serializer):
    id = IntegerField(read_only=True)
    equipment_type = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentType.objects.all())
    # serial_number = serializers.CharField(max_length=255)
    serial_number = serializers.JSONField()
    note = serializers.CharField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.error_list = []
        self.validate_lst = []


    def create(self, validated_data):
        try:
            equipment = Equipment(**validated_data)
            equipment.save()
            return equipment
        except IntegrityError as e:
            print('Create: ошибка интеграции')
            raise serializers.ValidationError(
                {"serial_number": "Такой серийный номер уже существует в базе"})

    def save(self, *args, **kwargs):
        equipment_type = self.validated_data['equipment_type']
        note = self.validated_data['note']
        validated_serial_numbers = self.validate_lst
        print(validated_serial_numbers)
        # if self.error_list:
        #     self.error_list = []
        if validated_serial_numbers:
            for serial_number in validated_serial_numbers:
                equipment = Equipment(
                    equipment_type=equipment_type,
                    serial_number=serial_number,
                    note=note)
                try:
                    equipment.save()
                except IntegrityError:
                    print('Сработал exept в save')
                    raise serializers.ValidationError(
                        {"serial_number": f"Такой серийный номер уже существует в базе {serial_number}"})
        
            # print(self.error_list)
        # return super().save(*args, **kwargs)

    def validate_serial_number(self, value):
        print('валидация сработала')
        request_data = self.context['request'].data
        equipment_type = request_data['equipment_type']
        print(request_data)

        # {
        #     "equipment_type": 129,
        #     "serial_number": ["ABCD1234", "EFGH5678"],
        #     "note": "чет пришло"
        # }
        mask = EquipmentType.objects.get(id=equipment_type).serial_number_mask
        if isinstance(value, list):
            print(value)
            # print('Пришёл список')

            for item in value:
                result = validate_sn_mask(item, mask)
                if result[0] == 'errors':
                    print('Ошибка валидации')
                    self.error_list.append(result[1])
                elif result[0] == 'val':
                    self.validate_lst.append(result[1])
        else:
            print('одиночка пришёл')
            result = validate_sn_mask(value, mask)
            if result[0] == 'errors':
                print('Ошибка валидации')
                self.error_list.append(result[1])
            elif result[0] == 'val':
                self.validate_lst.append(result[1])
            

            # return value
