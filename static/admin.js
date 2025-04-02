document.addEventListener("DOMContentLoaded", () => {
  fetchPredictionsAdmin();
  fetchAdminStats();
});

// Fetch Predictions
function fetchPredictionsAdmin() {
  fetch("/get_predictions")
    .then(response => response.json())
    .then(predictions => {
      displayPredictionsAdmin(predictions);
    })
    .catch(error => {
      console.error("Error fetching predictions:", error);
    });
}

// Display Predictions in Admin Table
function displayPredictionsAdmin(predictions) {
  const tableBody = document.querySelector("#adminPredictionTable tbody");
  const tableHeader = document.querySelector("#adminPredictionTableHeader");

  tableHeader.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>League Predictions</th>
      <th>Playoff Ranks</th>
      <th>Finalists</th>
      <th>Winner</th>
      <th>Purple Cap</th>
      <th>Orange Cap</th>
      <th>Points</th>
      <th>Timestamp</th>
      <th>Actions</th>
    </tr>
  `;

  tableBody.innerHTML = "";

  predictions.forEach(pred => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pred.id}</td>
      <td>${pred.name}</td>
      <td>${pred.predictions.join(", ")}</td>
      <td>${pred.semifinalists.join(", ")}</td>
      <td>${pred.finalists.join(", ")}</td>
      <td>${pred.winner}</td>
      <td>${pred.purple_cap}</td>
      <td>${pred.orange_cap}</td>
      <td>${pred.points}</td>
      <td>${pred.created_at}</td>
      <td>
        <button onclick='handleEdit(${JSON.stringify(pred)})'>Edit</button>
        <button onclick="deletePredictionAdmin(${pred.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Delete Prediction
function deletePredictionAdmin(predictionId) {
  if (!confirm("Are you sure you want to delete this prediction?")) return;

  fetch(`/delete_prediction/${predictionId}`, { method: "DELETE" })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      fetchPredictionsAdmin();
    })
    .catch(error => {
      console.error("Error deleting prediction:", error);
    });
}

// Fetch Stats
function fetchAdminStats() {
  fetch("/admin_stats")
    .then(response => response.json())
    .then(stats => {
      document.getElementById("statsDisplay").innerHTML = `
        <p>Total Predictions: ${stats.total_predictions}</p>
        <p>Total Points: ${stats.total_points}</p>
        <p>Average Points: ${stats.average_points.toFixed(2)}</p>
      `;
    });
}

// Update Actual Results
function updateActualResults() {
  const data = {
    actualResults: document.getElementById("actualResults").value.split(",").map(s => s.trim()),
    actualSemifinalists: document.getElementById("actualSemifinalists").value.split(",").map(s => s.trim()),
    actualFinalists: document.getElementById("actualFinalists").value.split(",").map(s => s.trim()),
    actualWinner: document.getElementById("actualWinner").value.trim(),
    actualPurpleCap: document.getElementById("actualPurpleCap").value.trim(),
    actualOrangeCap: document.getElementById("actualOrangeCap").value.trim(),
    actualPurpleCapStats: document.getElementById("actualPurpleCapStats").value.trim(),
    actualOrangeCapStats: document.getElementById("actualOrangeCapStats").value.trim()
  };

  fetch("/submit_results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      fetchAdminStats();
      fetchPredictionsAdmin();
    });
}

// Clear All Predictions
function clearPredictionsAdmin() {
  if (!confirm("Delete ALL predictions?")) return;

  fetch("/clear_predictions", { method: "DELETE" })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      fetchPredictionsAdmin();
      fetchAdminStats();
    });
}

// ----- EDIT PREDICTIONS -----

let editPredictionId = null;

function openEditModal(prediction) {
  const modal = document.getElementById("editModal");
  modal.style.display = "block";

  editPredictionId = prediction.id;

  document.getElementById("editName").value = prediction.name;
  document.getElementById("editWinner").value = prediction.winner;
  document.getElementById("editPurpleCap").value = prediction.purple_cap;
  document.getElementById("editOrangeCap").value = prediction.orange_cap;

  document.getElementById("editRank1").value = prediction.semifinalists[0] || "";
  document.getElementById("editRank2").value = prediction.semifinalists[1] || "";
  document.getElementById("editRank3").value = prediction.semifinalists[2] || "";
  document.getElementById("editRank4").value = prediction.semifinalists[3] || "";

  document.getElementById("editFinalist1").value = prediction.finalists[0] || "";
  document.getElementById("editFinalist2").value = prediction.finalists[1] || "";
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
}

function submitEditPrediction() {
  const updatedPrediction = {
    id: editPredictionId,
    name: document.getElementById("editName").value,
    winner: document.getElementById("editWinner").value,
    purple_cap: document.getElementById("editPurpleCap").value,
    orange_cap: document.getElementById("editOrangeCap").value,
    semifinalists: [
      document.getElementById("editRank1").value,
      document.getElementById("editRank2").value,
      document.getElementById("editRank3").value,
      document.getElementById("editRank4").value
    ],
    finalists: [
      document.getElementById("editFinalist1").value,
      document.getElementById("editFinalist2").value
    ]
  };

  fetch(`/update_prediction/${editPredictionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedPrediction)
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to update prediction");
      return response.json();
    })
    .then(result => {
      alert(result.message || "Prediction updated successfully!");
      closeEditModal();
      fetchPredictionsAdmin();
    })
    .catch(error => {
      console.error("Error updating prediction:", error);
      alert("Error updating prediction.");
    });
}

function handleEdit(prediction) {
  openEditModal(prediction);
}
