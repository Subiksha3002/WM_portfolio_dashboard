from django.shortcuts import render
from .models import Investor, Portfolio
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializers import PortfolioSerializer, InvestorSerializer,PortfolioAllocationSerializer,PortfolioMetricsSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.utils.timezone import now
from datetime import timedelta
from decimal import Decimal

# Get the custom user model
Investor = get_user_model()

#Investor creation
class RegisterView(APIView):
    """
    View to register a new investor.
    """
    def post(self, request):
        serializer = InvestorSerializer(data=request.data)
        # Validate and create the user
        if serializer.is_valid():
            # Create the user instance
            user = serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# post method to create a new portfolio
class PortfolioCreateView(APIView):
    """
    View to create a new portfolio.
    """
    # authentication
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        serializer = PortfolioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(investor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to list portfolios
class PortfolioListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        List holdings:
        - Investors see only their own holdings
        - Admins see all holdings
        """
        # Check if the user is an admin or investor
        if request.user.role == "admin":  
            portfolios = Portfolio.objects.all()
        else:
            portfolios = Portfolio.objects.filter(investor=request.user)

        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# View to get portfolio allocation
class PortfolioAllocationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        holdings = Portfolio.objects.all()
        serializer = PortfolioAllocationSerializer(holdings)
        return Response(serializer.data)


# View to get performance comparison
class PerformanceComparisonView(APIView):

    def get(self, request):
        today = now().date()

        # Order portfolio entries by created_at instead of date
        portfolio_data = Portfolio.objects.order_by('created_at')
        timeline = []
        for p in portfolio_data:
            #hardcoded date for demonstration purposes
            # Use p.created_at and convert to date string (handle None safely)
            date_str = p.created_at.strftime("%Y-%m-%d") if p.created_at else None
            timeline.append({
                "date": date_str,
                "portfolio": float(p.current_price * p.quantity),  # your calculation
                "nifty50": None,
                "gold": None,
            })

        def get_portfolio_value_by_date(target_date):
            # Filter using created_at__date to match date only (ignore time)
            entry = Portfolio.objects.filter(created_at__lte=target_date).order_by('created_at').first()
            if entry:
                return float(entry.current_price * entry.quantity)
            return None

        def calculate_return(current, past):
            if current is None or past is None or past == 0:
                return None
            return round(((current - past) / past) * 100, 2)

        one_month_ago = today - timedelta(days=30)
        three_months_ago = today - timedelta(days=90)
        one_year_ago = today - timedelta(days=365)

        current_value = get_portfolio_value_by_date(today)

        returns = {
            "portfolio": {
                "1month": calculate_return(current_value, get_portfolio_value_by_date(one_month_ago)),
                "3months": calculate_return(current_value, get_portfolio_value_by_date(three_months_ago)),
                "1year": calculate_return(current_value, get_portfolio_value_by_date(one_year_ago)),
            },
            "nifty50": {"1month": None, "3months": None, "1year": None},
            "gold": {"1month": None, "3months": None, "1year": None}
        }

        return Response({
            "timeline": timeline,
            "returns": returns
        })

# View to get portfolio metrics
class PortfolioMetricsView(APIView):
    def get(self, request):
        portfolios = Portfolio.objects.all()
        if not portfolios.exists():
            return Response({"detail": "No portfolio data found."}, status=404)

        serializer = PortfolioMetricsSerializer(portfolios, many=False)
        return Response(serializer.data)