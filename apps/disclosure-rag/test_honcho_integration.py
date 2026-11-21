#!/usr/bin/env python3
"""
Quick test of Honcho integration
"""

import os
import sys
from dotenv import load_dotenv

# Load environment
load_dotenv()

print("🧪 Testing Honcho Integration\n")
print("=" * 60)

# Test 1: Check API key
print("\n1️⃣  Checking Honcho API Key...")
api_key = os.getenv("HONCHO_API_KEY")
if api_key:
    print(f"   ✅ API key found: {api_key[:20]}...")
else:
    print("   ❌ HONCHO_API_KEY not found in environment")
    sys.exit(1)

# Test 2: Import Honcho SDK
print("\n2️⃣  Testing Honcho SDK import...")
try:
    from honcho import Honcho
    print("   ✅ Honcho SDK imported successfully")
except ImportError as e:
    print(f"   ❌ Failed to import Honcho: {e}")
    sys.exit(1)

# Test 3: Initialize client
print("\n3️⃣  Initializing Honcho client...")
try:
    client = Honcho(
        api_key=api_key,
        environment="production",
        workspace_id="disclosure-rag-test"
    )
    print("   ✅ Honcho client initialized")
except Exception as e:
    print(f"   ❌ Failed to initialize client: {e}")
    sys.exit(1)

# Test 4: Test our wrapper
print("\n4️⃣  Testing HonchoMemoryClient wrapper...")
try:
    from lib.honcho_client import HonchoMemoryClient
    memory = HonchoMemoryClient(workspace_id="disclosure-rag-test")
    print("   ✅ HonchoMemoryClient initialized")
except Exception as e:
    print(f"   ❌ Failed to initialize wrapper: {e}")
    print(f"   Error details: {type(e).__name__}: {str(e)}")
    sys.exit(1)

# Test 5: Create a peer
print("\n5️⃣  Creating test peer...")
try:
    test_peer = memory.get_or_create_peer("test_researcher_001")
    print("   ✅ Test peer created")
except Exception as e:
    print(f"   ❌ Failed to create peer: {e}")
    sys.exit(1)

# Test 6: Create a session
print("\n6️⃣  Creating test session...")
try:
    session_id = "test_session_001"
    session = memory.create_session(
        session_id,
        ["test_researcher_001"],
        metadata={"test": True, "topic": "Roswell"}
    )
    print(f"   ✅ Session created: {session_id}")
except Exception as e:
    print(f"   ❌ Failed to create session: {e}")
    sys.exit(1)

# Test 7: Add a message
print("\n7️⃣  Adding test message...")
try:
    memory.add_message(
        session_id,
        "test_researcher_001",
        "This is a test message about UFO research",
        is_user=True
    )
    print("   ✅ Message added")
except Exception as e:
    print(f"   ❌ Failed to add message: {e}")
    sys.exit(1)

# Test 8: Try to get context (might not work immediately)
print("\n8️⃣  Testing context retrieval...")
try:
    context = memory.get_session_context(session_id, max_tokens=1000)
    print(f"   ✅ Context retrieved (length: {len(str(context))} chars)")
except Exception as e:
    print(f"   ⚠️  Context retrieval not yet available: {e}")
    print("   (This is expected for new sessions)")

print("\n" + "=" * 60)
print("✅ All core tests passed!")
print("\nHoncho is successfully integrated and ready to use.")
print("\nNext steps:")
print("  1. Run: python disclosure_chat_with_memory.py --test")
print("  2. Try interactive mode: python disclosure_chat_with_memory.py")
print("  3. See HONCHO_INTEGRATION.md for more examples")
