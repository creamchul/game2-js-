// 게임 상태
const gameState = {
    hp: 100,
    maxHp: 100,
    gold: 0,
    luck: 10,
    floor: 1,
    isGameOver: false,
    log: [],
    playerClass: '',
    inventory: [],
    currentEvent: null,
    isMerchantOpen: false,
    hasShield: false,
    canTeleport: false,
    leftPrediction: '',
    rightPrediction: '',
    theme: 'default'
};

// DOM 요소들
const elements = {
    hp: document.getElementById('hp'),
    gold: document.getElementById('gold'),
    luck: document.getElementById('luck'),
    floor: document.getElementById('floor'),
    playerClass: document.getElementById('player-class'),
    description: document.getElementById('current-description'),
    choice1: document.getElementById('choice1'),
    choice2: document.getElementById('choice2'),
    eventChoice1: document.getElementById('event-choice1'),
    eventChoice2: document.getElementById('event-choice2'),
    eventChoices: document.getElementById('event-choices'),
    gameOver: document.getElementById('game-over'),
    finalFloor: document.getElementById('final-floor'),
    finalGold: document.getElementById('final-gold'),
    restartButton: document.getElementById('restart-button'),
    log: document.getElementById('log'),
    gameContainer: document.getElementById('game-container'),
    classSelection: document.getElementById('class-selection'),
    logContainer: document.getElementById('log-container'),
    warriorBtn: document.getElementById('warrior-btn'),
    rogueBtn: document.getElementById('rogue-btn'),
    wizardBtn: document.getElementById('wizard-btn'),
    inventoryCount: document.getElementById('inventory-count'),
    items: document.getElementById('items'),
    merchant: document.getElementById('merchant'),
    merchantItems: document.getElementById('merchant-items'),
    choices: document.getElementById('choices'),
    playerCharacter: document.getElementById('player-character'),
    bossCharacter: document.getElementById('boss-character'),
    characterDisplay: document.getElementById('character-display'),
    hpCircle: document.querySelector('.hp-circle'),
    goldCircle: document.querySelector('.gold-circle'),
    luckCircle: document.querySelector('.luck-circle'),
    defaultTheme: document.getElementById('default-theme'),
    pastelTheme: document.getElementById('pastel-theme'),
    darkTheme: document.getElementById('dark-theme'),
    rewardModal: document.getElementById('reward-modal'),
    rewardContent: document.getElementById('reward-content'),
    modalClose: document.querySelector('.modal-close')
};

// 이벤트 설명들
const eventDescriptions = [
    "어두운 방이 나타났습니다. 두 개의 문이 보입니다.",
    "거대한 홀이 나타났습니다. 두 개의 통로가 있습니다.",
    "미로 같은 복도에 도착했습니다. 어느 쪽으로 가시겠습니까?",
    "분기점에 도착했습니다. 두 갈래 길이 있습니다.",
    "계단을 올라왔습니다. 두 개의 문이 보입니다.",
    "보물 방에 도착했습니다. 두 개의 문이 보입니다.",
    "작은 방에 도착했습니다. 두 개의 문이 보입니다.",
    "고대의 신전에 도착했습니다. 두 가지 길이 있습니다.",
    "어두운 복도에 도착했습니다. 두 방향으로 갈 수 있습니다."
];

// 보스 설명
const bossDescriptions = [
    "10층: 거대한 슬라임이 방을 가득 채우고 있습니다. 어떻게 하시겠습니까?",
    "20층: 뼈로 된 기사가 칼을 들고 서 있습니다. 어떻게 하시겠습니까?",
    "30층: 화염의 마법사가 당신을 노려보고 있습니다. 어떻게 하시겠습니까?",
    "40층: 독안개 구름이 방 안에 퍼져 있습니다. 어떻게 하시겠습니까?",
    "50층: 거대한 미노타우르스가 도끼를 휘두르며 다가옵니다. 어떻게 하시겠습니까?",
    "60층: 고대의 골렘이 깨어나 움직이기 시작합니다. 어떻게 하시겠습니까?",
    "70층: 그림자 암살자가 당신을 향해 나타났습니다. 어떻게 하시겠습니까?",
    "80층: 얼음의 드래곤이 당신에게 포효합니다. 어떻게 하시겠습니까?",
    "90층: 지옥의 문지기가 길을 막고 있습니다. 어떻게 하시겠습니까?",
    "100층: 던전의 최종 보스, 암흑의 군주가 기다리고 있습니다. 최종 결전을 시작하시겠습니까?"
];

