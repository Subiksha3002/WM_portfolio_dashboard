from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PortfolioCreateView, RegisterView, PortfolioListView , PortfolioAllocationView,PortfolioMetricsView,PerformanceComparisonView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Get access + refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     # Get new access token
    path('portfolio/create/', PortfolioCreateView.as_view(), name='portfolio-create'),
    path('list/', PortfolioListView.as_view(), name='portfolio-list'),  # List portfolios
    path('allocation/',PortfolioAllocationView.as_view(), name='portfolio-allocation'),  # Portfolio allocation
    path('performance/', PerformanceComparisonView.as_view(), name='portfolio-performance'),  # Performance comparison
    path('summary/', PortfolioMetricsView.as_view(), name='portfolio-metrics'),  # Portfolio allocation
]
