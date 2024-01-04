$(document).ready(function () {
    $('#leetcodeForm').submit(function (event) {
        event.preventDefault();
        const leetcodeUsernameInput = document.getElementById('leetcodeUsername');
        const leetcodeUsername = leetcodeUsernameInput.value;
        if (leetcodeUsername) {
            fetchLeetCodeStats(leetcodeUsername);
        }
    });

    $('#friendForm').submit(function (event) {
        event.preventDefault();
        const friendUsernameInput = document.getElementById('friend_username');
        const friendUsername = friendUsernameInput.value;
        if (friendUsername) {
            addFriend(friendUsername);
        }
    });
});

function fetchLeetCodeStats(username) {
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

function displayError() {
    const leetcodeStatsContainer = $('#leetcodeStats');
    leetcodeStatsContainer.empty();
    const errorHTML = '<p class="error">Error fetching data. Please try again later.</p>';
    leetcodeStatsContainer.append(errorHTML);
}

function addFriend(username) {
    const apiUrl = `/add_friend/`;
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: `friend_username=${encodeURIComponent(username)}`,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display success message to the user or handle other actions if needed
        })
        .catch(error => {
            console.error('Error sending friend request:', error);
        });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