// 이벤트 결과들
const successResults = [
    "🎉 금화를 발견했습니다!",
    "🎁 보물 상자를 발견했습니다!",
    "💰 금화 주머니를 발견했습니다!",
    "✨ 비밀 통로를 발견했습니다!"
];

const failureResults = [
    "💥 함정에 걸렸습니다!",
    "👹 몬스터를 만났습니다!",
    "☠️ 독가스가 있는 방이었습니다!",
    "🔥 불 함정을 밟았습니다!",
    "⚡ 전기 함정에 걸렸습니다!",
    "🕸️ 거대 거미가 공격합니다!",
    "🧟 언데드가 나타났습니다!"
];

const neutralResults = [
    "🔍 아무것도 찾지 못했습니다.",
    "💨 빈 방이었습니다.",
    "🚶 아무 일도 일어나지 않았습니다.",
    "🔒 잠긴 상자를 발견했지만 열 수 없었습니다.",
    "📝 벽에 알 수 없는 글자가 적혀있습니다."
];

// 특별 이벤트 정의
const specialEvents = [
    {
        type: "chest",
        description: "🗃️ 신비한 상자를 발견했습니다. 열어보시겠습니까?",
        choices: ["열어본다", "지나친다"]
    },
    {
        type: "merchant",
        description: "👤 상인을 만났습니다. 물건을 구경하시겠습니까?",
        choices: ["상점 열기", "지나친다"]
    },
    {
        type: "portal",
        description: "🌀 신비한 포탈이 보입니다. 들어가시겠습니까?",
        choices: ["포탈에 들어간다", "피한다"]
    }
];

// 아이템 정의
const items = {
    healthPotion: {
        name: "회복 물약",
        description: "체력을 30 회복합니다.",
        price: 50,
        emoji: "🍖",
        use: function() {
            const healAmount = 30;
            gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
            addToLog(`🍖 회복 물약을 사용했습니다. 체력 +${healAmount}`);
            updateUI();
        }
    },
    luckCharm: {
        name: "행운의 부적",
        description: "다음 선택에서 운 +20%",
        price: 70,
        emoji: "🔮",
        use: function() {
            gameState.luck += 20;
            addToLog("🔮 행운의 부적을 사용했습니다. 운 +20");
            updateUI();
        }
    },
    shieldScroll: {
        name: "방어의 주문서",
        description: "다음 전투에서 피해를 50% 줄입니다.",
        price: 80,
        emoji: "🛡️",
        use: function() {
            gameState.hasShield = true;
            addToLog("🛡️ 방어의 주문서를 사용했습니다. 다음 전투 피해 -50%");
        }
    }
};

// 게임 초기화
initGame();

// 직업 선택 이벤트 리스너
elements.warriorBtn.addEventListener('click', () => selectClass('전사'));
elements.rogueBtn.addEventListener('click', () => selectClass('도적'));
elements.wizardBtn.addEventListener('click', () => selectClass('마법사'));

// 테마 변경 이벤트 리스너
elements.defaultTheme.addEventListener('click', () => changeTheme('default'));
elements.pastelTheme.addEventListener('click', () => changeTheme('pastel'));
elements.darkTheme.addEventListener('click', () => changeTheme('dark'));

// 모달 닫기 이벤트 리스너
elements.modalClose.addEventListener('click', closeModal);

