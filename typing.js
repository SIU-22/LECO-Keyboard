// ==================== هيكل البيانات (Progress System) ====================
let userProgress = {
    stats: {
        accuracy: 0,
        bestAccuracy: 0,
        speed: 0,
        bestSpeed: 0,
        totalWords: 0,
        correctWords: 0,
        mistakes: 0,
        perfectExercises: 0
    },
    lessons: {
        completed: [], // Changed to array to support multiple languages/non-sequential IDs
        currentLesson: 1,
        lessonsHistory: []
    },
    achievements: {
        "المتابعة": false,
        "الدفعة 95%": false,
        "سريعة 20": false,
        "الحلال": false,
        "المحترف": false
    },
    sessions: {
        totalPlayTime: 0,
        lastPlayed: null,
        streak: 0
    },
    points: 0,
    currentLanguage: localStorage.getItem('currentLanguage') || 'arabic',
    theme: localStorage.getItem('theme') || 'light'
};

// ==================== البيانات القديمة (Migration) ====================
let userData = {
    points: localStorage.getItem('typingPoints') ? parseInt(localStorage.getItem('typingPoints')) : 0,
    speedHistory: JSON.parse(localStorage.getItem('speedHistory')) || [],
    accuracyHistory: JSON.parse(localStorage.getItem('accuracyHistory')) || [],
    achievements: JSON.parse(localStorage.getItem('achievements')) || [],
    completedLessons: JSON.parse(localStorage.getItem('completedLessons')) || [],
    currentLanguage: localStorage.getItem('currentLanguage') || 'arabic'
};

// وظيفة استرجاع البيانات المدمجة
function loadGameProgress() {
    const saved = localStorage.getItem('leco_user_progress');
    if (saved) {
        userProgress = JSON.parse(saved);
    } else {
        // محاولة الهجرة من النظام القديم إذا وجد
        if (userData.points > 0 || userData.completedLessons.length > 0) {
            userProgress.points = userData.points;
            userProgress.lessons.completed = Array.isArray(userData.completedLessons) ? userData.completedLessons : [];
            if (userData.speedHistory && userData.speedHistory.length > 0) {
                // استخراج السرعات من الكائنات
                const speeds = userData.speedHistory.map(h => typeof h === 'object' ? h.speed : h).filter(s => !isNaN(s));
                if (speeds.length > 0) userProgress.stats.bestSpeed = Math.max(...speeds);
                
                const accuracies = userData.speedHistory.map(h => typeof h === 'object' ? h.accuracy : h).filter(a => !isNaN(a));
                if (accuracies.length > 0) userProgress.stats.bestAccuracy = Math.max(...accuracies);
            }
            saveGameProgress();
        }
    }
    
    // تأمين أن completed مصفوفة دائماً (Migration)
    if (!Array.isArray(userProgress.lessons.completed)) {
        const oldVal = userProgress.lessons.completed;
        userProgress.lessons.completed = [];
        if (typeof oldVal === 'number' && oldVal > 0) {
            // تحويل الرقم إلى مصفوفة من المعرفات (افتراض تسلسلي)
            for (let i = 1; i <= oldVal; i++) userProgress.lessons.completed.push(i);
        }
    }
}

function saveGameProgress() {
    localStorage.setItem('leco_user_progress', JSON.stringify(userProgress));
    // مزامنة النقاط مع النظام القديم للمصداقية
    localStorage.setItem('typingPoints', userProgress.points);
}

loadGameProgress();

// التحقق من وجود درس في الرابط عند التحميل
function checkLessonParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('lesson');
    if (lessonId && document.getElementById('typingArea')) {
        const lesson = lessons.find(l => l.id === parseInt(lessonId));
        if (lesson) {
            // تهيئة التمرين بناءً على الدرس
            currentExercise.targetText = lesson.exercises[0]; // البدء بأول تمرين في الدرس
            const targetDisplay = document.getElementById('targetText');
            if (targetDisplay) targetDisplay.textContent = currentExercise.targetText;
            
            // تحديث العنوان ليظهر اسم الدرس
            const title = document.querySelector('.exercise-header h3');
            if (title) title.textContent = lesson.title;
            
            currentExercise.isLesson = true;
            currentExercise.lessonId = lesson.id;
        }
    }
}

// ==================== بيانات الإنجازات التعريفية ====================
const achievementsData = [
    { id: "المتابعة", name: { ar: "المتابعة", en: "Persistence" }, desc: { ar: "إكمال 5 دروس", en: "Complete 5 lessons" }, icon: "🏃" },
    { id: "الدفعة 95%", name: { ar: "الدفعة 95%", en: "Accuracy 95%" }, desc: { ar: "دقة ≥ 95% في تمرين", en: "Accuracy ≥ 95% in any exercise" }, icon: "🎯" },
    { id: "سريعة 20", name: { ar: "سريعة 20", en: "Speed 20" }, desc: { ar: "سرعة ≥ 20 كلمة/دقيقة", en: "Speed ≥ 20 WPM" }, icon: "⚡" },
    { id: "الحلال", name: { ar: "الحلال", en: "Halal (Perfect)" }, desc: { ar: "إكمال تمرين بدون أخطاء", en: "Complete an exercise with no errors" }, icon: "💯" },
    { id: "المحترف", name: { ar: "المحترف", en: "Professional" }, desc: { ar: "سرعة ≥ 50 كلمة/دقيقة", en: "Speed ≥ 50 WPM" }, icon: "👑" }
];

