# Generated by Django 3.2.4 on 2021-07-17 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0016_dynamic_survey_time_2'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpattern',
            name='user_movies_pattern',
            field=models.CharField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='userpattern',
            name='user_names_pattern',
            field=models.CharField(max_length=5000),
        ),
    ]
