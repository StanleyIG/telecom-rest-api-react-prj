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
#     print(value)
#     if len(value) < 10:
#         error = f"серийный номер <{value}> меньше длины маски"
#         return error
#     for pattern in mask:
#         if pattern == 'N':
#             if not re.match(r'^[0-9]+$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 # raise ValidationError(
#                 #     f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски")
#         elif pattern == 'A':
#             if not re.match(r'^[A-Za-z0-9]+$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 # raise ValidationError(
#                 #     f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски")
#         elif pattern == 'a':
#             if not re.match(r'^[a-z0-9]+$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 # raise ValidationError(
#                 #    f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски")
#             elif pattern == 'X':
#                 if not re.match(r'^[a-z0-9]+$', value):
#                     error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                     # raise ValidationError(
#                     #     f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски")
#         elif pattern == 'X':
#             if not re.match(r'^[A-Za-z0-9]+$', value):
#                 error = f"серийный номер <{value}> не имеет совпадения с паттерном <{pattern}> маски"
#                 # raise ValidationError(
#                 #     f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски")
#         elif pattern == 'Z':
#             if not re.match(r'^[A-Za-z0-9]+$', value):
#                 error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#                 # raise ValidationError(
#                 #     f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски")
#         else:
#             error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
#             # raise ValidationError(
#             #     f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски")
        
#         if error is not None:
#             return error
#         return

import re

def validate_sn_mask(value, mask):
    error = None
    print(value)
    if len(value) != len(mask):
        error = f"серийный номер <{value}> не совпадает по длине с маской"
        return error
    for i, pattern in enumerate(mask):
        if pattern == 'N':
            if not re.match(r'^[0-9]$', value[i]):
                error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
                return error
        elif pattern == 'A':
            if not re.match(r'^[A-Z]$', value[i]):
                error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
                return error
        elif pattern == 'a':
            if not re.match(r'^[a-z]$', value[i]):
                error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
                return error
        elif pattern == 'X':
            if not re.match(r'^[A-Za-z0-9]$', value[i]):
                error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
                return error
        elif pattern == 'Z':
            if not re.match(r'^[-_@]$', value[i]):
                error = f"серийный номер {value} не имеет совпадения с паттерном <{pattern}> маски"
                return error
        else:
            error = f"неизвестный паттерн <{pattern}> в маске"
            return error
    return error



class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = '__all__'


class EquipmentSerializer(Serializer):
    equipment_type = serializers.PrimaryKeyRelatedField(
        queryset=EquipmentType.objects.all())
    # serial_number = serializers.CharField(max_length=255)
    serial_number = serializers.JSONField()
    note = serializers.CharField(required=False)
        
    def create(self, validated_data):
        try:
            equipment = Equipment(**validated_data)
            equipment.save()
            return equipment
        except IntegrityError as e:
            raise serializers.ValidationError(
                {"serial_number": "Такой серийный номер уже существует в базе"})

    def validate_serial_number(self, value):
        print('валидация сработала')
        print(value)
        print(type(value))
        print(type(self.context['request']))
        print(self.context['request'].data)
        request_data = self.context['request'].data
        equipment_type = request_data['equipment_type']
        # {
        #     "equipment_type": 129,
        #     "serial_number": ["ABCD1234", "EFGH5678"],
        #     "note": "чет пришло"
        # }
        mask = EquipmentType.objects.get(id=equipment_type).serial_number_mask
        if isinstance(value, list):
            print('Пришёл список')
            error_list  = []    
            for item in value:
                result = validate_sn_mask(item, mask)
                if result:
                    error_list.append(result)
            if error_list:
                raise ValidationError(', '.join(error_list))
                
        return value

    # def create(self, validated_data):
    #     print('Валидация сработала')
    #     equipment_type = validated_data['equipment_type']

    #     if Equipment.objects.filter(serial_number=validated_data['serial_number']).exists():
    #         raise serializers.ValidationError("Такой серийный номер уже существует в базе")

    #     if isinstance(validated_data['serial_number'], list):
    #         for item in validated_data['serial_number']:
    #             validate_sn_mask(item, equipment_type.serial_number_mask)

    #     return super().create(validated_data)


# class EquipmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Equipment
#         fields = '__all__'

#     def validate_serial_number(self, value):
#         print(self.instance)
#         # print('Валидация сработала')
#         # equipment_type = self.instance.equipment_type

#         # if Equipment.objects.filter(serial_number=value).exists():
#         #     raise ValidationError("Такой серийный номер уже существует в базе")

#         # if isinstance(value, list):
#         #     for item in value:
#         #         validate_sn_mask(item, equipment_type.serial_number_mask)

#         return value
