(function(){

  let skipAutoScroll = false;  // ✅ GLOBAL FLAG to control scroll from Buddy Compare
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
    selectedNamesToCompare = []; // 🧼 Clear any selected buddies
    displayLeaderboard();

      // ✅ Scroll to the newly positioned Expert Rankings section
  const scoreboardSection = document.getElementById("scoreboardContainer");
  if (scoreboardSection) {
    scoreboardSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
    
  }

  function showAllPredictionsTab() {
    console.log("📢 showAllPredictionsTab() triggered");
    console.log("🔍 pendingCompareNames:", pendingCompareNames);
  
    // 🧹 Reset compare mode if triggered from main view
    if (!pendingCompareNames) {
      selectedNamesToCompare = [];
    }
  
    const compareChips = document.getElementById("nameChipsContainer");
    if (compareChips) compareChips.innerHTML = "";
  
    const compareBtn = document.getElementById("compareButton");
    if (compareBtn) compareBtn.disabled = true;
  
    const resetBtn = document.getElementById("resetCompareBtn");
    if (resetBtn) resetBtn.style.display = "none";
  
    document.getElementById("scoreboardContainer").style.display = "none";
    document.getElementById("allPredictionsContainer").style.display = "block";
    document.getElementById("tab-all").classList.add("active");
    document.getElementById("tab-expert").classList.remove("active");
  
    // ✅ Always call displayPredictions with callback
    
    setTimeout(() => {
      if (pendingCompareNames && pendingCompareNames.length >= 2) {
        const namesToCompare = [...pendingCompareNames]; // copy before nulling
        pendingCompareNames = null;
    
        console.log("✅ Showing filtered compare table for:", namesToCompare);
        showComparedPredictions(window.allPredictionsRaw, namesToCompare);
      } else {
        displayPredictions();
      }
    }, 100);
    
    
    // ✅ Only scroll if not triggered by Buddy Compare
    if (!skipAutoScroll) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          const scrollTarget = document.querySelector("#predictionWrapper");
          if (scrollTarget) {
            scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
            console.log("✅ Scroll triggered to predictionWrapper");
          } else {
            console.warn("⚠️ predictionWrapper not found for scrolling");
          }
        });
      }, 500);
    }
  
    // ✅ Reset flag after it's used
    skipAutoScroll = false;
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
  
  let selectedNamesToCompare = [];
  let pendingCompareNames = null;

