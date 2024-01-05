function fetchIndividualLeetCodeStats(username) {
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            heatMap(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError();
        });
}

function heatMap(data) {
    const leetcodeStatsContainer = $('#leetcodeStatsContainer');
    leetcodeStatsContainer.empty();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const submissionCalendar = data.submissionCalendar;
    const cellSize = {
        width: canvas.width / 12,
        height: canvas.height / 7,
    };

    function drawHeatmap() {
        const borderWidth = 0.5;
        for (const epochDate in submissionCalendar) {
            const date = new Date(Number(epochDate) * 1000);
            const value = submissionCalendar[epochDate];
            const month = date.getMonth();
            const day = date.getDay();
            const x = month * cellSize.width;
            const y = day * cellSize.height
            const colorIntensity = value / getMaxValue();
            const color = `rgba(0, 128, 0, ${colorIntensity})`;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellSize.width, cellSize.height);
            ctx.strokeStyle = '#363636';
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(x, y, cellSize.width, cellSize.height);
        }
    }

    function getMaxValue() {
        return Math.max(...Object.values(submissionCalendar), 0);
    }

    drawHeatmap();
    leetcodeStatsContainer.append(canvas);
}