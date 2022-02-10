# Generated by Django 3.2.4 on 2021-10-26 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0021_dynamic_movies_select_count_2'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dynamic',
            old_name='movies_select_count_2',
            new_name='total_movies_time_1',
        ),
        migrations.AddField(
            model_name='dynamic',
            name='total_movies_time_2',
            field=models.IntegerField(null=True),
        ),
    ]