// تم استبداله بـ achievementsData أعلاه

// ==================== قاموس الترجمة (i18n) ====================
const i18n = {
    arabic: {
        "site-title": "تعلم الكتابة السريعة",
        "nav-home": "الرئيسية",
        "nav-lessons": "الدروس",
        "nav-exercises": "تمارين تفاعلية",
        "nav-progress": "تقدمي",
        "nav-programming": "تعلم البرمجة",
        "nav-about": "عن الموقع",
        "hero-title": "أتقن الكتابة السريعة على الكيبورد",
        "hero-desc": "تعلم الكتابة بسرعة 60 كلمة في الدقيقة مع تمارين تفاعلية وممتعة",
        "speed-test-title": "اختبر سرعتك الآن",
        "input-placeholder": "ابدأ الكتابة هنا...",
        "timer-label": "الوقت",
        "speed-label": "السرعة",
        "accuracy-label": "الدقة",
        "unit-seconds": "ثانية",
        "unit-wpm": "ك/د",
        "start-btn": "ابدأ الاختبار",
        "why-us": "لماذا تتعلم معنا؟",
        "feature-1-title": "دروس منظمة",
        "feature-1-desc": "منهج متكامل من المبتدئين حتى الاحتراف",
        "feature-2-title": "تمارين تفاعلية",
        "feature-2-desc": "ألعاب وتمارين ممتعة لتحسين سرعتك",
        "feature-3-title": "تتبع التقدم",
        "feature-3-desc": "إحصائيات مفصلة عن تطور مستواك",
        "feature-4-title": "شهادات إنجاز",
        "feature-4-desc": "احصل على شهادات عند إتمام المستويات",
        "keyboard-guide-title": "تعلم وضع الأصابع الصحيح",
        "finger-1": "الخنصر (ي)",
        "finger-2": "البنصر (ي)",
        "finger-3": "الوسطى (ي)",
        "finger-4": "السبابة (يمين)",
        "finger-5": "السبابة (يسار)",
        "finger-6": "الوسطى",
        "finger-7": "البنصر",
        "finger-8": "الخنصر",
        "home-row-guide": "صف الأساس (f و j)",
        "footer-rights": "جميع الحقوق محفوظة &copy; 2026",
        "lessons-title": "الدروس التعليمية",
        "lessons-desc": "اختر الدرس المناسب لمستواك",
        "tab-beginner": "مبتدئ",
        "tab-intermediate": "متوسط",
        "tab-advanced": "متقدم",
        "lesson-duration": "المدة",
        "lesson-start": "ابدأ الدرس",
        "points-label": "نقطة",
        "about-title": "عن موقع LECO Keyboard",
        "about-story-title": "قصتنا",
        "about-story-desc": "موقع كيبورد LECO هو مشروع تعليمي يهدف للمساعدة على إتقان مهارة الكتابة السريعة على لوحة المفاتيح. تأسس الموقع في 2026 كجزء من مشروع جامعي لتطوير مهارات البرمجة وتقديم محتوى تعليمي مفيد.",
        "about-mission-title": "مهمتنا",
        "about-mission-desc": "نسعى لتوفير منصة تعليمية متكاملة باللغة العربية و الانجليزية تساعد المبتدئين والمحترفين على تحسين سرعة ودقة الكتابة على الكيبورد من خلال تمارين تفاعلية ودروس منظمة.",
        "about-features-title": "مميزات الموقع",
        "about-feat-1": "واجهة عربية سهلة الاستخدام",
        "about-feat-2": "تمارين تفاعلية مع تقييم فوري",
        "about-feat-3": "إحصائيات مفصلة عن تقدم المستخدم",
        "about-feat-4": "نظام مكافآت وإنجازات لتحفيز المتعلمين",
        "about-feat-5": "محتوى مجاني بالكامل",
        "role-ux": "مصمم تجربة المستخدم",
        "role-dev": "مطور الواجهات الأمامية",
        "role-content": "مطور المحتوى التعليمي",
        "progress-title": "مسار تقدمك",
        "stats-speed": "أفضل سرعة",
        "achievements-title": "إنجازاتك",
        "chart-speed-title": "تطور السرعة",
        "chart-accuracy-title": "تطور الدقة",
        "stat-avg-speed": "متوسط السرعة",
        "stat-avg-accuracy": "الدقة",
        "stat-training-time": "وقت التدريب",
        "stat-level": "المستوى",
        "stat-unit-time": "ساعة",
        "progress-desc": "إحصائيات مفصلة عن تطور مستواك",
        "exercise-page-title": "تمارين تفاعلية",
        "exercise-page-desc": "تدرب على الكتابة مع ألعاب وتحديات ممتعة",
        "exercise-free-title": "تمرين الكتابة الحرة",
        "opt-easy": "سهل",
        "opt-medium": "متوسط",
        "opt-hard": "صعب",
        "unit-60s": "60 ثانية",
        "unit-2m": "دقيقتان",
        "unit-5m": "5 دقائق",
        "label-remaining-time": "الوقت المتبقي",
        "label-errors": "الأخطاء",
        "btn-start-exercise": "ابدأ التمرين",
        "key-tab": "Tab",
        "key-caps": "Caps",
        "key-shift": "Shift",
        "key-back": "Back",
        "key-enter": "Enter",
        "key-space": "Space",
        "prog-hero-title": "ابدأ تعلم البرمجة",
        "prog-hero-desc": "اختر لغة وابدأ رحلتك التعليمية اليوم",
        "prog-explore-btn": "استكشف الدورات",
        "prog-cat-html-desc": "لغة هيكلة صفحات الويب الأساسية",
        "prog-cat-css-desc": "لغة تنسيق وتصميم صفحات الويب بشكل احترافي",
        "prog-cat-js-desc": "لغة البرمجة لجعل الصفحات تفاعلية وديناميكية",
        "prog-cat-py-desc": "لغة برمجة قوية وسهلة التعلم لكافة الاستخدامات",
        "prog-cat-cpp-desc": "لغة برمجة قوية تستخدم في بناء الأنظمة والألعاب",
        "prog-cat-php-desc": "لغة برمجة نصية لتطوير مواقع الويب من جانب الخادم",
        "prog-cat-java-desc": "لغة برمجة قوية لتطبيقات الأندرويد والبرمجيات الكبيرة",
        "prog-start-btn": "ابدأ التعلم",
        "prog-feat-1-title": "مناسب للمبتدئين",
        "prog-feat-1-desc": "دروس مشروحة بأسلوب مبسط وشامل",
        "prog-feat-2-title": "مصادر مجانية",
        "prog-feat-2-desc": "وصول كامل لأفضل المصادر التعليمية العالمية",
        "prog-feat-3-title": "دروس متدرجة",
        "prog-feat-3-desc": "تعلم خطوة بخطوة من الصفر حتى الاحتراف"
    },
    english: {
        "site-title": "Learn Typing",
        "nav-home": "Home",
        "nav-lessons": "Lessons",
        "nav-exercises": "Exercises",
        "nav-progress": "Progress",
        "nav-programming": "Learn Coding",
        "nav-about": "About",
        "hero-title": "Master Touch Typing",
        "hero-desc": "Learn to type 60 WPM with fun and interactive exercises",
        "speed-test-title": "Test Your Speed Now",
        "input-placeholder": "Start typing here...",
        "timer-label": "Time",
        "speed-label": "Speed",
        "accuracy-label": "Accuracy",
        "unit-seconds": "sec",
        "unit-wpm": "wpm",
        "start-btn": "Start Test",
        "why-us": "Why Learn With Us?",
        "feature-1-title": "Structured Lessons",
        "feature-1-desc": "Complete curriculum from beginner to pro",
        "feature-2-title": "Interactive Exercises",
        "feature-2-desc": "Fun games and exercises to boost speed",
        "feature-3-title": "Progress Tracking",
        "feature-3-desc": "Detailed stats about your performance",
        "feature-4-title": "Achievements",
        "feature-4-desc": "Get badges for completing levels",
        "keyboard-guide-title": "Learn Correct Finger Placement",
        "finger-1": "Pinky (R)",
        "finger-2": "Ring (R)",
        "finger-3": "Middle (R)",
        "finger-4": "Index (Right)",
        "finger-5": "Index (Left)",
        "finger-6": "Middle",
        "finger-7": "Ring",
        "finger-8": "Pinky",
        "home-row-guide": "Home Row (f & j)",
        "footer-rights": "All rights reserved &copy; 2026",
        "lessons-title": "Educational Lessons",
        "lessons-desc": "Choose the right level for you",
        "tab-beginner": "Beginner",
        "tab-intermediate": "Intermediate",
        "tab-advanced": "Advanced",
        "lesson-duration": "Duration",
        "lesson-start": "Start Lesson",
        "points-label": "Points",
        "about-title": "About LECO Keyboard",
        "about-story-title": "Our Story",
        "about-story-desc": "LECO Keyboard is an educational project aimed at mastering touch typing skills. Founded in 2026 as a university project to develop coding skills and provide useful educational content.",
        "about-mission-title": "Our Mission",
        "about-mission-desc": "We strive to provide a comprehensive training platform in Arabic and English that helps beginners and professionals improve typing speed and accuracy through interactive exercises and structured lessons.",
        "about-features-title": "Site Features",
        "about-feat-1": "Easy to use bilingual interface",
        "about-feat-2": "Interactive exercises with instant feedback",
        "about-feat-3": "Detailed statistics on user progress",
        "about-feat-4": "Rewards system and achievements to motivate users",
        "about-feat-5": "Entirely free content",
        "role-ux": "UX Designer",
        "role-dev": "Frontend Developer",
        "role-content": "Educational Content Developer",
        "progress-title": "Your Progress Path",
        "stats-speed": "Best Speed",
        "stats-accuracy": "Avg. Accuracy",
        "stats-lessons": "Lessons Completed",
        "achievements-title": "Your Achievements",
        "chart-speed-title": "Speed Progress",
        "chart-accuracy-title": "Accuracy Progress",
        "stat-avg-speed": "Average Speed",
        "stat-avg-accuracy": "Accuracy",
        "stat-training-time": "Training Time",
        "stat-level": "Level",
        "stat-unit-time": "hours",
        "progress-desc": "Detailed stats about your performance",
        "exercise-page-title": "Interactive Exercises",
        "exercise-page-desc": "Practice typing with fun games and challenges",
        "exercise-free-title": "Free Typing Exercise",
        "opt-easy": "Easy",
        "opt-medium": "Medium",
        "opt-hard": "Hard",
        "unit-60s": "60 Seconds",
        "unit-2m": "2 Minutes",
        "unit-5m": "5 Minutes",
        "label-remaining-time": "Time Left",
        "label-errors": "Errors",
        "btn-start-exercise": "Start Exercise",
        "key-tab": "Tab",
        "key-caps": "Caps",
        "key-shift": "Shift",
        "key-back": "Back",
        "key-enter": "Enter",
        "key-space": "Space",
        "prog-hero-title": "Start Learning Programming",
        "prog-hero-desc": "Choose a language and begin your journey today",
        "prog-explore-btn": "Explore Courses",
        "prog-cat-html-desc": "The foundational language for building web pages",
        "prog-cat-css-desc": "Style and design your web pages professionally",
        "prog-cat-js-desc": "Add interactivity and dynamics to your websites",
        "prog-cat-py-desc": "A powerful, versatile, and easy-to-learn language",
        "prog-cat-cpp-desc": "A powerful programming language used for systems and games",
        "prog-cat-php-desc": "A scripting language used for server-side web development",
        "prog-cat-java-desc": "A powerful language used for Android and enterprise software",
        "prog-start-btn": "Start Learning",
        "prog-feat-1-title": "Beginner Friendly",
        "prog-feat-1-desc": "Comprehensive lessons explained simply",
        "prog-feat-2-title": "Free Resources",
        "prog-feat-2-desc": "Full access to world-class learning materials",
        "prog-feat-3-title": "Step-by-Step",
        "prog-feat-3-desc": "Progress from zero to professional mastery"
    }
};

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
        exercises: ["ا س د ف ك م ن ت"],
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
        exercises: ["ق ث غ خ ح ج ش ي"],
        duration: "15 دقايق",
        completed: false,
        points: 60
    },
    {
        id: 3,
        title: "الدرس الثالث: الصف السفلي (عربي)",
        level: "beginner",
        language: "arabic",
        description: "تعلم حروف الصف السفلي في لوحة المفاتيح العربية",
        content: "الصف السفلي: ئ ء ؤ ر لا ى ة و ز ظ",
        exercises: ["ر لا ى ة و ز ظ"],
        duration: "15 دقايق",
        completed: false,
        points: 70
    },
    {
        id: 4,
        title: "الدرس الرابع: كلمات عربية بسيطة",
        level: "intermediate",
        language: "arabic",
        description: "تدرب على كتابة كلمات عربية شاىعة",
        content: "كتابة كلمات من 3-4 حروف",
        exercises: ["كتاب قلم مدرسة جامعة بيت"],
        duration: "20 دقيقة",
        completed: false,
        points: 80
    },
    {
        id: 10,
        title: "الدرس الخامس: جمل عربية قصيرة",
        level: "advanced",
        language: "arabic",
        description: "كتابة جمل عربية كاملة",
        content: "تدرب على كتابة جمل مفيدة",
        exercises: ["السلام عليكم ورحمة الله وبركاته"],
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
        exercises: ["asdf jkl; asdf jkl;"],
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
        exercises: ["qwerty uiop"],
        duration: "15 minutes",
        completed: false,
        points: 60
    },
    {
        id: 7,
        title: "Lesson 3: Bottom Row (English)",
        level: "beginner",
        language: "english",
        description: "Learn the bottom row keys on English keyboard",
        content: "Bottom Row: Z X C V B N M , . /",
        exercises: ["zxcv bnm,."],
        duration: "15 minutes",
        completed: false,
        points: 70
    },
    {
        id: 8,
        title: "Lesson 4: Simple English Words",
        level: "intermediate",
        language: "english",
        description: "Practice typing common English words",
        content: "Type 3-4 letter words",
        exercises: ["cat dog book pen house car"],
        duration: "20 minutes",
        completed: false,
        points: 80
    },
    {
        id: 9,
        title: "Lesson 5: Short English Sentences",
        level: "advanced",
        language: "english",
        description: "Type complete English sentences",
        content: "Practice typing useful sentences",
        exercises: ["Hello, how are you? Good morning everyone."],
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

// ==================== تهيئة التطبيق ====================
document.addEventListener('DOMContentLoaded', function() {
    updateUITexts(); // تطبيق اللغة المختارة فور التحميل
    updateUserPoints();
    loadLessons();
    loadAchievements();
    
    // تهيئة واجهة المستخدم عند التحميل
    updateStatsUI();
    updateAchievementsUI();
    showWelcomeMessage();

    // تشغيل الميزات الأساسية
    setupLanguageSwitcher();
    setupMobileMenu();
    
    // التحقق من الدروس والتمارين
    checkLessonParam();
    
    // تهيئة لوحة المفاتيح والتمارين
    if (typeof setupKeyboardLayout === 'function') setupKeyboardLayout();
    if (typeof setupSpeedTest === 'function') {
        if (document.getElementById('testText')) {
            setupSpeedTest();
        }
    }
    if (typeof setupTypingExercise === 'function') {
        if (document.getElementById('typingArea')) {
            setupTypingExercise();
        }
    }
    
    // إذا كنا في صفحة التقدم
    if (document.getElementById('speedChart')) {
        if (typeof initCharts === 'function') initCharts();
    }
});

// ==================== القائمة الجانبية للجوال ====================
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // إغلاق القائمة عند النقر في أي مكان آخر
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // إغلاق القائمة عند النقر على رابط (مفيد في صفحات single page، لكن جيد للمصداقية هنا)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // إضافة إحصائيات المستخدم للقائمة في الجوال
        if (!document.getElementById('mobileUserStats')) {
            const statsClone = document.getElementById('userStats')?.cloneNode(true);
            if (statsClone) {
                statsClone.id = 'mobileUserStats';
                statsClone.style.display = 'flex';
                statsClone.style.marginTop = 'auto';
                statsClone.style.marginBottom = '20px';
                statsClone.style.padding = '15px';
                statsClone.style.justifyContent = 'center';
                statsClone.style.background = 'var(--bg-elevated)';
                statsClone.style.borderRadius = 'var(--radius-md)';
                navMenu.appendChild(statsClone);
            }
        }
    }
}

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
    startBtn.textContent = userProgress.currentLanguage === 'arabic' ? 'جاري الاختبار...' : 'Testing...';
    
    // بيانات الاختبار حسب اللغة
    let timeLeft = 60;
    let mistakes = 0;
    let typedChars = 0;
    let targetText = userProgress.currentLanguage === 'arabic' 
        ? "مرحبا بكم في موقع تعليم الكتابة السريعة" 
        : "Welcome to the typing speed test";
    
    // عرض النص
    if (testDisplay) {
        testDisplay.innerHTML = targetText;
        testDisplay.setAttribute('lang', userProgress.currentLanguage);
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
        startBtn.textContent = userProgress.currentLanguage === 'arabic' ? 'ابدأ الاختبار' : 'Start Test';
    }
    
    // عرض النتيجة
    const finalSpeed = speedSpan ? speedSpan.textContent : '0';
    const finalAccuracy = accuracySpan ? accuracySpan.textContent : '0';
    
    // إضافة نقاط
    const points = Math.round((parseInt(finalSpeed) * 2) + (parseInt(finalAccuracy) / 2));
    userProgress.points += points;
    localStorage.setItem('typingPoints', userProgress.points);
    updateUserPoints();
    
    // رسالة النتيجة
    const message = userProgress.currentLanguage === 'arabic' 
        ? `🎉 احسنت!\nالسرعة: ${finalSpeed} كلمة/دقيقة\nالدقة: ${finalAccuracy}%\nالنقاط: +${points}`
        : `🎉 Well done!\nSpeed: ${finalSpeed} WPM\nAccuracy: ${finalAccuracy}%\nPoints: +${points}`;
    
    setTimeout(() => {
        alert(message);
    }, 100);
}

