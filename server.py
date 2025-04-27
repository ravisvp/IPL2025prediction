import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
from datetime import datetime

# Initialize Flask app and configs
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

app.config["SECRET_KEY"] = "your-secret-key"
db_uri = os.environ.get("DATABASE_URI", "sqlite:///predictions.db")
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Global storage for actual results
actual_results_data = {}

# Models
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, default=0, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    predictions = db.Column(db.Text, nullable=False)
    semifinalists = db.Column(db.Text, nullable=False)
    finalists = db.Column(db.Text, nullable=False)
    winner = db.Column(db.String(10), nullable=False)
    purple_cap = db.Column(db.String(100), nullable=False)
    orange_cap = db.Column(db.String(100), nullable=False)
    points = db.Column(db.Integer, default=0)
    hits = db.Column(db.Integer, default=0)
    misses = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# Routes
@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

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
        return jsonify({"error": "Missing or invalid data"}), 400

    pred = Prediction(
        user_id=0,
        name=name,
        predictions=json.dumps(game_predictions),
        semifinalists=json.dumps(semifinalists),
        finalists=json.dumps(finalists),
        winner=winner.upper(),
        purple_cap=purple_cap,
        orange_cap=orange_cap
    )

    db.session.add(pred)
    db.session.commit()

    return jsonify({"message": "Prediction submitted successfully"}), 201

@app.route("/submit_comment", methods=["POST"])
def submit_comment():
    data = request.json
    name = data.get("name")
    comment_text = data.get("comment")

    if not name or not comment_text:
        return jsonify({"error": "Name and comment are required"}), 400

    user = Prediction.query.filter_by(name=name).first()
    if not user:
        return jsonify({"error": "Name not found in predictions"}), 400

    comment = Comment(name=name, comment=comment_text)
    db.session.add(comment)
    db.session.commit()

    return jsonify({"message": "Comment submitted successfully"}), 201

@app.route("/get_comments", methods=["GET"])
def get_comments():
    comments = Comment.query.order_by(Comment.created_at.desc()).all()
    result = []
    for c in comments:
        result.append({
            "name": c.name,
            "comment": c.comment,
            "created_at": c.created_at.strftime('%Y-%m-%d %H:%M')
        })
    return jsonify(result)

@app.route("/get_predictions", methods=["GET"])
def get_predictions():
    preds = Prediction.query.all()
    result = []
    for p in preds:
        result.append({
            "id": p.id,
            "user_id": p.user_id,
            "name": p.name,
            "predictions": json.loads(p.predictions),
            "semifinalists": json.loads(p.semifinalists),
            "finalists": json.loads(p.finalists),
            "winner": p.winner,
            "purple_cap": p.purple_cap,
            "orange_cap": p.orange_cap,
            "points": p.points,
            "hits": p.hits,
            "misses": p.misses,
            "created_at": p.created_at.strftime('%Y-%m-%d') if p.created_at else ""
        })
    return jsonify(result)

# ✅ NEW: Update prediction by ID (edit functionality for admin)
@app.route("/update_prediction/<int:prediction_id>", methods=["PUT"])
def update_prediction(prediction_id):
    pred = Prediction.query.get(prediction_id)
    if not pred:
        return jsonify({"error": "Prediction not found"}), 404

    data = request.json
    pred.name = data.get("name", pred.name)
    pred.predictions = json.dumps(data.get("predictions", json.loads(pred.predictions)))
    pred.semifinalists = json.dumps(data.get("semifinalists", json.loads(pred.semifinalists)))
    pred.finalists = json.dumps(data.get("finalists", json.loads(pred.finalists)))
    pred.name = data.get("name", pred.name)

    pred.winner = data.get("winner", pred.winner).upper()
    pred.purple_cap = data.get("purple_cap", pred.purple_cap)
    pred.orange_cap = data.get("orange_cap", pred.orange_cap)

    db.session.commit()

    return jsonify({"message": f"Prediction {prediction_id} updated successfully"}), 200

@app.route("/delete_prediction/<int:prediction_id>", methods=["DELETE"])
def delete_prediction(prediction_id):
    pred = Prediction.query.get(prediction_id)
    if not pred:
        return jsonify({"error": "Prediction not found"}), 404
    db.session.delete(pred)
    db.session.commit()
    return jsonify({"message": f"Deleted prediction {prediction_id}."}), 200

