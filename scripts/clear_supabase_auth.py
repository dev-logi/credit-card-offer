#!/usr/bin/env python3
"""
Script to clear all Supabase Auth users.
Requires SUPABASE_SERVICE_ROLE_KEY environment variable or .env file.

Uses Supabase REST API directly (no extra dependencies needed).
"""

import sys
import os
import requests

# Supabase configuration
SUPABASE_URL = 'https://uifqzdahexyokikkzsgf.supabase.co'

def get_service_role_key():
    """Get service role key from environment or .env file."""
    # Try environment variable first
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    if key:
        return key
    
    # Try loading from .env file
    env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                if line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
                    return line.split('=', 1)[1].strip().strip('"').strip("'")
    
    return None

def clear_supabase_auth_users():
    """Clear all auth users from Supabase using REST API."""
    service_role_key = get_service_role_key()
    
    if not service_role_key:
        print("❌ Error: SUPABASE_SERVICE_ROLE_KEY not found!")
        print("\nTo get your service role key:")
        print("1. Go to https://supabase.com/dashboard/project/uifqzdahexyokikkzsgf")
        print("2. Click ⚙️ Settings → API")
        print("3. Copy the 'service_role' key (NOT the 'anon' key)")
        print("4. Set it as an environment variable:")
        print("   export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'")
        print("\nOr add it to your .env file:")
        print("   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key")
        print("\n⚠️  WARNING: The service role key has admin access. Keep it secret!")
        print("\nAlternatively, you can manually delete users in the Supabase dashboard:")
        print("   https://supabase.com/dashboard/project/uifqzdahexyokikkzsgf/auth/users")
        return False
    
    try:
        headers = {
            'apikey': service_role_key,
            'Authorization': f'Bearer {service_role_key}',
            'Content-Type': 'application/json'
        }
        
        # List all users
        print("📊 Fetching all auth users...")
        list_url = f"{SUPABASE_URL}/auth/v1/admin/users"
        response = requests.get(list_url, headers=headers, params={'per_page': 1000})
        response.raise_for_status()
        
        users = response.json().get('users', [])
        user_count = len(users)
        print(f"   Found {user_count} users")
        
        if user_count == 0:
            print("✅ Supabase Auth is already clean - no users to delete")
            return True
        
        # Delete each user
        print(f"\n🗑️  Deleting {user_count} users...")
        deleted_count = 0
        failed_count = 0
        
        for user in users:
            try:
                user_id = user.get('id')
                user_email = user.get('email', user_id)
                
                delete_url = f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}"
                delete_response = requests.delete(delete_url, headers=headers)
                delete_response.raise_for_status()
                
                deleted_count += 1
                print(f"   ✅ Deleted user: {user_email}")
            except Exception as e:
                failed_count += 1
                print(f"   ❌ Failed to delete user {user_email}: {e}")
        
        print(f"\n✅ Supabase Auth cleanup complete!")
        print(f"   Deleted: {deleted_count}")
        if failed_count > 0:
            print(f"   Failed: {failed_count}")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error connecting to Supabase: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Response: {e.response.text}")
        return False
    except Exception as e:
        print(f"❌ Error clearing Supabase Auth users: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = clear_supabase_auth_users()
    sys.exit(0 if success else 1)