// ==================== إدارة التقدم العامة ====================
function updateAfterExercise(accuracy, speed, mistakes, lessonCompleted = false) {
    // تحديث الدقة
    userProgress.stats.accuracy = accuracy;
    if (accuracy > userProgress.stats.bestAccuracy) {
        userProgress.stats.bestAccuracy = accuracy;
    }

    // تحديث السرعة
    userProgress.stats.speed = speed;
    if (speed > userProgress.stats.bestSpeed) {
        userProgress.stats.bestSpeed = speed;
    }

    // تحديث الأخطاء والكمال
    userProgress.stats.mistakes += mistakes;
    if (mistakes === 0) {
        userProgress.stats.perfectExercises += 1;
    }

    // تحديث الدروس
    if (lessonCompleted && currentExercise.lessonId) {
        if (!userProgress.lessons.completed.includes(currentExercise.lessonId)) {
            userProgress.lessons.completed.push(currentExercise.lessonId);
        }
        userProgress.lessons.currentLesson = Math.max(...userProgress.lessons.completed, 0) + 1;
    }

    // حفظ الوقت والتاريخ
    userProgress.sessions.lastPlayed = new Date().toISOString();
    
    // التحقق من الإنجازات
    checkAchievements(accuracy, speed, mistakes);
    
    // حفظ وعرض
    saveGameProgress();
    updateStatsUI();
}

