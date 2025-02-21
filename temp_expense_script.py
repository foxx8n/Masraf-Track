import json
from datetime import datetime

expenses = [
    # Electronics (36,650)
    {'amount': 8000, 'category': 'Electronics', 'description': 'Bilgisayar'},
    {'amount': 22500, 'category': 'Electronics', 'description': 'Telefon parası'},
    {'amount': 4400, 'category': 'Electronics', 'description': 'Hat parası'},
    {'amount': 1750, 'category': 'Electronics', 'description': 'Wifi adaptör'},
    
    # Housing (6,500)
    {'amount': 5000, 'category': 'Housing', 'description': 'Ev kirası'},
    {'amount': 1500, 'category': 'Housing', 'description': 'Yeni ev elektrik parası'},
    
    # Food (5,600)
    {'amount': 2500, 'category': 'Food', 'description': 'Otel yemek'},
    {'amount': 2000, 'category': 'Food', 'description': 'Ol yemek emir'},
    {'amount': 500, 'category': 'Food', 'description': 'Yemek'},
    {'amount': 600, 'category': 'Food', 'description': 'Market'},
    
    # Transportation (6,000)
    {'amount': 2000, 'category': 'Transportation', 'description': 'Ben yol yemek'},
    {'amount': 2000, 'category': 'Transportation', 'description': 'Berke yol masraf'},
    {'amount': 2000, 'category': 'Transportation', 'description': 'Apo yol masraf'},
    
    # Debt (123,300)
    {'amount': 14000, 'category': 'Debt', 'description': 'Ayın 22sinde alınacak', 'debtDetails': {'type': 'borrowed', 'person': 'Borç'}},
    {'amount': 80000, 'category': 'Debt', 'description': 'Mihriban teyzeye verildi', 'debtDetails': {'type': 'lent', 'person': 'Mihriban teyze'}},
    {'amount': 5000, 'category': 'Debt', 'description': 'Apoya verildi', 'debtDetails': {'type': 'lent', 'person': 'Apo'}},
    {'amount': 2000, 'category': 'Debt', 'description': 'Baran hesap parası', 'debtDetails': {'type': 'lent', 'person': 'Baran'}},
    {'amount': 1000, 'category': 'Debt', 'description': 'Delil hesap parası', 'debtDetails': {'type': 'lent', 'person': 'Delil'}},
    {'amount': 2800, 'category': 'Debt', 'description': 'Çakır', 'debtDetails': {'type': 'lent', 'person': 'Çakır'}},
    {'amount': 3000, 'category': 'Debt', 'description': 'Muhammed', 'debtDetails': {'type': 'lent', 'person': 'Muhammed'}},
    {'amount': 6000, 'category': 'Debt', 'description': 'Muhammet abi', 'debtDetails': {'type': 'lent', 'person': 'Muhammet abi'}},
    {'amount': 2000, 'category': 'Debt', 'description': 'Apo', 'debtDetails': {'type': 'lent', 'person': 'Apo'}},
    {'amount': 2500, 'category': 'Debt', 'description': 'Apo', 'debtDetails': {'type': 'lent', 'person': 'Apo'}},
    {'amount': 5000, 'category': 'Debt', 'description': 'Apo', 'debtDetails': {'type': 'lent', 'person': 'Apo'}},
    
    # Other (98,000)
    {'amount': 5500, 'category': 'Other', 'description': 'Otel'},
    {'amount': 20000, 'category': 'Other', 'description': 'Binance kesilen'},
    {'amount': 58500, 'category': 'Other', 'description': 'Komisyon ödendi'},
    {'amount': 2500, 'category': 'Other', 'description': 'Kimlik'},
    {'amount': 4500, 'category': 'Other', 'description': 'Vekalet parası'},
    {'amount': 3500, 'category': 'Other', 'description': 'Tüm kart masrafı'},
    {'amount': 3500, 'category': 'Other', 'description': 'Anne kart ödemesi'},
    
    # Masraf (38,500)
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 1000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 4000, 'category': 'Masraf', 'description': 'Mardin masraf'},
    {'amount': 4000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 5000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 3000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 3000, 'category': 'Masraf', 'description': 'Masraf'},
    {'amount': 6500, 'category': 'Masraf', 'description': 'Masraf ortak'},
    {'amount': 2000, 'category': 'Masraf', 'description': 'Muhammet masraf'}
]

# Add today's date to all expenses
today = datetime.now().strftime('%Y-%m-%d')
for expense in expenses:
    expense['date'] = today
    expense['id'] = 'temp_' + str(hash(str(expense)))

print(json.dumps(expenses, indent=2)) 