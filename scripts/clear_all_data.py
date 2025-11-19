#!/usr/bin/env python3
"""
Combined script to clear both SQLite customer data and Supabase Auth users.
"""

import sys
import os
import subprocess

def main():
    """Clear both SQLite and Supabase data."""
    print("🧹 Starting complete data cleanup...")
    print("=" * 60)
    
    # 1. Clear SQLite customer data
    print("\n1️⃣  Clearing SQLite customer data...")
    try:
        result = subprocess.run(
            ['python', 'scripts/clear_customers.py'],
            cwd=os.path.dirname(os.path.dirname(__file__)),
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.returncode != 0:
            print(f"⚠️  Warning: {result.stderr}")
    except Exception as e:
        print(f"❌ Error clearing SQLite: {e}")
    
    # 2. Clear Supabase Auth users
    print("\n2️⃣  Clearing Supabase Auth users...")
    try:
        result = subprocess.run(
            ['python', 'scripts/clear_supabase_auth.py'],
            cwd=os.path.dirname(os.path.dirname(__file__)),
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.returncode != 0:
            print(result.stderr)
            print("\n💡 Tip: To clear Supabase users, you need the service role key.")
            print("   See instructions in the error message above.")
    except Exception as e:
        print(f"❌ Error clearing Supabase: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Cleanup process complete!")
    print("\n📝 Summary:")
    print("   - SQLite customer data: Cleared")
    print("   - Supabase Auth users: Check output above")

if __name__ == "__main__":
    main()

