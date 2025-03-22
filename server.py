import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
from datetime import datetime
# Initialize Flask to serve static files from the "static" folder.
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)
# Configuration
app.config["SECRET_KEY"] = "your-secret-key"  # Replace with a strong secret key in production
# Use environment variable DATABASE_URI if defined; otherwise, default to local testing.
db_uri = os.environ.get("DATABASE_URI", "sqlite:///predictions.db")
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
# Global variable to store the actual results once submitted.
actual_results_data = {}
# Prediction model for a 70-game tournament
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, default=0, nullable=False)
    name = db.Column(db.String(100), nullable=False)  # Display name provided by the user.
    predictions = db.Column(db.Text, nullable=False)    # JSON array of 70 game predictions.
    semifinalists = db.Column(db.Text, nullable=False)  # JSON array of 4 playoff predictions.
    finalists = db.Column(db.Text, nullable=False)      # JSON array of 2 finalist predictions.
    winner = db.Column(db.String(10), nullable=False)     # Winner prediction (stored uppercase).
    purple_cap = db.Column(db.String(100), nullable=False)  # Predicted Purple Cap Winner.
    orange_cap = db.Column(db.String(100), nullable=False)  # Predicted Orange Cap Winner.
    points = db.Column(db.Integer, default=0)
    hits = db.Column(db.Integer, default=0)    # Total correct league game predictions
    misses = db.Column(db.Integer, default=0)  # Total wrong league game predictions
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
with app.app_context():
    db.create_all()
# Home route to serve the index page from the "static" folder.
@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")
# Route to serve any static files (CSS, JS, images, etc.)
@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)
# Endpoint to submit a prediction
@app.route("/submit_prediction", methods=["POST"])
def submit_prediction():
    data = request.json
    name = data.get("name")
    game_predictions = data.get("predictions")
    semifinalists = data.get("semifinalists")
    finalists = data.get("finalists")
    winner = data.get("winner")
    purple_cap = data.get("purple_cap")
    orange_cap = data.get("orange_cap")
    if (not name or not game_predictions or len(game_predictions) != 70 or
        not semifinalists or len(semifinalists) != 4 or
        not finalists or len(finalists) != 2 or
        not winner or not purple_cap or not orange_cap):
        return jsonify({"error": "Missing data or incorrect number of predictions/semifinalists/finalists/winner/cap winners"}), 400
    pred = Prediction(
        user_id=0,
        name=name,
        predictions=json.dumps(game_predictions),
        semifinalists=json.dumps(semifinalists),
        finalists=json.dumps(finalists),
        winner=winner.upper(),
        purple_cap=purple_cap,
        orange_cap=orange_cap,
        points=0,
        hits=0,
        misses=0
    )
    db.session.add(pred)
    db.session.commit()
    return jsonify({"message": "Prediction submitted successfully"}), 201
# Endpoint to get all predictions
@app.route("/get_predictions", methods=["GET"])
def get_predictions():
    preds = Prediction.query.all()
    result = []
    for p in preds:
        try:
            game_preds = json.loads(p.predictions)
        except Exception:
            game_preds = []
        try:
            semis = json.loads(p.semifinalists)
        except Exception:
            semis = []
        try:
            finals = json.loads(p.finalists)
        except Exception:
            finals = []
        result.append({
            "id": p.id,
            "user_id": p.user_id,
            "name": p.name,
            "predictions": game_preds,
            "semifinalists": semis,
            "finalists": finals,
            "winner": p.winner,
            "purple_cap": p.purple_cap,
            "orange_cap": p.orange_cap,
            "points": p.points,
            "hits": p.hits,
            "misses": p.misses,
            "created_at": p.created_at.strftime('%Y-%m-%d') if p.created_at else ""
        })
    return jsonify(result)