// 게임 시작 시 직업 선택 화면만 표시
function initGame() {
    elements.classSelection.classList.remove('hidden');
    elements.gameContainer.classList.add('hidden');
    elements.logContainer.classList.add('hidden');
    
    // 저장된 테마가 있으면 적용
    const savedTheme = localStorage.getItem('dungeon-theme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
}

// 직업 선택 함수
function selectClass(className) {
    gameState.playerClass = className;
    
    // 직업별 보너스 적용
    switch(className) {
        case '전사':
            gameState.hp += 30;
            gameState.maxHp += 30;
            elements.playerCharacter.className = 'character-image warrior-character';
            break;
        case '도적':
            gameState.luck += 10;
            elements.playerCharacter.className = 'character-image rogue-character';
            break;
        case '마법사':
            // 마법사는 한번의 위험한 상황을 회피할 수 있는 능력을 가짐
            gameState.canTeleport = true;
            elements.playerCharacter.className = 'character-image wizard-character';
            break;
    }
    
    // 직업 선택 화면 숨기고 게임 화면 표시
    elements.classSelection.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');
    elements.logContainer.classList.remove('hidden');
    
    // 게임 시작 로그 추가
    addToLog(`🎮 ${className}(으)로 게임을 시작합니다.`);
    
    // UI 초기화
    updateUI();
    generateNextEvent();
}

// 버튼 이벤트 리스너
elements.choice1.addEventListener('click', () => handleChoice('왼쪽'));
elements.choice2.addEventListener('click', () => handleChoice('오른쪽'));
elements.eventChoice1.addEventListener('click', handleEventChoice1);
elements.eventChoice2.addEventListener('click', handleEventChoice2);
elements.restartButton.addEventListener('click', restartGame);

// 다음 층 이벤트 생성
function generateNextEvent() {
    // 페이드 효과 적용
    elements.gameContainer.classList.add('fade-out');
    
    setTimeout(() => {
        // 현재 이벤트 초기화
        gameState.currentEvent = null;
        elements.eventChoices.classList.add('hidden');
        elements.choices.classList.remove('hidden');
        
        // 상인 UI 숨기기
        elements.merchant.classList.add('hidden');
        gameState.isMerchantOpen = false;
        
        // 보스 캐릭터 숨기기 및 플레이어 캐릭터 표시
        elements.bossCharacter.classList.add('hidden');
        elements.playerCharacter.classList.remove('hidden');
        
        // 보스 층 체크
        if (gameState.floor % 10 === 0 && gameState.floor <= 100) {
            // 보스층
            const bossIndex = (gameState.floor / 10) - 1;
            elements.description.innerHTML = `<span class="boss-warning">⚠️ 보스 층 ⚠️</span><br>${bossDescriptions[bossIndex]}`;
            elements.description.classList.add('boss-floor');
            showChoices("싸운다", "도망친다");
            
            // 보스 캐릭터 표시
            elements.bossCharacter.classList.remove('hidden');
            
            // 보스 타입에 따른 이미지 설정
            const bossClasses = [
                'boss-slime',      // 10층
                'boss-knight',     // 20층
                'boss-wizard',     // 30층
                'boss-poison',     // 40층
                'boss-minotaur',   // 50층
                'boss-golem',      // 60층
                'boss-assassin',   // 70층
                'boss-dragon',     // 80층
                'boss-gatekeeper', // 90층
                'boss-lord'        // 100층
            ];
            
            elements.bossCharacter.className = 'boss-image ' + bossClasses[bossIndex];
            
            // 보스 등장 시 화면 진동 효과
            setTimeout(() => {
                elements.gameContainer.classList.add('shake');
                
                // 효과음 재생 (필요시)
                playSound('boss');
                
                // 진동 효과 제거
                setTimeout(() => {
                    elements.gameContainer.classList.remove('shake');
                }, 500);
            }, 300);
        } else {
            // 일반 이벤트 또는 특별 이벤트 결정
            elements.description.classList.remove('boss-floor');
            const eventRoll = Math.random();
            
            if (eventRoll < 0.2) {
                // 특별 이벤트 (상자, 상인, 포탈 등)
                const specialEvent = getRandomItem(specialEvents);
                gameState.currentEvent = specialEvent;
                
                elements.description.textContent = `${gameState.floor}층: ${specialEvent.description}`;
                elements.choices.classList.add('hidden');
                elements.eventChoices.classList.remove('hidden');
                
                elements.eventChoice1.textContent = specialEvent.choices[0];
                elements.eventChoice2.textContent = specialEvent.choices[1];
            } else {
                // 일반 이벤트
                elements.description.textContent = `${gameState.floor}층: ${getRandomItem(eventDescriptions)}`;
                
                // 마법사인 경우 각 문마다 다른 확률 적용 및 표시
                if (gameState.playerClass === '마법사') {
                    // 마법사는 한 쪽 문의 결과를 예지할 수 있음
                    const leftProb = Math.random();
                    const rightProb = Math.random();
                    
                    let leftResult, rightResult;
                    
                    if (leftProb < 0.4) {
                        leftResult = "성공";
                    } else if (leftProb < 0.7) {
                        leftResult = "실패";
                    } else {
                        leftResult = "중립";
                    }
                    
                    if (rightProb < 0.4) {
                        rightResult = "성공";
                    } else if (rightProb < 0.7) {
                        rightResult = "실패";
                    } else {
                        rightResult = "중립";
                    }
                    
                    elements.choice1.innerHTML = `왼쪽 문 열기<span class="success-chance">${leftResult} 예지</span>`;
                    elements.choice2.innerHTML = `오른쪽 문 열기<span class="success-chance">${rightResult} 예지</span>`;
                    
                    // 결과를 게임 상태에 저장
                    gameState.leftPrediction = leftResult;
                    gameState.rightPrediction = rightResult;
                } else {
                    elements.choice1.textContent = "왼쪽 문 열기";
                    elements.choice2.textContent = "오른쪽 문 열기";
                }
                
                // 마법사의 텔레포트 능력이 있으면 표시
                if (gameState.playerClass === '마법사' && gameState.canTeleport) {
                    elements.choice1.innerHTML += `<span class="teleport-available">⚡ 텔레포트 가능</span>`;
                    elements.choice2.innerHTML += `<span class="teleport-available">⚡ 텔레포트 가능</span>`;
                }
            }
        }
        
        // 페이드 인 효과 적용
        elements.gameContainer.classList.remove('fade-in');
        
    }, 500); // 페이드 아웃 지연 시간
}

// 선택 버튼 텍스트 변경
function showChoices(choice1Text, choice2Text) {
    elements.choice1.textContent = choice1Text;
    elements.choice2.textContent = choice2Text;
}

// 선택 처리 함수
function handleChoice(direction) {
    if (gameState.isGameOver) return;
    
    // 효과음 재생
    playSound('button');
    
    // 보스 층 체크
    if (gameState.floor % 10 === 0) {
        handleBossChoice(direction === '왼쪽' ? "싸운다" : "도망친다");
        return;
    }
    
    // 성공 확률 계산 (행운에 따라 조정)
    const successProbability = 0.4 + (gameState.luck / 100);
    const failureProbability = 0.3;
    
    const randomValue = Math.random();
    let result, resultText, goldChange = 0, hpChange = 0, luckChange = 0;
    
    // 결과 결정
    if (randomValue < successProbability) {
        // 성공
        result = getRandomItem(successResults);
        goldChange = Math.floor(Math.random() * 30) + 20;
        
        // 특별 아이템 획득 가능성
        if (Math.random() < 0.3 && gameState.inventory.length < 3) {
            const itemKeys = Object.keys(items);
            const randomItem = items[itemKeys[Math.floor(Math.random() * itemKeys.length)]];
            addItemToInventory(randomItem);
            resultText = `${result} <span class="gold-text">금화 +${goldChange}</span>, ${randomItem.emoji} ${randomItem.name} 획득!`;
            
            // 모달로 보상 표시
            showRewardModal(`${randomItem.emoji} ${randomItem.name} 획득!`, `${result} 금화 ${goldChange}개와 함께 ${randomItem.name}을(를) 획득했습니다!<br><br>${randomItem.description}`);
        } else {
            resultText = `${result} <span class="gold-text">금화 +${goldChange}</span>`;
            
            // 골드 획득 효과음
            playSound('gold');
        }
    } else if (randomValue < successProbability + failureProbability) {
        // 실패
        result = getRandomItem(failureResults);
        
        // 피해량 계산 (방어 아이템이 있으면 피해 감소)
        let damage = Math.floor(Math.random() * 15) + 10;
        
        // 마법사 텔레포트 능력 사용 여부 확인
        if (gameState.playerClass === '마법사' && gameState.canTeleport) {
            // 텔레포트 사용 여부를 물어봄
            if (confirm('⚡ 위험한 상황입니다! 텔레포트 능력을 사용하여 피해를 회피하시겠습니까?')) {
                gameState.canTeleport = false;
                addToLog(`⚡ 텔레포트 능력을 사용하여 위험에서 탈출했습니다!`);
                
                // 텔레포트 효과음
                playSound('teleport');
                
                // 텔레포트 후에는 중립 결과로 변경
                result = getRandomItem(neutralResults);
                resultText = result;
                damage = 0;
                hpChange = 0;
                
                // 층수 증가 후 다음 이벤트 생성
                gameState.floor++;
                addToLog(`${gameState.floor-1}층: ${direction} 문을 열었다. ${resultText}`);
                generateNextEvent();
                updateUI();
                return;
            }
        }
        
        if (gameState.hasShield) {
            damage = Math.floor(damage * 0.5);
            gameState.hasShield = false;
            resultText = `${result} 🛡️ 방어력으로 피해 감소! <span class="damage-text">체력 -${damage}</span>`;
        } else {
            resultText = `${result} <span class="damage-text">체력 -${damage}</span>`;
        }
        
        hpChange = -damage;
        
        // 피해 효과음
        playSound('damage');
    } else {
        // 중립
        result = getRandomItem(neutralResults);
        resultText = result;
        
        // 중립 효과음
        playSound('neutral');
    }
    
    // 층수 증가
    gameState.floor++;
    
    // 상태 업데이트
    gameState.gold += goldChange;
    gameState.hp += hpChange;
    gameState.luck += luckChange;
    
    // 로그에 기록
    const logEntry = `${gameState.floor-1}층: ${direction} 문을 열었다. ${resultText}`;
    addToLog(logEntry);
    
    // 게임 오버 체크
    if (gameState.hp <= 0) {
        gameState.hp = 0;
        gameOver();
    } else if (gameState.floor > 100) {
        // 100층 도달 - 게임 클리어
        elements.description.textContent = "축하합니다! 던전의 모든 층을 클리어했습니다!";
        addToLog("🏆 100층을 클리어했습니다! 던전을 정복했습니다!");
        gameOver(true);
    } else {
        // 다음 이벤트 생성
        generateNextEvent();
    }
    
    // UI 업데이트
    updateUI();
}

// 보스 선택 처리
function handleBossChoice(choice) {
    if (choice === "싸운다") {
        // 보스와 싸우는 경우
        const bossLevel = gameState.floor / 10;
        
        // 보스 피해량 (레벨에 따라 증가)
        let bossDamage = Math.floor(bossLevel * 10) + Math.floor(Math.random() * 10);
        
        // 방어력이 있으면 피해 감소
        if (gameState.hasShield) {
            bossDamage = Math.floor(bossDamage * 0.5);
            gameState.hasShield = false;
            addToLog(`🛡️ 방어의 주문서 효과로 보스의 피해가 감소했습니다.`);
        }
        
        // 보스에게서 피해를 입음
        gameState.hp -= bossDamage;
        
        // 보스 처치 보상 (레벨에 따라 증가)
        const bossGold = Math.floor(bossLevel * 50) + Math.floor(Math.random() * 50);
        gameState.gold += bossGold;
        
        // 층수 증가
        gameState.floor++;
        
        // 로그 기록
        addToLog(`${gameState.floor-1}층: 보스와 싸웠다. ⚔️ 보스를 처치했지만 체력 -${bossDamage}. 💰 금화 +${bossGold} 획득!`);
        
        if (gameState.floor === 101) {
            // 100층 보스 처치 - 게임 클리어
            addToLog("🏆 모든 보스를 처치하고 100층을 클리어했습니다! 던전을 정복했습니다!");
            elements.description.textContent = "축하합니다! 당신은 모든 보스를 처치하고 던전을 정복했습니다!";
            gameOver(true);
        }
    } else {
        // 도망치는 경우
        // 도망치면 체력은 조금만 잃고, 층은 그대로
        const escapeDamage = Math.floor(Math.random() * 10) + 5;
        gameState.hp -= escapeDamage;
        
        // 로그 기록
        addToLog(`${gameState.floor}층: 보스에게서 도망쳤다. 도망치는 과정에서 체력 -${escapeDamage}.`);
    }
    
    // 게임 오버 체크
    if (gameState.hp <= 0) {
        gameState.hp = 0;
        gameOver();
    } else {
        // 다음 이벤트 생성
        generateNextEvent();
    }
    
    // UI 업데이트
    updateUI();
}

// 특별 이벤트 선택 처리 1
function handleEventChoice1() {
    if (!gameState.currentEvent) return;
    
    const event = gameState.currentEvent;
    
    switch(event.type) {
        case "chest":
            handleChestOpen();
            break;
        case "merchant":
            openMerchant();
            break;
        case "portal":
            enterPortal();
            break;
    }
    
    // UI 업데이트
    updateUI();
}

// 특별 이벤트 선택 처리 2 (지나친다)
function handleEventChoice2() {
    if (!gameState.currentEvent) return;
    
    // 이벤트를 지나침
    addToLog(`${gameState.floor}층: 이벤트를 지나쳤습니다.`);
    
    // 층수 증가
    gameState.floor++;
    
    // 다음 이벤트 생성
    generateNextEvent();
    
    // UI 업데이트
    updateUI();
}

// 상자 열기 처리
function handleChestOpen() {
    const randomValue = Math.random();
    
    if (randomValue < 0.7) {
        // 좋은 결과
        const gold = Math.floor(Math.random() * 50) + 30;
        gameState.gold += gold;
        
        // 아이템 획득 가능성
        if (Math.random() < 0.5 && gameState.inventory.length < 3) {
            const itemKeys = Object.keys(items);
            const randomItem = items[itemKeys[Math.floor(Math.random() * itemKeys.length)]];
            addItemToInventory(randomItem);
            addToLog(`${gameState.floor}층: 상자를 열었다. 🎁 금화 +${gold}와 ${randomItem.emoji} ${randomItem.name}을(를) 발견했습니다!`);
        } else {
            addToLog(`${gameState.floor}층: 상자를 열었다. 🎁 금화 +${gold}을 발견했습니다!`);
        }
    } else {
        // 함정
        const damage = Math.floor(Math.random() * 15) + 5;
        
        // 방어력이 있으면 피해 감소
        if (gameState.hasShield) {
            const reducedDamage = Math.floor(damage * 0.5);
            gameState.hp -= reducedDamage;
            gameState.hasShield = false;
            addToLog(`${gameState.floor}층: 상자를 열었다. 💥 함정이었습니다! 🛡️ 방어력으로 피해 감소! 체력 -${reducedDamage}`);
        } else {
            gameState.hp -= damage;
            addToLog(`${gameState.floor}층: 상자를 열었다. 💥 함정이었습니다! 체력 -${damage}`);
        }
    }
    
    // 층수 증가
    gameState.floor++;
    
    // 게임 오버 체크
    if (gameState.hp <= 0) {
        gameState.hp = 0;
        gameOver();
    } else {
        // 다음 이벤트 생성
        generateNextEvent();
    }
}

// 상인 열기
function openMerchant() {
    gameState.isMerchantOpen = true;
    elements.merchant.classList.remove('hidden');
    
    // 상인 아이템 생성
    elements.merchantItems.innerHTML = '';
    
    Object.values(items).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'merchant-item';
        itemElement.textContent = `${item.emoji} ${item.name} (${item.price} 금화)`;
        itemElement.title = item.description;
        
        // 아이템 구매 이벤트
        itemElement.addEventListener('click', () => {
            buyItem(item);
        });
        
        elements.merchantItems.appendChild(itemElement);
    });
    
    // 상인 방문 로그
    addToLog(`${gameState.floor}층: 상인을 만났습니다. 물건을 구경하세요.`);
}

