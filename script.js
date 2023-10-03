const main = document.querySelector(".main");
const search = document.getElementById("Search");
const btn = document.getElementById("btn");
let ipAddress = "";
let postData;
btn.addEventListener("click", loadIp);
let datetime_str;
let wrapper = document.querySelector(".wrapper");
// transition of page
async function handleSecPage() {
    main.style.display = "none";
    wrapper.style.display = "flex";
    const longLatInfo = await longLat();
    const longLat_str = longLatInfo.loc;
    console.log(longLatInfo, longLat_str);
    let arr = longLat_str.split(",");
    let lat = arr[0];
    let long = arr[1];

    const postalInfo = await getPostOffice(longLatInfo.postal);
    let secPage_str = `<main>
<div class="top">
<div class="ip sec-Head">IP Arress: <span>${ipAddress}</span></div>

<div class="top-grid sec-Head">
<div class="top-grid-items sec-Head">Lat: <span>${lat}</span></div>
<div class="top-grid-items sec-Head">City: <span>${longLatInfo.city}</span></div>
<div class="top-grid-items sec-Head">Organisation: <span>${longLatInfo.org}</span></div>
<div class="top-grid-items sec-Head">Long: <span>${long}</span></div>
<div class="top-grid-items sec-Head">Region: <span>${longLatInfo.region}</span></div>
<div class="top-grid-items sec-Head">Hostname: <span>${longLatInfo.hostname}</span></div>
</div>
</div>
<div class="location">
<h1>Your Current Location</h1>
<iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" frameborder="0" style="border:0"></iframe>
</div>
<div class="more-info-container">
<h1>More Info About You</h1>
    <div class="more-info">
        <div class="info sec-Head">Time Zone : <span>${longLatInfo.timezone}</span></div>
        <div class="info sec-Head">Date & Time : <span>${datetime_str}</span></div>
        <div class="info sec-Head">Pincode : <span>${longLatInfo.postal}</span></div>
        <div class="info sec-Head">Message : <span>${postalInfo[0].Message}</span></div>
        </div>
        </div>
        <div class="post-office-container">
        <h1>Post Offices Near You</h1>
        <div class="searchbox">
        <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.592 25.9369L23.7498 20.0957C23.4861 19.832 23.1286 19.6856 22.7536 19.6856H21.7985C23.4158 17.6174 24.3768 15.0161 24.3768 12.1863C24.3768 5.45455 18.9213 0 12.1884 0C5.45548 0 0 5.45455 0 12.1863C0 18.9181 5.45548 24.3726 12.1884 24.3726C15.0187 24.3726 17.6204 23.4118 19.6889 21.7947V22.7497C19.6889 23.1247 19.8354 23.4821 20.0991 23.7457L25.9414 29.587C26.4922 30.1377 27.3829 30.1377 27.9278 29.587L29.5862 27.9289C30.137 27.3782 30.137 26.4876 29.592 25.9369ZM12.1884 19.6856C8.04551 19.6856 4.68784 16.3343 4.68784 12.1863C4.68784 8.04414 8.03965 4.68704 12.1884 4.68704C16.3313 4.68704 19.6889 8.03828 19.6889 12.1863C19.6889 16.3285 16.3371 19.6856 12.1884 19.6856Z" fill="#B8BCCC"/>
        </svg>
        <input type="text" name="P.O.-name"  class="searchBox-input" id="searchBox" placeholder="Search by name">
        </div>
        
        </div>
        <div class="post-office-card-container">
        
        </div>
        </main>`;
    document.querySelector("body").innerHTML = secPage_str;
    const secPage = document.querySelector("main");
    secPage.style.display = "block";
    postData = postalInfo[0].PostOffice;
    makePostaCards(postData);
    var searchBox = document.getElementById("searchBox");
    const searchTerm = searchBox.value;

    searchBox.addEventListener("keyup", (searchTerm) => {
        const container = document.querySelector(".post-office-card-container");
        let newData = [];
        postData.forEach((pO) => {
            let name = pO.Name;
            let deli = pO.DeliveryStatus;
            console.log(name, deli);
            if (deli.includes(searchTerm)) {
                newData.push(pO);
            } else if (name.includes(searchTerm)) {
                newData.push(pO);
            }
        });
        container.innerHTML = "";
        console.log(newData);
        makePostaCards(newData);
    });
}

// func to load IP address
function loadIp() {
    console.log("clicked");
    /* Add "https://api.ipify.org?format=json" statement
          this will communicate with the ipify servers in
          order to retrieve the IP address $.getJSON will
          load JSON-encoded data from the server using a
          GET HTTP request */
    $.getJSON("https://api.ipify.org?format=json", (data) => {
        // Setting text of element P with id gfg
        $("#gfg").html(data.ip);
        console.log(data);
        ipAddress = data.ip;
    });
    search.addEventListener("click", handleSecPage);
}

// long-lat fetcher
async function longLat() {
    console.log(ipAddress);
    const url = `https://ipinfo.io/${ipAddress}/geo?token=e277fd01672923`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    datetime_str = new Date().toLocaleString("en-US", {
        timeZone: `${data.timezone}`,
    });

    // "3/22/2021, 5:05:51 PM"
    console.log(datetime_str);
    // document.getElementById('abc').innerHTML = data.loc + datetime_str + getPostOffice(data.postal);
    return data;
}

// post office info fetcher
async function getPostOffice(postalCode) {
    const url = `https://api.postalpincode.in/pincode/${postalCode}`;
    const resp = await fetch(url);
    const data = await resp.json();
    console.log(data);
    return data;
}

function makePostaCards(post_Offices) {
    const container = document.querySelector(".post-office-card-container");
    post_Offices.forEach((pO) => {
        let my_Str = `<div class="card-heads sec-Head">Name : <span>${pO.Name}</span>
        </div>
        <div class="card-heads sec-Head">Branch Type : 
        <span>${pO.BranchType}</span>
        </div>
        <div class="card-heads sec-Head">Delivery Status :
        <span>${pO.DeliveryStatus}</span></div>
        <div class="card-heads sec-Head">District :
        <span>${pO.District}</span></div>
        <div class="card-heads sec-Head">Division :
        <span>${pO.Division}</span></div>`;
        const card = document.createElement("div");
        card.className = "post-office-card";
        card.innerHTML = my_Str;
        container.appendChild(card);
    });
}
