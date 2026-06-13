from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta

#profile of user
class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    points = models.IntegerField(default=0)

    streak = models.IntegerField(default=0)

    last_activity_date = models.DateField(
        null=True,
        blank=True
    )

    level = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

    def add_points(self, pts):
        self.points += pts

        self.level = (self.points // 100) + 1

        self.save()
    #daily reward
    def update_streak(self):
        today = date.today()

        if self.last_activity_date is None:
            self.streak = 1

        elif self.last_activity_date == today:
            return

        elif self.last_activity_date == today - timedelta(days=1):
            self.streak += 1

        else:
            self.streak = 1
        
        self.last_activity_date = today
        self.save()
    def update_level(self):
        self.level = (self.points // 100) + 1