// 포탈 입장
function enterPortal() {
    const portalEffect = Math.random();
    
    if (portalEffect < 0.5) {
        // 좋은 포탈
        const skipFloors = Math.floor(Math.random() * 2) + 1;
        gameState.floor += skipFloors + 1; // +1은 기본 층 증가
        addToLog(`${gameState.floor-skipFloors-1}층: 포탈에 들어갔다. ✨ 포탈이 당신을 ${skipFloors}층 앞으로 이동시켰습니다!`);
    } else if (portalEffect < 0.8) {
        // 중립 포탈
        gameState.floor++;
        const healAmount = Math.floor(Math.random() * 20) + 10;
        gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
        addToLog(`${gameState.floor-1}층: 포탈에 들어갔다. ✨ 포탈에서 치유의 기운이 느껴집니다. 체력 +${healAmount}`);
    } else {
        // 나쁜 포탈
        const damage = Math.floor(Math.random() * 15) + 5;
        gameState.hp -= damage;
        gameState.floor++;
        addToLog(`${gameState.floor-1}층: 포탈에 들어갔다. ⚡ 불안정한 포탈이 당신에게 피해를 줍니다. 체력 -${damage}`);
    }
    
    // 게임 오버 체크
    if (gameState.hp <= 0) {
        gameState.hp = 0;
        gameOver();
    } else {
        // 다음 이벤트 생성
        generateNextEvent();
    }
}

