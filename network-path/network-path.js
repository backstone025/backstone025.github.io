/**
 * Name: Bae gyeonseok
 * Date: 2026-05-06
 * Section: IAB 6068
 * * 사용자 IP와 검색된 URL 서버의 위치 경로를 추적하여 시각화하는 스크립트입니다. [cite: 182]
 */

"use strict";

(function () {
    // 1. URL 통일 (제한이 덜한 API 사용) 
    const IP_API_URL = "http://ip-api.com/json/";
    let map = null; // 지도 변수는 모듈 범위 내에서 유지 [cite: 165]

    window.addEventListener("load", init);

    function init() {
        document.getElementById("search-btn").addEventListener("click", handleSearch);
        fetchLocation(IP_API_URL); // 초기 위치 가져오기
    }

    function handleSearch() {
        let query = document.getElementById("url-input").value.trim();
        if (query) {
            query = query.replace(/^https?:\/\//, "").split('/')[0];
            fetchLocation(`${IP_API_URL}${query}`);
        }
    }

    function fetchLocation(url) {
        fetch(url)
            .then(checkStatus) // [cite: 123, 132]
            .then(res => res.json())
            .then(processResponse)
            .catch(handleError); // [cite: 125, 137]
    }

    function checkStatus(response) {
        if (!response.ok) {
            throw Error("Error in request: " + response.statusText);
        }
        return response;
    }

    /**
     * 데이터를 처리하고 DOM 및 지도를 업데이트합니다. (중복 제거됨) [cite: 122, 192]
     */
    function processResponse(data) {
        if (data.status === "fail") {
            handleError(new Error(data.message));
            return;
        }

        document.getElementById("result-container").classList.remove("hidden"); // [cite: 159]

        const infoList = document.getElementById("path-info-list");
        const li = document.createElement("li"); // [cite: 122]

        // ip-api.com 필드명에 맞게 수정 (query, city, country, isp 등)
        li.textContent = `[TRACKED] ${data.query} -> ${data.city}, ${data.country} (${data.isp})`;
        infoList.appendChild(li); // [cite: 122]

        updateMap(data.lat, data.lon, data.city);
    }

    /**
     * 지도를 업데이트하는 비사소한 DOM 조작 함수 [cite: 122, 192]
     */
    function updateMap(lat, lon, city) {
        if (!map) {
            map = L.map('map').setView([lat, lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        } else {
            map.setView([lat, lon], 10);
        }
        L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${city}</b><br>Server Location`).openPopup();
    }

    function handleError(err) {
        const errorView = document.getElementById("error-view");
        document.getElementById("error-message").textContent = "SYSTEM ERROR: " + err.message;
        errorView.classList.remove("hidden");
        document.getElementById("result-container").classList.add("hidden"); // [cite: 159]
    }
})();