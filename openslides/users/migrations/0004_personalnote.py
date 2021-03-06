# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-05-09 11:48
from __future__ import unicode_literals

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('users', '0003_group'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersonalNote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('note', models.TextField(blank=True)),
                ('star', models.BooleanField(default=False)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='personal_notes', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'default_permissions': (),
            },
        ),
    ]
