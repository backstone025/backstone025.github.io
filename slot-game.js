/**
 * name : Bae gyeonseok
 * date : 2026-4-17
 * Section: IAB 6068
 * 
 * 해당 파일은 슬롯 머신를 구현한 파일입니다.
 * 일반적인 슬롯 머신과 달리 3X3의 reel로 결과를 도출합니다.
 * 점수와 나올 확률을 조작하기 위한 이벤트도 추가되었습니다.
 */

"use strict";

(function () {


    const KEYS = ['🍒', '🍋', '🍀', '💎', '💀'];
    const OPERATIONS = ['+', '-', '/', 'x', '?'];

    let totalScore, storeCost, itemScores, itemWeights, itemIDs;
    let reelElements, resultText, spinBtn, refreshBtn, sctBtn, pbtBtn;

    window.addEventListener('load', init);

    /**
    * init()
    * 
    * @param@returns
    * 
    * 페이지가 로드할 때, 초기화하는 함수입니다.
    * 모든 버튼에 클릭 이벤트 리스너를 추가했습니다.
    */
    function init() {
        totalScore = document.getElementById('total-score');
        storeCost = document.getElementById('store-cost');

        itemScores = {
            '🍒': 1,
            '🍋': 2,
            '🍀': 5,
            '💎': 10,
            '💀': -10
        };
        itemWeights = {
            '🍒': 5,
            '🍋': 5,
            '🍀': 2,
            '💎': 1,
            '💀': 2
        };
        itemIDs = {
            '🍒': ['item1-score', 'item1-num'],
            '🍋': ['item2-score', 'item2-num'],
            '🍀': ['item3-score', 'item3-num'],
            '💎': ['item4-score', 'item4-num'],
            '💀': ['item5-score', 'item5-num']
        };

        reelElements = [
            document.getElementById('reel11'),
            document.getElementById('reel12'),
            document.getElementById('reel13'),
            document.getElementById('reel21'),
            document.getElementById('reel22'),
            document.getElementById('reel23'),
            document.getElementById('reel31'),
            document.getElementById('reel32'),
            document.getElementById('reel33')
        ];
        resultText = document.getElementById('result-text');

        spinBtn = document.getElementById('spin-btn');
        refreshBtn = document.getElementById('refresh-btn');
        sctBtn = document.getElementById('sct-btn');
        pbtBtn = document.getElementById('pbt-btn');

        spinBtn.addEventListener('click', spin);
        refreshBtn.addEventListener('click', refresh);
        sctBtn.addEventListener('click', purchaseSCT);
        pbtBtn.addEventListener('click', purchasePBT);
    }

    /**
     * refresh()
     * 
     * @param
     * @returns
     * 
     * refresh 버튼 클릭 시, 상점 아이템과 가격을 갱신합니다.
     * 플레이어의 점수로 구매할 수 있습니다.
     * refresh하는데 필요한 가격만큼의 점수가 없다면 동작하지 않습니다.
     */
    function refresh() {
        let cost = parseInt(storeCost.innerText);
        let score = parseInt(totalScore.innerText);
        if (score >= cost) {
            score -= cost;
            cost = Math.floor(cost * 1.5);
            totalScore.innerText = score;
            storeCost.innerText = cost;

            sctBtn.disabled = false;
            pbtBtn.disabled = false;
            document.getElementById('sct-item').innerText = KEYS[Math.floor(Math.random() * KEYS.length)];
            document.getElementById('sct-op').innerText = OPERATIONS[Math.floor(Math.random() * 5)];
            document.getElementById('sct-value').innerText = Math.floor(Math.random() * 10);
            sctBtn.innerText = Math.floor(Math.random() * (cost / 2) + cost / 4);

            document.getElementById('pbt-item').innerText = KEYS[Math.floor(Math.random() * KEYS.length)];
            document.getElementById('pbt-op').innerText = OPERATIONS[Math.floor(Math.random() * 5)];
            document.getElementById('pbt-value').innerText = Math.floor(Math.random() * 10);
            pbtBtn.innerText = Math.floor(Math.random() * (cost / 2) + cost / 4);

        }
    }

    /**
     * purchaseSCT()
     * 
     * @param
     * @returns
     * 
     * SCT(Score transform / 아이템 점수 변환)타입의 상점 아이템을 구매했을 때 동작됩니다.
     * SCT 타입의 상점 아이템은 적용할 reel의 아이콘 종류(item), 적용할 연산자(op), 적용할 값(value)의 조합으로 이뤄졌습니다.
     * 동작 후, 점수표의 정보가 갱신됩니다.
     * 한번 사용한 SCT 상점 아이템은 재사용이 불가합니다.
     */
    function purchaseSCT() {
        const cost = parseInt(sctBtn.innerText);
        let score = parseInt(totalScore.innerText);
        if (score >= cost) {
            totalScore.innerText = score - cost;
            sctBtn.disabled = true;
            const item = document.getElementById('sct-item').innerText;
            let op = document.getElementById('sct-op').innerText;
            const value = parseInt(document.getElementById('sct-value').innerText);
            const itemId = itemIDs[item][0];
            const itemScore = document.getElementById(itemId);
            let tmp = parseInt(itemScore.innerText);

            if (op === '?') {
                op = OPERATIONS[Math.floor(Math.random() * 4)];
            }

            if (op === '+') {
                tmp += value;
            } else if (op === '-') {
                tmp -= value;
            } else if (op === '/') {
                tmp /= Math.floor(value);
            } else if (op === 'x') {
                tmp *= value;
            }
            tmp = Math.floor(tmp);
            itemScore.innerText = tmp;
            itemScores[item] = tmp;
        }
    }

    /**
     * purchasePBT()
     * 
     * @param
     * @returns
     * 
     * PBT(probabilty transform / 확률 변환)타입의 상점 아이템을 구매했을 때 동작됩니다.
     * PBT 타입의 상점 아이템은 적용할 reel의 아이콘 종류(item), 적용할 연산자(op), 적용할 값(value)의 조합으로 이뤄졌습니다.
     * 동작 후, 확률표의 정보가 갱신됩니다.
     * 한번 사용한 PBT 상점 아이템은 재사용이 불가합니다.
     */
    function purchasePBT() {
        const cost = parseInt(pbtBtn.innerText);
        let score = parseInt(totalScore.innerText);
        if (score >= cost) {
            totalScore.innerText = score - cost;
            pbtBtn.disabled = true;
            const item = document.getElementById('pbt-item').innerText;
            let op = document.getElementById('pbt-op').innerText;
            const value = parseInt(document.getElementById('pbt-value').innerText);
            const itemId = itemIDs[item][1];
            const itemNum = document.getElementById(itemId);
            let tmp = parseInt(itemNum.innerText);

            if (op === '?') {
                op = OPERATIONS[Math.floor(Math.random() * 4)];
            }

            if (op === '+') {
                tmp += value;
            } else if (op === '-') {
                tmp -= value;
            } else if (op === '/') {
                tmp /= Math.floor(value);
            } else if (op === 'x') {
                tmp *= value;
            }
            tmp = Math.floor(tmp);
            itemNum.innerText = tmp;
            itemWeights[item] = tmp;
        }
    }

    /**
     * spin()
     * 
     * @param
     * @returns
     * 
     * 슬롯 머신 동작 버튼 작동시 실행됩니다.
     * 슬롯 머신의 결과 도출을 위해 각 reel별로 무작위로 아이콘을 뽑고, 결과를 환산해 도출합니다.
     * 슬롯 머신의 reels의 회전을 동작하도록 합니다.
     */
    function spin() {
        spinBtn.disabled = true;
        resultText.innerText = "두구두구...";

        const results = [];
        const weightedItems = [];
        for (const item in itemWeights) {
            for (let i = 0; i < itemWeights[item]; i++) {
                weightedItems.push(item);
            }
        }

        reelElements.forEach((reel, index) => {
            // 1. 가짜 리스트 생성
            const randomItems = [];
            for (let i = 0; i < 20; i++) {
                const randomItem = weightedItems[
                    Math.floor(
                        Math.random() * weightedItems.length)];
                randomItems.push(randomItem);
            }

            results.push(randomItems[randomItems.length - 1]);

            // 2. 화면에 이모지들을 배치
            // 이전 기록 비우기
            reel.textContent = '';

            randomItems.forEach(item => {
                const itemDiv = document.createElement('div'); // 새 요소를 생성합니다 
                itemDiv.textContent = item; // 텍스트를 할당합니다
                reel.appendChild(itemDiv); // 부모 요소에 자식으로 추가합니다 
            });

            // 3. 애니메이션 초기화 후 아래로 밀기
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';

            setTimeout(() => {
                reel.style.transition = `transform ${0.5 + (index * 0.1)}s cubic-bezier(0.2, 0, 0.2, 1)`;
                reel.style.transform = `translateY(-${80 * (randomItems.length - 1)}px)`;
            }, 50);
        });

        // 4. 당첨 판정 로직 (가장 마지막 릴이 멈추는 시간에 맞춤)
        setTimeout(() => {
            spinBtn.disabled = false;

            // 결과 확인 (세 값이 모두 같은지)
            let comb = checkComb(results);
            if (comb.length > 0) {
                let total = parseInt(totalScore.innerText);
                for (const success of comb) {
                    // 💀 당첨 시, 💀의 점수는 -1씩 누적되며, 0 이상의 값이면 -10으로 초기화시킨다.
                    if (success[1] === '💀') {
                        resultText.innerText = "😱 저주받은 잭팟... (💀)";
                        if (itemScores['💀'] >= 0) {
                            itemScores['💀'] = -10;
                        }
                        itemScores['💀'] = itemScores['💀'] - 1;
                        document.getElementById('item5-score').innerText = itemScores['💀'];


                    } else {
                        resultText.innerText = `🎊 대박! ${success[1]} 잭팟! 🎊`;
                    }
                    total += itemScores[success[1]];
                    totalScore.innerText = total;
                };
            } else {
                resultText.innerText = "아쉬워요! 다시 한 번!";
            }
        }, 1400); // 애니메이션 총 소요 시간에 맞춘 타이밍

        /**
         * checkComb()
         * 
         * @param {*} results 
         * @returns
         * 
         * 결과로 나온 reels 중에서 연속된 3개를 찾아냅니다.
         * 가로, 세로, 대각선을 탐색합니다.
         * 나온 결과는 상태 코드와 결과로 나온 아이콘을 묶은 배열로 반환합니다.
         */
        function checkComb(results) {
            const comb = [];
            if (results[0] === results[1] && results[1] === results[2]) {
                comb.push([100, results[0]]);
            }
            if (results[3] === results[4] && results[4] === results[5]) {
                comb.push([120, results[3]]);
            }
            if (results[6] === results[7] && results[7] === results[8]) {
                comb.push([130, results[6]]);
            }

            if (results[0] === results[3] && results[3] === results[6]) {
                comb.push([101, results[0]]);
            }
            if (results[1] === results[4] && results[4] === results[7]) {
                comb.push([102, results[1]]);
            }
            if (results[2] === results[5] && results[5] === results[8]) {
                comb.push([103, results[2]]);
            }

            if (results[0] === results[4] && results[4] === results[8]) {
                comb.push([210, results[0]]);
            }
            if (results[2] === results[4] && results[4] === results[6]) {
                comb.push([201, results[2]]);
            }

            return comb;
        }
    }
})();