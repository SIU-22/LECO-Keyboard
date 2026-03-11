// ==================== البيانات المخزنة ====================
let userData = {
    points: localStorage.getItem('typingPoints') ? parseInt(localStorage.getItem('typingPoints')) : 0,
    speedHistory: JSON.parse(localStorage.getItem('speedHistory')) || [],
    accuracyHistory: JSON.parse(localStorage.getItem('accuracyHistory')) || [],
    achievements: JSON.parse(localStorage.getItem('achievements')) || [],
    completedLessons: JSON.parse(localStorage.getItem('completedLessons')) || [],
    currentLanguage: localStorage.getItem('currentLanguage') || 'arabic'
};

// ==================== بيانات الإنجازات ====================
const achievements = [
    { id: 1, name: "البداية", description: "أكمل أول درس", icon: "🎯", earned: false },
    { id: 2, name: "سرعة 20", description: "حقق سرعة 20 كلمة في الدقيقة", icon: "⚡", earned: false },
    { id: 3, name: "الدقة 95%", description: "حقق دقة 95% في تمرين", icon: "🎯", earned: false },
    { id: 4, name: "المثابرة", description: "أكمل 5 دروس", icon: "🏃", earned: false },
    { id: 5, name: "المحترف", description: "حقق سرعة 50 كلمة في الدقيقة", icon: "👑", earned: false },
    { id: 6, name: "الكمال", description: "أكمل تمرين بدون أخطاء", icon: "💯", earned: false }
];

// ==================== نصوص للتدريب باللغتين (بدون تشكيل) ====================
const trainingTexts = {
    arabic: {
        easy: [
            "السلام عليكم",
            "كيف حالك",
            "اهلا وسهلا",
            "مرحبا بكم",
            "صباح الخير",
            "مساء النور",
            "تصبح على خير",
            "مع السلامة",
            "شكرا جزيلا",
            "عفوا"
        ],
        medium: [
            "العلم نور والجهل ظلام",
            "من جد وجد ومن زرع حصد",
            "الصبر مفتاح الفرج",
            "لا تؤجل عمل اليوم الى الغد",
            "الصحة تاج على رؤوس الاصحاء",
            "الوقت كالسيف ان لم تقطعه قطعك",
            "في التاني السلامة وفي العجلة الندامة",
            "رب ضارة نافعة",
            "اذا كان الكلام من فضة فالسكوت من ذهب"
        ],
        hard: [
            "المستقبل ملك لاولئك الذين يؤمنون بجمال احلامهم",
            "النجاح ليس عدم ارتكاب الاخطاء بل هو عدم تكرارها",
            "التعليم هو اقوى سلاح يمكنك استخدامه لتغيير العالم",
            "القراءة تمنحنا مكانا اخر نذهب اليه عندما نضطر للبقاء في مكاننا",
            "الحياة مثل ركوب الدراجة للحفاظ على توازنك يجب ان تستمر في التحرك"
        ]
    },
    english: {
        easy: [
            "Hello world",
            "How are you",
            "Good morning",
            "Good evening",
            "Thank you",
            "You are welcome",
            "See you later",
            "Have a nice day",
            "Take care",
            "Best wishes"
        ],
        medium: [
            "Practice makes perfect",
            "Knowledge is power",
            "Time is money",
            "Better late than never",
            "Actions speak louder than words",
            "The early bird catches the worm",
            "Don't judge a book by its cover",
            "Where there's smoke there's fire",
            "Rome wasn't built in a day"
        ],
        hard: [
            "Success is not final, failure is not fatal: it is the courage to continue that counts",
            "The only way to do great work is to love what you do",
            "Life is what happens when you're busy making other plans",
            "The future belongs to those who believe in the beauty of their dreams",
            "In the middle of difficulty lies opportunity"
        ]
    }
};

