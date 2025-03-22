(function(){
  const gamesList = [
    "RCB vs KKR", "RR vs SRH", "MI vs CSK", "LSG vs DC", "PBKS vs GT",
    "KKR vs RR", "LSG vs SRH", "RCB vs CSK", "MI vs GT", "SRH vs DC",
    "CSK vs RR", "KKR vs MI", "PBKS vs LSG", "GT vs RCB", "SRH vs KKR",
    "MI vs LSG", "DC vs CSK", "RR vs PBKS", "LSG vs KKR", "GT vs SRH",
    "RCB vs MI", "PBKS vs CSK", "RR vs GT", "DC vs RCB", "KKR vs CSK",
    "GT vs LSG", "PBKS vs SRH", "RCB vs RR", "MI vs DC", "CSK vs LSG",
    "KKR vs PBKS", "RR vs DC", "SRH vs MI", "PBKS vs RCB", "DC vs GT",
    "LSG vs RR", "RCB vs PBKS", "CSK vs MI", "GT vs KKR", "DC vs LSG",
    "MI vs SRH", "RR vs RCB", "SRH vs CSK", "PBKS vs KKR", "LSG vs MI",
    "RCB vs DC", "GT vs RR", "KKR vs DC", "PBKS vs CSK", "MI vs RR",
    "SRH vs GT", "CSK vs RCB", "RR vs KKR", "LSG vs PBKS", "DC vs SRH",
    "GT vs MI", "CSK vs KKR", "DC vs PBKS", "RCB vs LSG", "KKR vs SRH",
    "MI vs PBKS", "GT vs DC", "RR vs CSK", "SRH vs RCB", "LSG vs GT",
    "DC vs MI", "PBKS vs RR", "KKR vs RCB", "CSK vs GT", "SRH vs LSG"
  ];
  const numGames = gamesList.length;
  const teamsList = ["RCB", "KKR", "MI", "CSK", "RR", "SRH", "LSG", "DC", "PBKS", "GT"];
  const teamColors = {
    RCB: "#00509E",
    KKR: "#6A0DAD",
    MI: "#003399",
    CSK: "#FFC107",
    RR: "#E91E63",
    SRH: "#FF5722",
    LSG: "#0B3D1",
    DC: "#B71C1C",
    PBKS: "#8E244D",
    GT: "#FF6F00"
  };

  function generateAdminTableHeader() {
    const header = document.getElementById("adminPredictionTableHeader");
    header.innerHTML = "";
    const row = document.createElement("tr");
    const headers = ["ID", "Name", "League Predictions", "Playoff Ranks", "Finalists", "Winner", "Purple Cap", "Orange Cap", "Points", "Timestamp", "Actions"];
    headers.forEach(text => {
      const th = document.createElement("th");
      th.innerText = text;
      row.appendChild(th);
    });
    header.appendChild(row);
  }

  function fetchAdminPredictions() {
    const tableBody = document.getElementById("adminPredictionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    fetch("/get_predictions")
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch predictions");
        return response.json();
      })
      .then(predictions => {
        if (!Array.isArray(predictions) || predictions.length === 0) {
          tableBody.innerHTML = `<tr><td colspan="11">No predictions available</td></tr>`;
        } else {
          predictions.forEach(prediction => {
            const row = document.createElement("tr");
            row.insertCell(0).innerText = prediction.id;
            row.insertCell(1).innerText = prediction.name;
            row.insertCell(2).innerText = Array.isArray(prediction.predictions) ? prediction.predictions.join(", ") : "";
            row.insertCell(3).innerText = Array.isArray(prediction.semifinalists) ? prediction.semifinalists.join(", ") : "";
            row.insertCell(4).innerText = Array.isArray(prediction.finalists) ? prediction.finalists.join(", ") : "";
            row.insertCell(5).innerText = prediction.winner;
            row.insertCell(6).innerText = prediction.purple_cap;
            row.insertCell(7).innerText = prediction.orange_cap;
            row.insertCell(8).innerText = prediction.points;
            row.insertCell(9).innerText = prediction.created_at;
            const actionsCell = row.insertCell(10);
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.onclick = () => deletePrediction(prediction.id);
            actionsCell.appendChild(deleteBtn);
            tableBody.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.error("Error fetching admin predictions:", error);
        tableBody.innerHTML = `<tr><td colspan="11">Error loading predictions</td></tr>`;
      });
  }

  function deletePrediction(predictionId) {
    if (!confirm(`Are you sure you want to delete prediction ${predictionId}?`)) return;
    fetch(`/delete_prediction/${predictionId}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) throw new Error("Failed to delete prediction");
        return response.json();
      })
      .then(data => {
        alert(data.message);
        fetchAdminPredictions();
        fetchAdminStats();
      })
      .catch(error => {
        console.error("Error deleting prediction:", error);
        alert("Error deleting prediction. Check console for details.");
      });
  }

  function fetchAdminStats() {
    const statsDiv = document.getElementById("statsDisplay");
    statsDiv.innerHTML = "Loading statistics...";
    fetch("/admin_stats")
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch admin statistics");
        return response.json();
      })
      .then(stats => {
        statsDiv.innerHTML = `
          <p>Total Predictions: ${stats.total_predictions}</p>
          <p>Total Points Awarded: ${stats.total_points}</p>
          <p>Average Points per Prediction: ${stats.average_points.toFixed(2)}</p>
        `;
      })
      .catch(error => {
        console.error("Error fetching admin statistics:", error);
        statsDiv.innerHTML = "Error loading statistics";
      });
  }

  function updateActualResults() {
    const actualResultsStr = document.getElementById("actualResults").value.trim();
    const actualSemisStr = document.getElementById("actualSemifinalists").value.trim();
    const actualFinalsStr = document.getElementById("actualFinalists").value.trim();
    const actualWinner = document.getElementById("actualWinner").value.trim();
    const actualPurpleCap = document.getElementById("actualPurpleCap").value.trim();
    const actualOrangeCap = document.getElementById("actualOrangeCap").value.trim();
    
    let actualResults = [];
    if(actualResultsStr) {
      actualResults = actualResultsStr.split(",").map(s => s.trim()).filter(s => s);
      if(actualResults.length > gamesList.length) {
        alert(`Please enter at most ${gamesList.length} game results, separated by commas.`);
        return;
      }
    }
    
    let actualSemifinalists = [];
    if(actualSemisStr) {
      actualSemifinalists = actualSemisStr.split(",").map(s => s.trim()).filter(s => s);
      if(actualSemifinalists.length !== 4){
        alert("Please enter exactly 4 semifinalists, or leave blank if not available.");
        return;
      }
    }
    
    let actualFinalists = [];
    if(actualFinalsStr) {
      actualFinalists = actualFinalsStr.split(",").map(s => s.trim()).filter(s => s);
      if(actualFinalists.length !== 2){
        alert("Please enter exactly 2 finalists, or leave blank if not available.");
        return;
      }
    }
    
    const payload = {
      actualResults: actualResults,
      actualSemifinalists: actualSemifinalists,
      actualFinalists: actualFinalists,
      actualWinner: actualWinner || "",
      actualPurpleCap: actualPurpleCap || "",
      actualOrangeCap: actualOrangeCap || ""
    };
    
    fetch("/submit_results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to submit actual results");
        return response.json();
      })
      .then(data => {
        alert(data.message);
        fetchAdminPredictions();
        fetchAdminStats();
      })
      .catch(error => {
        console.error("Error submitting actual results:", error);
        alert("Error updating actual results. Check console for details.");
      });
  }

  function clearPredictionsAdmin() {
    if (!confirm("Are you sure you want to clear all predictions?")) return;
    fetch("/clear_predictions", { method: "DELETE" })
      .then(response => {
        if (!response.ok) throw new Error("Failed to clear predictions");
        return response.json();
      })
      .then(data => {
        alert(data.message);
        fetchAdminPredictions();
        fetchAdminStats();
      })
      .catch(error => {
        console.error("Error clearing predictions:", error);
        alert("Error clearing predictions. Check console for details.");
      });
  }

  window.generateAdminTableHeader = generateAdminTableHeader;
  window.fetchAdminLeaderboard = function(){
    generateAdminTableHeader();
    fetchAdminPredictions();
  };
  window.fetchAdminStats = fetchAdminStats;
  window.updateActualResults = updateActualResults;
  window.clearPredictionsAdmin = clearPredictionsAdmin;

  window.addEventListener("load", function(){
    generateAdminTableHeader();
    fetchAdminPredictions();
    fetchAdminStats();
  });
})();
