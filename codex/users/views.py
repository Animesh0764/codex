from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordResetForm
from django.contrib.auth import login, logout
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template import loader
from django.shortcuts import get_object_or_404
from . import forms
from .models import UserProfile
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LoginView
from .decorators import redirect_authenticated_user
from .models import Friend
from django.http import JsonResponse
from django.contrib import messages
import random

User = get_user_model()

# Create your views here.
def homepage(request):
    return render(request, "landingpage.html")

@login_required(login_url="/login/")
def homepage2(request):
    return render(request, "landingpage2.html")

def signup(req):
    if req.method == 'POST':
        form = forms.CustomUserCreationForm(req.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            

            #Generating otp
            token = generate_otp(user)
            user.otp = token

            #Building email confirmation URL
            cur_site = get_current_site(req)

            confirm_url = f"{cur_site.domain}/confirm-email/{user.pk}/{token}/"

            # Load and render the HTML template
            template = loader.get_template('confirm-email.html')
            context = {'user': user, 'confirm_url': confirm_url}
            message = template.render(context)

            #Email to be sent
            subject = "Confirm your email"
            email = EmailMultiAlternatives(subject, message, to=[user.email])
            email.attach_alternative(message, "text/html")
            email.send()

            return redirect('home')
        
    else:
        form = forms.CustomUserCreationForm()
    return render(req, 'signuppage.html', {'form': form})


@redirect_authenticated_user
def login_user(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            if 'next' in request.GET:
                return redirect(request.GET.get('next'))

            return redirect('home2')  # Redirect to landingpage2.html for authenticated users
    else:
        form = AuthenticationForm()

    return render(request, 'loginpage.html', {'form': form})


def logout_user(req):
    if req.method=='POST':
        logout(req)
        return redirect('home')
    
    return redirect('home')

def generate_otp(user):
    otp = default_token_generator.make_token(user)
    return otp

@login_required(login_url="/login/")
def profile_page(req):
    user = req.user
    user_profile, created = UserProfile.objects.get_or_create(cur_user=user)
    return render(req, 'profilepage.html', {'user': user, 'user_profile': user_profile})

@login_required(login_url="/login/")
def edit_bio(req):

    user = req.user
    user_profile, created = UserProfile.objects.get_or_create(cur_user=user)

    if req.method == 'POST':
        new_bio = req.POST.get('bio')
        new_leetcode_username = req.POST.get('leetcodeUsername')
        
        user_profile = req.user.userprofile
        user_profile.bio = new_bio
        user_profile.leetcode_username = new_leetcode_username
        user_profile.save()
    
    return redirect('profile_page')

def custom_login(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect('home2')  # Redirect to landingpage2.html for authenticated users
    else:
        return auth_views.login(request, *args, **kwargs)

def confirm_email(request, id, token):
    try:
        user = User.objects.get(pk=int(id))
        print(user, id, token)
    except Exception as e:
        user = None
        print(e)

    print(user)

    if user and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return render(request, 'email_confirmation_success.html')
    else:
        return render(request, 'email_confirmation_failure.html')

@login_required(login_url="/login/")
def connect_leetcode(request):
    if request.method == 'POST':
        leetcode_username = request.POST.get('leetcode_username')
        return JsonResponse({'message': 'LeetCode account connected successfully'})

class CustomLoginView(LoginView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home2')  # Redirect to landingpage2.html for authenticated users
        return super().get(request, *args, **kwargs)
    

@login_required
def add_friend(request):
    if request.method == 'POST':
        friend_username = request.POST.get('friend_username')
        try:
            friend = User.objects.get(username=friend_username)
            if friend == request.user:
                messages.error(request, "You cannot add yourself as a friend.")
            else:
                # Create a Friend instance for the current user
                Friend.objects.get_or_create(user=request.user, friend=friend, from_user=request.user)

                # Create a reciprocal Friend instance for the friend user
                Friend.objects.get_or_create(user=friend, friend=request.user, from_user=request.user)

                messages.success(request, f"{friend_username} added as a friend.")
        except User.DoesNotExist:
            messages.error(request, f"User {friend_username} not found.")

    return redirect('profile_page')


@login_required
def friend_list(request):
    friends = Friend.objects.filter(user=request.user).exclude(friend=request.user)
    print(friends)
    users_to_exclude = friends.values('friend')

    all_users = User.objects.exclude(pk=request.user.pk).exclude(pk__in=users_to_exclude)

    num_suggestions = min(5, all_users.count())
    suggestions = random.sample(list(all_users), num_suggestions)
    print(suggestions)
    return render(request, 'friend_list.html', {'friends': friends, 'suggestions': suggestions})

@login_required
def friend_stats(request, friend_username):
    try:
        friend = User.objects.get(username=friend_username)
        friend_profile = UserProfile.objects.get(cur_user=friend)  # Use 'cur_user'
        return render(request, 'friend_stats.html', {'friend_profile': friend_profile})
    except User.DoesNotExist:
        return render(request, 'friend_stats.html', {'error_message': f"User '{friend_username}' not found."})
    

@login_required
def edit_cf_account(request):
    user = request.user
    user_profile, created = UserProfile.objects.get_or_create(cur_user=user)

    if request.method == 'POST':
        new_codeforces_username = request.POST.get('codeforcesUsername')
        
        user_profile = request.user.userprofile
        user_profile.codeforces_username = new_codeforces_username
        user_profile.save()
    
    return redirect('profile_page')

@login_required
def edit_lc_account(request):
    user = request.user
    user_profile, created = UserProfile.objects.get_or_create(cur_user=user)

    if request.method == 'POST':
        new_leetcode_username = request.POST.get('leetcodeUsername')
        
        user_profile = request.user.userprofile
        user_profile.leetcode_username = new_leetcode_username
        user_profile.save()
    
    return redirect('profile_page')