// ==================== دروس متكاملة للغتين (بدون تشكيل) ====================
const lessons = [
    // دروس عربية
    {
        id: 1,
        title: "الدرس الاول: الصف الاساسي (عربي)",
        level: "beginner",
        language: "arabic",
        description: "تعلم وضع الاصابع على الصف الاساسي في لوحة المفاتيح العربية",
        content: "الصف الاساسي: ا س د ف ع (اليسار) - ك م ن ت (اليمين)",
        exercises: ["ا س د ف", "ك م ن ت", "ا س د ف ك م ن ت"],
        duration: "10 دقايق",
        completed: false,
        points: 50
    },
    {
        id: 2,
        title: "الدرس الثاني: الصف العلوي (عربي)",
        level: "beginner",
        language: "arabic",
        description: "تعلم حروف الصف العلوي في لوحة المفاتيح العربية",
        content: "الصف العلوي: ق ث غ خ ح ج ش ي",
        exercises: ["ق ث غ خ", "ح ج ش ي", "ق ث غ خ ح ج ش ي"],
        duration: "15 دقايق",
        completed: false,
        points: 60
    },
    {
        id: 3,
        title: "الدرس الثالث: كلمات عربية بسيطة",
        level: "intermediate",
        language: "arabic",
        description: "تدرب على كتابة كلمات عربية شاىعة",
        content: "كتابة كلمات من 3-4 حروف",
        exercises: ["كتاب", "قلم", "مدرسة", "جامعة", "بيت"],
        duration: "20 دقيقة",
        completed: false,
        points: 80
    },
    {
        id: 4,
        title: "الدرس الرابع: جمل عربية قصيرة",
        level: "advanced",
        language: "arabic",
        description: "كتابة جمل عربية كاملة",
        content: "تدرب على كتابة جمل مفيدة",
        exercises: ["السلام عليكم ورحمة الله", "كيف حالك اليوم", "اهلا وسهلا بكم"],
        duration: "25 دقيقة",
        completed: false,
        points: 100
    },
    
    // English Lessons
    {
        id: 5,
        title: "Lesson 1: Home Row (English)",
        level: "beginner",
        language: "english",
        description: "Learn the home row keys on English keyboard",
        content: "Home Row: A S D F (left) - J K L ; (right)",
        exercises: ["ASDF", "JKL;", "ASDF JKL;", "F J D K S L A ;"],
        duration: "10 minutes",
        completed: false,
        points: 50
    },
    {
        id: 6,
        title: "Lesson 2: Top Row (English)",
        level: "beginner",
        language: "english",
        description: "Learn the top row keys on English keyboard",
        content: "Top Row: Q W E R T Y U I O P",
        exercises: ["QWER", "TYUI", "OP", "QWERTYUIOP"],
        duration: "15 minutes",
        completed: false,
        points: 60
    },
    {
        id: 7,
        title: "Lesson 3: Simple English Words",
        level: "intermediate",
        language: "english",
        description: "Practice typing common English words",
        content: "Type 3-4 letter words",
        exercises: ["cat", "dog", "book", "pen", "house", "car"],
        duration: "20 minutes",
        completed: false,
        points: 80
    },
    {
        id: 8,
        title: "Lesson 4: Short English Sentences",
        level: "advanced",
        language: "english",
        description: "Type complete English sentences",
        content: "Practice typing useful sentences",
        exercises: ["Hello, how are you?", "Good morning everyone", "Have a nice day"],
        duration: "25 minutes",
        completed: false,
        points: 100
    }
];

// ==================== متغيرات التمرين الحالي ====================
let currentExercise = {
    active: false,
    startTime: null,
    targetText: "",
    userInput: "",
    errors: 0,
    totalKeystrokes: 0,
    timeLimit: 60,
    timeLeft: 60,
    timer: null,
    speed: 0,
    accuracy: 100,
    language: 'arabic',
    difficulty: 'easy'
};

// ==================== تحديث الصفحة الرئيسية ====================
document.addEventListener('DOMContentLoaded', function() {
    updateUserPoints();
    loadLessons();
    loadAchievements();
    setupLanguageSwitcher();
    setupKeyboardLayout();
    setupSpeedTest();
    
    // إذا كنا في صفحة التمارين
    if (document.getElementById('typingArea')) {
        setupTypingExercise();
    }
    
    // إذا كنا في صفحة التقدم
    if (document.getElementById('speedChart')) {
        initCharts();
    }
});

// ==================== اختبار السرعة في الصفحة الرئيسية (بدون تشكيل) ====================
function setupSpeedTest() {
    const startBtn = document.getElementById('startTest');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            startSpeedTest();
        });
    }
}

