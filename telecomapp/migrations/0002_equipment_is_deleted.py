# Generated by Django 4.2 on 2024-06-02 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('telecomapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='equipment',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]