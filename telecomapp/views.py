from django.db import IntegrityError
from rest_framework import status
from django.shortcuts import render
from rest_framework import generics
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from telecomapp import serializers
from telecomapp.serializers import EquipmentSerializer, EquipmentTypeSerializer
from .models import Equipment, EquipmentType
from rest_framework.pagination import LimitOffsetPagination


class EquipmentListViewPagination(LimitOffsetPagination):
    default_limit = 10


class EquipmentTypeViewPagination(LimitOffsetPagination):
    default_limit = 10


class EquipmentListView(ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    # pagination_class =  EquipmentListViewPagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # if serializer.errors:
        #      print('да')
        #      return Response({'errors': serializer.errors},
        #                 status=status.HTTP_201_CREATED, headers=headers)
        return Response({'errors': serializer.error_list,
                         'success_and_save': serializer.validate_lst},
                        status=status.HTTP_201_CREATED, headers=headers)

    # мягкое удаление

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    def get_queryset(self):
        sn = self.request.query_params.get('sn')  # ?<serial_number>
        _type = self.request.query_params.get('type')  # ?type=<equipment_type>
        note = self.request.query_params.get('note')  # ?note=<note>

        if sn:
            result = Equipment.objects.filter(
                serial_number__startswith=sn, is_deleted=False)
            if not result.exists():
                # ищу по примечанию если не нашлось по серийнику
                result = Equipment.objects.filter(
                    note__startswith=sn, is_deleted=False)

            return result

            # return Equipment.objects.filter(serial_number__startswith=sn, is_deleted=False)
        elif _type:
            return Equipment.objects.filter(equipment_type=_type, is_deleted=False)
        elif note:
            return Equipment.objects.filter(note=note, is_deleted=False)

        return Equipment.objects.filter(is_deleted=False)


class EquipmentTypeListView(ModelViewSet):
    queryset = EquipmentType.objects.all()
    serializer_class = EquipmentTypeSerializer
    # pagination_class =  EquipmentTypeViewPagination

    def get_queryset(self):
        name = self.request.query_params.get('name')
        mask = self.request.query_params.get('mask')

        if name:
            return EquipmentType.objects.filter(type_name=name)
        elif mask:
            return EquipmentType.objects.filter(serial_number_mask=mask)

        return EquipmentType.objects.all()