function startSpeedTest() {
    // جلب العناصر
    const input = document.querySelector('.test-container input');
    const startBtn = document.getElementById('startTest');
    const timerSpan = document.getElementById('timer');
    const speedSpan = document.getElementById('speed');
    const accuracySpan = document.getElementById('accuracy');
    const testDisplay = document.querySelector('.test-text');
    
    if (!input) return;
    
    // تجهيز الاختبار
    input.disabled = false;
    input.value = '';
    input.focus();
    startBtn.disabled = true;
    startBtn.textContent = userData.currentLanguage === 'arabic' ? 'جاري الاختبار...' : 'Testing...';
    
    // بيانات الاختبار حسب اللغة
    let timeLeft = 60;
    let mistakes = 0;
    let typedChars = 0;
    let targetText = userData.currentLanguage === 'arabic' 
        ? "مرحبا بكم في موقع تعليم الكتابة السريعة" 
        : "Welcome to the typing speed test";
    
    // عرض النص
    if (testDisplay) {
        testDisplay.innerHTML = targetText;
        testDisplay.setAttribute('lang', userData.currentLanguage);
    }
    
    // تحديث المؤقت كل ثانية
    const timer = setInterval(function() {
        timeLeft--;
        if (timerSpan) timerSpan.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endSpeedTest(input, startBtn, timerSpan, speedSpan, accuracySpan);
        }
    }, 1000);
    
    // مراقبة الكتابة
    input.oninput = function() {
        const userText = input.value;
        typedChars = userText.length;
        
        // حساب الأخطاء
        mistakes = 0;
        for (let i = 0; i < userText.length; i++) {
            if (i < targetText.length && userText[i] !== targetText[i]) {
                mistakes++;
            }
        }
        
        // حساب السرعة
        const minutes = (60 - timeLeft) / 60;
        const words = typedChars / 5;
        const speed = minutes > 0 ? Math.round(words / minutes) : 0;
        if (speedSpan) speedSpan.textContent = speed;
        
        // حساب الدقة
        const accuracy = typedChars > 0 ? Math.round(((typedChars - mistakes) / typedChars) * 100) : 100;
        if (accuracySpan) accuracySpan.textContent = accuracy;
        
        // تمييز النص
        if (testDisplay) {
            let highlighted = '';
            for (let i = 0; i < targetText.length; i++) {
                if (i < userText.length) {
                    if (userText[i] === targetText[i]) {
                        highlighted += `<span style="color: #0f6f37;">${targetText[i]}</span>`;
                    } else {
                        highlighted += `<span style="color: #da2b2b; text-decoration: underline;">${targetText[i]}</span>`;
                    }
                } else {
                    highlighted += targetText[i];
                }
            }
            testDisplay.innerHTML = highlighted;
        }
        
        // لو خلص النص
        if (userText.length === targetText.length) {
            clearInterval(timer);
            endSpeedTest(input, startBtn, timerSpan, speedSpan, accuracySpan);
        }
    };
}

function endSpeedTest(input, startBtn, timerSpan, speedSpan, accuracySpan) {
    // إنهاء الاختبار
    if (input) input.disabled = true;
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = userData.currentLanguage === 'arabic' ? 'ابدأ الاختبار' : 'Start Test';
    }
    
    // عرض النتيجة
    const finalSpeed = speedSpan ? speedSpan.textContent : '0';
    const finalAccuracy = accuracySpan ? accuracySpan.textContent : '0';
    
    // إضافة نقاط
    const points = Math.round((parseInt(finalSpeed) * 2) + (parseInt(finalAccuracy) / 2));
    userData.points += points;
    localStorage.setItem('typingPoints', userData.points);
    updateUserPoints();
    
    // رسالة النتيجة
    const message = userData.currentLanguage === 'arabic' 
        ? `🎉 احسنت!\nالسرعة: ${finalSpeed} كلمة/دقيقة\nالدقة: ${finalAccuracy}%\nالنقاط: +${points}`
        : `🎉 Well done!\nSpeed: ${finalSpeed} WPM\nAccuracy: ${finalAccuracy}%\nPoints: +${points}`;
    
    setTimeout(() => {
        alert(message);
    }, 100);
}

// ==================== مغير اللغة ====================
function setupLanguageSwitcher() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = userData.currentLanguage;
        languageSelect.addEventListener('change', function(e) {
            userData.currentLanguage = e.target.value;
            localStorage.setItem('currentLanguage', userData.currentLanguage);
            updateUITexts();
            location.reload(); // تحديث الصفحة لتطبيق اللغة الجديدة
        });
    }
}