// 아이템 구매
function buyItem(item) {
    if (gameState.gold >= item.price && gameState.inventory.length < 3) {
        // 아이템 구매
        gameState.gold -= item.price;
        addItemToInventory(item);
        addToLog(`${item.emoji} ${item.name}을(를) ${item.price} 금화에 구입했습니다.`);
        updateUI();
    } else if (gameState.gold < item.price) {
        // 금화 부족
        addToLog(`금화가 부족합니다. 필요한 금화: ${item.price}`);
    } else {
        // 인벤토리 가득 참
        addToLog(`인벤토리가 가득 찼습니다. 아이템을 사용해주세요.`);
    }
}

// 인벤토리에 아이템 추가
function addItemToInventory(item) {
    // 아이템 객체 복사 (깊은 복사)
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.use = item.use; // 함수는 별도로 복사
    
    // 인벤토리에 추가
    gameState.inventory.push(newItem);
    
    // 인벤토리 UI 업데이트
    updateInventoryUI();
}

// 인벤토리 UI 업데이트
function updateInventoryUI() {
    // 인벤토리 카운트 업데이트
    elements.inventoryCount.textContent = gameState.inventory.length;
    
    // 인벤토리 아이템 표시
    elements.items.innerHTML = '';
    
    gameState.inventory.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.textContent = `${item.emoji} ${item.name}`;
        itemElement.title = item.description;
        
        // 아이템 사용 이벤트
        itemElement.addEventListener('click', () => {
            useItem(index);
        });
        
        elements.items.appendChild(itemElement);
    });
}

