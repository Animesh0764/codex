//LeetCode stats
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
            showStats(data, username);
            showStatsCF(dataCF, username);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError();
        });
}

//Codeforces Status
function fetchCodeForcesStatus(username) {
    const apiUrl = `https://codeforces.com/api/user.status?handle=${username}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showStatusCF(data, username);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError();
        });
}

//Codeforces Rating
function fetchCodeForcesRating(username) {
    const apiUrl = `https://codeforces.com/api/user.rating?handle=${username}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showRatingCF(data, username);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError();
        });
}

//Codeforces Info
function showStatusCF(data, userName) {
    const username = userName;
    const attempted = data.result.length;
    const successfulAttempts = data.result.filter(item => item.verdict === "OK").length;
    const practiceQues = data.result.filter(item => item.author.participantType === "PRACTICE").length;
    const contestQues = data.result.filter(item => item.author.participantType === "CONTESTANT").length;
    const successfulAttemptsPercent = ((successfulAttempts/attempted)*100).toFixed(2);

    document.getElementById('CFusername').innerHTML = `Codeforces Stats for: ${username}`;
    document.getElementById('totalProblemsCF').innerHTML = `Succesful Attempt Percentage: ${successfulAttemptsPercent}`;
    document.getElementById('totalAttempts').innerHTML = `Total Attempted: ${attempted}`;
    document.getElementById('successAttempts').innerHTML = `Successfully Attempted: ${successfulAttempts}`;
    document.getElementById('practice').innerHTML = `Practice Questions: ${practiceQues}`;
    document.getElementById('contest').innerHTML = `Contest Questions: ${contestQues}`;
}

function showRatingCF(data, username) {
    const maxRating = data.result.map(item => item.newRating);
    const curRank = data.result[data.result.length - 1].newRating;
    const ranks = data.result.map(item => item.rank);

    console.log("maxRating:", maxRating);
    console.log("curRank:", curRank);
    console.log("ranks:", ranks);

    let maxrate = Math.max(...maxRating);
    let minRank = Math.min(...ranks);
    let maxRank = Math.max(...ranks);

    console.log("maxrate:", maxrate);
    console.log("minRank:", minRank);
    console.log("maxRank:", maxRank);

    document.getElementById('maxrating').innerHTML = `Max Rating: ${maxrate}`;
    document.getElementById('currating').innerHTML = `Current Rating: ${curRank}`;
    document.getElementById('maxrank').innerHTML = `Max Rank in Contest: ${minRank}`;
    document.getElementById('minrank').innerHTML = `Min Rank in Contest: ${maxRank}`;
}


//Leetcode Info
function showStats(data, userName) {
    const username = userName;
    const solved = data.totalSolved

    const easy = data.easySolved;
    const medium = data.mediumSolved;
    const hard = data.hardSolved;

    const easysolved = data.totalEasy;
    const mediumsolved = data.totalMedium;
    const hardsolved = data.totalHard;

    const totalProblems = data.totalQuestions;

    const solvedPercentage = ((solved / totalProblems) * 100).toFixed(2);
    const easyPercentage = ((easy / easysolved) * 100).toFixed(2);
    const mediumPercentage = ((medium / mediumsolved) * 100).toFixed(2);
    const hardPercentage = ((hard / hardsolved) * 100).toFixed(2);

    document.getElementById('username').innerHTML = `LeetCode Stats for: ${username}`;
    document.getElementById('solved').innerHTML = `Problems Solved: ${solved}`;
    document.getElementById('easy').innerHTML = `Easy Problems Solved: ${easy}`;
    document.getElementById('medium').innerHTML = `Medium Problems Solved: ${medium}`;
    document.getElementById('hard').innerHTML = `Hard Problems Solved: ${hard}`;
    document.getElementById('totalProblems').innerHTML = `Total Problems: ${totalProblems}`;
    document.getElementById('solvedPercentage').innerHTML = `Solved Percentage: ${solvedPercentage}%`;
    document.getElementById('easyPercentage').innerHTML = `Easy Percentage: ${easyPercentage}%`;
    document.getElementById('mediumPercentage').innerHTML = `Medium Percentage: ${mediumPercentage}%`;
    document.getElementById('hardPercentage').innerHTML = `Hard Percentage: ${hardPercentage}%`;
}

document.getElementById('sendFriendRequestBtn').addEventListener('click', function () {
    const userNameInput = $("#friend_username");

    userNameInput.value = "";
});