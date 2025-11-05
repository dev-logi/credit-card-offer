#!/usr/bin/env python3
"""Helper script to add network info to seed_data_comprehensive.py"""

import re

# Read the file
with open('seed_data_comprehensive.py', 'r') as f:
    content = f.read()

# Define replacements (card_id -> network)
replacements = [
    ('amex_blue_cash_everyday', 'amex'),
    ('chase_freedom_flex', 'visa'),
    ('chase_freedom_unlimited', 'visa'),
    ('citi_double_cash', 'mastercard'),
    ('citi_custom_cash', 'mastercard'),
    ('discover_it_cash_back', 'discover'),
    ('capital_one_savor"', 'mastercard'),  # Match exact to avoid savor_one
    ('capital_one_savor_one', 'mastercard'),
    ('wells_fargo_active_cash', 'visa'),
    ('chase_sapphire_preferred', 'visa'),
    ('chase_sapphire_reserve', 'visa'),
    ('amex_gold', 'amex'),
    ('amex_platinum', 'amex'),
    ('capital_one_venture"', 'visa'),  # Match exact to avoid venture_x/venture_one
    ('capital_one_venture_x', 'visa'),
    ('capital_one_venture_one', 'visa'),
    ('bank_of_america_travel_rewards', 'visa'),
    ('chase_ink_business_preferred', 'visa'),
    ('amex_business_gold', 'amex'),
]

# Add network to each card (after reward_type line)
for card_id, network in replacements:
    # Find the pattern: "id": "card_id"... "reward_type": "..."
    pattern = f'("id": "{card_id}".+?"reward_type": "[^"]+",)'
    replacement = f'\\1\n        "network": "{network}",'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    print(f"✅ Added network '{network}' for {card_id}")

# Write back
with open('seed_data_comprehensive.py', 'w') as f:
    f.write(content)

print("\n✅ All networks added to seed_data_comprehensive.py")