// ==================== تحديث نصوص الواجهة حسب اللغة ====================
function updateUITexts() {
    const lang = userData.currentLanguage;
    
    // تغيير اتجاه الصفحة
    document.documentElement.dir = lang === 'arabic' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // تحديث النصوص في الصفحة
    const elements = {
        'nav-home': { ar: 'الرئيسية', en: 'Home' },
        'nav-lessons': { ar: 'الدروس', en: 'Lessons' },
        'nav-exercises': { ar: 'تمارين', en: 'Exercises' },
        'nav-progress': { ar: 'تقدمي', en: 'Progress' },
        'nav-about': { ar: 'عن الموقع', en: 'About' },
        'hero-title': { ar: 'اتقن الكتابة السريعة على الكيبورد', en: 'Master Touch Typing' },
        'hero-desc': { ar: 'تعلم الكتابة بسرعة 60 كلمة في الدقيقة مع تمارين تفاعلية وممتعة', en: 'Learn to type at 60 WPM with interactive exercises' },
        'speed-test-title': { ar: 'اختبر سرعتك الآن', en: 'Test Your Speed Now' },
        'time-label': { ar: 'الوقت', en: 'Time' },
        'speed-label': { ar: 'السرعة', en: 'Speed' },
        'accuracy-label': { ar: 'الدقة', en: 'Accuracy' },
        'start-btn': { ar: 'ابدأ الاختبار', en: 'Start Test' }
    };
    
    for (let [id, texts] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = texts[lang];
        }
    }
}

// ==================== إنشاء لوحة المفاتيح الافتراضية ====================
function setupKeyboardLayout() {
    const virtualKeyboard = document.getElementById('virtualKeyboard');
    if (!virtualKeyboard) return;
    
    const layouts = {
        arabic: [
            ['ذ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
            ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د', '\\'],
            ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ئ'],
            ['ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', '،']
        ],
        english: [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
        ]
    };
    
    function renderKeyboard(language) {
        const layout = layouts[language];
        virtualKeyboard.innerHTML = '';
        
        layout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'virtual-key';
                keyDiv.textContent = key;
                keyDiv.setAttribute('data-key', key);
                
                // تحديد لون المفتاح حسب الصف
                if (key === 'ا' || key === 'a' || key === 's' || key === 'د' || key === 'f' || key === 'ك' || key === 'j' || key === 'k') {
                    keyDiv.style.background = '#48bb78'; // أخضر للصف الأساسي
                } else if (key === 'ق' || key === 'q' || key === 'w' || key === 'ث' || key === 'e' || key === 'r') {
                    keyDiv.style.background = '#4299e1'; // أزرق للصف العلوي
                } else if (key === 'ش' || key === 'z' || key === 'x' || key === 'س' || key === 'c' || key === 'v') {
                    keyDiv.style.background = '#f56565'; // أحمر للصف السفلي
                }
                
                rowDiv.appendChild(keyDiv);
            });
            
            virtualKeyboard.appendChild(rowDiv);
        });
    }
    
    renderKeyboard(userData.currentLanguage);
}

// ==================== توليد نص جديد للتمرين ====================
function generateNewText() {
    const language = userData.currentLanguage;
    const difficulty = document.getElementById('difficulty')?.value || 'easy';
    const texts = trainingTexts[language][difficulty];
    return texts[Math.floor(Math.random() * texts.length)];
}

// ==================== إعداد التمرين ====================
function setupTypingExercise() {
    const targetText = document.getElementById('targetText');
    const typingArea = document.getElementById('typingArea');
    const startBtn = document.querySelector('.exercise-controls .btn');
    
    if (startBtn) {
        startBtn.onclick = startTypingExercise;
    }
    
    document.getElementById('difficulty')?.addEventListener('change', function() {
        if (!currentExercise.active) {
            targetText.textContent = generateNewText();
        }
    });
}