# Endpoint to manually clear all predictions
@app.route("/clear_predictions", methods=["DELETE"])
def clear_predictions():
    try:
        count = Prediction.query.delete()
        db.session.commit()
        return jsonify({"message": f"Deleted {count} predictions."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
# Endpoint to submit actual results and update points, hits, and misses
@app.route("/submit_results", methods=["POST"])
def submit_results():
    global actual_results_data
    data = request.json
    # Allow partial actual results: use empty lists if not provided
    actual_results = data.get("actualResults") or []
    actual_semifinalists = data.get("actualSemifinalists") or []
    actual_finalists = data.get("actualFinalists") or []
    actual_winner = data.get("actualWinner") or ""
    # New cap fields:
    actual_purple_cap = data.get("actualPurpleCap") or ""
    actual_orange_cap = data.get("actualOrangeCap") or ""
    
    # Convert provided actual results to uppercase
    actual_results = [x.upper() for x in actual_results]
    actual_semifinalists = [x.upper() for x in actual_semifinalists]
    actual_finalists = [x.upper() for x in actual_finalists]
    actual_winner = actual_winner.upper() if actual_winner else ""
    actual_purple_cap = actual_purple_cap.upper() if actual_purple_cap else ""
    actual_orange_cap = actual_orange_cap.upper() if actual_orange_cap else ""
    
    preds = Prediction.query.all()
    updated_count = 0
    # Calculate total available picks based on provided results (for overall points)
    total_picks = len(actual_results)
    if len(actual_semifinalists) == 4:
        total_picks += 4
    if len(actual_finalists) == 2:
        total_picks += 2
    if actual_winner:
        total_picks += 1
        
    for p in preds:
        try:
            user_game_preds = json.loads(p.predictions)
        except Exception:
            user_game_preds = []
        
        # Calculate league hits and points over 70 games
        hits_league = 0
        points = 0
        for i in range(70):
            if i < len(actual_results) and i < len(user_game_preds) and user_game_preds[i].upper() == actual_results[i]:
                points += 1
                hits_league += 1
        # Evaluate playoff predictions (Rank 1-4) with new logic:
        try:
            user_playoff = json.loads(p.semifinalists)
        except Exception:
            user_playoff = []
        if len(actual_semifinalists) == 4 and len(user_playoff) == 4:
            for rank_index in range(4):
                predicted = user_playoff[rank_index].upper()
                if predicted in actual_semifinalists:
                    if rank_index < 2:
                        if predicted in actual_semifinalists[0:2]:
                            points += 3
                        else:
                            points += 2
                    else:
                        points += 2
        # Evaluate finalist predictions: 4 points each
        try:
            user_finalists = json.loads(p.finalists)
        except Exception:
            user_finalists = []
        if len(actual_finalists) == 2 and len(user_finalists) == 2:
            for team in user_finalists:
                if team.upper() in actual_finalists:
                    points += 4
        # Evaluate winner prediction: 5 points
        if actual_winner:
            if p.winner.upper() == actual_winner:
                points += 5
        # Evaluate Purple Cap: 5 points if match
        if actual_purple_cap:
            if p.purple_cap.upper() == actual_purple_cap:
                points += 5
        # Evaluate Orange Cap: 5 points if match
        if actual_orange_cap:
            if p.orange_cap.upper() == actual_orange_cap:
                points += 5
        p.points = points
        p.hits = hits_league
        p.misses = 70 - hits_league
        updated_count += 1
    db.session.commit()
    actual_results_data = {
        "actualResults": actual_results,
        "actualSemifinalists": actual_semifinalists,
        "actualFinalists": actual_finalists,
        "actualWinner": actual_winner,
        "actualPurpleCap": actual_purple_cap,
        "actualOrangeCap": actual_orange_cap
    }
    return jsonify({"message": f"Updated points for {updated_count} predictions."}), 200
# Admin statistics endpoint
@app.route("/admin_stats", methods=["GET"])
def admin_stats():
    total = Prediction.query.count()
    total_points = db.session.query(db.func.sum(Prediction.points)).scalar() or 0
    avg = total_points / total if total > 0 else 0
    return jsonify({
        "total_predictions": total,
        "total_points": total_points,
        "average_points": avg
    })
# Endpoint to delete a specific prediction
@app.route("/delete_prediction/<int:prediction_id>", methods=["DELETE"])
def delete_prediction(prediction_id):
    pred = Prediction.query.get(prediction_id)
    if not pred:
        return jsonify({"error": "Prediction not found"}), 404
    db.session.delete(pred)
    db.session.commit()
    return jsonify({"message": f"Deleted prediction {prediction_id}."}), 200
# Leaderboard endpoint (aggregates by name)
@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    results = db.session.query(
        Prediction.name,
        db.func.sum(Prediction.points).label("total_points"),
        db.func.sum(Prediction.hits).label("total_hits"),
        db.func.sum(Prediction.misses).label("total_misses")
    ).group_by(Prediction.name).order_by(db.func.sum(Prediction.points).desc()).all()
    leaderboard_data = [
        {
            "name": r.name,
            "total_points": r.total_points,
            "total_hits": r.total_hits,
            "total_misses": r.total_misses
        } for r in results
    ]
    return jsonify(leaderboard_data)
# Endpoint to get the actual results
@app.route("/actual_results", methods=["GET"])
def get_actual_results():
    return jsonify(actual_results_data)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("Starting Flask server on port", port)
    app.run(host="0.0.0.0", port=port, debug=True)

@app.route("/debug_predictions")
def debug_predictions():
    predictions = Prediction.query.all()
    return {
        "total_predictions": len(predictions),
        "predictions": [p.name for p in predictions]
    }