@app.route("/clear_predictions", methods=["DELETE"])
def clear_predictions():
    try:
        count = Prediction.query.delete()
        db.session.commit()
        return jsonify({"message": f"Deleted {count} predictions."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/submit_results", methods=["POST"])
def submit_results():
    global actual_results_data
    data = request.json

    # Get actual results from the form
    actual_results = data.get("actualResults") or []
    actual_semifinalists = data.get("actualSemifinalists") or []
    actual_finalists = data.get("actualFinalists") or []
    actual_winner = data.get("actualWinner") or ""
    actual_purple_cap = data.get("actualPurpleCap") or ""
    actual_orange_cap = data.get("actualOrangeCap") or ""

    # NEW: Get the actual stats for purple and orange cap predictions (a JSON string/dict)
    actual_purple_cap_stats = data.get("actualPurpleCapStats") or "{}"
    actual_orange_cap_stats = data.get("actualOrangeCapStats") or "{}"

    # Normalize to uppercase for comparison
    actual_results = [x.upper() for x in actual_results]
    actual_semifinalists = [x.upper() for x in actual_semifinalists]
    actual_finalists = [x.upper() for x in actual_finalists]
    actual_winner = actual_winner.upper()
    actual_purple_cap = actual_purple_cap.upper()
    actual_orange_cap = actual_orange_cap.upper()

    # Parse stats JSON strings
    try:
        purple_stats = json.loads(actual_purple_cap_stats)
    except Exception:
        purple_stats = {}

    try:
        orange_stats = json.loads(actual_orange_cap_stats)
    except Exception:
        orange_stats = {}

    preds = Prediction.query.all()
    updated_count = 0

    # Calculate total available picks dynamically
    total_games_entered = len(actual_results)

    for p in preds:
        try:
            user_game_preds = json.loads(p.predictions)
        except Exception:
            user_game_preds = []

        # League Hits / Misses based on the number of actual results provided
            # League Hits / Misses based on the number of actual results provided
        hits_league = 0
        for i in range(total_games_entered):
           if i < len(user_game_preds):
               user_pick = user_game_preds[i].upper()
               actual = actual_results[i]
        
               if actual == "WASHOUT":
            # Award 1 point to everyone if the match was washed out
                   hits_league += 1
               elif user_pick == actual:
                   hits_league += 1







       

        # Evaluate playoff predictions
        try:
            user_playoff = json.loads(p.semifinalists)
        except Exception:
            user_playoff = []

        points = hits_league  # 1 point per correct league prediction

        if len(actual_semifinalists) == 4 and len(user_playoff) == 4:
            for rank_index in range(4):
                predicted = user_playoff[rank_index].upper()
                if predicted in actual_semifinalists:
                    if rank_index < 2 and predicted in actual_semifinalists[:2]:
                        points += 3
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

        # Evaluate winner, purple cap, orange cap
        if actual_winner and p.winner.upper() == actual_winner:
            points += 5

        if actual_purple_cap and p.purple_cap.upper() == actual_purple_cap:
            points += 5

        if actual_orange_cap and p.orange_cap.upper() == actual_orange_cap:
            points += 5

        # Update the prediction record
        p.points = points
        p.hits = hits_league
        p.misses = total_games_entered - hits_league  # dynamic number instead of 70 - hits_league

        updated_count += 1

    db.session.commit()

    # Save the current actual results with parsed stats
    actual_results_data = {
        "actualResults": actual_results,
        "actualSemifinalists": actual_semifinalists,
        "actualFinalists": actual_finalists,
        "actualWinner": actual_winner,
        "actualPurpleCap": actual_purple_cap,
        "actualOrangeCap": actual_orange_cap,
        "actualPurpleCapStats": purple_stats,
        "actualOrangeCapStats": orange_stats
    }

    return jsonify({"message": f"Updated points for {updated_count} predictions."}), 200



@app.route("/actual_results", methods=["GET"])
def get_actual_results():
    return jsonify(actual_results_data)

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    results = db.session.query(
        Prediction.name,
        db.func.sum(Prediction.points).label("total_points"),
        db.func.sum(Prediction.hits).label("total_hits"),
        db.func.sum(Prediction.misses).label("total_misses")
    ).group_by(Prediction.name).order_by(db.func.sum(Prediction.points).desc()).all()

    leaderboard_data = [{
        "name": r.name,
        "total_points": r.total_points,
        "total_hits": r.total_hits,
        "total_misses": r.total_misses
    } for r in results]

    return jsonify(leaderboard_data)

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

@app.route("/debug_predictions", methods=["GET"])
def debug_predictions():
    predictions = Prediction.query.all()
    return jsonify({
        "total_predictions": len(predictions),
        "predictions": [p.name for p in predictions]
    })


@app.route("/next_game_predictions", methods=["GET"])
def next_game_predictions():
    from sqlalchemy import func

    actual_count = len(actual_results_data.get("actualResults", []))
    next_game_index = actual_count  # zero-based index
    all_preds = Prediction.query.all()

    user_predictions = []
    for p in all_preds:
        try:
            game_preds = json.loads(p.predictions)
            prediction = game_preds[next_game_index] if next_game_index < len(game_preds) else ""
        except:
            prediction = ""
        user_predictions.append({"name": p.name, "prediction": prediction})

    return jsonify({
        "next_game_number": next_game_index + 1,
        "predictions": user_predictions
    })

@app.route("/cap_prediction_users", methods=["GET"])
def cap_prediction_users():
    predictions = Prediction.query.all()

    purple_cap_users = {}
    orange_cap_users = {}

    for p in predictions:
        # Purple Cap
        purple_cap_users.setdefault(p.purple_cap, []).append(p.name)
        # Orange Cap
        orange_cap_users.setdefault(p.orange_cap, []).append(p.name)

    return jsonify({
        "purple_cap_users": purple_cap_users,
        "orange_cap_users": orange_cap_users
    })




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Flask server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)


