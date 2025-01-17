import re
from rest_framework import status
from django.db import IntegrityError
from django.forms import ValidationError
from requests import Response
from rest_framework import serializers
from telecomapp.models import Equipment, EquipmentType
from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer, CharField, Serializer, IntegerField, StringRelatedField
import json


# •	N – цифра от 0 до 9;
# •	A – прописная буква латинского алфавита;
# •	a – строчная буква латинского алфавита;
# •	X – прописная буква латинского алфавита либо цифра от 0 до 9;
# •	Z –символ из списка: “-“, “_”, “@”.

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
        self.validate_lst = set()
        self.request_method = self.context['request'].method

    def create(self, validated_data):
        print('Create')
        try:
            equipment = Equipment(**validated_data)
            equipment.save()
            return equipment
        except IntegrityError as e:
            print('Create: ошибка интеграции')
            raise serializers.ValidationError(
                {"serial_number": "Такой серийный номер уже существует в базе"})
        

    def update(self, instance, validated_data):
        print('Update')
        instance.equipment_type = validated_data.get(
            'equipment_type', instance.equipment_type)
        instance.serial_number = validated_data.get(
            'serial_number', instance.serial_number)
        instance.note = validated_data.get('note', instance.note)
        instance.save()
        return instance

    def save(self, *args, **kwargs):
        equipment_type = self.validated_data['equipment_type']
        note = self.validated_data['note']
        validated_serial_numbers = self.validate_lst
        if validated_serial_numbers:
            for serial_number in list(validated_serial_numbers):
                equipment = Equipment(
                    equipment_type=equipment_type,
                    serial_number=serial_number,
                    note=note)
                try:
                    equipment.save()
                    print('успешное сохранение')
                except IntegrityError:
                    print('Сработал exept в save')
                    self.validate_lst.remove(serial_number)
                    self.error_list.append(
                        f"Такой серийный номер уже существует в базе {serial_number}")
            del validated_serial_numbers
                    # raise serializers.ValidationError(
                    #     {"serial_number": f"Такой серийный номер уже существует в базе {serial_number}"})
        else:
            try:
                if self.validate_lst:
                    return super().save(*args,  **kwargs)
                if self.request_method == 'PUT' or self.request_method == 'PATCH':
                    print('put/path')
                    return super().save(*args,  **kwargs)
                # return super().save(*args,  **kwargs)
            except IntegrityError as e:
                print(e)
                print('Сработал exept в save одиночная запись')
                self.error_list.append(
                    f"Такой серийный номер уже существует в базе либо он не прошёл валидацию")
                del self.validate_lst
                if self.request_method == 'PUT' or self.request_method == 'PATCH':
                    raise serializers.ValidationError(
                        {"serial_number": f"Такой серийный номер уже существует в базе либо он не прошёл валидацию"})

            # print(self.error_list)
        # return super().save(*args, **kwargs)

    def validate_serial_number(self, value):
        request_data = self.context['request'].data
        equipment_type = request_data['equipment_type']
        mask = EquipmentType.objects.get(id=equipment_type).serial_number_mask
        if isinstance(value, list):
            for item in value:
                result = validate_sn_mask(item, mask)
                if result[0] == 'errors':
                    print('Ошибка валидации')
                    self.error_list.append(result[1])
                elif result[0] == 'val':
                    self.validate_lst.add(result[1])
        else:
            result = validate_sn_mask(value, mask)
            if result[0] == 'errors':
                print('Ошибка валидации')
                self.error_list.append(result[1])
            elif result[0] == 'val':
                print('валидация пройдена', value)
                if self.request_method == 'PUT' or self.request_method == 'PATCH':
                    return value
                self.validate_lst.add(result[1])
                return value