function displayLeaderboard() {
  const tableBody = document.getElementById("leaderboardTable").getElementsByTagName("tbody")[0];
  const streakContainer = document.getElementById("streakStats");
  tableBody.innerHTML = "";
  if (streakContainer) streakContainer.innerHTML = "";

  Promise.all([
    fetch("/get_predictions").then(r => r.json()),
    fetch("/actual_results").then(r => r.json())
  ])
    .then(([predictions, actualData]) => {
      const gamesCompleted = (actualData?.actualResults || []).filter(r => r && r.trim() !== "").length;

      let topHitStreak = { name: "", streak: 0 };
      let topMissStreak = { name: "", streak: 0 };

      predictions.forEach(pred => {
        let maxHit = 0, maxMiss = 0, curHit = 0, curMiss = 0;
        const actual = actualData?.actualResults || [];
        const userPreds = Array.isArray(pred.predictions) ? pred.predictions : JSON.parse(pred.predictions || "[]");

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

        if (maxHit > topHitStreak.streak) topHitStreak = { name: pred.name, streak: maxHit };
        if (maxMiss > topMissStreak.streak) topMissStreak = { name: pred.name, streak: maxMiss };
      });

      if (streakContainer) {
        setTimeout(() => {
          streakContainer.innerHTML = `
            <div class="streak-box hit-glow">
              <span class="emoji">🔥</span>Longest Hit Streak: <strong>${topHitStreak.name}</strong> (${topHitStreak.streak} in a row)
            </div>
            <div class="streak-box miss-glow">
              <span class="emoji">💀</span>Longest Miss Streak: <strong>${topMissStreak.name}</strong> (${topMissStreak.streak} in a row)
            </div>`;
        }, 3000);
      }

      fetch("/leaderboard")
        .then(r => r.json())
        .then(leaderboard => {
          const podiumContainer = document.getElementById("podiumContainer");
          podiumContainer.innerHTML = "";

          if (leaderboard.length >= 1) {
            const podiumWrapper = document.createElement("div");
            podiumWrapper.className = "podium";
            let currentRank = 1;
            let prevPoints = null;
            let rankCounter = 0;

            for (let i = 0; i < leaderboard.length && currentRank <= 3; i++) {
              const entry = leaderboard[i];
              if (entry.total_points !== prevPoints) {
                rankCounter++;
                currentRank = rankCounter;
              }

              let rankClass = "", medal = "";
              if (currentRank === 1) { rankClass = "gold"; medal = "🥇"; }
              else if (currentRank === 2) { rankClass = "silver"; medal = "🥈"; }
              else if (currentRank === 3) { rankClass = "bronze"; medal = "🥉"; }
              else break;

              const card = document.createElement("div");
              card.className = `podium-item ${rankClass}`;
              card.innerHTML = `
                <div class="emoji">${medal}</div>
                <div class="name">${entry.name}</div>
                <div class="points">${entry.total_points} pts</div>
              `;
              podiumWrapper.appendChild(card);
              prevPoints = entry.total_points;
            }

            podiumContainer.appendChild(podiumWrapper);
          }

          if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>No leaderboard data available</td></tr>";
            return;
          }

          let currentRank = 1, prevPoints = null;
          leaderboard.forEach((entry, idx) => {
            const row = document.createElement("tr");
            if (entry.total_points !== prevPoints) currentRank = currentRank;
            const rankNumber = currentRank;
            prevPoints = entry.total_points;
            if (idx + 1 < leaderboard.length) {
              const nextPoints = leaderboard[idx + 1].total_points;
              if (nextPoints !== prevPoints) currentRank++;
            }

            const nameCell = document.createElement("td");
            const displayName = entry.name || "User";
            let icon = "";
            if (rankNumber === 1) { icon = "🏆 "; nameCell.classList.add("top-predictor"); row.classList.add("top-rank-gold"); }
            else if (rankNumber === 2) { icon = "🥈 "; nameCell.classList.add("second-predictor"); row.classList.add("top-rank-silver"); }
            else if (rankNumber === 3) { icon = "🥉 "; nameCell.classList.add("third-predictor"); row.classList.add("top-rank-bronze"); }
            else row.classList.add("leaderboard-row");

            const wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.alignItems = "center";
wrapper.style.gap = "8px";

// Name content
const nameSpan = document.createElement("span");
nameSpan.innerHTML = `${rankNumber}. ${icon}${displayName}`;

// Compare Button
const compareBtn = document.createElement("button");
compareBtn.innerHTML = "👥";
compareBtn.title = "Buddy Compare";
compareBtn.className = "buddy-circle-btn";

compareBtn.addEventListener("click", () => {
  const name = displayName;
  const alreadySelected = selectedNamesToCompare.includes(name);

  if (!alreadySelected) {
    if (selectedNamesToCompare.length >= 8) {
      alert("You can only compare up to 8 users.");
      return;
    }

    selectedNamesToCompare.push(name);
    compareBtn.classList.add("selected-buddy");
  } else {
    selectedNamesToCompare = selectedNamesToCompare.filter(n => n !== name);
    compareBtn.classList.remove("selected-buddy");
  }

  // ✅ Show or hide floating compare button based on selection count
  const floatingBtn = document.getElementById("floatingCompareBtn");
  if (floatingBtn) {
    floatingBtn.style.display = selectedNamesToCompare.length >= 2 ? "block" : "none";
  }
});



// Add both to wrapper
wrapper.appendChild(nameSpan);
wrapper.appendChild(compareBtn);

// Append wrapper to nameCell
nameCell.appendChild(wrapper);



          

            
          

            
            nameCell.style.color = "#000";
            row.appendChild(nameCell);

            const pointsCell = document.createElement("td");
            pointsCell.textContent = entry.total_points ?? 0;
            pointsCell.style.backgroundColor = "#008000";
            pointsCell.style.color = "#fff";
            row.appendChild(pointsCell);

            const hitsCell = document.createElement("td");
            hitsCell.style.backgroundColor = "#008000";
            hitsCell.style.color = "#fff";

            const hitContainer = document.createElement("div");
            hitContainer.style.display = "flex";
            hitContainer.style.alignItems = "center";
            hitContainer.style.justifyContent = "center";
            hitContainer.style.gap = "6px";

            const hitText = document.createElement("span");
            hitText.textContent = entry.total_hits ?? 0;

            const accuracy = gamesCompleted > 0 ? (entry.total_hits / gamesCompleted) * 100 : 0;
            const badge = document.createElement("span");
            badge.className = "accuracy-badge";
            badge.title = `Accuracy: ${Math.round(accuracy)}%`;
            const tooltip = document.createElement("span");
            tooltip.className = "accuracy-tooltip";
            tooltip.textContent = `Accuracy: ${Math.round(accuracy)}%`;
            tooltip.style.display = "none";
            badge.appendChild(tooltip);

            badge.addEventListener("click", (e) => {
              e.stopPropagation();
              tooltip.style.display = tooltip.style.display === "none" ? "block" : "none";
            });

            if (accuracy > 70) badge.classList.add("green-badge");
            else if (accuracy >= 50) badge.classList.add("yellow-badge");
            else badge.classList.add("red-badge");

            hitContainer.appendChild(hitText);
            hitContainer.appendChild(badge);
            hitsCell.appendChild(hitContainer);
            row.appendChild(hitsCell);

            const missesCell = document.createElement("td");
            missesCell.textContent = entry.total_misses ?? 0;
            missesCell.style.backgroundColor = "#B22222";
            missesCell.style.color = "#fff";
            row.appendChild(missesCell);

            const gamesCompletedCell = document.createElement("td");
            gamesCompletedCell.textContent = gamesCompleted;
            gamesCompletedCell.style.backgroundColor = "#2f2f2f";
            gamesCompletedCell.style.color = "#fff";
            row.appendChild(gamesCompletedCell);

            tableBody.appendChild(row);
          });
        });
    })
    .catch(err => {
      console.error("Error in leaderboard:", err);
      tableBody.innerHTML = "<tr><td colspan='5'>Error loading leaderboard</td></tr>";
    });

    
    
}

