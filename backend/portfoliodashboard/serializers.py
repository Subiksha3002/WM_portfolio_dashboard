from .models import Investor, Portfolio
from rest_framework import serializers
from collections import defaultdict
from decimal import Decimal

class InvestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investor
        fields = ['username','email', 'password', 'role']
       
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Investor(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user 

class PortfolioSerializer(serializers.ModelSerializer):
    """
    Serializer for the Portfolio model.
    Converts Portfolio instances to JSON and vice versa.
    """
    # calculated fields
    value = serializers.SerializerMethodField()
    gain_loss = serializers.SerializerMethodField()
    gain_loss_percent = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = [
            "symbol",
            "name",
            "quantity",
            "avg_price",
            "current_price",
            "sector",
            "market_cap",
            "created_at",
            "value",
            "gain_loss",
            "gain_loss_percent"
        ] 

        #calulate value field:
    def get_value(self, obj):
        """
        Calculate the total value of the holding.
        """
        return obj.quantity * obj.current_price
    #calculate gain/loss field:
    def get_gain_loss(self, obj):
        """
        Calculate the gain or loss of the holding.
        """
        return (obj.current_price - obj.avg_price) * obj.quantity
    #calculate gain/loss percent field:
    def get_gain_loss_percent(self, obj):
        """
        Calculate the gain or loss percentage of the holding.
        """
        if obj.avg_price == 0:
            return 0
        return ((obj.current_price - obj.avg_price) / obj.avg_price) * 100

class PortfolioAllocationSerializer(serializers.ModelSerializer):
    bySector = serializers.SerializerMethodField()
    byMarketCap = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = ["bySector", "byMarketCap"]

    def _aggregate(self, obj_list, key_attr):
        totals, total_value = defaultdict(float), 0
        for holding in obj_list:
            value = float(holding.quantity) * float(holding.current_price)
            totals[getattr(holding, key_attr)] += value
            total_value += value
        return {
            k: {"value": round(v, 2), "percentage": round((v / total_value) * 100, 1) if total_value else 0}
            for k, v in totals.items()
        }

    def get_bySector(self, obj):
        return self._aggregate(obj, "sector")

    def get_byMarketCap(self, obj):
        return self._aggregate(obj, "market_cap")
        
# class PerformanceComparisonSerializer(serializers.Serializer):
#     timeline = serializers.ListField()
#     returns = serializers.DictField()

class PortfolioMetricsSerializer(serializers.Serializer):
    totalValue = serializers.SerializerMethodField()
    totalInvested = serializers.SerializerMethodField()
    totalGainLoss = serializers.SerializerMethodField()
    totalGainLossPercent = serializers.SerializerMethodField()
    topPerformer = serializers.SerializerMethodField()
    worstPerformer = serializers.SerializerMethodField()
    diversificationScore = serializers.SerializerMethodField()
    riskLevel = serializers.SerializerMethodField()

    def get_totalInvested(self, obj):
        portfolios = obj
        total_invested = sum(p.avg_price * p.quantity for p in portfolios)
        return float(round(total_invested, 2))

    def get_totalValue(self, obj):
        portfolios = obj
        # Placeholder current price (10% gain assumed), replace with actual if available
        total_value = sum(p.avg_price * Decimal('1.1') * p.quantity for p in portfolios)
        return float(round(total_value, 2))

    def get_totalGainLoss(self, obj):
        return round(self.get_totalValue(obj) - self.get_totalInvested(obj), 2)

    def get_totalGainLossPercent(self, obj):
        invested = self.get_totalInvested(obj)
        if invested == 0:
            return 0.0
        return round((self.get_totalGainLoss(obj) / invested) * 100, 2)

    def get_topPerformer(self, obj):
        portfolios = obj
        gain_data = []
        for p in portfolios:
            current_price = p.avg_price * Decimal('1.1')  # Placeholder
            gain_percent = ((current_price - p.avg_price) / p.avg_price) * 100
            gain_data.append({
                "symbol": p.symbol,
                "name": p.name,
                "gainPercent": round(gain_percent, 2)
            })
        top = max(gain_data, key=lambda x: x['gainPercent']) if gain_data else None
        return top

    def get_worstPerformer(self, obj):
        portfolios = obj
        gain_data = []
        for p in portfolios:
            current_price = p.avg_price * Decimal('1.1')  # Placeholder
            gain_percent = ((current_price - p.avg_price) / p.avg_price) * 100
            gain_data.append({
                "symbol": p.symbol,
                "name": p.name,
                "gainPercent": round(gain_percent, 2)
            })
        worst = min(gain_data, key=lambda x: x['gainPercent']) if gain_data else None
        return worst

    def get_diversificationScore(self, obj):
        sectors = set(p.sector for p in obj)
        return round(len(sectors) / 10 * 10, 1)  # simple scale out of 10

    def get_riskLevel(self, obj):
        gain_percent = self.get_totalGainLossPercent(obj)
        if gain_percent > 20:
            return "Low"
        elif gain_percent > 0:
            return "Moderate"
        else:
            return "High"