function checkAchievements(accuracy, speed, mistakes) {
    // 1. المتابعة: إكمال 5 دروس
    if (userProgress.lessons.completed >= 5) {
        unlockAchievement("المتابعة");
    }

    // 2. الدفعة 95%: دقة >= 95%
    if (accuracy >= 95) {
        unlockAchievement("الدفعة 95%");
    }

    // 3. سريعة 20: سرعة >= 20
    if (speed >= 20) {
        unlockAchievement("سريعة 20");
    }

    // 4. الحلال: تمرين بدون أخطاء
    if (mistakes === 0) {
        unlockAchievement("الحلال");
    }

    // 5. المحترف: سرعة >= 50
    if (speed >= 50) {
        unlockAchievement("المحترف");
    }
}

function unlockAchievement(achievementId) {
    if (!userProgress.achievements[achievementId]) {
        userProgress.achievements[achievementId] = true;
        saveGameProgress();
        showAchievementNotification(achievementId);
        updateAchievementsUI();
    }
}

function showAchievementNotification(achievementId) {
    const ach = achievementsData.find(a => a.id === achievementId);
    if (!ach) return;

    // إزالة الإشعار القديم إن وجد
    const oldToast = document.querySelector('.achievement-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    const lang = userProgress.currentLanguage;
    
    const displayLang = lang === 'arabic' ? 'ar' : 'en';
    
    toast.innerHTML = `
        <div class="toast-title">
            <span>${ach.icon}</span>
            <span>${lang === 'arabic' ? 'إنجاز جديد:' : 'New Achievement:'} ${ach.name[displayLang]}</span>
        </div>
        <div class="toast-desc">${ach.desc[displayLang]}</div>
        <div class="toast-progress">
            <div class="toast-progress-bar"></div>
        </div>
    `;

    document.body.appendChild(toast);

    // تأثير صوتي (اختياري)
    try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        audio.volume = 0.3;
        audio.play();
    } catch (e) {}

    // إزالة التنبيه بعد 4 ثوانٍ
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// ==================== تحديث واجهة المستخدم ====================
function updateStatsUI() {
    const accuracyNum = document.getElementById('avgAccuracy');
    if (accuracyNum) {
        const acc = userProgress.stats.accuracy || userProgress.stats.bestAccuracy || 0;
        accuracyNum.textContent = acc;
        
        // تحديث شريط الدقة إذا وجد
        const barFill = document.getElementById('accuracyFill');
        if (barFill) {
            barFill.style.width = acc + '%';
            barFill.className = 'accuracy-fill';
            if (acc <= 50) barFill.classList.add('accuracy-low');
            else if (acc <= 80) barFill.classList.add('accuracy-mid');
            else barFill.classList.add('accuracy-high');
        }
    }

    const speedNum = document.getElementById('avgSpeed');
    if (speedNum) {
        const currentSpeed = userProgress.stats.speed || userProgress.stats.bestSpeed || 0;
        speedNum.textContent = Math.round(currentSpeed);
        
        // تحديث شريط مقارنة السرعة
        const speedBar = document.getElementById('speedBar');
        if (speedBar && userProgress.stats.bestSpeed > 0) {
            const percentage = (currentSpeed / userProgress.stats.bestSpeed) * 100;
            speedBar.style.width = Math.min(percentage, 100) + '%';
        }
    }

    const pointsNum = document.getElementById('userPoints');
    if (pointsNum) {
        animateCounter(pointsNum, parseInt(pointsNum.textContent) || 0, userProgress.points);
    }
}

function animateCounter(element, start, end) {
    if (start === end) return;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }
    requestAnimationFrame(update);
}

