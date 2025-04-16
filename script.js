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
    theme: 'default',
    bossHp: 0,
    bossMaxHp: 0,
    currentBossIndex: -1,
    inBossFight: false,
    // 캐릭터 스탯 추가
    attack: 10,
    defense: 0,
    equipment: {
        weapon: null,
        armor: null,
        accessory: null
    },
    // 레벨 및 경험치 추가
    level: 1,
    exp: 0,
    maxExp: 100
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

// 챌린지 종류 정의
const challenges = [
    {
        id: 'noHealthPotion',
        name: '회복 금지',
        description: '회복 물약을 사용하지 않고 10층까지 도달하세요.',
        goal: 10,
        reward: {
            gold: 200,
            maxHp: 20
        }
    },
    {
        id: 'lowHealth',
        name: '위험한 모험',
        description: '체력 30% 이하로 5층을 올라가세요.',
        goal: 5,
        reward: {
            luck: 15,
            gold: 150
        }
    },
    {
        id: 'speedRun',
        name: '스피드런',
        description: '15번 이내의 선택으로 15층에 도달하세요.',
        goal: 15,
        maxTurns: 15,
        reward: {
            gold: 300
        }
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
            // 회복 금지 챌린지 중인지 확인
            if (gameState.challengeMode && gameState.challengeType === 'noHealthPotion') {
                addToLog("❌ 회복 금지 챌린지 중에는 회복 물약을 사용할 수 없습니다.");
                return false;
            }
            
            const healAmount = 30;
            gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
            addToLog(`🍖 회복 물약을 사용했습니다. 체력 +${healAmount}`);
            updateUI();
            return true;
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
            return true;
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
            return true;
        }
    }
};

// 장비 아이템 정의
const equipments = {
    // 무기 (공격력 증가)
    weapons: [
        { name: "녹슨 검", type: "weapon", attack: 5, defense: 0, luck: 0, emoji: "🗡️", tier: 1 },
        { name: "쇠검", type: "weapon", attack: 10, defense: 0, luck: 0, emoji: "⚔️", tier: 2 },
        { name: "화염의 대검", type: "weapon", attack: 15, defense: 0, luck: 0, emoji: "🔥", tier: 3 },
        { name: "서리 장검", type: "weapon", attack: 20, defense: 0, luck: 0, emoji: "❄️", tier: 4 },
        { name: "마법 지팡이", type: "weapon", attack: 25, defense: 0, luck: 0, emoji: "🪄", tier: 5 }
    ],
    // 방어구 (방어력 증가)
    armors: [
        { name: "가죽 갑옷", type: "armor", attack: 0, defense: 5, luck: 0, emoji: "👕", tier: 1 },
        { name: "쇠사슬 갑옷", type: "armor", attack: 0, defense: 10, luck: 0, emoji: "🧥", tier: 2 },
        { name: "철제 갑옷", type: "armor", attack: 0, defense: 15, luck: 0, emoji: "🛡️", tier: 3 },
        { name: "미스릴 갑옷", type: "armor", attack: 0, defense: 20, luck: 0, emoji: "✨", tier: 4 },
        { name: "드래곤 비늘 갑옷", type: "armor", attack: 0, defense: 25, luck: 0, emoji: "🐉", tier: 5 }
    ],
    // 악세서리 (운 증가)
    accessories: [
        { name: "행운의 부적", type: "accessory", attack: 0, defense: 0, luck: 5, emoji: "🍀", tier: 1 },
        { name: "보석 목걸이", type: "accessory", attack: 0, defense: 0, luck: 10, emoji: "💎", tier: 2 },
        { name: "마법 반지", type: "accessory", attack: 0, defense: 0, luck: 15, emoji: "💍", tier: 3 },
        { name: "비전의 눈", type: "accessory", attack: 0, defense: 0, luck: 20, emoji: "👁️", tier: 4 },
        { name: "황금 왕관", type: "accessory", attack: 0, defense: 0, luck: 25, emoji: "👑", tier: 5 }
    ]
};

// 직업별 스킬 정의
const skills = {
    '전사': {
        name: '강력한 일격',
        description: '보스에게 강력한 일격을 가하여 큰 피해를 입힙니다.',
        damage: 50,
        cost: 30,
        emoji: '⚔️'
    },
    '도적': {
        name: '치명타 공격',
        description: '보스의 약점을 공격하여 치명타 피해를 입힙니다.',
        damage: 40,
        cost: 25,
        emoji: '🗡️'
    },
    '마법사': {
        name: '화염구',
        description: '강력한 화염구를 발사하여 범위 피해를 입힙니다.',
        damage: 60,
        cost: 40,
        emoji: '��'
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

// 탭 전환 이벤트 리스너
document.getElementById('inventory-tab').addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    this.classList.add('active');
    document.getElementById('inventory-content').classList.add('active');
});

