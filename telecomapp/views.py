from django.shortcuts import render
from rest_framework import generics
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from telecomapp.serializers import EquipmentSerializer, EquipmentTypeSerializer
from.models import Equipment, EquipmentType
from rest_framework import status
# Create your views here.


# class EquipmentListView(generics.ListAPIView):
#     queryset = Equipment.objects.all()
#     serializer_class = EquipmentSerializer


class EquipmentListView(ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # print(serializer.error_list)
        return Response({'errors':serializer.error_list, 
                         'sucess_and_save': serializer.validate_lst}, 
                         status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        sn = self.request.query_params.get('sn') # ?<serial_number>
        _type = self.request.query_params.get('type') # ?type=<equipment_type>

        if sn:
            return Equipment.objects.filter(serial_number=sn)
        elif _type:
            return Equipment.objects.filter(equipment_type=_type)

        return Equipment.objects.all()



class EquipmentTypeListView(ModelViewSet):
    queryset = EquipmentType.objects.all()
    serializer_class = EquipmentTypeSerializer

    def get_queryset(self):
        name = self.request.query_params.get('name')
        mask = self.request.query_params.get('mask')

        if name:
            return EquipmentType.objects.filter(type_name=name)
        elif mask:
            return EquipmentType.objects.filter(serial_number_mask=mask)
        
        return EquipmentType.objects.all()