from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create or update test admin and user accounts'

    def handle(self, *args, **options):
        # Create admin user
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@test.com',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('✓ Created admin user: admin / admin123'))
        else:
            # Update existing admin to ensure correct password and staff status
            admin.set_password('admin123')
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()
            self.stdout.write(self.style.SUCCESS('✓ Updated admin user'))

        # Create test user
        testuser, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'testuser@test.com',
                'is_staff': False,
            }
        )
        if created:
            testuser.set_password('test123')
            testuser.save()
            self.stdout.write(self.style.SUCCESS('✓ Created test user: testuser / test123'))
        else:
            testuser.set_password('test123')
            testuser.is_staff = False
            testuser.save()
            self.stdout.write(self.style.SUCCESS('✓ Updated test user'))
