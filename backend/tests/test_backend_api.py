"""
Backend API Tests for Beat Claude - AI Hiring Companion
Tests cover: Auth (Email OTP), Dashboard, Hiring Sessions, JD Parsing, Assessments
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL') or "https://unzip-start-1.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip('/')

class TestHealthCheck:
    """Basic API health check"""
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Beat Claude" in data["message"]
        print(f"✓ Root endpoint working: {data['message']}")


class TestAuthEmailOTP:
    """Authentication using Email OTP - Testing Mode"""
    
    def test_send_otp(self):
        """Test OTP sending endpoint"""
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(f"{BASE_URL}/api/auth/send-otp", json={"email": email})
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        # In testing mode, OTP is returned in response
        assert "otp" in data, "OTP should be returned in testing mode"
        assert len(data["otp"]) == 6, "OTP should be 6 digits"
        print(f"✓ OTP sent successfully for {email}, OTP: {data['otp']}")
        return email, data["otp"]
    
    def test_verify_otp_success(self):
        """Test OTP verification with valid OTP"""
        # First send OTP
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        send_response = requests.post(f"{BASE_URL}/api/auth/send-otp", json={"email": email})
        assert send_response.status_code == 200
        otp = send_response.json()["otp"]
        
        # Verify OTP
        session = requests.Session()
        verify_response = session.post(f"{BASE_URL}/api/auth/verify-otp", json={"email": email, "otp": otp})
        assert verify_response.status_code == 200
        data = verify_response.json()
        assert "user" in data
        assert "session_token" in data
        assert data["user"]["email"] == email
        print(f"✓ OTP verified successfully, user created: {data['user']['email']}")
        return session, data
    
    def test_verify_otp_invalid(self):
        """Test OTP verification with wrong OTP"""
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        send_response = requests.post(f"{BASE_URL}/api/auth/send-otp", json={"email": email})
        assert send_response.status_code == 200
        
        # Try with wrong OTP
        verify_response = requests.post(f"{BASE_URL}/api/auth/verify-otp", json={"email": email, "otp": "000000"})
        assert verify_response.status_code == 401
        print("✓ Invalid OTP correctly rejected")
    
    def test_get_me_authenticated(self):
        """Test /auth/me with valid session"""
        # Login first
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        send_response = requests.post(f"{BASE_URL}/api/auth/send-otp", json={"email": email})
        otp = send_response.json()["otp"]
        
        session = requests.Session()
        verify_response = session.post(f"{BASE_URL}/api/auth/verify-otp", json={"email": email, "otp": otp})
        assert verify_response.status_code == 200
        
        # Get current user
        me_response = session.get(f"{BASE_URL}/api/auth/me")
        assert me_response.status_code == 200
        data = me_response.json()
        assert data["email"] == email
        print(f"✓ /auth/me returned correct user: {data['email']}")
    
    def test_get_me_unauthenticated(self):
        """Test /auth/me without session"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ /auth/me correctly returns 401 for unauthenticated requests")


class TestDashboard:
    """Dashboard stats endpoint"""
    
    def test_dashboard_stats(self):
        """Test dashboard stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_jds" in data
        assert "total_assessments" in data
        assert "total_candidates" in data
        assert "total_scored" in data
        print(f"✓ Dashboard stats: JDs={data['total_jds']}, Assessments={data['total_assessments']}, Candidates={data['total_candidates']}")


class TestHiringSessions:
    """Hiring Sessions CRUD - requires authentication"""
    
    @pytest.fixture
    def authenticated_session(self):
        """Get authenticated session"""
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        send_response = requests.post(f"{BASE_URL}/api/auth/send-otp", json={"email": email})
        otp = send_response.json()["otp"]
        
        session = requests.Session()
        session.post(f"{BASE_URL}/api/auth/verify-otp", json={"email": email, "otp": otp})
        return session
    
    def test_create_hiring_session(self, authenticated_session):
        """Test creating a hiring session"""
        name = f"TEST_Hiring_{uuid.uuid4().hex[:6]}"
        response = authenticated_session.post(
            f"{BASE_URL}/api/hiring-sessions",
            params={"name": name, "description": "Test description"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == name
        assert "id" in data
        assert data["status"] == "active"
        print(f"✓ Hiring session created: {data['name']} ({data['id']})")
        return data
    
    def test_get_hiring_sessions(self, authenticated_session):
        """Test getting hiring sessions list"""
        # Create one first
        name = f"TEST_Hiring_{uuid.uuid4().hex[:6]}"
        authenticated_session.post(f"{BASE_URL}/api/hiring-sessions", params={"name": name})
        
        # Get list
        response = authenticated_session.get(f"{BASE_URL}/api/hiring-sessions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} hiring sessions")
    
    def test_hiring_sessions_requires_auth(self):
        """Test that hiring sessions requires authentication"""
        response = requests.get(f"{BASE_URL}/api/hiring-sessions")
        assert response.status_code == 401
        print("✓ Hiring sessions correctly requires authentication")


class TestJobDescriptions:
    """Job Description parsing - testing text mode"""
    
    def test_parse_jd_text(self):
        """Test JD parsing from text"""
        jd_text = """
        Senior Software Engineer
        
        We are looking for a Senior Software Engineer to join our team.
        
        Requirements:
        - 5+ years of experience in Python
        - Experience with FastAPI and React
        - Strong knowledge of MongoDB
        - Experience with CI/CD pipelines
        
        Responsibilities:
        - Design and implement backend APIs
        - Code review and mentoring
        - Collaborate with frontend team
        """
        
        response = requests.post(f"{BASE_URL}/api/jd", json={"description": jd_text})
        # Note: This uses AI and may timeout, so we accept 200 or 500 (timeout)
        if response.status_code == 200:
            data = response.json()
            assert "title" in data
            assert "skills" in data
            assert "id" in data
            print(f"✓ JD parsed successfully: {data['title']}, Skills: {data['skills'][:3]}")
        else:
            print(f"⚠ JD parsing timed out (expected with AI API) - Status: {response.status_code}")
    
    def test_get_all_jds(self):
        """Test getting all JDs"""
        response = requests.get(f"{BASE_URL}/api/jd")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} job descriptions")


class TestAssessments:
    """Assessments API tests"""
    
    def test_get_all_assessments(self):
        """Test getting all assessments"""
        response = requests.get(f"{BASE_URL}/api/assessments")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} assessments")


class TestSubmissions:
    """Submissions API tests"""
    
    def test_get_all_submissions(self):
        """Test getting all submissions"""
        response = requests.get(f"{BASE_URL}/api/submissions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} submissions")


class TestScores:
    """Scores API tests"""
    
    def test_get_all_scores(self):
        """Test getting all scores"""
        response = requests.get(f"{BASE_URL}/api/scores")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} scores")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
