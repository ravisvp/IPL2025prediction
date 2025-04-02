(function(){
  // ----- Data and Utility Functions -----
  const gamesList = [
    "RCB vs KKR",
    "RR vs SRH",
    "MI vs CSK",
    "LSG vs DC",
    "PBKS vs GT",
    "KKR vs RR",
    "LSG vs SRH",
    "RCB vs CSK",
    "MI vs GT",
    "SRH vs DC",
    "CSK vs RR",
    "KKR vs MI",
    "PBKS vs LSG",
    "GT vs RCB",
    "SRH vs KKR",
    "MI vs LSG",
    "DC vs CSK",
    "RR vs PBKS",
    "LSG vs KKR",
    "GT vs SRH",
    "RCB vs MI",
    "PBKS vs CSK",
    "RR vs GT",
    "DC vs RCB",
    "KKR vs CSK",
    "GT vs LSG",
    "PBKS vs SRH",
    "RCB vs RR",
    "MI vs DC",
    "CSK vs LSG",
    "KKR vs PBKS",
    "RR vs DC",
    "SRH vs MI",
    "PBKS vs RCB",
    "DC vs GT",
    "LSG vs RR",
    "RCB vs PBKS",
    "CSK vs MI",
    "GT vs KKR",
    "DC vs LSG",
    "MI vs SRH",
    "RR vs RCB",
    "SRH vs CSK",
    "PBKS vs KKR",
    "LSG vs MI",
    "RCB vs DC",
    "GT vs RR",
    "KKR vs DC",
    "PBKS vs CSK",
    "MI vs RR",
    "SRH vs GT",
    "CSK vs RCB",
    "RR vs KKR",
    "LSG vs PBKS",
    "DC vs SRH",
    "GT vs MI",
    "CSK vs KKR",
    "DC vs PBKS",
    "RCB vs LSG",
    "KKR vs SRH",
    "MI vs PBKS",
    "GT vs DC",
    "RR vs CSK",
    "SRH vs RCB",
    "LSG vs GT",
    "DC vs MI",
    "PBKS vs RR",
    "KKR vs RCB",
    "CSK vs GT",
    "SRH vs LSG"
  ];

  window.gamesList = gamesList;

  const numGames = gamesList.length;
  const teamsList = ["RCB", "KKR", "MI", "CSK", "RR", "SRH", "LSG", "DC", "PBKS", "GT"];
  const teamColors = {
    RCB: "#00509E",
    KKR: "#6A0DAD",
    MI: "#003399",
    CSK: "#FFC107",
    RR: "#E91E63",
    SRH: "#FF5722",
    LSG: "#0B3D91",
    DC: "#B71C1C",
    PBKS: "#8E244D",
    GT: "#FF6F00"
  };
  window.teamColors = teamColors;


  // Uniform styling for name cells in display tables
  const nameCellBgColor = "#e0d4f5"; // light violet
  const nameCellTextColor = "#000";
  function getRankColor(index) {
    if (index === 0) return "#FFD700"; // Gold
    if (index === 1) return "#C0C0C0"; // Silver
    if (index === 2) return "#CD7F32"; // Bronze
    return "#D3D3D3"; // Light Gray
  }
  window.getRankColor = getRankColor;
  // ----- Prediction Form Variables -----
  let selectedGamePredictions = new Array(gamesList.length).fill(null);
  // For playoff selections by rank, use an array of 4 items.
  let selectedSemifinalists = [null, null, null, null];
  let selectedFinalists = [];
  let selectedWinner = "";
  // ----- Prediction Form Functions -----
  function populateGamePredictions() {
    const container = document.getElementById("gamePredictionsContainer");
    container.innerHTML = "";
    gamesList.forEach((game, index) => {
      const gameContainer = document.createElement("div");
      gameContainer.className = "game-container";
      const label = document.createElement("span");
      label.className = "game-label";
      label.innerText = `Game ${index + 1} (${game}):`;
      gameContainer.appendChild(label);
      const teams = game.split(" vs ");
      teams.forEach(team => {
        const trimmedTeam = team.trim();
        const box = document.createElement("div");
        box.className = "team-box";
        box.innerText = trimmedTeam;
        box.style.backgroundColor = teamColors[trimmedTeam] || "#2f2f2f";
        box.onclick = function() {
          selectedGamePredictions[index] = trimmedTeam;
          const siblings = gameContainer.querySelectorAll(".team-box");
          siblings.forEach(sib => sib.classList.remove("selected"));
          box.classList.add("selected");
          updateGameSelectionDisplay(gameContainer, trimmedTeam);
        };
        gameContainer.appendChild(box);
      });
      const displaySpan = document.createElement("span");
      displaySpan.className = "selected-team";
      displaySpan.innerText = selectedGamePredictions[index] ? selectedGamePredictions[index] : "";
      gameContainer.appendChild(displaySpan);
      container.appendChild(gameContainer);
    });
  }
  function updateGameSelectionDisplay(gameContainer, team) {
    const displaySpan = gameContainer.querySelector(".selected-team");
    if (displaySpan) displaySpan.innerText = team;
  }
  // New function: populate a selection for a playoff rank.
  function populateRankSelect(rankIndex, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous content
    teamsList.forEach(team => {
      const box = document.createElement("div");
      box.className = "team-box";
      box.innerText = team;
      box.style.backgroundColor = teamColors[team] || "#2f2f2f";
      box.onclick = function() {
        // Check if the team is already selected in another rank.
        for (let i = 0; i < selectedSemifinalists.length; i++){
          if (i !== rankIndex && selectedSemifinalists[i] === team) {
            alert(`${team} is already selected for another rank. Please choose another team.`);
            return;
          }
        }
        selectedSemifinalists[rankIndex] = team;
        // Remove selected class from all boxes in this container.
        const boxes = container.querySelectorAll(".team-box");
        boxes.forEach(b => b.classList.remove("selected"));
        box.classList.add("selected");
      };
      container.appendChild(box);
    });
  }
  
  function populateMultiSelect(containerId, selectionArray, maxSelection) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    teamsList.forEach(team => {
      const box = document.createElement("div");
      box.className = "team-box";
      box.innerText = team;
      box.style.backgroundColor = teamColors[team] || "#2f2f2f";
      box.onclick = function() {
        const idx = selectionArray.indexOf(team);
        if (idx >= 0) {
          selectionArray.splice(idx, 1);
          box.classList.remove("selected");
        } else {
          if (selectionArray.length < maxSelection) {
            selectionArray.push(team);
            box.classList.add("selected");
          } else {
            alert(`Please select exactly ${maxSelection} teams.`);
          }
        }
      };
      container.appendChild(box);
    });
  }
  function populateSingleSelect(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    teamsList.forEach(team => {
      const box = document.createElement("div");
      box.className = "team-box";
      box.innerText = team;
      box.style.backgroundColor = teamColors[team] || "#2f2f2f";
      box.onclick = function() {
        const boxes = container.querySelectorAll(".team-box");
        boxes.forEach(b => b.classList.remove("selected"));
        box.classList.add("selected");
        selectedWinner = team;
      };
      container.appendChild(box);
    });
  }
  
  function initPredictionForm(){
    selectedGamePredictions = new Array(gamesList.length).fill(null);
    selectedSemifinalists = [null, null, null, null];
    selectedFinalists = [];
    selectedWinner = "";
    populateGamePredictions();
    // Populate 4 separate playoff rank selections:
    populateRankSelect(0, "rank1Container");
    populateRankSelect(1, "rank2Container");
    populateRankSelect(2, "rank3Container");
    populateRankSelect(3, "rank4Container");
    // Finalists and winner remain unchanged:
    populateMultiSelect("finalistContainer", selectedFinalists, 2);
    populateSingleSelect("winnerContainer");
  }
  
  function submitUserPrediction(){
    const name = document.getElementById("name").value;
    if (!name) {
      alert("Please enter your name or nickname.");
      return;
    }
    for (let i = 0; i < selectedGamePredictions.length; i++){
      if (!selectedGamePredictions[i]){
        alert(`Please make a selection for game ${i+1}.`);
        return;
      }
    }
    if (selectedSemifinalists.some(rank => !rank)) {
      alert("Please select a team for each playoff rank (Rank 1, Rank 2, Rank 3, Rank 4).");
      return;
    }
    if (selectedFinalists.length !== 2) {
      alert("Please select exactly 2 finalists.");
      return;
    }
    if (!selectedWinner) {
      alert("Please select a winner.");
      return;
    }
    
    // New fields: Purple Cap and Orange Cap (moved after winner)
    const purpleCap = document.getElementById("purple_cap").value;
    const orangeCap = document.getElementById("orange_cap").value;
    if (!purpleCap) {
      alert("Please enter the Purple Cap Winner.");
      return;
    }
    if (!orangeCap) {
      alert("Please enter the Orange Cap Winner.");
      return;
    }
    
    const data = {
      name: name,
      predictions: selectedGamePredictions,
      semifinalists: selectedSemifinalists,
      finalists: selectedFinalists,
      winner: selectedWinner,
      purple_cap: purpleCap,
      orange_cap: orangeCap
    };
    console.log("Submitting prediction:", data);
    fetch("/submit_prediction", {
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).then(response => {
      if (!response.ok) throw new Error("Network response not ok");
      return response.json();
    }).then(result => {
      alert(result.message);
      document.getElementById("userPredictionForm").style.display = "none";
      document.getElementById("enterPredictionTitle").style.display = "none";
      document.getElementById("acknowledgment").style.display = "block";
      displayFinalsPredictions();
      displayLeaderboard();
      displayPredictions();
    }).catch(error => {
      console.error("Error submitting prediction:", error);
      alert("Error submitting prediction. Check console for details.");
    });
  }
  
  // ----- Navigation and Display Functions -----
  function showExpertTab(){
    document.getElementById("scoreboardContainer").style.display = "block";
    document.getElementById("allPredictionsContainer").style.display = "none";
    document.getElementById("tab-expert").classList.add("active");
    document.getElementById("tab-all").classList.remove("active");
    displayLeaderboard();
  }
  function showAllPredictionsTab(){
    document.getElementById("scoreboardContainer").style.display = "none";
    document.getElementById("allPredictionsContainer").style.display = "block";
    document.getElementById("tab-all").classList.add("active");
    document.getElementById("tab-expert").classList.remove("active");
    displayPredictions();
  }
  function showPredictionForm(){
    console.log("showPredictionForm called");
    document.getElementById("main-view").style.display = "none";
    document.getElementById("prediction-form").style.display = "block";
    initPredictionForm();
  }
  function showMainView(){
    document.getElementById("prediction-form").style.display = "none";
    document.getElementById("acknowledgment").style.display = "none";
    document.getElementById("main-view").style.display = "block";
    displayLeaderboard();
    displayPredictions();
    displayFinalsPredictions();
  }
  
  function displayLeaderboard() {
    const tableBody = document.getElementById("leaderboardTable").getElementsByTagName("tbody")[0];
    const streakContainer = document.getElementById("streakStats");
    tableBody.innerHTML = "";
    if (streakContainer) streakContainer.innerHTML = "";
  
    Promise.all([
      fetch("/get_predictions").then(r => {
        if (!r.ok) throw new Error("Failed to fetch predictions");
        return r.json();
      }),
      fetch("/actual_results").then(r => r.json())
    ])
      .then(([predictions, actualData]) => {
        let gamesCompleted = actualData?.actualResults?.length || 0;
        let topHitStreak = { name: "", streak: 0 };
        let topMissStreak = { name: "", streak: 0 };
  
        predictions.forEach(pred => {
          let maxHit = 0, maxMiss = 0, curHit = 0, curMiss = 0;
          const actual = actualData?.actualResults || [];
          const userPreds = Array.isArray(pred.predictions)
            ? pred.predictions
            : JSON.parse(pred.predictions || "[]");
  
          for (let i = 0; i < actual.length; i++) {
            const predicted = userPreds[i]?.toUpperCase();
            const correct = actual[i]?.toUpperCase();
  
            if (predicted === correct) {
              curHit++;
              maxHit = Math.max(maxHit, curHit);
              curMiss = 0;
            } else {
              curMiss++;
              maxMiss = Math.max(maxMiss, curMiss);
              curHit = 0;
            }
          }
  
          if (maxHit > topHitStreak.streak) {
            topHitStreak = { name: pred.name, streak: maxHit };
          }
          if (maxMiss > topMissStreak.streak) {
            topMissStreak = { name: pred.name, streak: maxMiss };
          }
        });
  
        if (streakContainer) {
          setTimeout(() => {
            streakContainer.innerHTML = `
              <div class="streak-box hit-glow">
                <span class="emoji">🔥</span>Longest Hit Streak: <strong>${topHitStreak.name}</strong> (${topHitStreak.streak} in a row)
              </div>
              <div class="streak-box miss-glow">
                <span class="emoji">💀</span>Longest Miss Streak: <strong>${topMissStreak.name}</strong> (${topMissStreak.streak} in a row)
              </div>
            `;
          }, 3000);
        }
  
        // Leaderboard
        fetch("/leaderboard")
          .then(r => r.json())
          .then(leaderboard => {
            if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
              tableBody.innerHTML = "<tr><td colspan='5'>No leaderboard data available</td></tr>";
            } else {
              leaderboard.forEach((entry, idx) => {
                const row = document.createElement("tr");
                const rankNumber = idx + 1;
                const displayName = entry.name || "User";
  
                // 🎖️ Add emoji + glow text classes
                const nameCell = document.createElement("td");
                let icon = "";
                if (idx === 0) {
                  icon = "🏆 ";
                  nameCell.classList.add("top-predictor");
                  row.classList.add("top-rank-gold");
                } else if (idx === 1) {
                  icon = "🥈 ";
                  nameCell.classList.add("second-predictor");
                  row.classList.add("top-rank-silver");
                } else if (idx === 2) {
                  icon = "🥉 ";
                  nameCell.classList.add("third-predictor");
                  row.classList.add("top-rank-bronze");
                }
                else {
                  row.classList.add("leaderboard-row");  // ✅ add this for non-top-3
                }
  
                nameCell.innerHTML = `${rankNumber}. ${icon}${displayName}`;

                if (idx > 2) {
                  nameCell.classList.add("regular-predictor");
                }
                
            
                nameCell.style.color = "#000";
                nameCell.style.fontWeight = "bold";
                nameCell.style.whiteSpace = "nowrap";
                row.appendChild(nameCell);
  
                const pointsCell = document.createElement("td");
                pointsCell.textContent = entry.total_points ?? 0;
                pointsCell.style.backgroundColor = pointsCell.textContent > 0 ? "#008000" : "#2f2f2f";
                pointsCell.style.color = "#fff";
                row.appendChild(pointsCell);
  
                const hitsCell = document.createElement("td");
                hitsCell.textContent = entry.total_hits ?? 0;
                hitsCell.style.backgroundColor = hitsCell.textContent > 0 ? "#008000" : "#2f2f2f";
                hitsCell.style.color = "#fff";
                row.appendChild(hitsCell);
  
                const missesCell = document.createElement("td");
                missesCell.textContent = entry.total_misses ?? 0;
                missesCell.style.backgroundColor = missesCell.textContent > 0 ? "#B22222" : "#2f2f2f";
                missesCell.style.color = "#fff";
                row.appendChild(missesCell);
  
                const gamesCompletedCell = document.createElement("td");
                gamesCompletedCell.textContent = gamesCompleted;
                gamesCompletedCell.style.backgroundColor = "#2f2f2f";
                gamesCompletedCell.style.color = "#fff";
                row.appendChild(gamesCompletedCell);
  
                tableBody.appendChild(row);
              });
            }
          });
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        tableBody.innerHTML = "<tr><td colspan='5'>Error loading leaderboard</td></tr>";
      });
  }
  
  
  
  
  // ----- Detailed Predictions Display -----
  function generateDetailedPredictionTableHeader(){
    const header = document.getElementById("predictionTableHeader");
    header.innerHTML = "";
    const row = document.createElement("tr");
    let th = document.createElement("th");
    th.innerText = "Name";
    row.appendChild(th);
    gamesList.forEach(game=>{
      th = document.createElement("th");
      th.innerText = game;
      row.appendChild(th);
    });
    for (let i = 1; i <= 4; i++){
      th = document.createElement("th");
      th.innerText = `Rank ${i}`;
      row.appendChild(th);
    }
    for (let i = 1; i <= 2; i++){
      th = document.createElement("th");
      th.innerText = `Final ${i}`;
      row.appendChild(th);
    }
    th = document.createElement("th");
    th.innerText = "Winner";
    row.appendChild(th);
    // New headers for Purple Cap and Orange Cap
    th = document.createElement("th");
    th.innerText = "Purple Cap";
    row.appendChild(th);
    th = document.createElement("th");
    th.innerText = "Orange Cap";
    row.appendChild(th);
    
    th = document.createElement("th");
    th.innerText = "Points";
    row.appendChild(th);
    header.appendChild(row);
  }
  function createBarChart(ctx, chartLabel, dataCounts, useTeamColors = false, defaultColor = "#CCCCCC") {
    // If a chart instance exists on this canvas, destroy it first
    if (ctx.canvas.chartInstance) {
      ctx.canvas.chartInstance.destroy();
    }
  
    const sortedEntries = Object.entries(dataCounts).sort((a, b) => b[1] - a[1]);
    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);
    const backgroundColors = useTeamColors
      ? labels.map(team => teamColors[team] || defaultColor)
      : labels.map(() => defaultColor);

  // Example: A dark gray background color behind the chart
      ctx.canvas.style.backgroundColor = "#1a1a1a"; // or #2f2f2f, etc.

    const isMobile = window.innerWidth < 600;
  
    // Create new chart instance
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          data: data,
          backgroundColor: backgroundColors,
          borderColor: '#000', // black or something that stands out
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
          padding: {
            left: isMobile ? 5 : 20,
            right: isMobile ? 5 : 20,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          y: {
            ticks: {
              color: '#FFFFFF',
              font: {
                size: isMobile ? 10 : 14,
                weight: 'bold'
              }
            }
          },
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: '#FFFFFF',
              font: {
                size: isMobile ? 8 : 12
              }
            },
            grid: {
              color: '#555'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  
    // Store the new chart instance on the canvas for later reference
    ctx.canvas.chartInstance = newChart;
  }
  
  
  
  function displayStatistics() {
    const container = document.getElementById("statisticsContainer");
  
    if (!container) {
      console.error("Statistics container not found!");
      return;
    }
  
    container.innerHTML = "<p>Loading statistics...</p>";
  
    Promise.all([
      fetch("/get_predictions").then(r => r.json()),
      fetch("/actual_results").then(r => r.json()),
      fetch("/cap_prediction_users").then(r => r.json())
    ])
      .then(([predictions, actualData, capUsers]) => {
        if (!predictions || predictions.length === 0) {
          container.innerHTML = "<p>No predictions to show statistics.</p>";
          return;
        }
  
        const winnerCounts = {};
        const purpleCapCounts = {};
        const orangeCapCounts = {};
  
        predictions.forEach(pred => {
          winnerCounts[pred.winner || "Unknown"] = (winnerCounts[pred.winner || "Unknown"] || 0) + 1;
          purpleCapCounts[pred.purple_cap || "Unknown"] = (purpleCapCounts[pred.purple_cap || "Unknown"] || 0) + 1;
          orangeCapCounts[pred.orange_cap || "Unknown"] = (orangeCapCounts[pred.orange_cap || "Unknown"] || 0) + 1;
        });
  
        container.innerHTML = `
          <h2 class="violet-heading">Prediction Statistics</h2>
          <div class="chart-container">
            <div class="chart-header violet-header">Winner Predictions</div>
            <canvas id="winnerChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header violet-header">Purple Cap Predictions</div>
            <canvas id="purpleCapChart"></canvas>
          </div>
          <div class="chart-container">
            <div class="chart-header violet-header">Orange Cap Predictions</div>
            <canvas id="orangeCapChart"></canvas>
          </div>
        `;
  
        createBarChart(
          document.getElementById("winnerChart").getContext("2d"),
          "Winner Predictions",
          winnerCounts,
          true
        );
  
        const actualPurpleCapStats = actualData.actualPurpleCapStats || {};
        const combinedPurpleStats = Object.keys(purpleCapCounts).map(player => ({
          player,
          predictionsCount: purpleCapCounts[player],
          wickets: parseInt(actualPurpleCapStats[player]) || 0,
          users: capUsers.purple_cap_users[player] || []
        }));
  
        combinedPurpleStats.sort((a, b) => b.wickets - a.wickets);
  
        const purpleLabels = combinedPurpleStats.map(stat => `${stat.player} (${stat.wickets} wkts)`);
        const purpleData = combinedPurpleStats.map(stat => stat.predictionsCount);
        const purpleLabelColors = combinedPurpleStats.map((_, index) => ['#FFD700', '#C0C0C0', '#CD7F32'][index] || '#FFFFFF');
  
        const ctxPurple = document.getElementById("purpleCapChart").getContext("2d");
        if (ctxPurple.canvas.chartInstance) ctxPurple.canvas.chartInstance.destroy();
        ctxPurple.canvas.style.backgroundColor = "#1a1a1a";
  
        ctxPurple.canvas.chartInstance = new Chart(ctxPurple, {
          type: 'bar',
          data: { labels: purpleLabels, datasets: [{ label: "Purple Cap Predictions", data: purpleData, backgroundColor: "#90EE90", borderColor: '#000', borderWidth: 1 }] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
              y: { ticks: { color: ctx => purpleLabelColors[ctx.index], font: { size: window.innerWidth < 600 ? 10 : 14, weight: 'bold' } } },
              x: { beginAtZero: true, ticks: { precision: 0, color: '#FFFFFF', font: { size: window.innerWidth < 600 ? 8 : 12 } }, grid: { color: '#555' } }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: ctx => `Purple Cap Predictions: ${combinedPurpleStats[ctx.dataIndex].predictionsCount} (${combinedPurpleStats[ctx.dataIndex].users.join(", ")})`
                }
              }
            }
          }
        });
  
        const actualOrangeCapStats = actualData.actualOrangeCapStats || {};
        const combinedOrangeStats = Object.keys(orangeCapCounts).map(player => ({
          player,
          predictionsCount: orangeCapCounts[player],
          runs: parseInt(actualOrangeCapStats[player]) || 0,
          users: capUsers.orange_cap_users[player] || []
        }));
  
        combinedOrangeStats.sort((a, b) => b.runs - a.runs);
  
        const orangeLabels = combinedOrangeStats.map(stat => `${stat.player} (${stat.runs} runs)`);
        const orangeData = combinedOrangeStats.map(stat => stat.predictionsCount);
        const orangeLabelColors = combinedOrangeStats.map((_, index) => ['#FFD700', '#C0C0C0', '#CD7F32'][index] || '#FFFFFF');
  
        const ctxOrange = document.getElementById("orangeCapChart").getContext("2d");
        if (ctxOrange.canvas.chartInstance) ctxOrange.canvas.chartInstance.destroy();
        ctxOrange.canvas.style.backgroundColor = "#1a1a1a";
  
        ctxOrange.canvas.chartInstance = new Chart(ctxOrange, {
          type: 'bar',
          data: { labels: orangeLabels, datasets: [{ label: "Orange Cap Predictions", data: orangeData, backgroundColor: "#FFA500", borderColor: '#000', borderWidth: 1 }] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
              y: { ticks: { color: ctx => orangeLabelColors[ctx.index], font: { size: window.innerWidth < 600 ? 10 : 14, weight: 'bold' } } },
              x: { beginAtZero: true, ticks: { precision: 0, color: '#FFFFFF', font: { size: window.innerWidth < 600 ? 8 : 12 } }, grid: { color: '#555' } }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: ctx => `Orange Cap Predictions: ${combinedOrangeStats[ctx.dataIndex].predictionsCount} (${combinedOrangeStats[ctx.dataIndex].users.join(", ")})`
                }
              }
            }
          }
        });
      })
      .catch(error => {
        console.error("Error fetching predictions statistics:", error);
        container.innerHTML = "<p>Error loading statistics.</p>";
      });
  }
  
  function renderBarChart(canvasId, label, dataCounts) {
    const ctx = document.getElementById(canvasId).getContext('2d');
  
    // Convert the counts object to an array and sort it descending by count
    const sortedEntries = Object.entries(dataCounts).sort((a, b) => b[1] - a[1]);
  
    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);
  
    // Create an array of colors based on team names, or default color if not found.
    const backgroundColors = labels.map(team => teamColors[team] || 'rgba(54, 162, 235, 0.6)');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y', // Horizontal bar
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  function displayComments() {
    const container = document.getElementById("commentsContainer");
    if (!container) {
      console.error("commentsContainer not found!");
      return;
    }
  
    container.innerHTML = `<h2 class="violet-heading">Comments</h2><div>Loading comments...</div>`;
  
    fetch("/get_comments")
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch comments");
        return response.json();
      })
      .then(comments => {
        if (!Array.isArray(comments) || comments.length === 0) {
          container.innerHTML = `<h2 class="violet-heading">Comments</h2><div>No comments yet.</div>`;
          return;
        }
  
        let html = `<h2 class="violet-heading">Comments</h2>`;
        comments.forEach(c => {
          html += `
            <div class="comment-item">
              <div class="comment-meta">
                <strong class="comment-name">${c.name}</strong> 
                <span class="comment-time">(${c.created_at})</span>
              </div>
              <div class="comment-text">${c.comment}</div>
            </div>
          `;
        });
  
        container.innerHTML = html;
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
        container.innerHTML = `<h2 class="violet-heading">Comments</h2><div>Error loading comments.</div>`;
      });
  }
  

  function showCommentForm() {
    document.getElementById("main-view").style.display = "none";
    document.getElementById("comment-form").style.display = "block";
  }
  function submitUserComment() {
    const name = document.getElementById("commentName").value.trim();
    const comment = document.getElementById("commentText").value.trim();
  
    if (!name || !comment) {
      alert("Please enter both your name and comment.");
      return;
    }
  
    fetch("/submit_comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, comment: comment })
    })
      .then(response => {
        if (!response.ok) {
          // Extract error from server response
          return response.json().then(err => {
            throw new Error(err.error || "Failed to submit comment");
          });
        }
        return response.json();
      })
      .then(result => {
        alert(result.message || "Comment submitted!");
        
        // Optionally hide the form and show acknowledgment
        document.getElementById("comment-form").style.display = "none";
        document.getElementById("commentAcknowledgment").style.display = "block";
        
        // Back to main view after acknowledgment
        // OR remove showMainView() if you want to stay on acknowledgment
        showMainView(); 
        displayComments();  // Refresh the comments section if it's on main view
      })
      .catch(error => {
        console.error("Error submitting comment:", error);
        alert("Error submitting comment: " + error.message);
      });
  }
  
  
  function displayPredictions(){
    generateDetailedPredictionTableHeader();
    const tableBody = document.getElementById("predictionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    fetch("/actual_results")
    .then(response => response.json())
    .then(actualData => {
      if (actualData && actualData.actualResults && actualData.actualResults.length === gamesList.length){
        const row = tableBody.insertRow(0);
        let cell = row.insertCell(-1);
        cell.innerText = "Actual Results";
        cell.style.fontWeight = "bold";
        actualData.actualResults.forEach(result => {
          cell = row.insertCell(-1);
          cell.innerText = result;
          cell.style.backgroundColor = teamColors[result] || "#2f2f2f";
          cell.style.fontWeight = "bold";
        });
        if (actualData.actualSemifinalists && actualData.actualSemifinalists.length === 4){
          actualData.actualSemifinalists.forEach(team => {
            cell = row.insertCell(-1);
            cell.innerText = team;
            cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
            cell.style.fontWeight = "bold";
          });
        } else {
          for (let i = 0; i < 4; i++) row.insertCell(-1).innerText = "";
        }
        if (actualData.actualFinalists && actualData.actualFinalists.length === 2){
          actualData.actualFinalists.forEach(team => {
            cell = row.insertCell(-1);
            cell.innerText = team;
            cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
            cell.style.fontWeight = "bold";
          });
        } else {
          for (let i = 0; i < 2; i++) row.insertCell(-1).innerText = "";
        }
        let winnerCell = row.insertCell(-1);
        winnerCell.innerText = actualData.actualWinner || "";
        winnerCell.style.backgroundColor = teamColors[actualData.actualWinner] || "#2f2f2f";
        winnerCell.style.fontWeight = "bold";
        row.insertCell(-1).innerText = "";
        // New cells for Purple Cap and Orange Cap (for actual results row, leave empty)
        row.insertCell(-1).innerText = "";
        row.insertCell(-1).innerText = "";
      }
      fetch("/get_predictions")
      .then(response => {
        if (!response.ok) throw new Error("Server response not ok");
        return response.json();
      })
      .then(predictions => {
        console.log("Detailed predictions count:", predictions.length);
        if (!Array.isArray(predictions) || predictions.length === 0){
          tableBody.innerHTML += `<tr><td colspan="${1 + gamesList.length + 4 + 2 + 1 + 2 + 1}">No predictions available</td></tr>`;
        } else {
          predictions.forEach((prediction, idx) => {
            const row = tableBody.insertRow(-1);
            const nameCell = row.insertCell();
            nameCell.innerText = prediction.name ? prediction.name : "User";
            nameCell.style.backgroundColor = nameCellBgColor;
            nameCell.style.color = nameCellTextColor;
            nameCell.style.fontWeight = "bold";
            nameCell.style.whiteSpace = "nowrap";
            if (!prediction.predictions || prediction.predictions.length !== gamesList.length){
              for (let i = 0; i < gamesList.length; i++){
                row.insertCell(-1).innerText = "";
              }
            } else {
              prediction.predictions.forEach(pred => {
                row.insertCell(-1).innerText = pred;
              });
            }
            if (!prediction.semifinalists){
              for (let i = 0; i < 4; i++){
                row.insertCell(-1).innerText = "";
              }
            } else {
              let semis = (typeof prediction.semifinalists === "string") ? JSON.parse(prediction.semifinalists) : prediction.semifinalists;
              semis.forEach(s => {
                row.insertCell(-1).innerText = s;
              });
            }
            if (!prediction.finalists){
              for (let i = 0; i < 2; i++){
                row.insertCell(-1).innerText = "";
              }
            } else {
              let finals = (typeof prediction.finalists === "string") ? JSON.parse(prediction.finalists) : prediction.finalists;
              finals.forEach(f => {
                row.insertCell(-1).innerText = f;
              });
            }
            row.insertCell(-1).innerText = prediction.winner;
            let purpleCell = row.insertCell(-1);
            purpleCell.innerText = prediction.purple_cap || "";
            purpleCell.style.fontWeight = "bold";
            purpleCell.style.backgroundColor = "#90EE90";
            purpleCell.style.color = "#000";
            let orangeCell = row.insertCell(-1);
            orangeCell.innerText = prediction.orange_cap || "";
            orangeCell.style.fontWeight = "bold";
            orangeCell.style.backgroundColor = "#FFA500";
            orangeCell.style.color = "#000";
            let pointsCell = row.insertCell(-1);
            pointsCell.innerText = prediction.points;
            if (!isNaN(prediction.points) && prediction.points > 0){
              pointsCell.style.backgroundColor = "#008000";
              pointsCell.style.color = "#fff";
            } else {
              pointsCell.style.backgroundColor = "#2f2f2f";
              pointsCell.style.color = "#fff";
            }
          });
          colorizeTable();
        }
      })
      .catch(error => {
        console.error("Error fetching detailed predictions:", error);
        tableBody.innerHTML = `<tr><td colspan="${1 + gamesList.length + 4 + 2 + 1 + 2 + 1}">Error loading predictions</td></tr>`;
      });
    })
    .catch(error => {
      console.error("Error fetching actual results for detailed predictions:", error);
      fetchPredictionsFallback();
    });
  }
  function fetchPredictionsFallback(){
    const tableBody = document.getElementById("predictionTable").getElementsByTagName("tbody")[0];
    fetch("/get_predictions")
    .then(response => {
      if (!response.ok) throw new Error("Server response not ok");
      return response.json();
    })
    .then(predictions => {
      if (!Array.isArray(predictions) || predictions.length === 0){
        tableBody.innerHTML += `<tr><td colspan="21">No predictions available</td></tr>`;
      } else {
        predictions.forEach(prediction => {
          const row = tableBody.insertRow(-1);
          row.insertCell(0).innerText = prediction.name ? prediction.name : "User";
          if (!prediction.predictions || prediction.predictions.length !== gamesList.length){
            for (let i = 0; i < gamesList.length; i++){
              row.insertCell(-1).innerText = "";
            }
          } else {
            prediction.predictions.forEach(pred => {
              row.insertCell(-1).innerText = pred;
            });
          }
          if (!prediction.semifinalists){
            for (let i = 0; i < 4; i++){
              row.insertCell(-1).innerText = "";
            }
          } else {
            let semis = (typeof prediction.semifinalists === "string") ? JSON.parse(prediction.semifinalists) : prediction.semifinalists;
            semis.forEach(s => {
              row.insertCell(-1).innerText = s;
            });
          }
          if (!prediction.finalists){
            for (let i = 0; i < 2; i++){
              row.insertCell(-1).innerText = "";
            }
          } else {
            let finals = (typeof prediction.finalists === "string") ? JSON.parse(prediction.finalists) : prediction.finalists;
            finals.forEach(f => {
              row.insertCell(-1).innerText = f;
            });
          }
          row.insertCell(-1).innerText = prediction.winner;
          let purpleCell = row.insertCell(-1);
          purpleCell.innerText = prediction.purple_cap || "";
          purpleCell.style.fontWeight = "bold";
          purpleCell.style.backgroundColor = "#90EE90";
          purpleCell.style.color = "#000";
          let orangeCell = row.insertCell(-1);
          orangeCell.innerText = prediction.orange_cap || "";
          orangeCell.style.fontWeight = "bold";
          orangeCell.style.backgroundColor = "#FFA500";
          orangeCell.style.color = "#000";
          row.insertCell(-1).innerText = prediction.points;
          colorizeTable();
        });
      }
    })
    .catch(error => {
      console.error("Error fetching predictions (fallback):", error);
      tableBody.innerHTML = `<tr><td colspan="21">Error loading predictions</td></tr>`;
    });
  }
  function colorizeTable(){
    const tableBody = document.getElementById("predictionTable").getElementsByTagName("tbody")[0];
    const rows = tableBody.rows;
    for (let r = 0; r < rows.length; r++){
      const row = rows[r];
      for (let i = 1; i <= numGames; i++){
        const cell = row.cells[i];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
      for (let i = 1 + numGames; i < 1 + gamesList.length + 4; i++){
        const cell = row.cells[i];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
      for (let i = 1 + gamesList.length + 4; i < 1 + gamesList.length + 4 + 2; i++){
        const cell = row.cells[i];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
      {
        const cell = row.cells[1 + gamesList.length + 4 + 2];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
    }
  }
  function displayFinalsPredictions() {
    const finalsTable = document.getElementById("finalsPredictionTable");
    let tableBody = finalsTable.getElementsByTagName("tbody")[0];
    
    if (!tableBody) {
      tableBody = document.createElement("tbody");
      finalsTable.appendChild(tableBody);
    }
  
    tableBody.innerHTML = "";
  
    fetch("/get_predictions")
      .then(response => {
        if (!response.ok) throw new Error("Server response not ok");
        return response.json();
      })
      .then(predictions => {
        console.log("Finals predictions count:", predictions.length);
  
        if (!Array.isArray(predictions) || predictions.length === 0) {
          tableBody.innerHTML = "<tr><td colspan='10'>No playoffs predictions available</td></tr>";
          return;
        }
  
        predictions.forEach((prediction, idx) => {
          const row = document.createElement("tr");
  
          // Add numbering and user name
          const number = idx + 1;
          const displayName = prediction.name || "User";
          const nameCell = document.createElement("td");
          nameCell.innerText = `${number}. ${displayName}`;
          nameCell.style.backgroundColor = nameCellBgColor;
          nameCell.style.color = nameCellTextColor;
          nameCell.style.fontWeight = "bold";
          nameCell.style.whiteSpace = "nowrap";
          row.appendChild(nameCell);
  
          // Semifinalists (Rank 1-4)
          let ranks = [];
          if (prediction.semifinalists) {
            ranks = (typeof prediction.semifinalists === "string") ? JSON.parse(prediction.semifinalists) : prediction.semifinalists;
          }
          for (let i = 0; i < 4; i++) {
            const cell = document.createElement("td");
            cell.innerText = ranks[i] || "";
            cell.style.fontWeight = "bold";
            if (cell.innerText.trim()) {
              cell.style.backgroundColor = teamColors[cell.innerText.trim()] || "#2f2f2f";
              cell.style.color = "#fff";
            }
            row.appendChild(cell);
          }
  
          // Finalists (2 teams)
          let finals = [];
          if (prediction.finalists) {
            finals = (typeof prediction.finalists === "string") ? JSON.parse(prediction.finalists) : prediction.finalists;
          }
          for (let i = 0; i < 2; i++) {
            const cell = document.createElement("td");
            cell.innerText = finals[i] || "";
            cell.style.fontWeight = "bold";
            if (cell.innerText.trim()) {
              cell.style.backgroundColor = teamColors[cell.innerText.trim()] || "#2f2f2f";
              cell.style.color = "#fff";
            }
            row.appendChild(cell);
          }
  
          // Winner
          const winnerCell = document.createElement("td");
          winnerCell.innerText = prediction.winner || "";
          winnerCell.style.fontWeight = "bold";
          if (winnerCell.innerText.trim()) {
            winnerCell.style.backgroundColor = teamColors[winnerCell.innerText.trim()] || "#2f2f2f";
            winnerCell.style.color = "#fff";
          }
          row.appendChild(winnerCell);
  
          // Purple Cap
          const purpleCapCell = document.createElement("td");
          purpleCapCell.innerText = prediction.purple_cap || "";
          purpleCapCell.style.fontWeight = "bold";
          purpleCapCell.style.backgroundColor = "#90EE90";
          purpleCapCell.style.color = "#000";
          row.appendChild(purpleCapCell);
  
          // Orange Cap
          const orangeCapCell = document.createElement("td");
          orangeCapCell.innerText = prediction.orange_cap || "";
          orangeCapCell.style.fontWeight = "bold";
          orangeCapCell.style.backgroundColor = "#FFA500";
          orangeCapCell.style.color = "#000";
          row.appendChild(orangeCapCell);
  
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Error fetching playoffs predictions:", error);
        tableBody.innerHTML = "<tr><td colspan='10'>Error loading playoffs predictions</td></tr>";
      });
  }
  

  // ----- Attach Event Listeners and Expose Functions -----
  window.addEventListener("load", function(){
    const enterBtn = document.getElementById("enterPredictionBtn");
    if (enterBtn) {
      enterBtn.onclick = showPredictionForm;
      console.log("Enter Predictions button assigned");
    } else {
      console.error("Enter Predictions button not found.");
    }
    // Refresh all tables on page load
    displayLeaderboard();
    displayPredictions();
    const enterCommentBtn = document.getElementById("enterCommentBtn");
if (enterCommentBtn) {
  enterCommentBtn.onclick = showCommentForm;
  console.log("Enter Comment button assigned");
} else {
  console.error("Enter Comment button not found.");
}

// Refresh comments on load
displayComments();

    fetch("/get_predictions")
      .then(response => {
        if (!response.ok) throw new Error("Server response not ok");
        return response.json();
      })
      .then(predictions => {
        console.log("Finals predictions count:", predictions.length);
      })
      .catch(error => {
        console.error("Error fetching finals predictions count:", error);
      });
    displayFinalsPredictions();
    displayStatistics();
    generateDetailedPredictionTableHeader();
  });
  function generateDetailedPredictionTableHeader(){
    const header = document.getElementById("predictionTableHeader");
    header.innerHTML = "";
    const row = document.createElement("tr");
    let th = document.createElement("th");
    th.innerText = "Name";
    row.appendChild(th);
    gamesList.forEach(game=>{
      th = document.createElement("th");
      th.innerText = game;
      row.appendChild(th);
    });
    for (let i = 1; i <= 4; i++){
      th = document.createElement("th");
      th.innerText = `Rank ${i}`;
      row.appendChild(th);
    }
    for (let i = 1; i <= 2; i++){
      th = document.createElement("th");
      th.innerText = `Final ${i}`;
      row.appendChild(th);
    }
    th = document.createElement("th");
    th.innerText = "Winner";
    row.appendChild(th);
    // New headers for Purple Cap and Orange Cap
    th = document.createElement("th");
    th.innerText = "Purple Cap";
    row.appendChild(th);
    th = document.createElement("th");
    th.innerText = "Orange Cap";
    row.appendChild(th);
    
    th = document.createElement("th");
    th.innerText = "Points";
    row.appendChild(th);
    header.appendChild(row);
  }
  window.showExpertTab = showExpertTab;
  window.showAllPredictionsTab = showAllPredictionsTab;
  window.showCommentForm = showCommentForm;
window.submitUserComment = submitUserComment;
window.displayComments = displayComments;
  window.showPredictionForm = showPredictionForm;
  window.showMainView = showMainView;
  window.submitUserPrediction = submitUserPrediction;
  window.displayFinalsPredictions = displayFinalsPredictions;
  window.displayPredictions = displayPredictions;
})();

function displayUpcomingGamePredictions() {
  console.log("✅ displayUpcomingGamePredictions triggered");

  Promise.all([
    fetch("/leaderboard").then(r => r.json()),
    fetch("/get_predictions").then(r => r.json()),
    fetch("/actual_results").then(r => r.json())
  ])
    .then(([leaderboard, predictions, actualData]) => {
      // Build a rank map from the leaderboard (lower index means higher rank)
      const rankMap = {};
      leaderboard.forEach((entry, index) => {
        rankMap[entry.name] = index;
      });

      // Sort predictions based on the rank in leaderboard
      predictions.sort((a, b) => {
        const rankA = rankMap[a.name] !== undefined ? rankMap[a.name] : Infinity;
        const rankB = rankMap[b.name] !== undefined ? rankMap[b.name] : Infinity;
        return rankA - rankB;
      });

      // Determine the upcoming game index using actual results
      const actualResults = actualData.actualResults || [];
      const upcomingGameIndex = actualResults.length;
      const container = document.getElementById("upcomingPredictionTableContainer");

      if (upcomingGameIndex >= gamesList.length) {
        container.innerHTML = "<p>No upcoming games left.</p>";
        return;
      }

      const gameName = gamesList[upcomingGameIndex];
      let html = `
        <div class="scrollable-table-wrapper">
          <table id="upcomingGameTable">
            <thead>
              <tr>
                <th class="sticky-left-col">Game ${upcomingGameIndex + 1}: ${gameName}</th>
      `;

      // Build table header with predictor names and emojis for top 3
      predictions.forEach((pred, idx) => {
        let icon = "";
        if (idx === 0) icon = "🏆 ";
        else if (idx === 1) icon = "🥈 ";
        else if (idx === 2) icon = "🥉 ";

        html += `<th>${icon}${pred.name || "User"}</th>`;
      });

      html += `
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="sticky-left-col">Prediction</td>
      `;

      // Build the row for each user's upcoming game prediction in sorted order
      predictions.forEach(pred => {
        const preds = Array.isArray(pred.predictions)
          ? pred.predictions
          : JSON.parse(pred.predictions || "[]");
        const prediction = (preds[upcomingGameIndex] || "-").toUpperCase();
        const bgColor = teamColors[prediction] || "#ddd";
        html += `<td style="background-color:${bgColor}; color:#000; font-weight:bold;">${prediction}</td>`;
      });

      html += `
              </tr>
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    })
    .catch(err => {
      console.error("Error loading upcoming game predictions", err);
    });
}





// Ensure upcoming predictions display on load
window.addEventListener('load', function() {
  if (document.getElementById("upcomingPredictionTableContainer")) {
    displayUpcomingGamePredictions();
  }
});