// ==================== بدء التمرين ====================
function startTypingExercise() {
    const typingArea = document.getElementById('typingArea');
    const targetText = document.getElementById('targetText');
    const startBtn = document.querySelector('.exercise-controls .btn');
    
    currentExercise.targetText = generateNewText();
    targetText.textContent = currentExercise.targetText;
    
    currentExercise.active = true;
    currentExercise.startTime = new Date();
    currentExercise.errors = 0;
    currentExercise.totalKeystrokes = 0;
    currentExercise.timeLimit = parseInt(document.getElementById('timeLimit').value);
    currentExercise.timeLeft = currentExercise.timeLimit;
    currentExercise.language = userData.currentLanguage;
    currentExercise.difficulty = document.getElementById('difficulty').value;
    
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
    
    startBtn.disabled = true;
    document.getElementById('difficulty').disabled = true;
    document.getElementById('timeLimit').disabled = true;
    
    startTimer();
    
    typingArea.addEventListener('input', handleTyping);
    
    document.getElementById('exerciseResults').style.display = 'none';
}

// ==================== معالجة الكتابة ====================
function handleTyping(e) {
    if (!currentExercise.active) return;
    
    const userInput = e.target.value;
    const targetText = currentExercise.targetText;
    
    currentExercise.totalKeystrokes++;
    
    const lastChar = userInput[userInput.length - 1];
    const targetChar = targetText[userInput.length - 1];
    
    if (lastChar !== targetChar) {
        currentExercise.errors++;
        highlightError(userInput.length - 1);
    }
    
    currentExercise.accuracy = Math.max(0, 100 - (currentExercise.errors / currentExercise.totalKeystrokes * 100));
    
    if (currentExercise.totalKeystrokes % 10 === 0) {
        updateSpeed();
    }
    
    updateExerciseStats();
    
    if (userInput.length === targetText.length) {
        completeExercise();
    }
    
    highlightKey(lastChar);
}

// ==================== إضاءة المفتاح ====================
function highlightKey(key) {
    const keys = document.querySelectorAll('.virtual-key');
    keys.forEach(k => {
        k.classList.remove('active');
        if (k.textContent === key) {
            k.classList.add('active');
        }
    });
}

// ==================== تمييز الخطأ ====================
function highlightError(position) {
    const targetText = document.getElementById('targetText');
    const text = targetText.textContent;
    const highlightedText = text.split('').map((char, index) => {
        if (index === position) {
            return `<span class="error-char">${char}</span>`;
        }
        return char;
    }).join('');
    
    targetText.innerHTML = highlightedText;
}

// ==================== تحديث إحصائيات التمرين ====================
function updateExerciseStats() {
    document.getElementById('currentSpeed').textContent = Math.round(currentExercise.speed);
    document.getElementById('currentAccuracy').textContent = Math.round(currentExercise.accuracy);
    document.getElementById('timeLeft').textContent = currentExercise.timeLeft;
    document.getElementById('errors').textContent = currentExercise.errors;
}

// ==================== بدء المؤقت ====================
function startTimer() {
    currentExercise.timer = setInterval(() => {
        currentExercise.timeLeft--;
        document.getElementById('timeLeft').textContent = currentExercise.timeLeft;
        
        updateSpeed();
        
        if (currentExercise.timeLeft <= 0) {
            completeExercise();
        }
    }, 1000);
}

// ==================== تحديث السرعة ====================
function updateSpeed() {
    const timePassed = (new Date() - currentExercise.startTime) / 1000 / 60;
    const wordsTyped = currentExercise.totalKeystrokes / 5;
    currentExercise.speed = wordsTyped / timePassed;
    document.getElementById('currentSpeed').textContent = Math.round(currentExercise.speed);
}

// ==================== إكمال التمرين ====================
function completeExercise() {
    clearInterval(currentExercise.timer);
    currentExercise.active = false;
    
    const typingArea = document.getElementById('typingArea');
    typingArea.disabled = true;
    
    const pointsEarned = calculatePoints();
    userData.points += pointsEarned;
    
    saveExerciseResults(pointsEarned);
    displayResults(pointsEarned);
    
    document.querySelector('.exercise-controls .btn').disabled = false;
    document.getElementById('difficulty').disabled = false;
    document.getElementById('timeLimit').disabled = false;
}

// ==================== حساب النقاط ====================
function calculatePoints() {
    let points = 0;
    
    const timeBonus = Math.max(0, 100 - (currentExercise.timeLimit - currentExercise.timeLeft));
    const accuracyBonus = currentExercise.accuracy * 2;
    const speedBonus = currentExercise.speed * 3;
    const languageBonus = userData.currentLanguage === 'english' ? 20 : 10;
    
    points = Math.round(timeBonus + accuracyBonus + speedBonus + languageBonus);
    
    return points;
}