// 게임 시작 시 직업 선택 화면만 표시
function initGame() {
    elements.classSelection.classList.remove('hidden');
    elements.gameContainer.classList.add('hidden');
    elements.logContainer.classList.add('hidden');
    
    // 보스 상태 초기화
    gameState.bossHp = 0;
    gameState.bossMaxHp = 0;
    gameState.currentBossIndex = -1;
    gameState.inBossFight = false;
    
    // 저장된 테마가 있으면 적용
    const savedTheme = localStorage.getItem('dungeon-theme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
}

// 직업 선택 함수
function selectClass(className) {
    console.log("직업 선택됨:", className); // 디버깅 로그
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
    
    // 게임 시작 로그 추가
    addToLog(`🎮 ${className}(으)로 게임을 시작합니다.`);
    
    // 플레이어 클래스 표시
    elements.playerClass.textContent = className;
    
    // 직업 선택 화면 숨기고 게임 화면 표시 - opacity 직접 설정
    elements.classSelection.classList.add('hidden');
    elements.gameContainer.style.opacity = '1';
    elements.gameContainer.classList.remove('hidden');
    elements.gameContainer.classList.remove('fade-out');
    elements.logContainer.classList.remove('hidden');
    
    // UI 초기화
    updateUI();
    
    // 페이드 효과 제거
    elements.gameContainer.style.transition = 'none';
    
    // 다음 이벤트 생성 전에 게임 컨테이너가 보이도록 보장
    setTimeout(() => {
        // 트랜지션 효과 복원
        elements.gameContainer.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
        
        // 첫 이벤트 생성 (층수는 증가시키지 않음)
        const randomEvent = getRandomItem(eventDescriptions);
        elements.description.textContent = `${gameState.floor}층: ${randomEvent}`;
        elements.choice1.textContent = "왼쪽 문 열기";
        elements.choice2.textContent = "오른쪽 문 열기";
        
        // 버튼 활성화 확인
        elements.choice1.disabled = false;
        elements.choice2.disabled = false;
        
        // 마법사인 경우 텔레포트 능력 표시
        if (gameState.playerClass === '마법사' && gameState.canTeleport) {
            elements.choice1.innerHTML += `<span class="teleport-available">⚡ 텔레포트 가능</span>`;
            elements.choice2.innerHTML += `<span class="teleport-available">⚡ 텔레포트 가능</span>`;
        }
    }, 100);
}

// 버튼 이벤트 리스너
elements.choice1.addEventListener('click', () => handleChoice('왼쪽'));
elements.choice2.addEventListener('click', () => handleChoice('오른쪽'));
elements.eventChoice1.addEventListener('click', handleEventChoice1);
elements.eventChoice2.addEventListener('click', handleEventChoice2);
elements.restartButton.addEventListener('click', restartGame);

// 다음 층 이벤트 생성
function generateNextEvent() {
    console.log("다음 이벤트 생성, 현재 층:", gameState.floor); // 디버깅 로그
    
    // 페이드 효과 적용 - 오류 방지를 위해 직접 opacity 조작
    elements.gameContainer.style.opacity = '0';
    elements.gameContainer.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        // 현재 이벤트 초기화
        gameState.currentEvent = null;
        elements.eventChoices.classList.add('hidden');
        elements.choices.classList.remove('hidden');
        
        // 보스 전투 상태 초기화
        gameState.inBossFight = false;
        
        // 상인 UI 숨기기
        elements.merchant.classList.add('hidden');
        gameState.isMerchantOpen = false;
        
        // 보스 캐릭터 숨기기 및 플레이어 캐릭터 표시
        elements.bossCharacter.classList.add('hidden');
        elements.playerCharacter.classList.remove('hidden');
        
        // 보스 체력 컨테이너 숨기기
        const bossHpContainer = document.getElementById('boss-hp-container');
        if (bossHpContainer) {
            bossHpContainer.classList.add('hidden');
        }
        
        // 버튼 초기화 - 모든 버튼 보이게
        elements.choice1.style.visibility = 'visible';
        elements.choice2.style.visibility = 'visible';
        
        // 보스 층 체크
        if (gameState.floor % 10 === 0 && gameState.floor <= 100) {
            // 보스층
            const bossIndex = (gameState.floor / 10) - 1;
            gameState.currentBossIndex = bossIndex;
            gameState.inBossFight = true;
            
            // 보스 체력 설정 (레벨에 따라 증가) - 체력을 절반으로 줄임
            const bossLevel = gameState.floor / 10;
            gameState.bossMaxHp = Math.floor(bossLevel * 50); // 100에서 50으로 변경
            gameState.bossHp = gameState.bossMaxHp;
            
            // 보스 캐릭터 표시
            elements.bossCharacter.classList.remove('hidden');
            elements.bossCharacter.classList.remove('boss-wounded', 'boss-critical', 'boss-hit');
            elements.bossCharacter.style.transform = 'scale(1)';
            
            // 보스 체력 바 표시
            const bossHpContainer = document.getElementById('boss-hp-container');
            if (bossHpContainer) {
                bossHpContainer.classList.remove('hidden');
                
                // 보스 체력 값 초기화
                const bossHpValue = document.getElementById('boss-hp-value');
                const bossMaxHp = document.getElementById('boss-max-hp');
                
                if (bossHpValue && bossMaxHp) {
                    bossHpValue.textContent = gameState.bossHp;
                    bossMaxHp.textContent = gameState.bossMaxHp;
                }
                
                // 보스 체력 바 초기화
                const bossHpFill = bossHpContainer.querySelector('.boss-hp-fill');
                if (bossHpFill) {
                    bossHpFill.style.width = '100%';
                    bossHpFill.style.background = 'linear-gradient(to right, #ff3838, #ff5252)';
                    bossHpFill.style.animation = 'none';
                }
            }
            
            elements.description.innerHTML = `<span class="boss-warning">⚠️ 보스 층 ⚠️</span><br>${bossDescriptions[bossIndex]}`;
            elements.description.classList.add('boss-floor');
            
            // 보스와 싸우기 & 스킬 사용 버튼 표시
            const playerSkill = skills[gameState.playerClass];
            showChoices(`보스 공격하기`, `${playerSkill.emoji} ${playerSkill.name} (${playerSkill.cost} 금화)`);
            
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
            
            // 초기 체력 바 업데이트
            updateBossHpBar();
            
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
        
        // 페이드 효과 제거 - 직접 스타일 조작
        elements.gameContainer.style.opacity = '1';
        elements.gameContainer.style.transform = 'translateY(0)';
        
        // 게임 컨테이너가 확실히 보이도록 클래스 정리
        elements.gameContainer.classList.remove('hidden');
        elements.gameContainer.classList.remove('fade-out');
        
    }, 500); // 페이드 아웃 지연 시간
}