const floatingBtn = document.getElementById("floatingCompareBtn");
if (floatingBtn) {
  floatingBtn.addEventListener("click", () => {
    if (!Array.isArray(selectedNamesToCompare) || selectedNamesToCompare.length < 2) {
      console.warn("❌ Floating compare skipped: not enough users selected");
      return;
    }

    console.log("🔥 Compare Now clicked:", selectedNamesToCompare);
    skipAutoScroll = true;
    pendingCompareNames = [...selectedNamesToCompare];
    showAllPredictionsTab();
    floatingBtn.style.display = "none";
  });
}

  
  // ----- Detailed Predictions Display -----
  function generateDetailedPredictionTableHeader() {
    const header = document.getElementById("predictionTableHeader");
    header.innerHTML = "";
    const row = document.createElement("tr");
  
    const nameHeader = document.createElement("th");
    nameHeader.innerText = "Name";
    row.appendChild(nameHeader);
  
    // Get games completed count from global or fallback to 0
    const gamesCompleted = window.actualResults?.length || 0;
  
    gamesList.forEach((game, index) => {
      const th = document.createElement("th");
      th.innerText = game;
  
      if (index < gamesCompleted) {
        th.classList.add("completed-game");
      } else if (index === gamesCompleted) {
        th.classList.add("ongoing-game");
      }
  
      row.appendChild(th);
    });
  
    for (let i = 1; i <= 4; i++) {
      const th = document.createElement("th");
      th.innerText = `Rank ${i}`;
      row.appendChild(th);
    }
  
    for (let i = 1; i <= 2; i++) {
      const th = document.createElement("th");
      th.innerText = `Final ${i}`;
      row.appendChild(th);
    }
  
    const winnerTh = document.createElement("th");
    winnerTh.innerText = "Winner";
    row.appendChild(winnerTh);
  
    const purpleTh = document.createElement("th");
    purpleTh.innerText = "Purple Cap";
    row.appendChild(purpleTh);
  
    const orangeTh = document.createElement("th");
    orangeTh.innerText = "Orange Cap";
    row.appendChild(orangeTh);
  
    const pointsTh = document.createElement("th");
    pointsTh.innerText = "Points";
    row.appendChild(pointsTh);
  
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

  function createScrollableTooltip(ctx, chartLabel, combinedStats, color, labelColors) {
    if (ctx.canvas.chartInstance) ctx.canvas.chartInstance.destroy();
    const isMobile = window.innerWidth < 600;
  
    ctx.canvas.style.backgroundColor = "#1a1a1a";
  
    ctx.canvas.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: combinedStats.map(stat => `${stat.player} (${stat.statValue})`),
        datasets: [{
          label: chartLabel,
          data: combinedStats.map(stat => stat.predictionsCount),
          backgroundColor: color,
          borderColor: '#000',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          y: {
            ticks: {
              color: (ctx) => labelColors[ctx.index],
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
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: function(context) {
              let tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<table></table>';
                document.body.appendChild(tooltipEl);
              }
  
              const tooltipModel = context.tooltip;
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }
  
              const stat = combinedStats[tooltipModel.dataPoints[0].dataIndex];
              const userList = stat.users.length > 0 ? stat.users.join(", ") : "No users";
  
              const maxHeight = window.innerHeight / 3;
              tooltipEl.innerHTML = `
                <div style="font-size:12px; font-weight:bold;">${chartLabel}: ${stat.predictionsCount}</div>
                <div style="max-height:${maxHeight}px; overflow-y:auto; font-size:11px; color:#fff;">
                  ${userList}
                </div>
              `;
  
              const position = context.chart.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = 1;
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.background = 'rgba(0, 0, 0, 0.8)';
              tooltipEl.style.padding = '8px';
              tooltipEl.style.borderRadius = '4px';
              tooltipEl.style.pointerEvents = 'none';
              tooltipEl.style.zIndex = '1000';
              tooltipEl.style.maxWidth = '200px';
              tooltipEl.style.color = '#fff';
            }
          }
        }
      }
    });
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
            <div class="chart-header violet-header">Orange Cap Predictions</div>
            <canvas id="orangeCapChart"></canvas>
          </div>
  
          <div class="chart-container">
            <div class="chart-header violet-header">Purple Cap Predictions</div>
            <canvas id="purpleCapChart"></canvas>
          </div>
  
          <div class="chart-container">
            <div class="chart-header violet-header">Winner Predictions</div>
            <canvas id="winnerChart"></canvas>
          </div>
        `;
  
        createBarChart(
          document.getElementById("winnerChart").getContext("2d"),
          "Winner Predictions",
          winnerCounts,
          true
        );
  
        const actualPurpleCapStats = actualData.actualPurpleCapStats || {};
        const actualOrangeCapStats = actualData.actualOrangeCapStats || {};
  
        // ---------- Purple Cap ----------
        const combinedPurpleStats = Object.keys(purpleCapCounts).map(player => ({
          player,
          predictionsCount: purpleCapCounts[player],
          statValue: parseInt(actualPurpleCapStats[player]) || 0,
          users: capUsers.purple_cap_users[player] || []
        }));
        combinedPurpleStats.sort((a, b) => b.statValue - a.statValue);
        const purpleLabelColors = combinedPurpleStats.map((_, index) => ['#FFD700', '#C0C0C0', '#CD7F32'][index] || '#FFFFFF');
        createScrollableTooltip(
          document.getElementById("purpleCapChart").getContext("2d"),
          "Purple Cap Predictions",
          combinedPurpleStats,
          "#90EE90",
          purpleLabelColors
        );
  
        // Check actual Purple Cap leader
        const purpleLeader = Object.entries(actualPurpleCapStats).sort((a, b) => b[1] - a[1])[0];
        const purpleLeaderName = purpleLeader?.[0] || null;
        const purpleLeaderWkts = purpleLeader?.[1] || null;
        const purpleWasPredicted = combinedPurpleStats.some(stat => stat.player.toUpperCase() === purpleLeaderName?.toUpperCase());
  
        if (purpleLeaderName && !purpleWasPredicted) {
          const chartContainer = document.getElementById("purpleCapChart").parentNode;
          const noteDiv = document.createElement("div");
          noteDiv.className = "actual-cap-highlight";
          noteDiv.innerHTML = `🏏 Actual Purple Cap Leader: <strong>${purpleLeaderName}</strong> (${purpleLeaderWkts} wkts) – not predicted by anyone!`;
          chartContainer.insertBefore(noteDiv, chartContainer.querySelector("canvas"));

        }
  
        // ---------- Orange Cap ----------
        const combinedOrangeStats = Object.keys(orangeCapCounts).map(player => ({
          player,
          predictionsCount: orangeCapCounts[player],
          statValue: parseInt(actualOrangeCapStats[player]) || 0,
          users: capUsers.orange_cap_users[player] || []
        }));
        combinedOrangeStats.sort((a, b) => b.statValue - a.statValue);
        const orangeLabelColors = combinedOrangeStats.map((_, index) => ['#FFD700', '#C0C0C0', '#CD7F32'][index] || '#FFFFFF');
        createScrollableTooltip(
          document.getElementById("orangeCapChart").getContext("2d"),
          "Orange Cap Predictions",
          combinedOrangeStats,
          "#FFA500",
          orangeLabelColors
        );
  
        // Check actual Orange Cap leader
        const orangeLeader = Object.entries(actualOrangeCapStats).sort((a, b) => b[1] - a[1])[0];
        const orangeLeaderName = orangeLeader?.[0] || null;
        const orangeLeaderRuns = orangeLeader?.[1] || null;
        const orangeWasPredicted = combinedOrangeStats.some(stat => stat.player.toUpperCase() === orangeLeaderName?.toUpperCase());
  
        if (orangeLeaderName && !orangeWasPredicted) {
          const chartContainer = document.getElementById("orangeCapChart").parentNode;
          const noteDiv = document.createElement("div");
          noteDiv.className = "actual-cap-highlight";
          noteDiv.innerHTML = `🏏 Actual Orange Cap Leader: <strong>${orangeLeaderName}</strong> (${orangeLeaderRuns} runs) – not predicted by anyone!`;
          chartContainer.insertBefore(noteDiv, chartContainer.querySelector("canvas"));

        }
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
  
  function displayPredictions(callback) {

    console.log("📥 displayPredictions() called");


    const tableBody = document.getElementById("predictionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
  
    fetch("/actual_results")
      .then(response => response.json())
      .then(actualData => {
        window.actualResults = actualData?.actualResults || [];
        


        const gamesCompleted = window.actualResults.length;
  
        

        
  
        const headerRow = document.querySelector("#predictionTable thead tr");
        if (headerRow) {
          const headerCells = headerRow.querySelectorAll("th");
          headerCells.forEach((th, index) => {
            if (index === 0) return;
  
            if (index - 1 < gamesCompleted) {
              th.classList.add("completed-game");
            } else if (index - 1 === gamesCompleted) {
              th.classList.add("ongoing-game");
              const gameName = th.textContent;
              th.innerHTML = `
                <span class="game-title">${gameName}</span><br>
                <span class="live-label">LIVE</span>
              `;
            }
          });
        }
  
        if (actualData?.actualResults?.length === gamesList.length) {
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
  
          if (actualData.actualSemifinalists?.length === 4) {
            actualData.actualSemifinalists.forEach(team => {
              cell = row.insertCell(-1);
              cell.innerText = team;
              cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
              cell.style.fontWeight = "bold";
            });
          } else {
            for (let i = 0; i < 4; i++) row.insertCell(-1).innerText = "";
          }
  
          if (actualData.actualFinalists?.length === 2) {
            actualData.actualFinalists.forEach(team => {
              cell = row.insertCell(-1);
              cell.innerText = team;
              cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
              cell.style.fontWeight = "bold";
            });
          } else {
            for (let i = 0; i < 2; i++) row.insertCell(-1).innerText = "";
          }
  
          const winnerCell = row.insertCell(-1);
          winnerCell.innerText = actualData.actualWinner || "";
          winnerCell.style.backgroundColor = teamColors[actualData.actualWinner] || "#2f2f2f";
          winnerCell.style.fontWeight = "bold";
  
          row.insertCell(-1).innerText = "";
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
      
          window.allPredictionsRaw = predictions;

          if (window._delayedCompareNames) {
            pendingCompareNames = [...window._delayedCompareNames];
            console.log("🎯 Transferred delayed names to pendingCompareNames:", pendingCompareNames);
            window._delayedCompareNames = null; // clear it
          }
          
      
          generateDetailedPredictionTableHeader(predictions); // ✅ always generate header
          setTimeout(() => {
            console.log("⏳ Setting up compare chips after delay...");
            setupCompareChips(predictions);
            if (pendingCompareNames && pendingCompareNames.length >= 2) {
              console.log("✅ Showing filtered compare table for (after chip setup):", pendingCompareNames);
              showComparedPredictions(predictions, pendingCompareNames);
              pendingCompareNames = null;
            }
          
          }, 300);
                             // ✅ always setup chips
      
          
          // continue rendering all predictions (as fallback/default)
        
      
        
            

  
            if (!Array.isArray(predictions) || predictions.length === 0) {
              tableBody.innerHTML += `<tr><td colspan="${1 + gamesList.length + 4 + 2 + 1 + 2 + 1}">No predictions available</td></tr>`;
            } else {
              predictions.forEach(prediction => {
                const row = tableBody.insertRow(-1);
                const nameCell = row.insertCell();
                nameCell.innerText = prediction.name || "User";
                nameCell.style.backgroundColor = nameCellBgColor;
                nameCell.classList.add("sticky-left-col");

                nameCell.style.color = nameCellTextColor;
                nameCell.style.fontWeight = "bold";
                nameCell.style.whiteSpace = "nowrap";
  
                if (!prediction.predictions || prediction.predictions.length !== gamesList.length) {
                  for (let i = 0; i < gamesList.length; i++) {
                    row.insertCell(-1).innerText = "";
                  }
                } else {
                  prediction.predictions.forEach((pred, index) => {
                    const cell = row.insertCell(-1);
                    cell.innerText = pred;
  
                    if (index < gamesCompleted) {
                      cell.classList.add("completed-game");
                    } else if (index === gamesCompleted) {
                      cell.classList.add("ongoing-game");
                    }
                  });
                }
  
                if (!prediction.semifinalists) {
                  for (let i = 0; i < 4; i++) row.insertCell(-1).innerText = "";
                } else {
                  const semis = typeof prediction.semifinalists === "string"
                    ? JSON.parse(prediction.semifinalists)
                    : prediction.semifinalists;
                  semis.forEach(s => row.insertCell(-1).innerText = s);
                }
  
                if (!prediction.finalists) {
                  for (let i = 0; i < 2; i++) row.insertCell(-1).innerText = "";
                } else {
                  const finals = typeof prediction.finalists === "string"
                    ? JSON.parse(prediction.finalists)
                    : prediction.finalists;
                  finals.forEach(f => row.insertCell(-1).innerText = f);
                }
  
                row.insertCell(-1).innerText = prediction.winner;
  
                const purpleCell = row.insertCell(-1);
                purpleCell.innerText = prediction.purple_cap || "";
                purpleCell.style.fontWeight = "bold";
                purpleCell.style.backgroundColor = "#90EE90";
                purpleCell.style.color = "#000";
  
                const orangeCell = row.insertCell(-1);
                orangeCell.innerText = prediction.orange_cap || "";
                orangeCell.style.fontWeight = "bold";
                orangeCell.style.backgroundColor = "#FFA500";
                orangeCell.style.color = "#000";
  
                const pointsCell = row.insertCell(-1);
                pointsCell.innerText = prediction.points;
                pointsCell.style.backgroundColor = prediction.points > 0 ? "#008000" : "#2f2f2f";
                pointsCell.style.color = "#fff";
              });
  
              colorizeTable();
  
              // ✅ Setup compare chips for selection
              // ⏳ Wait for chips container to exist before setting up chips
const waitForChips = setInterval(() => {
  const chipContainer = document.getElementById("nameChipsContainer");
  const compareBtn = document.getElementById("compareButton");
  if (chipContainer && compareBtn) {
    clearInterval(waitForChips);
    // ✅ Wait until compareSelector becomes visible before initializing chips

    console.log("🧪 Checking if compare chips can be setup...");

    const chipContainer = document.getElementById("nameChipsContainer");
    const compareBtn = document.getElementById("compareButton");
    if (chipContainer && compareBtn && chipContainer.offsetParent !== null) {
      console.log("✅ Setting up compare chips immediately");
      setupCompareChips(predictions);
    
      if (pendingCompareNames && pendingCompareNames.length >= 2) {
        console.log("✅ Showing filtered compare table for:", pendingCompareNames);
        showComparedPredictions(predictions, pendingCompareNames);
        pendingCompareNames = null;
        return; // ✅ Prevent fallback to full table
      }
    }
    
     else {
      console.log("⏳ Delayed setup via observer (compareSelector not visible yet");
      const observer = new MutationObserver(() => {
        const chipContainer = document.getElementById("nameChipsContainer");
        const compareBtn = document.getElementById("compareButton");
        if (chipContainer && compareBtn && chipContainer.offsetParent !== null) {
          console.log("✅ Setting up compare chips after observer trigger");
          setupCompareChips(predictions);
          observer.disconnect();
        }
      });
    
      const compareSelector = document.getElementById("compareSelector");
      if (compareSelector) {
        console.log("📡 Observing compareSelector for changes...");
        observer.observe(compareSelector, {
          childList: true,
          subtree: true
        });
      }
      else {
        console.warn("❌ compareSelector not found!");
      }
    }
    
const compareSelector = document.getElementById("compareSelector");
if (compareSelector) {
  observer.observe(compareSelector, {
    childList: true,
    subtree: true
  });
}

  }
}, 100); // check every 100ms (safe and snappy)

              if (typeof callback === "function") {
                callback();
              }
              
  
              // ✅ Auto-scroll to ongoing game column
             // ✅ Auto-scroll to ongoing game column (fix)
             if (!skipAutoScroll) {
             setTimeout(() => {
  const scrollWrapper = document.getElementById('predictionWrapper');
  const ongoingHeader = document.querySelector("#predictionTable thead th.ongoing-game");

  console.log("🧪 .table-scroll found:", !!scrollWrapper);
  console.log("🧪 .ongoing-game header found:", !!ongoingHeader);

  if (scrollWrapper && ongoingHeader) {
    const offset = ongoingHeader.offsetLeft;

    // Apply scroll
    scrollWrapper.scrollLeft = offset - 60; // Fine-tune offset if needed
    console.log("✅ Scrolled to:", ongoingHeader.textContent);
  } else {
    console.warn("⚠️ Could not scroll — missing wrapper or ongoing column");
  }
}, 500);
} // You had 800ms; reduce for faster response
skipAutoScroll = false;  // ✅ reset regardless
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

 

  window.showComparedPredictions = function(allPredictions, selectedNames) {
    if (!Array.isArray(selectedNames)) {
      console.warn("Invalid input to showComparedPredictions");
      return;
    }
    
  

  const tableBody = document.querySelector("#predictionTable tbody");
  tableBody.innerHTML = "";

  const headerRow = document.querySelector("#predictionTable thead tr");
  const allColumns = headerRow ? headerRow.children.length : 20;

  const selected = allPredictions.filter(p => selectedNames.includes(p.name));
  selected.forEach(pred => {
    const row = tableBody.insertRow();
    const nameCell = row.insertCell();
    nameCell.innerText = pred.name || "User";
    nameCell.style.backgroundColor = "#e0d4f5";
    nameCell.style.color = "#000";
    nameCell.style.fontWeight = "bold";

    const games = Array.isArray(pred.predictions)
      ? pred.predictions
      : JSON.parse(pred.predictions || "[]");

    games.forEach((predTeam, idx) => {
      const cell = row.insertCell();
      cell.innerText = predTeam;
      cell.style.backgroundColor = teamColors[predTeam] || "#2f2f2f";
      cell.style.color = "#fff";
    });

    (["semifinalists", "finalists"]).forEach(key => {
      const values = typeof pred[key] === "string"
        ? JSON.parse(pred[key])
        : pred[key];
      if (Array.isArray(values)) {
        values.forEach(t => {
          const cell = row.insertCell();
          cell.innerText = t;
          cell.style.backgroundColor = teamColors[t] || "#2f2f2f";
          cell.style.color = "#fff";
        });
      } else {
        for (let i = 0; i < (key === "semifinalists" ? 4 : 2); i++) {
          row.insertCell().innerText = "";
        }
      }
    });

    const winnerCell = row.insertCell();
    winnerCell.innerText = pred.winner;
    winnerCell.style.backgroundColor = teamColors[pred.winner] || "#2f2f2f";
    winnerCell.style.color = "#fff";

    const purple = row.insertCell();
    purple.innerText = pred.purple_cap || "";
    purple.style.backgroundColor = "#90EE90";
    purple.style.color = "#000";

    const orange = row.insertCell();
    orange.innerText = pred.orange_cap || "";
    orange.style.backgroundColor = "#FFA500";
    orange.style.color = "#000";

    const points = row.insertCell();
    points.innerText = pred.points || 0;
    points.style.backgroundColor = "#008000";
    points.style.color = "#fff";
  });

  // Optional: scroll back to the table
  document.getElementById("predictionWrapper").scrollIntoView({ behavior: "smooth" });
  document.getElementById("resetCompareBtn").style.display = "inline-block";

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

      const actualSemifinalists = ["RCB", "MI", "PBKS", "GT"]; // ✅ Set this as the known 4 teams

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
          const team = (ranks[i] || "").toUpperCase();
          cell.innerText = team;
          cell.style.fontWeight = "bold";

          if (team) {
            cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
            cell.style.color = "#fff";

            // ✅ Apply green or red border depending on correctness
            if (actualSemifinalists.includes(team)) {
  cell.style.border = "4px solid #00FF00"; // Bright lime green
  cell.style.boxShadow = "0 0 6px 2px #00FF00"; // Add glow effect
} else {
  cell.style.border = "4px solid #FF4500"; // Bright red-orange
  cell.style.boxShadow = "0 0 6px 2px #FF4500"; // Add glow effect
}

            cell.style.borderRadius = "4px";
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
          const team = (finals[i] || "").toUpperCase();
          cell.innerText = team;
          cell.style.fontWeight = "bold";

          if (team) {
            cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
            cell.style.color = "#fff";
          }

          row.appendChild(cell);
        }

        // Winner
        const winnerCell = document.createElement("td");
        const winner = (prediction.winner || "").toUpperCase();
        winnerCell.innerText = winner;
        winnerCell.style.fontWeight = "bold";

        if (winner) {
          winnerCell.style.backgroundColor = teamColors[winner] || "#2f2f2f";
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

  
  function displayHeatmap() {
    const container = document.getElementById("heatmapContainer");
    container.style.display = "block"; // ensure visible
    container.innerHTML = "<p>Loading heatmap...</p>";
  
    Promise.all([
      fetch("/get_predictions").then(r => r.json()),
      fetch("/actual_results").then(r => r.json()),
      fetch("/leaderboard").then(r => r.json())
    ])
      .then(([predictions, actualData, leaderboard]) => {
        console.log("✅ Predictions fetched for heatmap:", predictions);
        console.log("✅ Actual results for heatmap:", actualData);
  
        const actualResults = actualData?.actualResults || [];
        const numGames = window.gamesList.length;
  
        // 🧠 Rank map
        const rankMap = {};
        leaderboard.forEach((entry, index) => {
          rankMap[entry.name] = index;
        });
  
        // 🔃 Sort by rank
        predictions.sort((a, b) => {
          const rankA = rankMap[a.name] ?? Infinity;
          const rankB = rankMap[b.name] ?? Infinity;
          return rankA - rankB;
        });
  
        // 🔥 Identify longest streaks
        let maxHitStreakInfo = { name: "", length: 0, startIndex: 0 };
        let maxMissStreakInfo = { name: "", length: 0, startIndex: 0 };
  
        predictions.forEach(pred => {
          const picks = Array.isArray(pred.predictions)
            ? pred.predictions
            : JSON.parse(pred.predictions || "[]");
  
          let curHit = 0, curMiss = 0;
          let maxHit = 0, maxMiss = 0;
          let hitStart = 0, missStart = 0;
          let tempHitStart = 0, tempMissStart = 0;
  
          for (let i = 0; i < actualResults.length; i++) {
            const actual = actualResults[i]?.toUpperCase();
            const predicted = picks[i]?.toUpperCase();
  
            if (actual === predicted) {
              curHit++;
              if (curHit === 1) tempHitStart = i;
              if (curHit > maxHit) {
                maxHit = curHit;
                hitStart = tempHitStart;
              }
              curMiss = 0;
            } else {
              curMiss++;
              if (curMiss === 1) tempMissStart = i;
              if (curMiss > maxMiss) {
                maxMiss = curMiss;
                missStart = tempMissStart;
              }
              curHit = 0;
            }
          }
  
          if (maxHit > maxHitStreakInfo.length) {
            maxHitStreakInfo = { name: pred.name, length: maxHit, startIndex: hitStart };
          }
          if (maxMiss > maxMissStreakInfo.length) {
            maxMissStreakInfo = { name: pred.name, length: maxMiss, startIndex: missStart };
          }
        });
  
        // 🧱 Build table
        let html = `
          <h2 class="violet-heading">Prediction Accuracy Heatmap</h2>
          <div class="table-scroll heatmap-scroll">
            <table id="heatmapTable">
              <thead><tr><th>Name</th>
        `;
  
        for (let i = 0; i < numGames; i++) {
          html += `<th>${i + 1}</th>`;
        }
  
        html += `</tr></thead><tbody>`;
  
        predictions.forEach(pred => {
          const name = pred.name || "User";
          const picks = Array.isArray(pred.predictions)
            ? pred.predictions
            : JSON.parse(pred.predictions || "[]");
  
          html += `<tr><td class="heatmap-name">${name}</td>`;
  
          for (let i = 0; i < numGames; i++) {
            const actual = actualResults[i]?.toUpperCase();
            const predicted = picks[i]?.toUpperCase();
  
            let cellClass = "heatmap-pending";
            if (actual) {
              if (actual === predicted) cellClass = "heatmap-correct";
              else cellClass = "heatmap-wrong";
            }
  
            let extraClass = "";
            if (
              name === maxHitStreakInfo.name &&
              i >= maxHitStreakInfo.startIndex &&
              i < maxHitStreakInfo.startIndex + maxHitStreakInfo.length
            ) {
              extraClass = "highlight-hit-streak";
            }
  
            if (
              name === maxMissStreakInfo.name &&
              i >= maxMissStreakInfo.startIndex &&
              i < maxMissStreakInfo.startIndex + maxMissStreakInfo.length
            ) {
              extraClass = "highlight-miss-streak";
            }
  
            html += `<td class="${cellClass} ${extraClass}"></td>`;
          }
  
          html += `</tr>`;
        });
  
        html += `</tbody></table></div>`;
        container.innerHTML = html;
  
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(err => {
        console.error("Error loading heatmap:", err);
        container.innerHTML = "<p>Error loading heatmap.</p>";
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
    const heatmapBtn = document.getElementById("heatmapBtn");
if (heatmapBtn) {
  console.log("🔥 Heatmap Button Found!");
  heatmapBtn.addEventListener("click", () => {
    console.log("🔥 Heatmap button clicked!");
    displayHeatmap();  // 👈 this must be globally exposed with `window.displayHeatmap = ...`
    const heatmapSection = document.getElementById("heatmapContainer");
    if (heatmapSection) {
      console.log("🧭 Scrolling to heatmap section...");
      heatmapSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.warn("⚠️ heatmapContainer not found in DOM");
    }
  });
} else {
  console.warn("❌ Heatmap Button NOT found!");
}


    const podiumBtn = document.getElementById("scrollToPodiumBtn");
    if (podiumBtn) {
      console.log("✅ Rank Podium Button Found!");
      podiumBtn.onclick = () => {
        const podiumSection = document.getElementById("podiumContainer");
        if (podiumSection) {
          podiumSection.scrollIntoView({ behavior: "smooth" });
        }
      };
    } else {
      console.warn("❌ Rank Podium button not found.");
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
    generateDetailedPredictionTableHeader(predictions);

  });
  
  function generateDetailedPredictionTableHeader(predictions) {
    const header = document.getElementById("predictionTableHeader");
    header.innerHTML = "";
    const row = document.createElement("tr");
  
    // Name Column
    const nameHeader = document.createElement("th");
    nameHeader.innerText = "Name";
    row.appendChild(nameHeader);
  
    const gamesCompleted = window.actualResults?.length || 0;
  
    // Count how many picked each team per game
    const gamePickCounts = {};
    predictions.forEach(pred => {
      const picks = Array.isArray(pred.predictions)
        ? pred.predictions
        : JSON.parse(pred.predictions || "[]");
      picks.forEach((team, i) => {
        team = team?.toUpperCase();
        if (!gamePickCounts[i]) gamePickCounts[i] = {};
        if (team) gamePickCounts[i][team] = (gamePickCounts[i][team] || 0) + 1;
      });
    });
  
    gamesList.forEach((game, index) => {
      const th = document.createElement("th");
      const [team1, , team2] = game.split(" ");
  
      const team1Count = gamePickCounts[index]?.[team1] || 0;
      const team2Count = gamePickCounts[index]?.[team2] || 0;
  
      // Set class if this is the ongoing game
      if (index < gamesCompleted) {
        th.classList.add("completed-game");
      } else if (index === gamesCompleted) {
        th.classList.add("ongoing-game");

        const liveLabel = document.createElement("div");
  liveLabel.className = "live-label";
  liveLabel.innerText = "LIVE";
  th.appendChild(liveLabel);
      }


  
      // Game title
      const gameTitle = document.createElement("div");
      gameTitle.className = "game-title";
      gameTitle.innerText = game;
  
      // Pick summary
      const pickSummary = document.createElement("div");
      pickSummary.className = "game-pick-summary";
      pickSummary.innerHTML = `
        <span class="pick-circle" style="background:${teamColors[team1] || '#bbb'}">${team1Count}</span>
        <span class="pick-circle" style="background:${teamColors[team2] || '#bbb'}">${team2Count}</span>
      `;
  
      th.appendChild(gameTitle);
      th.appendChild(pickSummary);
      row.appendChild(th);
    });
  
    // Ranks
    for (let i = 1; i <= 4; i++) {
      const th = document.createElement("th");
      th.innerText = `Rank ${i}`;
      row.appendChild(th);
    }
  
    // Finals
    for (let i = 1; i <= 2; i++) {
      const th = document.createElement("th");
      th.innerText = `Final ${i}`;
      row.appendChild(th);
    }
  
    // Winner + Cap + Points
    ["Winner", "Purple Cap", "Orange Cap", "Points"].forEach(title => {
      const th = document.createElement("th");
      th.innerText = title;
      row.appendChild(th);
    });
  
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
  window.displayHeatmap = displayHeatmap;
  window.showComparedPredictions = showComparedPredictions;
})();
// Match schedule with game number and start time (24-hour format, in local time or UTC)
const matchSchedule = [
  { game: 24, teams: "DC vs RCB", startTime: "2025-04-09T10:00:00" }
  // Add more games as needed
];





function displayUpcomingGamePredictions() {
  console.log("✅ displayUpcomingGamePredictions triggered");

  Promise.all([
    fetch("/leaderboard").then(r => r.json()),
    fetch("/get_predictions").then(r => r.json()),
    fetch("/actual_results").then(r => r.json())
  ])
    .then(([leaderboard, predictions, actualData]) => {
      const rankMap = {};
      leaderboard.forEach((entry, index) => {
        rankMap[entry.name] = index;
      });

      predictions.sort((a, b) => {
        const rankA = rankMap[a.name] !== undefined ? rankMap[a.name] : Infinity;
        const rankB = rankMap[b.name] !== undefined ? rankMap[b.name] : Infinity;
        return rankA - rankB;
      });

      const actualResults = actualData.actualResults || [];
      const upcomingGameIndex = actualResults.length;
      const container = document.getElementById("upcomingPredictionTableContainer");

      if (upcomingGameIndex >= gamesList.length) {
        container.innerHTML = "<p>No upcoming games left.</p>";
        return;
      }

      const gameName = gamesList[upcomingGameIndex];

      // Tally predictions for the current game
      const counts = {};
      predictions.forEach(pred => {
        const preds = Array.isArray(pred.predictions) ? pred.predictions : JSON.parse(pred.predictions || "[]");
        const prediction = (preds[upcomingGameIndex] || "-").toUpperCase();
        if (prediction && prediction !== "-") {
          counts[prediction] = (counts[prediction] || 0) + 1;
        }
      });

      const countSummary = Object.entries(counts).map(([team, count]) => `${count} ${team}`).join(" / ");

      // Add the summary to the title wrapper (to the right)
      const wrapper = document.querySelector(".prediction-title-wrapper");
      if (wrapper) {
        const existing = document.getElementById("upcomingGameSummary");
        if (existing) existing.remove();

        const summaryBox = document.createElement("span");
        summaryBox.id = "upcomingGameSummary";
        summaryBox.className = "summary-box";
        summaryBox.textContent = countSummary;
        wrapper.appendChild(summaryBox);
      }

      let html = `
        <div class="scrollable-table-wrapper">
          <table id="upcomingGameTable">
            <thead>
              <tr>
                <th class="sticky-left-col">Game ${upcomingGameIndex + 1}: ${gameName}</th>
      `;

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

      // Countdown timer
      const countdownEl = document.getElementById("matchCountdownBox");
      const upcomingSchedule = matchSchedule.find(m => m.game === upcomingGameIndex + 1);
      if (upcomingSchedule && countdownEl) {
        const matchTime = new Date(upcomingSchedule.startTime).getTime();

        function updateCountdown() {
          const now = new Date().getTime();
          const distance = matchTime - now;

          if (distance <= 0) {
            countdownEl.textContent = "🎯 Match started!";
            clearInterval(timer);
            return;
          }

          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          countdownEl.textContent = `⏳ ${hours}h ${minutes}m ${seconds}s`;
        }

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
      }
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
  const buddyBtn = document.getElementById("buddyCompareBtn");
if (buddyBtn) {
  buddyBtn.addEventListener("click", () => {
    skipAutoScroll = true; // ✅ Prevent predictionWrapper scroll
    console.log("👥 Buddy Compare clicked: skipAutoScroll set to TRUE");

    showAllPredictionsTab();

    const observer = new MutationObserver(() => {
      const compareBox = document.getElementById("compareSelector");
      if (compareBox && compareBox.offsetParent !== null) {
        compareBox.scrollIntoView({ behavior: "smooth", block: "start" });
        console.log("👥 Scrolled to Compare Selector");
        skipAutoScroll = false; // ✅ Reset after scroll
        if (typeof observer !== "undefined") {
          observer.disconnect();
        }
        
      }
    });

    observer.observe(document.getElementById("allPredictionsContainer"), {
      childList: true,
      subtree: true
    });
  });
}

 
}); // ✅ <-- this was missing




    
 
function setupCompareChips(predictions) {
  console.log("🔧 setupCompareChips called with", predictions.length, "entries");

  const container = document.getElementById("nameChipsContainer");
  const floatingCompareBtn = document.getElementById("floatingCompareBtn"); // leaderboard circle button
  const inlineCompareBtn = document.getElementById("compareNowBtn");        // "Compare Now" inside chip container
  const resetBtn = document.getElementById("resetCompareBtn");

  // 🚨 Validate DOM targets
  if (!container || !floatingCompareBtn || !inlineCompareBtn || !resetBtn) {
    console.warn("⚠️ Compare chips setup skipped: required elements not found.");
    return;
  }

  // 🧹 Reset container and compare list
  container.innerHTML = "";
  selectedNamesToCompare = [];

  predictions.forEach(pred => {
    const chip = document.createElement("div");
    chip.className = "name-chip";
    chip.innerText = pred.name || "User";

    chip.addEventListener("click", () => {
      const name = pred.name;
      const isSelected = selectedNamesToCompare.includes(name);

      if (isSelected) {
        selectedNamesToCompare = selectedNamesToCompare.filter(n => n !== name);
        chip.classList.remove("selected");
      } else {
        if (selectedNamesToCompare.length >= 8) {
          alert("You can only compare up to 8 users.");
          return;
        }
        selectedNamesToCompare.push(name);
        chip.classList.add("selected");
      }

      // 🔄 Update button states
      const has2OrMore = selectedNamesToCompare.length >= 2;
      const hasAny = selectedNamesToCompare.length > 0;

      inlineCompareBtn.style.display = has2OrMore ? "inline-block" : "none";
      resetBtn.style.display = hasAny ? "inline-block" : "none";
      floatingCompareBtn.style.display = has2OrMore ? "block" : "none";

      console.log("👥 Selected for comparison:", selectedNamesToCompare);
    });

    container.appendChild(chip);
  });

  // ✅ Floating "Compare" button (in leaderboard)
  floatingCompareBtn.onclick = () => {
    if (selectedNamesToCompare.length >= 2) {
      console.log("🔥 Floating Compare clicked with:", selectedNamesToCompare);
      pendingCompareNames = [...selectedNamesToCompare];
      skipAutoScroll = true;
      showAllPredictionsTab();
    } else {
      console.warn("Please select at least 2 users to compare.");
    }
  };

  // ✅ Inline "Compare Now" button (below chips)
  inlineCompareBtn.onclick = () => {
    if (selectedNamesToCompare.length >= 2) {
      console.log("🔥 Chip Compare clicked with:", selectedNamesToCompare);
      skipAutoScroll = true;
  
      // 🧠 DEFER the pendingCompareNames assignment until displayPredictions
      window._delayedCompareNames = [...selectedNamesToCompare]; // temp variable
      showAllPredictionsTab();
    } else {
      alert("Please select at least 2 users to compare.");
    }
  };
  

  // ✅ Reset button (clears chips and shows full table again)
  resetBtn.onclick = () => {
    selectedNamesToCompare = [];
    document.querySelectorAll(".name-chip").forEach(chip => chip.classList.remove("selected"));
    resetBtn.style.display = "none";
    floatingCompareBtn.style.display = "none";
    inlineCompareBtn.style.display = "none";
    displayPredictions(); // 🔄 Show full predictions table again
  };
}



document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    const rect = this.getBoundingClientRect();

    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    circle.classList.add('ripple');

    this.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600); // Match ripple animation duration
  });
});