// ==================== حفظ نتائج التمرين ====================
function saveExerciseResults(points) {
    userData.speedHistory.push({
        date: new Date().toLocaleDateString(),
        speed: currentExercise.speed,
        accuracy: currentExercise.accuracy,
        language: currentExercise.language
    });
    
    if (userData.speedHistory.length > 10) {
        userData.speedHistory.shift();
    }
    
    localStorage.setItem('speedHistory', JSON.stringify(userData.speedHistory));
    localStorage.setItem('typingPoints', userData.points);
    
    checkAchievements();
}

// ==================== عرض النتائج ====================
function displayResults(points) {
    document.getElementById('maxSpeed').textContent = Math.round(currentExercise.speed);
    document.getElementById('avgAccuracy').textContent = Math.round(currentExercise.accuracy);
    document.getElementById('totalKeystrokes').textContent = currentExercise.totalKeystrokes;
    document.getElementById('earnedPoints').textContent = points;
    
    document.getElementById('exerciseResults').style.display = 'block';
    
    updateUserPoints();
}

// ==================== تحديث نقاط المستخدم ====================
function updateUserPoints() {
    const pointsElement = document.getElementById('userPoints');
    if (pointsElement) {
        pointsElement.textContent = userData.points;
    }
}

// ==================== التحقق من الإنجازات ====================
function checkAchievements() {
    const newAchievements = [];
    
    if (userData.speedHistory.length === 1 && !achievements[0].earned) {
        achievements[0].earned = true;
        newAchievements.push(achievements[0]);
    }
    
    if (currentExercise.speed >= 20 && !achievements[1].earned) {
        achievements[1].earned = true;
        newAchievements.push(achievements[1]);
    }
    
    if (currentExercise.accuracy >= 95 && !achievements[2].earned) {
        achievements[2].earned = true;
        newAchievements.push(achievements[2]);
    }
    
    if (userData.completedLessons.length >= 5 && !achievements[3].earned) {
        achievements[3].earned = true;
        newAchievements.push(achievements[3]);
    }
    
    if (currentExercise.speed >= 50 && !achievements[4].earned) {
        achievements[4].earned = true;
        newAchievements.push(achievements[4]);
    }
    
    if (currentExercise.errors === 0 && !achievements[5].earned) {
        achievements[5].earned = true;
        newAchievements.push(achievements[5]);
    }
    
    if (newAchievements.length > 0) {
        showNewAchievements(newAchievements);
    }
    
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

// ==================== عرض الإنجازات الجديدة ====================
function showNewAchievements(achievements) {
    let message = userData.currentLanguage === 'arabic' 
        ? '🎉 تهانينا! حصلت على انجازات جديدة:\n\n'
        : '🎉 Congratulations! You got new achievements:\n\n';
    
    achievements.forEach(ach => {
        message += `${ach.icon} ${ach.name}: ${ach.description}\n`;
    });
    
    alert(message);
}

// ==================== تحميل الدروس ====================
function loadLessons() {
    const lessonsContainer = document.getElementById('lessonsContainer');
    if (!lessonsContainer) return;
    
    const currentLang = userData.currentLanguage;
    const filteredLessons = lessons.filter(l => l.language === currentLang);
    
    lessonsContainer.innerHTML = filteredLessons.map(lesson => `
        <div class="lesson-card" data-level="${lesson.level}" data-language="${lesson.language}">
            <div class="lesson-header">
                <h3>${lesson.title}</h3>
                <span class="lesson-duration">${lesson.duration}</span>
            </div>
            <p class="lesson-description">${lesson.description}</p>
            <div class="lesson-content">
                <strong>${currentLang === 'arabic' ? 'المحتوى:' : 'Content:'}</strong>
                <p>${lesson.content}</p>
            </div>
            <div class="lesson-exercises">
                <strong>${currentLang === 'arabic' ? 'تمارين:' : 'Exercises:'}</strong>
                <ul>
                    ${lesson.exercises.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
            <div class="lesson-footer">
                <span class="lesson-points">+${lesson.points} ${currentLang === 'arabic' ? 'نقطة' : 'points'}</span>
                <button class="btn lesson-btn" onclick="startLesson(${lesson.id})" 
                    ${userData.completedLessons.includes(lesson.id) ? 'disabled' : ''}>
                    ${userData.completedLessons.includes(lesson.id) 
                        ? (currentLang === 'arabic' ? '✓ مكتمل' : '✓ Completed') 
                        : (currentLang === 'arabic' ? 'ابدأ الدرس' : 'Start Lesson')}
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== بدء الدرس ====================
function startLesson(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    window.location.href = `exercises.html?lesson=${lessonId}`;
}

// ==================== تصفية الدروس حسب المستوى ====================
function filterLessons(level) {
    const tabs = document.querySelectorAll('.level-tab');
    tabs.forEach(tab => {
        if (tab.textContent.includes(level === 'beginner' ? 'مبتدئ' : 
                                      level === 'intermediate' ? 'متوسط' : 'متقدم')) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    const cards = document.querySelectorAll('.lesson-card');
    cards.forEach(card => {
        if (level === 'all' || card.dataset.level === level) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==================== تهيئة الرسوم البيانية ====================
function initCharts() {
    if (!document.getElementById('speedChart')) return;
    
    const speedCtx = document.getElementById('speedChart').getContext('2d');
    new Chart(speedCtx, {
        type: 'line',
        data: {
            labels: userData.speedHistory.map((item, index) => `تمرين ${index + 1}`),
            datasets: [{
                label: userData.currentLanguage === 'arabic' ? 'السرعة (كلمة/دقيقة)' : 'Speed (WPM)',
                data: userData.speedHistory.map(item => item.speed),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
    
    const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');
    new Chart(accuracyCtx, {
        type: 'line',
        data: {
            labels: userData.accuracyHistory.map((item, index) => `تمرين ${index + 1}`),
            datasets: [{
                label: userData.currentLanguage === 'arabic' ? 'الدقة (%)' : 'Accuracy (%)',
                data: userData.accuracyHistory.map(item => item.accuracy),
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
    
    updateProgressStats();
}

// ==================== تحديث إحصائيات التقدم ====================
function updateProgressStats() {
    if (userData.speedHistory.length > 0) {
        const avgSpeed = userData.speedHistory.reduce((sum, item) => sum + item.speed, 0) / userData.speedHistory.length;
        const avgAccuracy = userData.speedHistory.reduce((sum, item) => sum + item.accuracy, 0) / userData.speedHistory.length;
        
        document.getElementById('avgSpeed').textContent = Math.round(avgSpeed);
        document.getElementById('avgAccuracy').textContent = Math.round(avgAccuracy);
    }
    
    const avgSpeed = parseInt(document.getElementById('avgSpeed').textContent);
    let level = userData.currentLanguage === 'arabic' ? 'مبتدئ' : 'Beginner';
    if (avgSpeed > 40) level = userData.currentLanguage === 'arabic' ? 'متوسط' : 'Intermediate';
    if (avgSpeed > 60) level = userData.currentLanguage === 'arabic' ? 'متقدم' : 'Advanced';
    document.getElementById('userLevel').textContent = level;
}

// ==================== تحميل الإنجازات ====================
function loadAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    if (!achievementsList) return;
    
    const lang = userData.currentLanguage;
    
    achievementsList.innerHTML = achievements.map(ach => `
        <div class="achievement-card ${ach.earned ? 'earned' : 'locked'}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <h4>${ach.name}</h4>
                <p>${ach.description}</p>
                ${ach.earned ? '<span class="achievement-badge">✓</span>' : ''}
            </div>
        </div>
    `).join('');
}

// ==================== حفظ ومتابعة ====================
function saveAndContinue() {
    userData.accuracyHistory.push({
        date: new Date().toLocaleDateString(),
        accuracy: currentExercise.accuracy,
        speed: currentExercise.speed
    });
    
    localStorage.setItem('accuracyHistory', JSON.stringify(userData.accuracyHistory));
    
    if (confirm(userData.currentLanguage === 'arabic' ? 
                'هل تريد الانتقال للدرس التالي؟' : 
                'Do you want to go to the next lesson?')) {
        window.location.href = 'lessons.html';
    } else {
        document.getElementById('exerciseResults').style.display = 'none';
        document.querySelector('.exercise-controls .btn').disabled = false;
    }
}

// ==================== حفظ التمرين الحالي ====================
function saveCurrentExercise() {
    if (currentExercise.active) {
        completeExercise();
    }
}

// ==================== مراقبة مغادرة الصفحة ====================
window.addEventListener('beforeunload', function(e) {
    if (currentExercise.active) {
        e.preventDefault();
        e.returnValue = '';
    }
});