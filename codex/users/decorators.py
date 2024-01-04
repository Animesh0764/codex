from django.shortcuts import redirect

def redirect_authenticated_user(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home2')  # Redirect to landingpage2.html for authenticated users
        return view_func(request, *args, **kwargs)
    return _wrapped_view
