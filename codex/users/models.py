from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    cur_user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    leetcode_username = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.cur_user.username

class Friend(models.Model):
    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='user_friends', on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    from_user = models.ForeignKey(User, related_name='sent_friend_requests', default=None, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        unique_together = ['user', 'friend']

    def __str__(self):
        return f'{self.user.username} - {self.friend.username}'