// 선택 버튼 텍스트 변경
function showChoices(choice1Text, choice2Text) {
    // 버튼 텍스트 설정 (비어있으면 기본값 사용)
    elements.choice1.textContent = choice1Text || "선택 1";
    elements.choice2.textContent = choice2Text || "선택 2";
    
    // 버튼이 항상 보이도록 설정
    elements.choice1.style.visibility = 'visible';
    elements.choice2.style.visibility = 'visible';
}

// 선택 처리 함수
function handleChoice(direction) {
    if (gameState.isGameOver) return;
    
    // 효과음 재생
    playSound('button');
    
    // 보스 층 체크
    if (gameState.inBossFight) {
        // 보스와의 전투는 방향에 따라 처리
        if (direction === '왼쪽') {
            // 왼쪽 버튼 - 일반 공격
            handleBossAttack(false);
        } else {
            // 오른쪽 버튼 - 스킬 공격
            handleBossAttack(true);
        }
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
            resultText = `${result} 금화 +${goldChange}, ${randomItem.emoji} ${randomItem.name} 획득!`;
            
            // 모달로 보상 표시
            showRewardModal(`${randomItem.emoji} ${randomItem.name} 획득!`, `${result} 금화 ${goldChange}개와 함께 ${randomItem.name}을(를) 획득했습니다!<br><br>${randomItem.description}`);
        } else {
            resultText = `${result} 금화 +${goldChange}`;
            
            // 골드 획득 효과음
            playSound('gold');
        }
    } else if (randomValue < successProbability + failureProbability) {
        // 실패
        result = getRandomItem(failureResults);
        
        // 피해량 계산 (방어력이 있으면 피해 감소)
        let damage = Math.floor(Math.random() * 15) + 10;
        
        // 마법사 텔레포트 능력 사용 여부 확인
        if (gameState.playerClass === '마법사' && gameState.canTeleport) {
            // 텔레포트 사용 여부를 물어봄
            if (confirm('⚡ 위험한 상황입니다! 텔레포트 능력을 사용하여 피해를 회피하시겠습니까?')) {
                gameState.canTeleport = false;
                addToLog(`⚡ 텔레포트 능력을 사용하여 위험에서 탈출했습니다!`);
                
                // 텔레포트 효과음
                playSound('teleport');
                
                // 텔레포트 후 결과 변경
                result = getRandomItem(neutralResults);
                resultText = result;
                
                // 로그 기록 및 방향 처리
                addToLog(`${gameState.floor}층: ${direction} 문을 열었다. ${resultText}`);
                chooseDirection(direction);
                
                // UI 업데이트 및 다음 이벤트
                generateNextEvent();
                updateUI();
                return;
            }
        }
        
        if (gameState.hasShield) {
            damage = Math.floor(damage * 0.5);
            gameState.hasShield = false;
            resultText = `${result} 🛡️ 방어력으로 피해 감소! 체력 -${damage}`;
        } else {
            resultText = `${result} 체력 -${damage}`;
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
    
    // 상태 업데이트
    gameState.gold += goldChange;
    gameState.hp += hpChange;
    gameState.luck += luckChange;
    
    // 현재 층 표시
    const currentFloor = gameState.floor;
    
    // 로그에 기록
    const logEntry = `${currentFloor}층: ${direction} 문을 열었다. ${resultText}`;
    addToLog(logEntry);
    
    // 방향으로 이동
    chooseDirection(direction);
    
    // 일반 층 클리어 시 경험치 획득 (5 경험치)
    addExperience(5);
    
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

// 보스 공격 처리 함수
function handleBossAttack(useSkill) {
    if (!gameState.inBossFight) return;
    
    // 기본 공격력에 플레이어의 공격력 스탯 추가
    let damage = Math.floor(Math.random() * 10) + 10 + Math.floor(gameState.attack * 0.5);
    let goldCost = 0;
    let skillText = '';
    
    // 스킬 사용 시 추가 효과
    if (useSkill && gameState.gold >= skills[gameState.playerClass].cost) {
        // 골드 소모
        goldCost = skills[gameState.playerClass].cost;
        gameState.gold -= goldCost;
        
        // 스킬 별 추가 데미지
        const playerSkill = skills[gameState.playerClass];
        damage += playerSkill.damage;
        skillText = `<br>${playerSkill.emoji} ${playerSkill.name} (${playerSkill.cost} 금화)`
        
        addToLog(`${playerSkill.emoji} ${gameState.playerClass}의 특수 기술을 사용했습니다. (${goldCost} 금화 소모)`);
    }
    
    // 이전 체력 저장
    const oldHp = gameState.bossHp;
    
    // 보스 체력 감소
    gameState.bossHp = Math.max(0, gameState.bossHp - damage);
    
    // 보스 피격 효과
    elements.bossCharacter.classList.add('boss-hit');
    setTimeout(() => {
        elements.bossCharacter.classList.remove('boss-hit');
    }, 500);
    
    // 데미지 텍스트 표시 애니메이션
    showBossDamage(damage);
    
    // 보스 체력 바 업데이트 - 애니메이션 효과 적용
    updateBossHpBar(oldHp);
    
    let resultText = '';
    
    // 골드 소모 텍스트
    if (goldCost > 0) {
        resultText += `<span class="gold-text">-${goldCost} 금화</span><br>`;
    }
    
    // 데미지 텍스트
    resultText += `보스에게 <span class="damage-text">${damage} 데미지</span>를 입혔습니다!${skillText}`;
    
    // 보스 처치 확인
    if (gameState.bossHp <= 0) {
        // 보스 체력을 명시적으로 0으로 설정
        gameState.bossHp = 0;
        
        // 체력바 즉시 업데이트 - 상태 변경 후 즉시 호출
        updateBossHpBar(0); // 명시적으로 0 전달
        
        // 보스 처치 보상
        const bossLevel = gameState.floor / 10;
        const goldReward = bossLevel * 100;
        
        gameState.gold += goldReward;
        
        addToLog(`🏆 ${bossLevel * 10}층의 보스를 처치했습니다!`);
        
        // 보스 처치 후 장비 아이템 획득
        const equipment = getBossEquipment(bossLevel);
        equipItem(equipment);
        
        // 보스 처치 시 경험치 획득 (보스 레벨 * 10 경험치)
        addExperience(bossLevel * 20);
        
        // 랜덤 체력 회복 (60% 확률)
        let healText = '';
        if (Math.random() < 0.6) {
            // 최대 체력의 20~40% 회복
            const healPercent = 20 + Math.floor(Math.random() * 21); // 20~40%
            const healAmount = Math.floor(gameState.maxHp * (healPercent / 100));
            
            // 체력 회복 (최대 체력 초과 방지)
            const oldHp = gameState.hp;
            gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
            const actualHeal = gameState.hp - oldHp;
            
            // 체력 회복 로그 추가
            addToLog(`💖 승리의 기운으로 체력이 ${actualHeal} 회복되었습니다!`);
            
            // 체력 회복 텍스트
            healText = `<br><span class="heal-text">💖 승리의 기운: +${actualHeal} 체력 회복!</span>`;
        }
        
        // 보스 처치 후 텍스트 추가
        resultText += `<br><br><span class="gold-text">보스를 처치했습니다!</span><br>보상: <span class="gold-text">+${goldReward} 금화</span>`;
        resultText += `<br><span class="equipment-text">${equipment.emoji} ${equipment.name} 획득!</span>`;
        resultText += `<br><span class="exp-text">✨ ${bossLevel * 20} 경험치 획득!</span>${healText}<br><br>`;
        resultText += `<button id="continue-btn" class="modal-close">계속하기</button>`;
        
        elements.description.innerHTML = resultText;
        
        // 계속하기 버튼 이벤트
        setTimeout(() => {
            const continueBtn = document.getElementById('continue-btn');
            if (continueBtn) {
                continueBtn.onclick = function() {
                    // 직접 다음 이벤트 생성
                    gameState.floor += 1;
                    addToLog(`${gameState.floor}층으로 올라갑니다.`);
                    
                    // 보스 전투 종료 처리
                    gameState.inBossFight = false;
                    
                    // 보스 캐릭터 숨기기
                    elements.bossCharacter.classList.add('hidden');
                    
                    // 보스 체력 바 숨기기
                    const bossHpContainer = document.getElementById('boss-hp-container');
                    if (bossHpContainer) {
                        bossHpContainer.classList.add('hidden');
                    }
                    
                    // 효과음 재생
                    playSound('stair');
                    
                    // 버튼 다시 표시
                    elements.choice1.style.visibility = 'visible';
                    elements.choice2.style.visibility = 'visible';
                    
                    // 다음 이벤트 생성
                    generateNextEvent();
                    updateUI();
                };
            }
        }, 100);
        
        // 버튼 숨기기
        elements.choice1.style.visibility = 'hidden';
        elements.choice2.style.visibility = 'hidden';
        
        // 보스를 처치했을 때는 더 이상 진행하지 않고 여기서 함수 종료
        return;
    }
    
    // 보스 턴 - 플레이어 데미지
    const bossLevel = gameState.floor / 10;
    let bossDamage = Math.floor(Math.random() * 10) + 5 + bossLevel * 2;
    
    // 방어력에 따른 데미지 감소 (방어력의 30%만큼 감소)
    const damageReduction = Math.floor(gameState.defense * 0.3);
    bossDamage = Math.max(1, bossDamage - damageReduction);
    
    gameState.hp -= bossDamage;
    updateUI();
    
    // 결과 텍스트에 보스 공격 추가
    resultText += `<br><br>보스가 반격하여 <span class="damage-text">${bossDamage} 데미지</span>를 입혔습니다!`;
    if (damageReduction > 0) {
        resultText += `<br><span class="defense-text">방어력으로 ${damageReduction} 데미지 감소!</span>`;
    }
    
    // 게임오버 확인
    if (gameState.hp <= 0) {
        gameOver();
        return;
    }
    
    // 결과 표시
    elements.description.innerHTML = resultText;
    
    // 효과음 재생
    playSound('attack');
}

// 보스 데미지 시각화 함수
function showBossDamage(damage) {
    // 보스 이미지에 데미지 팝업 추가
    const bossCharacter = elements.bossCharacter;
    if (!bossCharacter) return;
    
    // 데미지 팝업 요소 생성
    const damagePopup = document.createElement('div');
    damagePopup.className = 'damage-popup';
    damagePopup.textContent = `-${damage}`;
    
    // 보스 캐릭터 위치 기준으로 랜덤한 위치에 표시
    const rect = bossCharacter.getBoundingClientRect();
    const randomX = rect.left + Math.random() * rect.width;
    const randomY = rect.top + Math.random() * (rect.height * 0.7); // 상단 70% 영역에만 표시
    
    // 위치 설정
    damagePopup.style.left = `${randomX}px`;
    damagePopup.style.top = `${randomY}px`;
    
    // 문서에 추가
    document.body.appendChild(damagePopup);
    
    // 일정 시간 후 제거
    setTimeout(() => {
        if (damagePopup.parentNode) {
            damagePopup.parentNode.removeChild(damagePopup);
        }
    }, 1000);
    
    // 보스 체력 상태에 따른 시각 효과
    const healthPercent = (gameState.bossHp / gameState.bossMaxHp) * 100;
    
    // 보스 체력 상태에 따른 클래스 조정
    bossCharacter.classList.remove('boss-wounded', 'boss-critical');
    
    if (healthPercent < 30) {
        // 30% 미만 - 치명적 상태
        bossCharacter.classList.add('boss-critical');
    } else if (healthPercent < 60) {
        // 60% 미만 - 부상 상태
        bossCharacter.classList.add('boss-wounded');
    }
}

// 보스 체력 바 업데이트 (애니메이션 효과 추가)
function updateBossHpBar(oldHp = null) {
    if (!gameState.inBossFight) return;
    
    const bossHpContainer = document.getElementById('boss-hp-container');
    if (!bossHpContainer) return;
    
    const bossHpValue = document.getElementById('boss-hp-value');
    const bossMaxHp = document.getElementById('boss-max-hp');
    const bossHpFill = bossHpContainer.querySelector('.boss-hp-fill');
    
    if (!bossHpValue || !bossMaxHp || !bossHpFill) return;
    
    const hpPercent = Math.max(0, Math.min(100, (gameState.bossHp / gameState.bossMaxHp) * 100));
    
    // 체력 바 업데이트
    if (bossHpFill) {
        // 애니메이션 효과를 위해 transition 적용
        bossHpFill.style.transition = 'width 0.5s ease-in-out, background 0.5s';
        bossHpFill.style.width = `${hpPercent}%`;
        
        // 체력이 절반 이하면 색상 변경
        if (hpPercent < 50) {
            bossHpFill.style.background = 'linear-gradient(to right, #ff0000, #ff3838)';
        }
        // 체력이 25% 이하면 더 강한 색상 변경 및 효과
        if (hpPercent < 25) {
            bossHpFill.style.background = 'linear-gradient(to right, #b30000, #ff0000)';
            bossHpFill.style.animation = 'pulse-hp 1s infinite';
        } else {
            bossHpFill.style.animation = 'none';
        }
    }
    
    // 체력 텍스트 업데이트
    if (bossHpValue && bossMaxHp) {
        bossMaxHp.textContent = gameState.bossMaxHp;
        
        // 애니메이션 효과 적용
        if (oldHp !== null) {
            animateNumber(bossHpValue, oldHp, gameState.bossHp, 500);
        } else {
            bossHpValue.textContent = Math.max(0, gameState.bossHp);
        }
    }
    
    // 보스 캐릭터도 체력에 따라 효과 업데이트
    updateBossVisual(hpPercent);
}

// 숫자 애니메이션 함수 (점진적으로 변경되는 효과)
function animateNumber(element, start, end, duration) {
    if (!element) return;
    
    // end가 0 이하이면 즉시 0으로 설정하고 리턴
    if (end <= 0) {
        element.textContent = '0';
        return;
    }
    
    const startTime = performance.now();
    const change = end - start;
    
    function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime > duration) {
            element.textContent = Math.round(end);
            return;
        }
        
        const progress = elapsedTime / duration;
        const currentValue = start + change * progress;
        element.textContent = Math.round(currentValue);
        
        requestAnimationFrame(updateNumber);
    }
    
    requestAnimationFrame(updateNumber);
}