function updateAchievementsUI() {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    container.innerHTML = '';
    const lang = userProgress.currentLanguage;

    achievementsData.forEach(ach => {
        const isUnlocked = userProgress.achievements[ach.id];
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        const displayLang = lang === 'arabic' ? 'ar' : 'en';
        
        card.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <h4>${ach.name[displayLang]}</h4>
                <p>${ach.desc[displayLang]}</p>
            </div>
            <div class="achievement-status">
                ${isUnlocked ? '✅' : '🔒'}
            </div>
        `;
        container.appendChild(card);
    });
}

function resetProgress() {
    if (confirm(userProgress.currentLanguage === 'arabic' ? 'هل أنت متأكد من رغبتك في إعادة تعيين كل التقدم؟ لا يمكن التراجع عن هذا الفعل.' : 'Are you sure you want to reset all progress? This action cannot be undone.')) {
        localStorage.removeItem('leco_user_progress');
        location.reload();
    }
}
function setupLanguageSwitcher() {
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            // تبديل اللغة
            userProgress.currentLanguage = (userProgress.currentLanguage === 'arabic') ? 'english' : 'arabic';
            saveGameProgress(); // يحفظ userProgress بالكامل بما في ذلك اللغة
            localStorage.setItem('currentLanguage', userProgress.currentLanguage);
            
            // تطبيق التغييرات
            updateUITexts();
            
            // في هذا التطبيق، نحتاج لإعادة تحميل الصفحة لتحديث الدروس والنصوص المولدة
            location.reload();
        });
    }
}

// ==================== تحديث نصوص الواجهة حسب اللغة ====================
function updateUITexts() {
    const lang = userProgress.currentLanguage;
    const translations = i18n[lang];
    
    // تغيير اتجاه الصفحة
    document.documentElement.dir = lang === 'arabic' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'arabic' ? 'ar' : 'en';
    
    // تحديث عنوان الصفحة (إذا كان يحتوي على فاصل)
    if (document.title.includes(' - ')) {
        const parts = document.title.split(' - ');
        document.title = `${translations["site-title"]} - ${parts[1]}`;
    }

    // تحديث كافة العناصر التي تحمل السمة data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[key];
            } else {
                el.innerHTML = translations[key];
            }
        }
    });

    // تحديث نص زر اللغة
    const currentLangText = document.getElementById('currentLangText');
    if (currentLangText) {
        currentLangText.textContent = lang === 'arabic' ? 'العربية' : 'English';
    }

    // تحديث العناصر القديمة التي تعتمد على الـ ID لضمان عدم الكسر
    const legacyMap = {
        'nav-home': 'nav-home',
        'nav-lessons': 'nav-lessons',
        'nav-exercises': 'nav-exercises',
        'nav-progress': 'nav-progress',
        'nav-about': 'nav-about',
        'hero-title': 'hero-title',
        'hero-desc': 'hero-desc',
        'speed-test-title': 'speed-test-title',
        'time-label': 'timer-label',
        'speed-label': 'speed-label',
        'accuracy-label': 'accuracy-label',
        'start-btn': 'start-btn'
    };

    for (let [id, key] of Object.entries(legacyMap)) {
        const el = document.getElementById(id);
        if (el && translations[key]) {
            el.textContent = translations[key];
        }
    }
}

// ==================== إنشاء لوحة المفاتيح الافتراضية ====================
function setupKeyboardLayout() {
    const virtualKeyboard = document.getElementById('virtualKeyboard');
    if (!virtualKeyboard) return;
    
    const layouts = {
        arabic: [
            ['ذ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Back'],
            ['Tab', 'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د', '\\'],
            ['Caps', 'ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'Enter'],
            ['Shift', 'ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'Shift'],
            ['Space']
        ],
        english: [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Back'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Space']
        ]
    };
    
    function renderKeyboard(language) {
        const layout = layouts[language];
        virtualKeyboard.innerHTML = '';
        
        layout.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = `keyboard-row row-${rowIndex + 1}`;
            
            row.forEach((key, colIndex) => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'virtual-key';
                
                const lang = userProgress.currentLanguage;
                let displayKey = key;
                
                // Add width classes and localized labels
                if (key === 'Tab') {
                    keyDiv.classList.add('wide-tab');
                    displayKey = i18n[lang]["key-tab"] || key;
                } else if (key === 'Caps') {
                    keyDiv.classList.add('wide-caps');
                    displayKey = i18n[lang]["key-caps"] || key;
                } else if (key === 'Shift') {
                    keyDiv.classList.add('wide-shift');
                    displayKey = i18n[lang]["key-shift"] || key;
                } else if (key === 'Back') {
                    keyDiv.classList.add('wide-backspace');
                    displayKey = i18n[lang]["key-back"] || key;
                } else if (key === 'Enter') {
                    keyDiv.classList.add('wide-enter');
                    displayKey = i18n[lang]["key-enter"] || key;
                } else if (key === 'Space') {
                    keyDiv.classList.add('wide-space');
                    displayKey = i18n[lang]["key-space"] || key;
                }
                
                keyDiv.textContent = displayKey;
                keyDiv.setAttribute('data-key', key.toLowerCase());
                
                // Finger colors (exclude special keys for color guide consistency if needed, or color them)
                const isSpecial = ['Tab', 'Caps', 'Shift', 'Back', 'Enter', 'Space'].includes(key);
                if (!isSpecial) {
                    const colColors = [
                        '#ef4444','#ef4444','#f97316','#eab308','#22c55e','#22c55e',
                        '#14b8a6','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#ec4899','#ec4899'
                    ];
                    // Adjust color index for rows with special keys at start
                    let colorIdx = colIndex;
                    if (rowIndex === 1 || rowIndex === 2 || rowIndex === 3) colorIdx -= 1; // shift index because of Tab/Caps/Shift at start
                    
                    const color = colColors[Math.max(colorIdx, 0)];
                    keyDiv.style.borderTop = `2px solid ${color}`;
                } else if (key === 'Space') {
                     keyDiv.style.borderTop = `2px solid #6366f1`; // thumb color
                }
                
                // Highlight home keys
                if (['f', 'j', 'ب', 'ل', 'ا'].includes(key)) {
                    keyDiv.style.borderBottom = '3px solid #a78bfa';
                }
                
                rowDiv.appendChild(keyDiv);
            });
            
            virtualKeyboard.appendChild(rowDiv);
        });
    }
    
    renderKeyboard(userProgress.currentLanguage);
}