// 아이템 사용
function useItem(index) {
    const item = gameState.inventory[index];
    
    // 아이템 효과 적용
    item.use();
    
    // 인벤토리에서 제거
    gameState.inventory.splice(index, 1);
    
    // 인벤토리 UI 업데이트
    updateInventoryUI();
}

// UI 업데이트
function updateUI() {
    elements.hp.textContent = gameState.hp;
    elements.gold.textContent = gameState.gold;
    elements.luck.textContent = gameState.luck;
    elements.floor.textContent = gameState.floor;
    elements.playerClass.textContent = gameState.playerClass;
    
    // 스탯 원형 게이지 업데이트
    updateStatCircles();
    
    // 인벤토리 업데이트
    updateInventoryUI();
    
    // 특별 이벤트 중에는 선택 버튼 숨기기
    if (gameState.currentEvent) {
        elements.choices.classList.add('hidden');
        elements.eventChoices.classList.remove('hidden');
    } else {
        elements.eventChoices.classList.add('hidden');
        elements.choices.classList.remove('hidden');
    }
    
    // 마법사의 텔레포트 능력 상태 표시
    if (gameState.playerClass === '마법사') {
        const teleportStatus = gameState.canTeleport ? '사용 가능' : '사용 불가';
        // 텔레포트 상태를 어딘가에 표시 (예를 들어 로그나 상태창)
    }
    
    // 캐릭터 클래스 업데이트
    updateCharacterDisplay();
}

