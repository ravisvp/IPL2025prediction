(function(){
  // gamesList without any (H) markers
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
  
  // Variables for storing user selections
  let selectedGamePredictions = new Array(gamesList.length).fill(null);
  let selectedSemifinalists = [];
  let selectedFinalists = [];
  let selectedWinner = "";
  
  function populateGamePredictions() {
    const container = document.getElementById("gamePredictionsContainer");
    container.innerHTML = "";
    gamesList.forEach((game, index) => {
      const gameContainer = document.createElement("div");
      gameContainer.className = "game-container";
      const label = document.createElement("span");
      label.className = "game-label";
      label.innerText = `Game ${index+1} (${game}):`;
      gameContainer.appendChild(label);
      const teams = game.split(" vs ");
      teams.forEach(team => {
        const trimmedTeam = team.trim();
        const box = document.createElement("div");
        box.className = "team-box";
        box.innerText = trimmedTeam;
        box.style.backgroundColor = teamColors[trimmedTeam] || "#2f2f2f";
        box.onclick = function(){
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
      displaySpan.innerText = selectedGamePredictions[index] || "";
      gameContainer.appendChild(displaySpan);
      container.appendChild(gameContainer);
    });
  }
  function updateGameSelectionDisplay(gameContainer, team) {
    const displaySpan = gameContainer.querySelector(".selected-team");
    if(displaySpan) { displaySpan.innerText = team; }
  }
  function populateMultiSelect(containerId, selectionArray, maxSelection) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    teamsList.forEach(team => {
      const box = document.createElement("div");
      box.className = "team-box";
      box.innerText = team;
      box.style.backgroundColor = teamColors[team] || "#2f2f2f";
      box.onclick = function(){
        const idx = selectionArray.indexOf(team);
        if(idx>=0){
          selectionArray.splice(idx,1);
          box.classList.remove("selected");
        } else {
          if(selectionArray.length < maxSelection){
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
      box.onclick = function(){
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
    selectedSemifinalists = [];
    selectedFinalists = [];
    selectedWinner = "";
    populateGamePredictions();
    populateMultiSelect("semifinalContainer", selectedSemifinalists, 4);
    populateMultiSelect("finalistContainer", selectedFinalists, 2);
    populateSingleSelect("winnerContainer");
  }
  function submitUserPrediction(){
    const name = document.getElementById("name").value;
    if(!name){ alert("Please enter your name or nickname."); return; }
    for(let i=0;i<selectedGamePredictions.length;i++){
      if(!selectedGamePredictions[i]){
        alert(`Please make a selection for game ${i+1}.`);
        return;
      }
    }
    if(selectedSemifinalists.length !== 4){ alert("Please select exactly 4 semifinalists."); return; }
    if(selectedFinalists.length !== 2){ alert("Please select exactly 2 finalists."); return; }
    if(!selectedWinner){ alert("Please select a winner."); return; }
    const data = {
      name: name,
      predictions: selectedGamePredictions,
      semifinalists: selectedSemifinalists,
      finalists: selectedFinalists,
      winner: selectedWinner
    };
    console.log("Submitting prediction:", data);
    fetch("/submit_prediction", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(data)
    }).then(response=>{
      if(!response.ok) throw new Error("Network response not ok");
      return response.json();
    }).then(result=>{
      alert(result.message);
      document.getElementById("userPredictionForm").style.display = "none";
      document.getElementById("acknowledgment").style.display = "block";
      displayFinalsPredictions();
    }).catch(error=>{
      console.error("Error submitting prediction:", error);
      alert("Error submitting prediction. Check console for details.");
    });
  }
  
  // ----------------------
  // Navigation and Display Functions
  // ----------------------
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
    showExpertTab();
    displayFinalsPredictions();
  }
  
  // ----------------------
  // Leaderboard Display Function
  // ----------------------
  function displayLeaderboard(){
    const tableBody = document.getElementById("leaderboardTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    fetch("/leaderboard")
    .then(response=>{
      if(!response.ok) throw new Error("Server response not ok");
      return response.json();
    }).then(leaderboard=>{
      if(!Array.isArray(leaderboard)||leaderboard.length===0){
        tableBody.innerHTML = "<tr><td colspan='4'>No leaderboard data available</td></tr>";
      } else {
        leaderboard.forEach((entry,index)=>{
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          nameCell.textContent = entry.name ? entry.name : "User";
          nameCell.style.backgroundColor = getRankColor(index);
          nameCell.style.color = "#000";
          nameCell.style.whiteSpace = "nowrap";
          row.appendChild(nameCell);
  
          const pointsCell = document.createElement("td");
          pointsCell.textContent = entry.total_points !== undefined ? entry.total_points : 0;
          pointsCell.style.backgroundColor = (!isNaN(entry.total_points)&&entry.total_points>0) ? "#008000" : "#2f2f2f";
          pointsCell.style.color = "#fff";
          row.appendChild(pointsCell);
  
          const hitsCell = document.createElement("td");
          hitsCell.textContent = entry.total_hits !== undefined ? entry.total_hits : 0;
          hitsCell.style.backgroundColor = (!isNaN(entry.total_hits)&&entry.total_hits>0) ? "#008000" : "#2f2f2f";
          hitsCell.style.color = "#fff";
          row.appendChild(hitsCell);
  
          const missesCell = document.createElement("td");
          missesCell.textContent = entry.total_misses !== undefined ? entry.total_misses : 0;
          missesCell.style.backgroundColor = (!isNaN(entry.total_misses)&&entry.total_misses>0) ? "#B22222" : "#2f2f2f";
          missesCell.style.color = "#fff";
          row.appendChild(missesCell);
  
          tableBody.appendChild(row);
        });
      }
    }).catch(error=>{
      console.error("Error fetching leaderboard:",error);
      tableBody.innerHTML = "<tr><td colspan='4'>Error loading leaderboard</td></tr>";
    });
  }
  
  // ----------------------
  // Detailed Predictions (View Predictions) Display
  // ----------------------
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
    for(let i=1;i<=4;i++){
      th = document.createElement("th");
      th.innerText = `Semi ${i}`;
      row.appendChild(th);
    }
    for(let i=1;i<=2;i++){
      th = document.createElement("th");
      th.innerText = `Final ${i}`;
      row.appendChild(th);
    }
    th = document.createElement("th");
    th.innerText = "Winner";
    row.appendChild(th);
    th = document.createElement("th");
    th.innerText = "Points";
    row.appendChild(th);
    header.appendChild(row);
  }
  
  function displayPredictions(){
    generateDetailedPredictionTableHeader();
    const tableBody = document.getElementById("predictionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    fetch("/actual_results")
    .then(response=>response.json())
    .then(actualData=>{
      if(actualData && actualData.actualResults && actualData.actualResults.length===gamesList.length){
        const row = tableBody.insertRow(0);
        let cell = row.insertCell(-1);
        cell.innerText = "Actual Results";
        cell.style.fontWeight = "bold";
        actualData.actualResults.forEach(result=>{
          cell = row.insertCell(-1);
          cell.innerText = result;
          cell.style.backgroundColor = teamColors[result] || "#2f2f2f";
          cell.style.fontWeight = "bold";
        });
        if(actualData.actualSemifinalists && actualData.actualSemifinalists.length===4){
          actualData.actualSemifinalists.forEach(team=>{
            cell = row.insertCell(-1);
            cell.innerText = team;
            cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
            cell.style.fontWeight = "bold";
          });
        } else {
          for(let i=0;i<4;i++) row.insertCell(-1).innerText = "";
        }
        if(actualData.actualFinalists && actualData.actualFinalists.length===2){
          actualData.actualFinalists.forEach(team=>{
            cell = row.insertCell(-1);
            cell.innerText = team;
            cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
            cell.style.fontWeight = "bold";
          });
        } else {
          for(let i=0;i<2;i++) row.insertCell(-1).innerText = "";
        }
        let winnerCell = row.insertCell(-1);
        winnerCell.innerText = actualData.actualWinner || "";
        winnerCell.style.backgroundColor = teamColors[actualData.actualWinner] || "#2f2f2f";
        winnerCell.style.fontWeight = "bold";
        row.insertCell(-1).innerText = "";
      }
      
      fetch("/get_predictions")
      .then(response=>{
        if(!response.ok) throw new Error("Server response not ok");
        return response.json();
      })
      .then(predictions=>{
        if(!Array.isArray(predictions) || predictions.length===0){
          tableBody.innerHTML += `<tr><td colspan="${1+gamesList.length+4+2+1+1}">No predictions available</td></tr>`;
        } else {
          predictions.forEach((prediction, idx)=>{
            const row = tableBody.insertRow(-1);
            const nameCell = row.insertCell();
            nameCell.innerText = prediction.name ? prediction.name : "User";
            nameCell.style.backgroundColor = getRankColor(idx);
            nameCell.style.color = "#000";
            nameCell.style.whiteSpace = "nowrap";
  
            if(!prediction.predictions || prediction.predictions.length !== gamesList.length){
              for(let i=0;i<gamesList.length;i++){
                row.insertCell(-1).innerText = "";
              }
            } else {
              prediction.predictions.forEach(pred=>{
                row.insertCell(-1).innerText = pred;
              });
            }
            if(!prediction.semifinalists){
              for(let i=0;i<4;i++){
                row.insertCell(-1).innerText = "";
              }
            } else {
              let semis = typeof prediction.semifinalists === "string" ? JSON.parse(prediction.semifinalists) : prediction.semifinalists;
              semis.forEach(s=>{
                row.insertCell(-1).innerText = s;
              });
            }
            if(!prediction.finalists){
              for(let i=0;i<2;i++){
                row.insertCell(-1).innerText = "";
              }
            } else {
              let finals = typeof prediction.finalists === "string" ? JSON.parse(prediction.finalists) : prediction.finalists;
              finals.forEach(f=>{
                row.insertCell(-1).innerText = f;
              });
            }
            row.insertCell(-1).innerText = prediction.winner;
            let pointsCell = row.insertCell(-1);
            pointsCell.innerText = prediction.points;
            if(!isNaN(prediction.points) && prediction.points > 0){
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
      .catch(error=>{
        console.error("Error fetching predictions:", error);
        tableBody.innerHTML = `<tr><td colspan="${1+gamesList.length+4+2+1+1}">Error loading predictions</td></tr>`;
      });
    })
    .catch(error=>{
      console.error("Error fetching actual results:", error);
      fetchPredictionsFallback();
    });
  }
  
  function fetchPredictionsFallback(){
    const tableBody = document.getElementById("predictionTable").getElementsByTagName("tbody")[0];
    fetch("/get_predictions")
    .then(response=>{
      if(!response.ok) throw new Error("Server response not ok");
      return response.json();
    })
    .then(predictions=>{
      if(!Array.isArray(predictions) || predictions.length===0){
        tableBody.innerHTML += `<tr><td colspan="21">No predictions available</td></tr>`;
      } else {
        predictions.forEach(prediction=>{
          const row = tableBody.insertRow(-1);
          row.insertCell(0).innerText = prediction.name ? prediction.name : "User";
          if(!prediction.predictions || prediction.predictions.length !== gamesList.length){
            for(let i=0;i<gamesList.length;i++){
              row.insertCell(-1).innerText = "";
            }
          } else {
            prediction.predictions.forEach(pred=>{
              row.insertCell(-1).innerText = pred;
            });
          }
          if(!prediction.semifinalists){
            for(let i=0;i<4;i++){
              row.insertCell(-1).innerText = "";
            }
          } else {
            let semis = typeof prediction.semifinalists === "string" ? JSON.parse(prediction.semifinalists) : prediction.semifinalists;
            semis.forEach(s=>{
              row.insertCell(-1).innerText = s;
            });
          }
          if(!prediction.finalists){
            for(let i=0;i<2;i++){
              row.insertCell(-1).innerText = "";
            }
          } else {
            let finals = typeof prediction.finalists === "string" ? JSON.parse(prediction.finalists) : prediction.finalists;
            finals.forEach(f=>{
              row.insertCell(-1).innerText = f;
            });
          }
          row.insertCell(-1).innerText = prediction.winner;
          let pointsCell = row.insertCell(-1);
          pointsCell.innerText = prediction.points;
          if(!isNaN(prediction.points) && prediction.points > 0){
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
    .catch(error=>{
      console.error("Error fetching predictions (fallback):", error);
      tableBody.innerHTML = `<tr><td colspan="21">Error loading predictions</td></tr>`;
    });
  }
  
  function colorizeTable(){
    const tableBody = document.getElementById("predictionTable").getElementsByTagName("tbody")[0];
    const rows = tableBody.rows;
    for(let r=0; r<rows.length; r++){
      const row = rows[r];
      for(let i=1; i<=numGames; i++){
        const cell = row.cells[i];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
      for(let i=1+numGames; i<1+gamesList.length+4; i++){
        const cell = row.cells[i];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
      for(let i=1+gamesList.length+4; i<1+gamesList.length+4+2; i++){
        const cell = row.cells[i];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
      {
        const cell = row.cells[1+gamesList.length+4+2];
        const team = cell.innerText.trim();
        cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
      }
    }
  }
  
  // NEW: Define displayFinalsPredictions to update the finalsPredictionTable with team color coding.
  function displayFinalsPredictions(){
    const tableBody = document.getElementById("finalsPredictionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    fetch("/get_predictions")
      .then(response => {
        if (!response.ok) throw new Error("Server response not ok");
        return response.json();
      })
      .then(predictions => {
        if (Array.isArray(predictions) && predictions.length > 0) {
          // For simplicity, we display the first prediction's playoffs/finals/winner
          const prediction = predictions[0];
          const row = tableBody.insertRow();
          
          // Name cell with rank color (first prediction)
          const nameCell = row.insertCell();
          nameCell.innerText = prediction.name || "User";
          nameCell.style.backgroundColor = getRankColor(0);
          nameCell.style.color = "#000";
          
          // Semifinalists cells (4)
          let semis = [];
          if (typeof prediction.semifinalists === "string") {
            try{ semis = JSON.parse(prediction.semifinalists); } catch(e){ semis = []; }
          } else { semis = prediction.semifinalists; }
          for (let i = 0; i < 4; i++){
            const cell = row.insertCell();
            const team = semis && semis[i] ? semis[i] : "";
            cell.innerText = team;
            if(team){
              cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
              cell.style.color = "#fff";
            }
          }
          
          // Finalists cells (2)
          let finals = [];
          if (typeof prediction.finalists === "string") {
            try{ finals = JSON.parse(prediction.finalists); } catch(e){ finals = []; }
          } else { finals = prediction.finalists; }
          for (let i = 0; i < 2; i++){
            const cell = row.insertCell();
            const team = finals && finals[i] ? finals[i] : "";
            cell.innerText = team;
            if(team){
              cell.style.backgroundColor = teamColors[team] || "#2f2f2f";
              cell.style.color = "#fff";
            }
          }
          
          // Winner cell
          const winnerCell = row.insertCell();
          const winnerTeam = prediction.winner || "";
          winnerCell.innerText = winnerTeam;
          if(winnerTeam){
            winnerCell.style.backgroundColor = teamColors[winnerTeam] || "#2f2f2f";
            winnerCell.style.color = "#fff";
          }
        } else {
          tableBody.innerHTML = "<tr><td colspan='8'>No playoffs predictions available</td></tr>";
        }
      })
      .catch(error => {
        console.error("Error fetching playoffs predictions:", error);
        tableBody.innerHTML = "<tr><td colspan='8'>Error loading playoffs predictions</td></tr>";
      });
  }
  
  // ----------------------
  // Attach Event Listeners and Expose Functions
  // ----------------------
  window.addEventListener("load", function(){
    // Bind the Enter Predictions button event listener
    const enterBtn = document.getElementById("enterPredictionBtn");
    if (enterBtn) {
      enterBtn.onclick = showPredictionForm;
      console.log("Enter Predictions button assigned");
    } else {
      console.error("Enter Predictions button not found.");
    }
    generateDetailedPredictionTableHeader();
    // Optionally, call displayLeaderboard() or displayFinalsPredictions() here.
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
    for(let i=1;i<=4;i++){
      th = document.createElement("th");
      th.innerText = `Semi ${i}`;
      row.appendChild(th);
    }
    for(let i=1;i<=2;i++){
      th = document.createElement("th");
      th.innerText = `Final ${i}`;
      row.appendChild(th);
    }
    th = document.createElement("th");
    th.innerText = "Winner";
    row.appendChild(th);
    th = document.createElement("th");
    th.innerText = "Points";
    row.appendChild(th);
    header.appendChild(row);
  }
  
  window.showExpertTab = showExpertTab;
  window.showAllPredictionsTab = showAllPredictionsTab;
  window.showPredictionForm = showPredictionForm;
  window.showMainView = showMainView;
  window.submitUserPrediction = submitUserPrediction;
  window.displayFinalsPredictions = displayFinalsPredictions;
})();



