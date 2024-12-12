# Generated by Django 5.1.4 on 2024-12-09 02:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('company', '0001_initial'),
        ('department', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('mobile_number', models.CharField(max_length=15)),
                ('address', models.TextField()),
                ('designation', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('application_received', 'Application Received'), ('interview_scheduled', 'Interview Scheduled'), ('hired', 'Hired'), ('not_accepted', 'Not Accepted')], default='application_received', max_length=20)),
                ('hired_on', models.DateTimeField(null=True)),
                ('days_employed', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employees', to='company.company')),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employees', to='department.department')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_account', to='user.user')),
            ],
        ),
    ]
