#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional
import time

class JMONMultiUserTester:
    def __init__(self, base_url="https://musicode-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # User tokens and IDs for testing
        self.user1_token = None
        self.user1_id = None
        self.user2_token = None
        self.user2_id = None
        
        # Created resources for cleanup
        self.user1_folder_id = None
        self.user2_folder_id = None
        self.user1_project_id = None
        self.user2_project_id = None

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def make_request(self, method: str, endpoint: str, data: Dict[str, Any] = None, token: str = None) -> tuple:
        """Make HTTP request with optional authentication"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            try:
                response_data = response.json() if response.text else {}
            except:
                response_data = {}

            return response.status_code, response_data

        except requests.exceptions.RequestException as e:
            return 0, {"error": str(e)}

    def test_user_registration(self):
        """Test user registration functionality"""
        print(f"\n🔍 Testing User Registration...")
        
        # Test User 1 Registration
        user1_data = {
            "username": f"testuser1_{int(time.time())}",
            "email": f"test1_{int(time.time())}@example.com",
            "password": "TestPassword123!",
            "full_name": "Test User One"
        }
        
        status, response = self.make_request("POST", "auth/register", user1_data)
        
        if status == 200 and "access_token" in response:
            self.user1_token = response["access_token"]
            self.user1_id = response["user"]["id"]
            self.log_test("User 1 Registration", True, f"User registered with ID: {self.user1_id}")
        else:
            self.log_test("User 1 Registration", False, f"Status: {status}, Response: {response}")
            return False
        
        # Test User 2 Registration
        user2_data = {
            "username": f"testuser2_{int(time.time())}",
            "email": f"test2_{int(time.time())}@example.com",
            "password": "TestPassword456!",
            "full_name": "Test User Two"
        }
        
        status, response = self.make_request("POST", "auth/register", user2_data)
        
        if status == 200 and "access_token" in response:
            self.user2_token = response["access_token"]
            self.user2_id = response["user"]["id"]
            self.log_test("User 2 Registration", True, f"User registered with ID: {self.user2_id}")
        else:
            self.log_test("User 2 Registration", False, f"Status: {status}, Response: {response}")
            return False
        
        # Test duplicate registration (should fail)
        status, response = self.make_request("POST", "auth/register", user1_data)
        
        if status == 400:
            self.log_test("Duplicate Registration Prevention", True, "Correctly prevented duplicate registration")
        else:
            self.log_test("Duplicate Registration Prevention", False, f"Should have failed with 400, got {status}")
        
        return True

    def test_user_authentication(self):
        """Test user login functionality"""
        print(f"\n🔍 Testing User Authentication...")
        
        # Test getting current user info
        status, response = self.make_request("GET", "auth/me", token=self.user1_token)
        
        if status == 200 and response.get("id") == self.user1_id:
            self.log_test("Get Current User Info", True, f"Retrieved user info for {response.get('username')}")
        else:
            self.log_test("Get Current User Info", False, f"Status: {status}, Response: {response}")
        
        # Test invalid token
        status, response = self.make_request("GET", "auth/me", token="invalid_token")
        
        if status == 401:
            self.log_test("Invalid Token Rejection", True, "Correctly rejected invalid token")
        else:
            self.log_test("Invalid Token Rejection", False, f"Should have failed with 401, got {status}")

    def test_folder_management(self):
        """Test folder creation and management"""
        print(f"\n🔍 Testing Folder Management...")
        
        # User 1 creates a folder
        folder1_data = {
            "name": "User 1 Test Folder",
            "description": "Test folder for user 1"
        }
        
        status, response = self.make_request("POST", "folders", folder1_data, self.user1_token)
        
        if status == 200 and "id" in response:
            self.user1_folder_id = response["id"]
            self.log_test("User 1 Folder Creation", True, f"Created folder with ID: {self.user1_folder_id}")
        else:
            self.log_test("User 1 Folder Creation", False, f"Status: {status}, Response: {response}")
        
        # User 2 creates a folder
        folder2_data = {
            "name": "User 2 Test Folder",
            "description": "Test folder for user 2"
        }
        
        status, response = self.make_request("POST", "folders", folder2_data, self.user2_token)
        
        if status == 200 and "id" in response:
            self.user2_folder_id = response["id"]
            self.log_test("User 2 Folder Creation", True, f"Created folder with ID: {self.user2_folder_id}")
        else:
            self.log_test("User 2 Folder Creation", False, f"Status: {status}, Response: {response}")
        
        # Test folder isolation - User 1 should only see their folders
        status, response = self.make_request("GET", "folders", token=self.user1_token)
        
        if status == 200:
            user1_folders = response
            user1_folder_ids = [f["id"] for f in user1_folders]
            
            if self.user1_folder_id in user1_folder_ids and self.user2_folder_id not in user1_folder_ids:
                self.log_test("Folder Data Isolation", True, "User 1 can only see their own folders")
            else:
                self.log_test("Folder Data Isolation", False, f"User 1 folders: {user1_folder_ids}")
        else:
            self.log_test("Folder Data Isolation", False, f"Status: {status}, Response: {response}")

    def test_project_management_and_isolation(self):
        """Test project creation and user data isolation"""
        print(f"\n🔍 Testing Project Management and Data Isolation...")
        
        # User 1 creates a project in their folder
        project1_data = {
            "name": "User 1 Test Project",
            "description": "Test project for user 1",
            "folder_id": self.user1_folder_id,
            "jmon_code": "// User 1 JMON code\nconst composition = { tracks: [], tempo: 120 };\nreturn composition;"
        }
        
        status, response = self.make_request("POST", "projects", project1_data, self.user1_token)
        
        if status == 200 and "id" in response:
            self.user1_project_id = response["id"]
            self.log_test("User 1 Project Creation", True, f"Created project with ID: {self.user1_project_id}")
        else:
            self.log_test("User 1 Project Creation", False, f"Status: {status}, Response: {response}")
        
        # User 2 creates a project in their folder
        project2_data = {
            "name": "User 2 Test Project",
            "description": "Test project for user 2",
            "folder_id": self.user2_folder_id,
            "jmon_code": "// User 2 JMON code\nconst composition = { tracks: [], tempo: 140 };\nreturn composition;"
        }
        
        status, response = self.make_request("POST", "projects", project2_data, self.user2_token)
        
        if status == 200 and "id" in response:
            self.user2_project_id = response["id"]
            self.log_test("User 2 Project Creation", True, f"Created project with ID: {self.user2_project_id}")
        else:
            self.log_test("User 2 Project Creation", False, f"Status: {status}, Response: {response}")
        
        # Test project isolation - User 1 should only see their projects
        status, response = self.make_request("GET", "projects", token=self.user1_token)
        
        if status == 200:
            user1_projects = response
            user1_project_ids = [p["id"] for p in user1_projects]
            
            if self.user1_project_id in user1_project_ids and self.user2_project_id not in user1_project_ids:
                self.log_test("Project Data Isolation", True, "User 1 can only see their own projects")
            else:
                self.log_test("Project Data Isolation", False, f"User 1 projects: {user1_project_ids}")
        else:
            self.log_test("Project Data Isolation", False, f"Status: {status}, Response: {response}")
        
        # Test cross-user project access (should fail)
        status, response = self.make_request("GET", f"projects/{self.user2_project_id}", token=self.user1_token)
        
        if status == 404:
            self.log_test("Cross-User Project Access Prevention", True, "User 1 cannot access User 2's project")
        else:
            self.log_test("Cross-User Project Access Prevention", False, f"Should have failed with 404, got {status}")

    def test_jmon_compilation(self):
        """Test JMON code compilation"""
        print(f"\n🔍 Testing JMON Compilation...")
        
        compile_data = {
            "code": "const composition = { tracks: [], tempo: 120, timeSignature: '4/4', duration: 4 }; return composition;",
            "project_id": self.user1_project_id
        }
        
        status, response = self.make_request("POST", "jmon/compile", compile_data, self.user1_token)
        
        if status == 200:
            self.log_test("JMON Code Compilation", True, "Code compiled successfully")
        else:
            self.log_test("JMON Code Compilation", False, f"Status: {status}, Response: {response}")

    def test_project_play_tracking(self):
        """Test project play tracking"""
        print(f"\n🔍 Testing Project Play Tracking...")
        
        status, response = self.make_request("POST", f"projects/{self.user1_project_id}/play", token=self.user1_token)
        
        if status == 200:
            self.log_test("Project Play Tracking", True, "Play event tracked successfully")
        else:
            self.log_test("Project Play Tracking", False, f"Status: {status}, Response: {response}")

    def test_analytics_functionality(self):
        """Test analytics and usage stats"""
        print(f"\n🔍 Testing Analytics Functionality...")
        
        # Test usage stats
        status, response = self.make_request("GET", "analytics/stats", token=self.user1_token)
        
        if status == 200 and "total_projects" in response:
            self.log_test("Usage Statistics", True, f"Retrieved stats: {response}")
        else:
            self.log_test("Usage Statistics", False, f"Status: {status}, Response: {response}")
        
        # Test activity tracking
        status, response = self.make_request("GET", "analytics/activity?days=7", token=self.user1_token)
        
        if status == 200:
            self.log_test("Activity Tracking", True, f"Retrieved {len(response)} activity events")
        else:
            self.log_test("Activity Tracking", False, f"Status: {status}, Response: {response}")

    def test_project_updates(self):
        """Test project update functionality"""
        print(f"\n🔍 Testing Project Updates...")
        
        update_data = {
            "name": "Updated User 1 Project",
            "jmon_code": "// Updated JMON code\nconst newComposition = { tracks: [{ name: 'Test Track' }], tempo: 140 };\nreturn newComposition;",
            "jmon_object": {
                "tracks": [{"name": "Test Track", "notes": []}],
                "tempo": 140,
                "timeSignature": "4/4",
                "duration": 4
            }
        }
        
        status, response = self.make_request("PUT", f"projects/{self.user1_project_id}", update_data, self.user1_token)
        
        if status == 200:
            self.log_test("Project Update", True, "Project updated successfully")
        else:
            self.log_test("Project Update", False, f"Status: {status}, Response: {response}")

    def test_unauthorized_access(self):
        """Test unauthorized access scenarios"""
        print(f"\n🔍 Testing Unauthorized Access Scenarios...")
        
        # Test accessing endpoints without token
        status, response = self.make_request("GET", "projects")
        
        if status == 401 or status == 403:
            self.log_test("Unauthorized Project Access", True, "Correctly rejected request without token")
        else:
            self.log_test("Unauthorized Project Access", False, f"Should have failed with 401/403, got {status}")
        
        # Test accessing folders without token
        status, response = self.make_request("GET", "folders")
        
        if status == 401 or status == 403:
            self.log_test("Unauthorized Folder Access", True, "Correctly rejected request without token")
        else:
            self.log_test("Unauthorized Folder Access", False, f"Should have failed with 401/403, got {status}")

    def run_all_tests(self):
        """Run all multi-user backend tests"""
        print("=" * 70)
        print("JMON MULTI-USER BACKEND API TESTING")
        print("=" * 70)
        print(f"Testing against: {self.api_url}")
        print()

        # Test user registration and authentication
        if not self.test_user_registration():
            print("❌ User registration failed, stopping tests")
            return False
        
        self.test_user_authentication()
        
        # Test folder management and isolation
        self.test_folder_management()
        
        # Test project management and data isolation
        self.test_project_management_and_isolation()
        
        # Test JMON functionality
        self.test_jmon_compilation()
        self.test_project_play_tracking()
        
        # Test analytics
        self.test_analytics_functionality()
        
        # Test updates
        self.test_project_updates()
        
        # Test security
        self.test_unauthorized_access()

        # Print summary
        print("\n" + "=" * 70)
        print("MULTI-USER TEST SUMMARY")
        print("=" * 70)
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.tests_passed < self.tests_run:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test_name']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = JMONMultiUserTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_multiuser_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
                'timestamp': datetime.utcnow().isoformat()
            },
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())