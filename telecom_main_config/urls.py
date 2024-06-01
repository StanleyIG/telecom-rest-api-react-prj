"""
URL configuration for telecom_main_config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter, SimpleRouter
from telecomapp import views
from telecomapp.views import EquipmentListView, EquipmentTypeListView
from django.views.generic import RedirectView
from django.contrib.auth import views as auth_views
from rest_framework.authtoken import views as auth_authtoken


router = DefaultRouter()
router.register('equipments', EquipmentListView)
router.register('equipments_types', EquipmentTypeListView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path("", RedirectView.as_view(url="api/")),
    path('api/', include(router.urls)),
    path('api-token-auth/', auth_authtoken.obtain_auth_token),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
]
