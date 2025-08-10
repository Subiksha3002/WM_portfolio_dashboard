from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.utils import timezone
# Create your models here.

class Investor(AbstractUser):
    """
    Custom user model for the portfolio dashboard.
    Inherits from Django's AbstractUser to extend the default user model.

    """
    ROLE_CHOICES = (
        ('investor', 'Investor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='investor')
    class Meta:
        db_table = "registerinfo"

class Portfolio(models.Model):
    """
    Model representing a portfolio of investments.
    Each portfolio is associated with an investor.
    """
    symbol = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    avg_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    # date = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    sector = models.CharField(max_length=100)
    market_cap = models.CharField(max_length=50)  
    new_date = models.DateField(null=True, blank=True, default=now)
    investor = models.ForeignKey(Investor, on_delete=models.CASCADE, related_name='holdings')
    created_at = models.DateTimeField( default=timezone.now)



    class Meta:
        db_table = "new_WM"


    def __str__(self):
        return f"{self.name} ({self.symbol})"