// 보스 체력 변화 시각적 효과
function updateBossVisual(hpPercent) {
    const bossCharacter = document.getElementById('boss-character');
    
    if (!bossCharacter) return;
    
    // 체력에 따라 보스 시각 효과 변경
    if (hpPercent < 50) {
        bossCharacter.classList.add('boss-wounded');
    }
    
    if (hpPercent < 25) {
        bossCharacter.classList.add('boss-critical');
    } else {
        bossCharacter.classList.remove('boss-critical');
    }
    
    // 보스 체력에 따른 크기 조정
    const scaleValue = 0.5 + (hpPercent / 100) * 0.5; // 50%~100% 스케일
    bossCharacter.style.transform = `scale(${scaleValue})`;
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
    
    // 다음 이벤트 생성 (층수는 이미 증가함)
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
    
    // 층수 증가를 chooseDirection으로 처리
    chooseDirection("상자");
    
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
    
    if (portalEffect < 0.4) {
        // 좋은 포탈 (앞으로 이동)
        const skipFloors = Math.floor(Math.random() * 3) + 2; // 2~4층 앞으로 이동
        const currentFloor = gameState.floor;
        gameState.floor += skipFloors;
        addToLog(`${currentFloor}층: 포탈에 들어갔다. ✨ 포탈이 당신을 ${skipFloors}층 앞으로 이동시켰습니다!`);
    } else if (portalEffect < 0.7) {
        // 중립 포탈 (치유 효과)
        const healAmount = Math.floor(Math.random() * 20) + 10;
        gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
        // 중립 포탈은 1층만 앞으로 이동
        gameState.floor++;
        addToLog(`${gameState.floor-1}층: 포탈에 들어갔다. ✨ 포탈에서 치유의 기운이 느껴집니다. 체력 +${healAmount}`);
        addToLog(`포탈을 통해 ${gameState.floor}층으로 이동합니다.`);
    } else {
        // 나쁜 포탈 (뒤로 이동 또는 피해)
        if (gameState.floor > 2 && Math.random() < 0.6) {
            // 뒤로 이동 (1층 아래로는 내려가지 않음)
            const backFloors = Math.floor(Math.random() * 2) + 1; // 1~2층 뒤로
            const currentFloor = gameState.floor;
            gameState.floor = Math.max(1, gameState.floor - backFloors);
            addToLog(`${currentFloor}층: 포탈에 들어갔다. ⚡ 불안정한 포탈이 당신을 ${backFloors}층 뒤로 이동시켰습니다!`);
        } else {
            // 피해
            const damage = Math.floor(Math.random() * 15) + 5;
            gameState.hp -= damage;
            // 피해를 입히는 포탈은 그래도 1층 앞으로 이동
            gameState.floor++;
            addToLog(`${gameState.floor-1}층: 포탈에 들어갔다. ⚡ 불안정한 포탈이 당신에게 피해를 줍니다. 체력 -${damage}`);
            addToLog(`포탈을 통해 ${gameState.floor}층으로 이동합니다.`);
        }
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

// 인벤토리에 아이템 추가
function addItemToInventory(item) {
    // 인벤토리에 공간이 있는지 확인
    if (gameState.inventory.length < 3) {
        // 새 객체 생성하여 추가
        const newItem = {
            name: item.name,
            description: item.description,
            price: item.price,
            emoji: item.emoji,
            use: item.use
        };
        
        // 인벤토리에 추가
        gameState.inventory.push(newItem);
        
        // 로그에 기록
        addToLog(`${item.emoji} ${item.name}을(를) 획득했습니다.`);
        
        // 인벤토리 UI 업데이트
        updateInventoryUI();
        return true;
    } else {
        // 인벤토리가 가득 찼을 때
        addToLog("인벤토리가 가득 찼습니다.");
        return false;
    }
}

// 인벤토리 UI 업데이트
function updateInventoryUI() {
    // 인벤토리 카운트 업데이트
    elements.inventoryCount.textContent = gameState.inventory.length;
    
    // 인벤토리 아이템 표시
    elements.items.innerHTML = '';
    
    if (gameState.inventory.length === 0) {
        elements.items.innerHTML = '<div class="empty-inventory">아이템이 없습니다.</div>';
        return;
    }
    
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
    // 인벤토리에서 아이템 가져오기
    const item = gameState.inventory[index];
    
    // 아이템이 있으면 사용
    if (item && item.use) {
        // 아이템 사용 효과 적용
        const result = item.use();
        
        // 사용 성공 시 인벤토리에서 제거
        if (result !== false) {
            gameState.inventory.splice(index, 1);
            updateInventoryUI();
        }
    }
}

// 아이템 구매
function buyItem(item) {
    if (gameState.gold >= item.price) {
        // 인벤토리 공간 확인
        if (gameState.inventory.length < 3) {
            // 아이템 구매
            gameState.gold -= item.price;
            addItemToInventory(item);
            addToLog(`${item.emoji} ${item.name}을(를) ${item.price} 금화에 구입했습니다.`);
            updateUI();
        } else {
            // 인벤토리가 가득 참
            addToLog("인벤토리가 가득 찼습니다. 아이템을 사용해주세요.");
        }
    } else {
        // 금화 부족
        addToLog(`금화가 부족합니다. 필요한 금화: ${item.price}`);
    }
}

// UI 업데이트
function updateUI() {
    elements.hp.textContent = gameState.hp;
    elements.gold.textContent = gameState.gold;
    elements.luck.textContent = gameState.luck;
    elements.floor.textContent = gameState.floor;
    elements.playerClass.textContent = gameState.playerClass;
    
    // 공격력과 방어력 업데이트
    if (document.getElementById('attack')) {
        document.getElementById('attack').textContent = gameState.attack;
    }
    if (document.getElementById('defense')) {
        document.getElementById('defense').textContent = gameState.defense;
    }
    
    // 레벨과 경험치 업데이트
    if (document.getElementById('level')) {
        document.getElementById('level').textContent = gameState.level;
    }
    if (document.getElementById('exp')) {
        document.getElementById('exp').textContent = gameState.exp;
    }
    if (document.getElementById('exp-max')) {
        document.getElementById('exp-max').textContent = gameState.maxExp;
    }
    
    // 경험치 바 업데이트
    const expBar = document.getElementById('exp-bar');
    if (expBar) {
        const expPercent = (gameState.exp / gameState.maxExp) * 100;
        expBar.style.width = `${expPercent}%`;
    }
    
    // 스탯 원형 게이지 업데이트
    updateStatCircles();
    
    // 인벤토리 업데이트
    updateInventoryUI();
    
    // 장비 정보 업데이트
    updateEquipmentInfo();
    
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
    // HTML 태그를 제거하는 함수
    function stripHtml(html) {
        // span 태그와 그 내용 추출
        const spanRegex = /<span class="[^"]*">([^<]*)<\/span>/g;
        return html.replace(spanRegex, "$1");
    }
    
    // HTML 태그 제거된 메시지 생성
    const cleanMessage = stripHtml(message);
    
    // 로그에 추가
    gameState.log.push(cleanMessage);
    
    const logEntry = document.createElement('p');
    logEntry.textContent = cleanMessage;
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
    gameState.bossHp = 0;
    gameState.bossMaxHp = 0;
    gameState.currentBossIndex = -1;
    gameState.inBossFight = false;
    gameState.attack = 10;
    gameState.defense = 0;
    gameState.equipment = {
        weapon: null,
        armor: null,
        accessory: null
    };
    gameState.level = 1;
    gameState.exp = 0;
    gameState.maxExp = 100;
    
    // UI 초기화
    elements.log.innerHTML = '';
    elements.items.innerHTML = '';
    elements.gameOver.classList.add('hidden');
    elements.choice1.disabled = false;
    elements.choice2.disabled = false;
    elements.description.classList.remove('boss-floor');
    elements.bossCharacter.classList.add('hidden');
    elements.bossCharacter.classList.remove('boss-wounded', 'boss-critical', 'boss-hit');
    elements.bossCharacter.style.transform = 'scale(1)';
    
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

// 방향 선택 처리
function chooseDirection(direction) {
    // 상인이 열려 있을 때 닫기
    if (gameState.isMerchantOpen) {
        elements.merchant.classList.add('hidden');
        gameState.isMerchantOpen = false;
        return;
    }
    
    // 보스전 중이 아닐 때만 층수 증가
    if (!gameState.inBossFight) {
        gameState.floor += 1;
        addToLog(`${gameState.floor}층으로 올라갑니다.`);
        
        // 층 변경에 따른 효과음
        playSound('stair');
    }
}

// 보스 처치 후 장비 아이템 획득 함수
function getBossEquipment(bossLevel) {
    // 보스 레벨에 따라 장비 티어 결정 (1-5)
    const tier = Math.min(5, Math.max(1, Math.ceil(bossLevel / 2)));
    
    // 장비 타입 랜덤 선택 (무기, 방어구, 악세서리)
    const equipType = Math.floor(Math.random() * 3);
    let equipment;
    
    switch(equipType) {
        case 0: // 무기
            equipment = equipments.weapons.find(w => w.tier === tier);
            break;
        case 1: // 방어구
            equipment = equipments.armors.find(a => a.tier === tier);
            break;
        case 2: // 악세서리
            equipment = equipments.accessories.find(a => a.tier === tier);
            break;
    }
    
    return equipment;
}

// 장비 장착 함수
function equipItem(equipment) {
    // 이미 같은 타입의 장비를 장착 중인지 확인
    const oldEquipment = gameState.equipment[equipment.type];
    
    // 기존 장비가 있으면 스탯 제거
    if (oldEquipment) {
        gameState.attack -= oldEquipment.attack || 0;
        gameState.defense -= oldEquipment.defense || 0;
        gameState.luck -= oldEquipment.luck || 0;
    }
    
    // 새 장비 장착 및 스탯 적용
    gameState.equipment[equipment.type] = equipment;
    gameState.attack += equipment.attack || 0;
    gameState.defense += equipment.defense || 0;
    gameState.luck += equipment.luck || 0;
    
    // 로그에 기록
    addToLog(`${equipment.emoji} ${equipment.name}을(를) 장착했습니다.`);
}

// 장비 정보 표시 함수
function updateEquipmentInfo() {
    // 장비 슬롯 참조
    const weaponSlot = document.querySelector('#weapon-slot');
    const armorSlot = document.querySelector('#armor-slot');
    const accessorySlot = document.querySelector('#accessory-slot');
    
    // 무기 정보 업데이트
    if (weaponSlot) {
        const weapon = gameState.equipment.weapon;
        if (weapon) {
            weaponSlot.innerHTML = `
                <div class="slot-name">무기</div>
                <div class="equipment-item">
                    ${weapon.emoji} ${weapon.name}<br>
                    <span class="equipment-stats">공격력 +${weapon.attack}</span>
                </div>
            `;
        } else {
            weaponSlot.innerHTML = `
                <div class="slot-name">무기</div>
                <div class="slot-empty">비어 있음</div>
            `;
        }
    }
    
    // 방어구 정보 업데이트
    if (armorSlot) {
        const armor = gameState.equipment.armor;
        if (armor) {
            armorSlot.innerHTML = `
                <div class="slot-name">방어구</div>
                <div class="equipment-item">
                    ${armor.emoji} ${armor.name}<br>
                    <span class="equipment-stats">방어력 +${armor.defense}</span>
                </div>
            `;
        } else {
            armorSlot.innerHTML = `
                <div class="slot-name">방어구</div>
                <div class="slot-empty">비어 있음</div>
            `;
        }
    }
    
    // 악세서리 정보 업데이트
    if (accessorySlot) {
        const accessory = gameState.equipment.accessory;
        if (accessory) {
            accessorySlot.innerHTML = `
                <div class="slot-name">장신구</div>
                <div class="equipment-item">
                    ${accessory.emoji} ${accessory.name}<br>
                    <span class="equipment-stats">운 +${accessory.luck}</span>
                </div>
            `;
        } else {
            accessorySlot.innerHTML = `
                <div class="slot-name">장신구</div>
                <div class="slot-empty">비어 있음</div>
            `;
        }
    }
}

// 경험치 획득 및 레벨업 처리 함수
function addExperience(amount) {
    // 경험치 획득
    gameState.exp += amount;
    addToLog(`✨ 경험치 +${amount} 획득했습니다.`);
    
    // 레벨업 체크
    if (gameState.exp >= gameState.maxExp) {
        // 레벨업
        gameState.level += 1;
        gameState.exp -= gameState.maxExp;
        
        // 다음 레벨업에 필요한 경험치 증가 (100 + 레벨당 50씩 증가)
        gameState.maxExp = 100 + (gameState.level - 1) * 50;
        
        // 레벨업 보상 (체력, 공격력, 방어력 증가)
        gameState.maxHp += 10;  // 20에서 10으로 감소
        gameState.hp = Math.min(gameState.hp + gameState.maxHp * 0.3, gameState.maxHp); // 부분 회복으로 변경
        gameState.attack += 2;  // 5에서 2로 감소
        gameState.defense += 1; // 3에서 1로 감소
        
        // 레벨업 로그 추가
        addToLog(`🎉 레벨 ${gameState.level}로 상승했습니다!`);
        addToLog(`💪 최대 체력 +10, 공격력 +2, 방어력 +1 증가!`);
        addToLog(`다음 레벨업까지 필요한 경험치: ${gameState.maxExp}`);
        
        // 레벨업 효과음 및 애니메이션
        playSound('levelup');
        
        // 레벨업 알림 표시
        showLevelUpNotification();
    }
    
    // UI 업데이트
    updateUI();
}

// 레벨업 알림 표시 함수
function showLevelUpNotification() {
    // 레벨업 메시지 요소 생성
    const levelupMsg = document.createElement('div');
    levelupMsg.className = 'levelup-message';
    levelupMsg.textContent = `레벨 ${gameState.level} 달성!`;
    
    // 문서에 추가
    document.body.appendChild(levelupMsg);
    
    // 일정 시간 후 제거
    setTimeout(() => {
        if (levelupMsg.parentNode) {
            levelupMsg.parentNode.removeChild(levelupMsg);
        }
    }, 3000);
}

// 추가 CSS 스타일 정의
const style = document.createElement('style');
style.textContent = `
    .heal-text {
        color: #2ecc71;
        font-weight: bold;
        text-shadow: 0 0 2px rgba(46, 204, 113, 0.5);
        animation: heal-pulse 1.5s ease-in-out;
    }
    
    @keyframes heal-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .equipment-text {
        color: #9b59b6;
        font-weight: bold;
    }
    
    .defense-text {
        color: #3498db;
        font-weight: bold;
    }
    
    .levelup-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(46, 204, 113, 0.9);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 24px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(46, 204, 113, 0.7);
        animation: levelup-anim 3s ease-in-out;
    }
    
    @keyframes levelup-anim {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        10% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
    
    .exp-bar-fill {
        height: 100%;
        background: linear-gradient(to right, #3498db, #2ecc71);
        width: 0%;
        transition: width 0.5s ease-in-out;
        border-radius: 5px;
    }
`;
document.head.appendChild(style); 