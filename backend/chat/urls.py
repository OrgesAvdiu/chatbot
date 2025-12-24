from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('user/', views.current_user_view, name='current-user'),
    
    # Chat
    path('chat/', views.chat_view, name='chat'),
    
    # Conversations
    path('conversations/', views.conversations_list_view, name='conversations-list'),
    path('conversations/<int:pk>/', views.conversation_detail_view, name='conversation-detail'),
    path('conversations/create/', views.conversation_create_view, name='conversation-create'),
    
    # Admin Dashboard
    path('admin/dashboard/', views.admin_dashboard_view, name='admin-dashboard'),
]