// 스탯 원형 게이지 업데이트
function updateStatCircles() {
    // 체력 게이지
    const hpPercent = Math.min(100, Math.max(0, (gameState.hp / gameState.maxHp) * 100));
    elements.hpCircle.style.setProperty('--percent', `${hpPercent}%`);
    
    // 골드 게이지 (최대 300으로 가정)
    const goldPercent = Math.min(100, (gameState.gold / 300) * 100);
    elements.goldCircle.style.setProperty('--percent', `${goldPercent}%`);
    
    // 운 게이지 (최대 50으로 가정)
    const luckPercent = Math.min(100, (gameState.luck / 50) * 100);
    elements.luckCircle.style.setProperty('--percent', `${luckPercent}%`);
}

// 캐릭터 디스플레이 업데이트
function updateCharacterDisplay() {
    // 플레이어 캐릭터 클래스 설정
    if (gameState.playerClass === '전사') {
        elements.playerCharacter.className = 'character-image warrior-character';
    } else if (gameState.playerClass === '도적') {
        elements.playerCharacter.className = 'character-image rogue-character';
    } else if (gameState.playerClass === '마법사') {
        elements.playerCharacter.className = 'character-image wizard-character';
    }
}

// 로그에 추가
function addToLog(message) {
    gameState.log.push(message);
    
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    elements.log.prepend(logEntry);
    
    // 로그가 너무 길어지면 오래된 항목 제거
    if (gameState.log.length > 50) {
        gameState.log.shift();
        if (elements.log.childElementCount > 50) {
            elements.log.removeChild(elements.log.lastChild);
        }
    }
}