// ==================== توليد نص جديد للتمرين ====================
function generateNewText() {
    const language = userProgress.currentLanguage;
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
    
    // إذا لم يكن هناك نص محدد مسبقاً (عبر الدرس) نقوم بتوليد نص عشوائي
    if (!currentExercise.targetText) {
        currentExercise.targetText = generateNewText();
    }
    targetText.textContent = currentExercise.targetText;
    
    currentExercise.active = true;
    currentExercise.startTime = new Date();
    currentExercise.errors = 0;
    currentExercise.totalKeystrokes = 0;
    currentExercise.timeLimit = parseInt(document.getElementById('timeLimit').value);
    currentExercise.timeLeft = currentExercise.timeLimit;
    currentExercise.language = userProgress.currentLanguage;
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
    if (typingArea) typingArea.disabled = true;
    
    const pointsEarned = calculatePoints();
    userProgress.points += pointsEarned;
    
    // تحديث النظام الجديد
    updateAfterExercise(
        currentExercise.accuracy, 
        currentExercise.speed, 
        currentExercise.mistakes || 0,
        currentExercise.isLesson || false
    );
    
    displayResults(pointsEarned);
    
    const startBtn = document.querySelector('.exercise-controls .btn');
    if (startBtn) startBtn.disabled = false;
    
    const diff = document.getElementById('difficulty');
    if (diff) diff.disabled = false;
    
    const timeLim = document.getElementById('timeLimit');
    if (timeLim) timeLim.disabled = false;
}

