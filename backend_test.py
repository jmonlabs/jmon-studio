#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any
import random
import string

class JMONFeathersBackendTester:
    def __init__(self, base_url="https://musicode-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.access_token = None
        self.user_id = None
        self.created_project_id = None
        self.created_folder_id = None
        self.test_username = f"testuser_{random.randint(1000, 9999)}"
        self.test_email = f"test_{random.randint(1000, 9999)}@example.com"
        self.test_password = "TestPassword123!"

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

    def make_request(self, method: str, endpoint: str, data: Dict[str, Any] = None, auth_required: bool = False, expected_status: int = 200) -> tuple:
        """Make HTTP request with proper headers"""
        url = f"{self.api_url}/{endpoint.lstrip('/')}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=15)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=15)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=15)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=15)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=15)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            try:
                response_data = response.json() if response.text else {}
            except:
                response_data = {"raw_response": response.text}
            
            return success, response_data, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}, 0
        except Exception as e:
            return False, {"error": f"Unexpected error: {str(e)}"}, 0

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int = 200, data: Dict[str, Any] = None, auth_required: bool = False) -> tuple:
        """Run a single API test"""
        print(f"\n🔍 Testing {name}...")
        print(f"    URL: {self.api_url}/{endpoint.lstrip('/')}")
        if data:
            print(f"    Data: {json.dumps(data, indent=2)[:200]}...")
        
        success, response_data, status_code = self.make_request(method, endpoint, data, auth_required, expected_status)
        
        if success:
            details = f"Status: {status_code}, Response: {json.dumps(response_data, indent=2)[:300]}..."
        else:
            details = f"Expected {expected_status}, got {status_code}. Response: {json.dumps(response_data, indent=2)[:300]}..."

        self.log_test(name, success, details)
        return success, response_data

    # Health & Info Tests
    def test_health_check(self):
        """Test API health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_api_info(self):
        """Test root API info endpoint"""
        return self.run_test("API Info", "GET", "", 200)

    # Authentication Tests
    def test_user_registration(self):
        """Test user registration"""
        registration_data = {
            "username": self.test_username,
            "email": self.test_email,
            "password": self.test_password,
            "full_name": "Test User"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, registration_data)
        
        if success and 'access_token' in response:
            self.access_token = response['access_token']
            if 'user' in response:
                self.user_id = response['user']['id']
            print(f"    Registered user: {self.test_username}")
            print(f"    User ID: {self.user_id}")
        
        return success, response

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "username": self.test_username,
            "password": self.test_password
        }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        
        if success and 'access_token' in response:
            self.access_token = response['access_token']
            if 'user' in response:
                self.user_id = response['user']['id']
        
        return success, response

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_login_data = {
            "username": "nonexistent_user",
            "password": "wrong_password"
        }
        
        return self.run_test("Invalid Login", "POST", "auth/login", 401, invalid_login_data)

    def test_get_user_profile(self):
        """Test getting user profile with JWT token"""
        return self.run_test("Get User Profile", "GET", "auth/me", 200, auth_required=True)

    def test_unauthorized_access(self):
        """Test accessing protected endpoint without token"""
        # Temporarily clear token
        temp_token = self.access_token
        self.access_token = None
        
        success, response = self.run_test("Unauthorized Access", "GET", "projects", 401, auth_required=False)
        
        # Restore token
        self.access_token = temp_token
        return success, response

    # Project Management Tests
    def test_create_project(self):
        """Test project creation"""
        project_data = {
            "name": f"Test Project {datetime.now().strftime('%H%M%S')}",
            "description": "A test project for FeathersJS backend",
            "jmon_code": "// Test JMON code\nconst composition = { tracks: [], tempo: 120, timeSignature: '4/4', duration: 4 };\nreturn composition;",
            "jmon_object": {
                "tracks": [],
                "tempo": 120,
                "timeSignature": "4/4",
                "duration": 4
            }
        }
        
        success, response = self.run_test("Create Project", "POST", "projects", 200, project_data, auth_required=True)
        
        if success and 'id' in response:
            self.created_project_id = response['id']
            print(f"    Created project ID: {self.created_project_id}")
        
        return success, response

    def test_list_projects(self):
        """Test listing all projects"""
        return self.run_test("List Projects", "GET", "projects", 200, auth_required=True)

    def test_list_projects_with_folder_filter(self):
        """Test listing projects with folder_id parameter"""
        return self.run_test("List Projects (Root Folder)", "GET", "projects?folder_id=", 200, auth_required=True)

    def test_get_single_project(self):
        """Test getting a single project"""
        if not self.created_project_id:
            self.log_test("Get Single Project", False, "No project ID available")
            return False, {}
        
        return self.run_test("Get Single Project", "GET", f"projects/{self.created_project_id}", 200, auth_required=True)

    def test_update_project(self):
        """Test updating a project"""
        if not self.created_project_id:
            self.log_test("Update Project", False, "No project ID available")
            return False, {}
        
        update_data = {
            "name": "Updated Test Project",
            "description": "Updated description",
            "jmon_code": "// Updated JMON code\nconst newComposition = { tracks: [{ name: 'Test Track' }], tempo: 140 };\nreturn newComposition;"
        }
        
        return self.run_test("Update Project", "PUT", f"projects/{self.created_project_id}", 200, update_data, auth_required=True)

    # Folder Management Tests
    def test_create_folder(self):
        """Test folder creation"""
        folder_data = {
            "name": f"Test Folder {datetime.now().strftime('%H%M%S')}",
            "description": "A test folder for organizing projects"
        }
        
        success, response = self.run_test("Create Folder", "POST", "folders", 200, folder_data, auth_required=True)
        
        if success and 'id' in response:
            self.created_folder_id = response['id']
            print(f"    Created folder ID: {self.created_folder_id}")
        
        return success, response

    def test_list_folders(self):
        """Test listing all folders"""
        return self.run_test("List Folders", "GET", "folders", 200, auth_required=True)

    def test_update_folder(self):
        """Test updating a folder"""
        if not self.created_folder_id:
            self.log_test("Update Folder", False, "No folder ID available")
            return False, {}
        
        update_data = {
            "name": "Updated Test Folder",
            "description": "Updated folder description"
        }
        
        return self.run_test("Update Folder", "PUT", f"folders/{self.created_folder_id}", 200, update_data, auth_required=True)

    # JMON & Analytics Tests
    def test_jmon_compile(self):
        """Test JMON code compilation"""
        compile_data = {
            "code": "const composition = { tracks: [], tempo: 120, timeSignature: '4/4', duration: 4 }; return composition;",
            "project_id": self.created_project_id
        }
        
        return self.run_test("JMON Compile", "POST", "jmon/compile", 200, compile_data, auth_required=True)

    def test_project_play_tracking(self):
        """Test project play tracking"""
        if not self.created_project_id:
            self.log_test("Project Play Tracking", False, "No project ID available")
            return False, {}
        
        return self.run_test("Project Play Tracking", "POST", f"projects/{self.created_project_id}/play", 200, {}, auth_required=True)

    def test_analytics_stats(self):
        """Test analytics stats endpoint"""
        return self.run_test("Analytics Stats", "GET", "analytics/stats", 200, auth_required=True)

    def test_analytics_activity(self):
        """Test analytics activity endpoint"""
        return self.run_test("Analytics Activity", "GET", "analytics/activity", 200, auth_required=True)

    def test_analytics_activity_with_days(self):
        """Test analytics activity with days parameter"""
        return self.run_test("Analytics Activity (7 days)", "GET", "analytics/activity?days=7", 200, auth_required=True)

    # Cleanup Tests
    def test_delete_folder(self):
        """Test folder deletion (should move projects to root)"""
        if not self.created_folder_id:
            self.log_test("Delete Folder", False, "No folder ID available")
            return False, {}
        
        return self.run_test("Delete Folder", "DELETE", f"folders/{self.created_folder_id}", 200, auth_required=True)

    def test_delete_project(self):
        """Test project deletion"""
        if not self.created_project_id:
            self.log_test("Delete Project", False, "No project ID available")
            return False, {}
        
        return self.run_test("Delete Project", "DELETE", f"projects/{self.created_project_id}", 200, auth_required=True)

    def run_all_tests(self):
        """Run comprehensive FeathersJS backend tests"""
        print("=" * 80)
        print("JMON STUDIO FEATHERSJS BACKEND TESTING")
        print("=" * 80)
        print(f"Testing against: {self.api_url}")
        print(f"Test user: {self.test_username}")
        print()

        # Health & Info Tests
        print("\n🏥 HEALTH & INFO TESTS")
        print("-" * 40)
        self.test_health_check()
        self.test_api_info()

        # Authentication Tests
        print("\n🔐 AUTHENTICATION TESTS")
        print("-" * 40)
        self.test_user_registration()
        self.test_user_login()
        self.test_get_user_profile()
        self.test_invalid_login()
        self.test_unauthorized_access()

        # Project Management Tests
        print("\n📁 PROJECT MANAGEMENT TESTS")
        print("-" * 40)
        self.test_create_project()
        self.test_list_projects()
        self.test_list_projects_with_folder_filter()
        self.test_get_single_project()
        self.test_update_project()

        # Folder Management Tests
        print("\n📂 FOLDER MANAGEMENT TESTS")
        print("-" * 40)
        self.test_create_folder()
        self.test_list_folders()
        self.test_update_folder()

        # JMON & Analytics Tests
        print("\n🎵 JMON & ANALYTICS TESTS")
        print("-" * 40)
        self.test_jmon_compile()
        self.test_project_play_tracking()
        self.test_analytics_stats()
        self.test_analytics_activity()
        self.test_analytics_activity_with_days()

        # Database Integration Tests
        print("\n💾 DATABASE INTEGRATION TESTS")
        print("-" * 40)
        # Re-verify data persistence by fetching created resources
        if self.created_project_id:
            self.run_test("Data Persistence - Project", "GET", f"projects/{self.created_project_id}", 200, auth_required=True)
        if self.created_folder_id:
            self.run_test("Data Persistence - Folder", "GET", f"folders", 200, auth_required=True)

        # Cleanup Tests
        print("\n🧹 CLEANUP TESTS")
        print("-" * 40)
        self.test_delete_folder()
        self.test_delete_project()

        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        # Categorize results
        failed_tests = [result for result in self.test_results if not result['success']]
        passed_tests = [result for result in self.test_results if result['success']]
        
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for result in failed_tests:
                print(f"  - {result['test_name']}")
                print(f"    {result['details'][:150]}...")
        
        if passed_tests:
            print(f"\n✅ PASSED TESTS ({len(passed_tests)}):")
            for result in passed_tests:
                print(f"  - {result['test_name']}")
        
        # Critical issues summary
        critical_failures = []
        for result in failed_tests:
            if any(keyword in result['test_name'].lower() for keyword in ['auth', 'login', 'register', 'health']):
                critical_failures.append(result['test_name'])
        
        if critical_failures:
            print(f"\n🚨 CRITICAL FAILURES:")
            for failure in critical_failures:
                print(f"  - {failure}")
        
        return self.tests_passed == self.tests_run


def main():
    tester = JMONFeathersBackendTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
                'timestamp': datetime.utcnow().isoformat(),
                'test_user': tester.test_username,
                'api_url': tester.api_url
            },
            'results': tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())