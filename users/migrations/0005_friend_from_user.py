# Generated by Django 3.2.20 on 2023-08-13 10:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0004_friend'),
    ]

    operations = [
        migrations.AddField(
            model_name='friend',
            name='from_user',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sent_friend_requests', to=settings.AUTH_USER_MODEL),
        ),
    ]
