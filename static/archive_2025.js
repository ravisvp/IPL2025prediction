async function loadArchivePage() {
    try {
        const [leaderboardRes, predictionsRes] = await Promise.all([
            fetch("/leaderboard_2025.json"),
            fetch("/predictions_2025.json")
        ]);

        if (!leaderboardRes.ok || !predictionsRes.ok) {
            throw new Error("Could not load archive JSON files.");
        }

        const leaderboard = await leaderboardRes.json();
        const predictions = await predictionsRes.json();

        renderLeaderboard(leaderboard);
        renderFinalsTable(predictions);
    } catch (error) {
        console.error("Archive load error:", error);
        document.body.insertAdjacentHTML(
            "beforeend",
            `<p style="color:red;text-align:center;font-weight:bold;">Failed to load archive data.</p>`
        );
    }
}

function renderLeaderboard(data) {
    const tbody = document.querySelector("#leaderboardTable tbody");
    tbody.innerHTML = "";

    data.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.total_points}</td>
            <td>${player.total_hits}</td>
            <td>${player.total_misses}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderFinalsTable(data) {
    const tbody = document.querySelector("#finalsTable tbody");
    tbody.innerHTML = "";

    data.forEach((player) => {
        const semifinalists = Array.isArray(player.semifinalists)
            ? player.semifinalists.join(", ")
            : "";

        const finalists = Array.isArray(player.finalists)
            ? player.finalists.join(", ")
            : "";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${semifinalists}</td>
            <td>${finalists}</td>
            <td>${player.winner || ""}</td>
            <td>${player.orange_cap || ""}</td>
            <td>${player.purple_cap || ""}</td>
            <td>${player.points ?? ""}</td>
        `;
        tbody.appendChild(row);
    });
}

loadArchivePage();