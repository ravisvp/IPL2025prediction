import requests
import random
import json

# Change the URL if needed (if running on a different host or port)
url = "http://localhost:5000/submit_prediction"

teams = ["RCB", "KKR", "MI", "CSK", "RR", "SRH", "LSG", "DC", "PBKS", "GT"]

def random_league_predictions():
    # Generate 70 random predictions for league games
    return [random.choice(teams) for _ in range(70)]

def random_playoff_predictions():
    # For playoff predictions, select 4 unique teams (order matters)
    return random.sample(teams, 4)

def random_finalist_predictions():
    # Select 2 unique teams for finalists
    return random.sample(teams, 2)

def random_winner():
    # Randomly choose one team as the winner
    return random.choice(teams)

# Generate predictions for 25 test users
for i in range(25):
    data = {
        "name": f"TestUser{i+1}",
        "predictions": random_league_predictions(),
        "semifinalists": random_playoff_predictions(),
        "finalists": random_finalist_predictions(),
        "winner": random_winner(),
        "purple_cap": random.choice(teams),
        "orange_cap": random.choice(teams)
    }
    response = requests.post(url, json=data)
    print(f"User {i+1} - Status: {response.status_code}, Response: {response.json()}")
