document.addEventListener("DOMContentLoaded", function(){
    const searchbuttom= document.getElementById("search-btm");
    const usernameInput= document.getElementById("user-input");
    const statscontainer=document.querySelector(".start-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel =document.getElementById("easy-label")
    const mediumLabel =document.getElementById("medium-label")
    const hardLabel =document.getElementById("hard-label")
    const cardStatsContainer =document.querySelector(".stats-card")

    //return true or false based on a regex
    function valideteUsername(username){
        if(username.trim() ===""){
            alert("username should not be empty");
            return false;
        }
        const regtx=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching =regtx.test(username);
        if(isMatching){
            alert("invalid username")
        }
        return isMatching;

    }


    async function fetchuserDetails(username) {

       // const url='https://leetcode.com/graphql/'
        try{
            searchbuttom.textContent="Searching....";
            searchbuttom.disabled=true;
           // statscontainer.style.setProperty("display",hidden);
            //statscontainer.classList.add("hidden");

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };


            const response = await fetch(proxyUrl+targetUrl,requestOptions);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parsedata= await response.json();
            console.log('logging data:',parsedata);

            displayUserData(parsedata);
        }
        catch(error ){
            // statscontainer.innerHTML='<P> no data found </p>'
              statscontainer.innerHTML = `<p>${error.message}</p>`
        }
        finally{
            searchbuttom.textContent="Searching....";
            searchbuttom.disabled=false;

        }
        
    }

    function updateProgress(solved, total , label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsadata){
        const totalQues=parsadata.data.allQuestionsCount[0].count;
        const totalEasyQues=parsadata.data.allQuestionsCount[1].count;
        const totalMediumQues=parsadata.data.allQuestionsCount[2].count;
        const totalHardQues=parsadata.data.allQuestionsCount[3].count;

        const solvedTotalQus=parsadata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyTotalQus=parsadata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumTotalQus=parsadata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardTotalQus=parsadata.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedEasyTotalQus, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumTotalQus, totalMediumQues, mediumLabel , mediumProgressCircle);
        updateProgress(solvedHardTotalQus, totalHardQues, hardLabel, hardProgressCircle);

        const CardData  = [
            {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];
        console.log("card ka data: " , CardData);

        cardStatsContainer.innerHTML = CardData.map(
            data => 
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("")

    }

    searchbuttom.addEventListener('click', function(){
        const username=usernameInput.value;
        console.log('Loggin username :',username);
        if(valideteUsername(username)){
            fetchuserDetails(username);
        }
    })
})