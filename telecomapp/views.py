from django.core.cache import cache
from django.db import IntegrityError
from rest_framework import status
from django.shortcuts import render
from rest_framework import generics
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.views import APIView
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
        return Response({'errors': serializer.error_list,
                         'success_and_save': serializer.validate_lst},
                        status=status.HTTP_201_CREATED, headers=headers)
    

    def list(self, request, *args, **kwargs):
        user = request.user
        page_number = request.GET.get('page', 1)
        cache_key = f'cache_{user.id}_{page_number}'
        sn = request.GET.get('sn')
        if sn:
            cache.delete(cache_key)
            print('кэш очищен')
        cached_data = cache.get(cache_key)
        
        if not cached_data:
            print('кэш пуст')
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if not sn:
                cache.set(cache_key, queryset)
        elif cached_data:
            print('есть кэш')
            page = self.paginate_queryset(cached_data)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        if cached_data:
            return Response(cached_data)
        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data)
        return Response(serializer.data)


    # мягкое удаление
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    def get_queryset(self):
        sn = self.request.query_params.get('sn')  # ?<serial_number>
        _type = self.request.query_params.get('type')  # ?type=<equipment_type>
        note = self.request.query_params.get('note')  # ?note=<note>

        if sn:
            cache.clear()
            result = Equipment.objects.filter(
                serial_number__startswith=sn, is_deleted=False)
            if not result.exists():
                # ищу по примечанию если не нашлось по серийнику
                result = Equipment.objects.filter(
                    note__startswith=sn, is_deleted=False)

            return result

            # return Equipment.objects.filter(serial_number__startswith=sn, is_deleted=False)
        elif _type:
            cache.clear()
            return Equipment.objects.filter(equipment_type=_type, is_deleted=False)
        elif note:
            cache.clear()
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