// ==================== حساب النقاط ====================
function calculatePoints() {
    let points = 0;
    
    const timeBonus = Math.max(0, 100 - (currentExercise.timeLimit - currentExercise.timeLeft));
    const accuracyBonus = currentExercise.accuracy * 2;
    const speedBonus = currentExercise.speed * 3;
    const languageBonus = userProgress.currentLanguage === 'english' ? 20 : 10;
    
    points = Math.round(timeBonus + accuracyBonus + speedBonus + languageBonus);
    
    return points;
}

// تم استبدال saveExerciseResults بـ updateAfterExercise

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
    updateStatsUI(); // النظام الجديد يضم النقاط في updateStatsUI
}

// تم استبدال النظام القديم للإنجازات بالنظام الجديد التفاعلي

// ==================== تحميل الدروس ====================
function loadLessons() {
    const lessonsContainer = document.getElementById('lessonsContainer');
    if (!lessonsContainer) return;
    
    const currentLang = userProgress.currentLanguage;
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
                    ${userProgress.lessons.completed.includes(lesson.id) ? 'disabled' : ''}>
                    ${userProgress.lessons.completed.includes(lesson.id) 
                        ? (currentLang === 'arabic' ? '✓ مكتمل' : '✓ Completed') 
                        : (currentLang === 'arabic' ? 'ابدأ الدرس' : 'Start Lesson')}
                </button>
            </div>
        </div>
    `).join('');

    // تطبيق الفلتر الافتراضي (مبتدئ)
    filterLessons('beginner');
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
        if (tab.getAttribute('onclick').includes(`'${level}'`)) {
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
    const lang = userProgress.currentLanguage;
    const translations = i18n[lang];
    const labelPrefix = lang === 'arabic' ? 'تمرين' : 'Exercise';

    const history = userProgress.lessons.lessonsHistory;
    new Chart(speedCtx, {
        type: 'line',
        data: {
            labels: history.map((item, index) => `${labelPrefix} ${index + 1}`),
            datasets: [{
                label: translations["stat-avg-speed"] + ` (${translations["unit-wpm"]})`,
                data: history.map(item => item.speed),
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
    // Removed redeclaration of history
    new Chart(accuracyCtx, {
        type: 'line',
        data: {
            labels: history.map((item, index) => `${labelPrefix} ${index + 1}`),
            datasets: [{
                label: translations["stat-avg-accuracy"] + " (%)",
                data: history.map(item => item.accuracy),
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
    const history = userProgress.lessons.lessonsHistory;
    if (history.length > 0) {
        const avgSpeed = history.reduce((sum, item) => sum + item.speed, 0) / history.length;
        const avgAccuracy = history.reduce((sum, item) => sum + item.accuracy, 0) / history.length;
        
        const avgSpeedEl = document.getElementById('avgSpeed');
        if (avgSpeedEl) avgSpeedEl.textContent = Math.round(avgSpeed);
        
        const avgAccuracyEl = document.getElementById('avgAccuracy');
        if (avgAccuracyEl) avgAccuracyEl.textContent = Math.round(avgAccuracy);
    }
    
    const avgSpeed = parseInt(document.getElementById('avgSpeed').textContent);
    let levelKey = 'tab-beginner';
    if (avgSpeed > 40) levelKey = 'tab-intermediate';
    if (avgSpeed > 60) levelKey = 'tab-advanced';
    
    const lessonsCount = document.getElementById('completedCount');
    if (lessonsCount) lessonsCount.textContent = Array.isArray(userProgress.lessons.completed) ? userProgress.lessons.completed.length : userProgress.lessons.completed;
    
    const userLevel = document.getElementById('userLevel');
    if (userLevel) userLevel.textContent = i18n[userProgress.currentLanguage][levelKey];
}

// ==================== تحميل الإنجازات ====================
function loadAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    if (!achievementsList) return;
    
    const lang = userProgress.currentLanguage === 'arabic' ? 'ar' : 'en';
    
    achievementsList.innerHTML = achievementsData.map(ach => {
        const isEarned = userProgress.achievements[ach.id];
        return `
            <div class="achievement-card ${isEarned ? 'earned' : 'locked'}">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-info">
                    <h4>${ach.name[lang]}</h4>
                    <p>${ach.desc[lang]}</p>
                    ${isEarned ? '<span class="achievement-badge">✓</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ==================== حفظ ومتابعة ====================
function saveAndContinue() {
    // إضافة لدرس للتاريخ
    userProgress.lessons.lessonsHistory.push({
        date: new Date().toLocaleDateString(),
        accuracy: currentExercise.accuracy,
        speed: currentExercise.speed,
        lessonId: currentExercise.lessonId || null
    });

    if (currentExercise.isLesson && currentExercise.lessonId) {
        // إذا كان درساً، نعتبره مكتملاً
        if (!userProgress.lessons.completed.includes(currentExercise.lessonId)) {
            userProgress.lessons.completed.push(currentExercise.lessonId);
        }
    }
    
    saveGameProgress();
    
    if (confirm(userProgress.currentLanguage === 'arabic' ? 
                'تم حفظ تقدمك. هل تريد العودة لقائمة الدروس؟' : 
                'Your progress has been saved. Do you want to return to the lessons list?')) {
        window.location.href = 'lessons.html';
    } else {
        document.getElementById('exerciseResults').style.display = 'none';
        const startBtn = document.querySelector('.exercise-controls .btn');
        if (startBtn) startBtn.disabled = false;
    }
}

// ==================== حفظ التمرين الحالي ====================
function saveCurrentExercise() {
    if (currentExercise.active) {
        completeExercise();
    }
}

// ==================== مراقبة مغادرة الصفحة ====================
// ==================== رسالة ترحيب ====================
function showWelcomeMessage() {
    // التحقق من أننا في الصفحة الرئيسية
    if (!document.getElementById('startTest')) return;
    
    console.log("Welcome to LECO Keyboard!");
    // يمكن إضافة إشعار ترحيبي هنا مستقبلاً
}

window.addEventListener('beforeunload', function(e) {
    if (currentExercise.active) {
        e.preventDefault();
        e.returnValue = '';
    }
});