// 게임 오버
function gameOver(isWin = false) {
    gameState.isGameOver = true;
    
    elements.finalFloor.textContent = gameState.floor;
    elements.finalGold.textContent = gameState.gold;
    
    elements.gameOver.classList.remove('hidden');
    elements.choice1.disabled = true;
    elements.choice2.disabled = true;
    
    if (isWin) {
        elements.gameOver.style.backgroundColor = '#d4edda';
        elements.gameOver.style.color = '#155724';
        elements.gameOver.style.borderColor = '#c3e6cb';
        elements.gameOver.querySelector('h2').textContent = '던전 클리어!';
    }
}

// 게임 재시작
function restartGame() {
    // 게임 상태 초기화
    gameState.hp = 100;
    gameState.maxHp = 100;
    gameState.gold = 0;
    gameState.luck = 10;
    gameState.floor = 1;
    gameState.isGameOver = false;
    gameState.log = [];
    gameState.inventory = [];
    gameState.playerClass = '';
    gameState.hasShield = false;
    gameState.canTeleport = false;
    gameState.leftPrediction = '';
    gameState.rightPrediction = '';
    
    // UI 초기화
    elements.log.innerHTML = '';
    elements.items.innerHTML = '';
    elements.gameOver.classList.add('hidden');
    elements.choice1.disabled = false;
    elements.choice2.disabled = false;
    elements.description.classList.remove('boss-floor');
    elements.bossCharacter.classList.add('hidden');
    
    // 직업 선택 화면으로 돌아가기
    elements.gameContainer.classList.add('hidden');
    elements.logContainer.classList.add('hidden');
    elements.classSelection.classList.remove('hidden');
}

// 배열에서 무작위 아이템 가져오기
function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// 테마 변경 함수
function changeTheme(theme) {
    // 기존 테마 클래스 제거
    document.body.classList.remove('pastel-theme', 'dark-theme');
    
    // 테마 버튼 액티브 상태 초기화
    elements.defaultTheme.classList.remove('active');
    elements.pastelTheme.classList.remove('active');
    elements.darkTheme.classList.remove('active');
    
    // 선택한 테마 적용
    if (theme === 'pastel') {
        document.body.classList.add('pastel-theme');
        elements.pastelTheme.classList.add('active');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        elements.darkTheme.classList.add('active');
    } else {
        elements.defaultTheme.classList.add('active');
    }
    
    // 테마 저장
    localStorage.setItem('dungeon-theme', theme);
    gameState.theme = theme;
}

// 모달 표시 함수
function showRewardModal(title, content) {
    // 모달 제목과 내용 설정
    const modalHeader = elements.rewardModal.querySelector('.modal-header h3');
    modalHeader.textContent = title;
    elements.rewardContent.innerHTML = content;
    
    // 모달 표시
    elements.rewardModal.classList.add('active');
}

// 모달 닫기 함수
function closeModal() {
    elements.rewardModal.classList.remove('active');
}

// 효과음 재생 함수
function playSound(type) {
    // 오디오 기능은 나중에 구현 가능
    // 예시:
    // const audio = new Audio(`sounds/${type}.mp3`);
    // audio.play();
} 