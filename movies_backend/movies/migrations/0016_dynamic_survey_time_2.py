# Generated by Django 3.2.4 on 2021-07-10 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0015_auto_20210702_1852'),
    ]

    operations = [
        migrations.AddField(
            model_name='dynamic',
            name='survey_time_2',
            field=models.IntegerField(null=True),
        ),
    ]