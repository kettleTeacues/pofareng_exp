from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_get_lifelog():
    response = client.get("/lifelog")
    assert response.status_code == 200