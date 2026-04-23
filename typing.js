// Project developed by Mohamed Ahmed Al-Bashir
// All rights reserved © 2026
console.log("🚀 Built by Mohamed Ahmed Al-Bashir — All rights reserved");

// ==================== هيكل البيانات (Progress System) ====================
let userProgress = {
    stats: {
        accuracy: 0,
        bestAccuracy: 0,
        speed: 0,
        bestSpeed: 0,
        totalWords: 0,
        correctWords: 0,
        errors: 0,
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
        "المحترف": false,
        "عاشق البرمجة": false,
        "سريع جدا": false,
        "منضبط": false,
        "القناص": false,
        "الأسطورة": false
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

// دالة التحقق من صحة هيكل البيانات المسترجعة
function validateProgress(data) {
    const template = {
        stats: { accuracy: 0, bestAccuracy: 0, speed: 0, bestSpeed: 0, totalWords: 0, correctWords: 0, errors: 0, perfectExercises: 0 },
        lessons: { completed: [], currentLesson: 1, lessonsHistory: [] },
        achievements: { "المتابعة": false, "الدفعة 95%": false, "سريعة 20": false, "الحلال": false, "المحترف": false, "عاشق البرمجة": false, "سريع جدا": false, "منضبط": false, "القناص": false, "الأسطورة": false },
        sessions: { totalPlayTime: 0, lastPlayed: null, streak: 0 },
        points: 0,
        currentLanguage: 'arabic',
        theme: 'light'
    };

    // دمج البيانات المسترجعة مع القالب لضمان عدم وجود خصائص مفقودة
    const merged = { ...template, ...data };
    merged.stats = { ...template.stats, ...data.stats };
    merged.lessons = { ...template.lessons, ...data.lessons };
    merged.achievements = { ...template.achievements, ...data.achievements };
    merged.sessions = { ...template.sessions, ...data.sessions };
    
    // التأكد من أن المصفوفات هي مصفوفات فعلاً
    if (!Array.isArray(merged.lessons.completed)) merged.lessons.completed = [];
    if (!Array.isArray(merged.lessons.lessonsHistory)) merged.lessons.lessonsHistory = [];
    
    return merged;
}

// وظيفة استرجاع البيانات المدمجة
function loadGameProgress() {
    const saved = localStorage.getItem('leco_user_progress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            userProgress = validateProgress(parsed);
        } catch (e) {
            console.error("Error parsing progress data:", e);
            // البقاء على القيم الافتراضية في حال الخطأ
        }
    } else {
        // محاولة الهجرة من النظام القديم إذا وجد
        if (userData.points > 0 || userData.completedLessons.length > 0) {
            userProgress.points = userData.points;
            userProgress.lessons.completed = Array.isArray(userData.completedLessons) ? userData.completedLessons : [];
            if (userData.speedHistory && userData.speedHistory.length > 0) {
                const speeds = userData.speedHistory.map(h => typeof h === 'object' ? h.speed : h).filter(s => !isNaN(s));
                if (speeds.length > 0) userProgress.stats.bestSpeed = Math.max(...speeds);
                
                const accuracies = userData.speedHistory.map(h => typeof h === 'object' ? h.accuracy : h).filter(a => !isNaN(a));
                if (accuracies.length > 0) userProgress.stats.bestAccuracy = Math.max(...accuracies);
            }
            saveGameProgress();
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
            
            // تهيئة واجهة المستخدم للدرس
            const targetDisplay = document.getElementById('targetText');
            if (targetDisplay) {
                targetDisplay.textContent = currentExercise.targetText;
                highlightTextState(); // تهيئة الأسبان
            }
            
            // تحديث العنوان ليظهر اسم الدرس
            const title = document.querySelector('.exercise-header h3');
            if (title) title.textContent = lesson.title;
            
            currentExercise.isLesson = true;
            currentExercise.lessonId = lesson.id;
            
            // التمييز الأولي للمفتاح
            highlightNextKey(currentExercise.targetText[0]);
        }
    }
}

// ==================== بيانات الإنجازات التعريفية ====================
const achievementsData = [
    { id: "المتابعة", name: { ar: "المتابعة", en: "Persistence" }, desc: { ar: "إكمال 5 دروس", en: "Complete 5 lessons" }, icon: "🏃" },
    { id: "الدفعة 95%", name: { ar: "الدفعة 95%", en: "Accuracy 95%" }, desc: { ar: "دقة ≥ 95% في تمرين", en: "Accuracy ≥ 95% in any exercise" }, icon: "🎯" },
    { id: "سريعة 20", name: { ar: "سريعة 20", en: "Speed 20" }, desc: { ar: "سرعة ≥ 20 كلمة/دقيقة", en: "Speed ≥ 20 WPM" }, icon: "⚡" },
    { id: "الحلال", name: { ar: "الحلال", en: "Halal (Perfect)" }, desc: { ar: "إكمال تمرين بدون أخطاء", en: "Complete an exercise with no errors" }, icon: "💯" },
    { id: "المحترف", name: { ar: "المحترف", en: "Professional" }, desc: { ar: "سرعة ≥ 50 كلمة/دقيقة", en: "Speed ≥ 50 WPM" }, icon: "👑" },
    { id: "عاشق البرمجة", name: { ar: "عاشق البرمجة", en: "Code Lover" }, desc: { ar: "إكمال أول تمرين برمجي", en: "Complete first coding exercise" }, icon: "💻" },
    { id: "سريع جدا", name: { ar: "سريع جدا", en: "Super Sonic" }, desc: { ar: "سرعة ≥ 80 كلمة/دقيقة", en: "Speed ≥ 80 WPM" }, icon: "🚀" },
    { id: "منضبط", name: { ar: "منضبط", en: "Disciplined" }, desc: { ar: "إكمال 10 دروس", en: "Complete 10 lessons" }, icon: "📅" },
    { id: "القناص", name: { ar: "القناص", en: "Sniper" }, desc: { ar: "إكمال 3 تمارين متتالية بدقة 100%", en: "Complete 3 exercises with 100% accuracy" }, icon: "🔭" },
    { id: "الأسطورة", name: { ar: "الأسطورة", en: "The Legend" }, desc: { ar: "تحقيق 10,000 نقطة", en: "Reach 10,000 points" }, icon: "💎" }
];

// ==================== بيانات الشارات ====================
const badgesData = [
    { id: "beginner", name: { ar: "مبتدئ واعد", en: "Rising Star" }, icon: "🌱", requirement: 1 },
    { id: "intermediate", name: { ar: "متدرب مجتهد", en: "Hard Worker" }, icon: "🛠️", requirement: 5 },
    { id: "pro", name: { ar: "خبير السرعة", en: "Speed Master" }, icon: "🚀", requirement: 10 },
    { id: "master", name: { ar: "أستاذ الكيبورد", en: "Keyboard Master" }, icon: "🎓", requirement: 20 },
    { id: "god", name: { ar: "إله الكتابة", en: "Typing God" }, icon: "✨", requirement: 50 }
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
        "nav-coding": "اختبار البرمجة",
        "nav-programming": "تعلم البرمجة",
        "nav-about": "عن الموقع",
        "hero-title": "أتقن الكتابة السريعة على الكيبورد",
        "hero-desc": "تعلم الكتابة بسرعة 60 كلمة في الدقيقة مع تمارين تفاعلية وممتعة",
        "speed-test-title": "اختبر سرعتك الآن",
        "test-text-default": "مرحبا بكم في موقع تعليم الكتابة السريعة",
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
        "footer-rights": "© 2026 محمد أحمد البشير — بكل فخر، نسخر شغفنا لنرتقي بمجتمع المبرمجين إلى آفاقٍ جديدة. جميع الحقوق محفوظة.",
        "lessons-title": "الدروس التعليمية",
        "lessons-desc": "اختر الدرس المناسب لمستواك",
        "tab-beginner": "مبتدئ",
        "tab-intermediate": "متوسط",
        "tab-advanced": "متقدم",
        "lesson-duration": "المدة",
        "lesson-start": "ابدأ الدرس",
        "points-label": "نقطة",
        "about-title": "حيث تلتقي سرعة الكتابة بعقلية المبرمج",
        "about-story-title": "مهمتنا",
        "about-story-desc": "في LECO Keyboard، نؤمن بأن كل سطر برمجي عظيم يبدأ بإتقان لوحة المفاتيح. نحن منصة تعليمية تقنية تُركّز على مهارتين أساسيتين لأي مستخدم ناجح خلف الشاشة: الكتابة السريعة بدقة قياسية، وتعلم أساسيات البرمجة بمنهجية منظمة. هدفنا أن يتحول الطالب من مستخدم عادي إلى مُنتج فعّال في العصر الرقمي.",
        "about-mission-title": "لماذا LECO؟",
        "about-mission-desc": "نُدرك أن الطلاب والمبرمجين المبتدئين يحتاجون إلى أكثر من مجرد تمارين — يحتاجون إلى أدوات قياس موثوقة وتغذية راجعة فورية. لهذا بنينا LECO على ثلاثة ركائز تقنية لا تُتنازل عنها:",
        "about-features-title": "ركائزنا التقنية",
        "about-feat-1": "دقة الحسابات: نقيس سرعتك بوحدة WPM مع حساب دقيق لمعدل الخطأ وصافي الكلمات الصحيحة، لأن الرقم الحقيقي هو ما يُحفّزك على التطور.",
        "about-feat-2": "المنهجية التعليمية: مسار تدريجي متكامل يبدأ من أساسيات استخدام لوحة المفاتيح، وصولاً إلى كتابة أكواد بلغة (HTML, CSS, JavaScript, Python, C++, PHP, Java) مُصمَّم خصيصًا للمبتدئ الذي يسعى للتفكير بعقلية المبرمج.",
        "about-feat-3": "تجربة مستخدم سلسة: واجهة ثنائية اللغة (عربي / إنجليزي)، تصميم داكن يُريح العينين، ومؤشرات تقدم مرئية تجعل التعلم تجربة تفاعلية لا تُنسى.",
        "about-feat-4": "نظام إنجازات وشارات يُحفّزك لتحطيم رقمك القياسي في كل جلسة",
        "about-feat-5": "محتوى مجاني 100% — لأن الوصول إلى التعليم التقني حق للجميع",
        "about-stat-exercises": "50+ تمرين تفاعلي",
        "about-stat-achievements": "نظام إنجازات",
        "about-stat-wpm": "دقة WPM",
        "about-stat-langs": "أكثر من 7 لغات",
        "about-stat-lessons-count": "أكثر من 20 درس",
        "about-stat-bilingual": "عربي / إنجليزي",
        "about-stat-free": "مجاني 100%",
        "about-cta-title": "ابدأ الآن",
        "about-cta-desc": "كل خبير كان مبتدئاً ذات يوم. ابدأ أول اختبار سرعة الآن، أو اغمر نفسك في أول درس برمجة — المقياس الحقيقي لتقدمك يبدأ بضغطة مفتاح.",
        "about-cta-btn": "ابدأ اختبار السرعة",
        "about-cta-btn2": "ابدأ أول درس برمجة",
        "role-ux": "مصمم تجربة المستخدم",
        "role-dev": "مطور الواجهات الأمامية",
        "role-content": "مطور المحتوى التعليمي",
        "progress-title": "مسار تقدمك",
        "stats-speed": "أفضل سرعة",
        "stats-accuracy": "متوسط الدقة",
        "stats-lessons": "الدروس المكتملة",
        "achievements-title": "إنجازاتك",
        "badges-title": "الشارات التي حصلت عليها",
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
        "prog-explore-btn": "ابدأ التعلم الآن",
        "coding-test-title": "اختبار البرمجة التفاعلي",
        "coding-test-desc": "اكتب الكود وجربه مباشرة هنا",
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
        "prog-feat-3-desc": "تعلم خطوة بخطوة من الصفر حتى الاحتراف",
        "result-title": "نتيجة التمرين",
        "result-max-speed": "السرعة القصوى:",
        "result-avg-accuracy": "متوسط الدقة:",
        "result-keystrokes": "إجمالي الضغطات:",
        "result-points": "النقاط المكتسبة:",
        "result-save-btn": "حفظ النتيجة والمتابعة"
    },
    english: {
        "site-title": "Learn Typing",
        "nav-home": "Home",
        "nav-lessons": "Lessons",
        "nav-exercises": "Exercises",
        "nav-progress": "Progress",
        "nav-coding": "Coding Test",
        "nav-programming": "Learn Coding",
        "nav-about": "About",
        "hero-title": "Master Touch Typing",
        "hero-desc": "Learn to type 60 WPM with fun and interactive exercises",
        "speed-test-title": "Test Your Speed Now",
        "test-text-default": "Welcome to the typing speed learning website",
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
        "footer-rights": "© 2026 Mohamed Ahmed Al-Bashir — Proudly leveraging our passion to elevate the developer community to new horizons. All rights reserved.",
        "lessons-title": "Educational Lessons",
        "lessons-desc": "Choose the right level for you",
        "tab-beginner": "Beginner",
        "tab-intermediate": "Intermediate",
        "tab-advanced": "Advanced",
        "lesson-duration": "Duration",
        "lesson-start": "Start Lesson",
        "points-label": "Points",
        "about-title": "Where Typing Speed Meets the Programmer's Mindset",
        "about-story-title": "Our Mission",
        "about-story-desc": "At LECO Keyboard, we believe every great line of code starts with mastering your keyboard. We are a tech-focused educational platform built around two fundamental skills every successful screen-user needs: precision-driven touch typing and structured programming fundamentals. Our goal is to transform every learner from a passive user into a productive digital creator.",
        "about-mission-title": "Why LECO?",
        "about-mission-desc": "Students and beginner programmers need more than exercises — they need reliable measurement tools and instant, actionable feedback. That's why LECO is built on three non-negotiable technical pillars:",
        "about-features-title": "Our Key Pillars",
        "about-feat-1": "Technical Accuracy: We measure your speed in true WPM with precise error-rate and net-correct-word calculations — because an honest number is what drives real improvement.",
        "about-feat-2": "Structured Methodology: A comprehensive progressive path starting from keyboard fundamentals to writing code in (HTML, CSS, JavaScript, Python, C++, PHP, Java), specifically designed for beginners who aim to think with a programmer's mindset.",
        "about-feat-3": "Seamless UX: A bilingual (Arabic / English) interface, eye-friendly dark mode, and visual progress indicators that make every session an engaging, interactive experience.",
        "about-feat-4": "Achievement & badge system to motivate you to break your personal record every session",
        "about-feat-5": "100% free content — because access to technical education is a right, not a privilege",
        "about-stat-exercises": "50+ Exercises",
        "about-stat-achievements": "Achievements",
        "about-stat-wpm": "WPM Precision",
        "about-stat-langs": "7+ Languages",
        "about-stat-lessons-count": "20+ Lessons",
        "about-stat-bilingual": "AR / EN",
        "about-stat-free": "100% Free",
        "about-cta-title": "Start Now",
        "about-cta-desc": "Every expert was once a beginner. Take your first speed test right now, or dive into your first coding lesson — your true progress starts with a single keystroke.",
        "about-cta-btn": "Start Speed Test",
        "about-cta-btn2": "Start First Coding Lesson",
        "role-ux": "UX Designer",
        "role-dev": "Frontend Developer",
        "role-content": "Educational Content Developer",
        "progress-title": "Your Progress Path",
        "stats-speed": "Best Speed",
        "stats-accuracy": "Avg. Accuracy",
        "stats-lessons": "Lessons Completed",
        "achievements-title": "Your Achievements",
        "badges-title": "Earned Badges",
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
        "prog-explore-btn": "Start Learning Now",
        "coding-test-title": "Interactive Coding Test",
        "coding-test-desc": "Write code and test it live here",
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
        "prog-feat-3-desc": "Progress from zero to professional mastery",
        "result-title": "Exercise Result",
        "result-max-speed": "Max Speed:",
        "result-avg-accuracy": "Avg. Accuracy:",
        "result-keystrokes": "Total Keystrokes:",
        "result-points": "Points Earned:",
        "result-save-btn": "Save Result & Continue"
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
    },
    // دروس إضافية عربية
    {
        id: 11,
        title: "الدرس السادس: التنوين والشدة",
        level: "intermediate",
        language: "arabic",
        description: "تدرب على علامات التشكيل الأساسية",
        content: "التنوين: ً ٍ ٌ - الشدة: ّ",
        exercises: ["محمدٌ كتاباً مدرسةٍ يحبُّ"],
        duration: "20 دقيقة",
        completed: false,
        points: 90
    },
    {
        id: 12,
        title: "الدرس السابع: الأرقام والرموز",
        level: "intermediate",
        language: "arabic",
        description: "تعلم كتابة الأرقام والرموز الشائعة",
        content: "الأرقام: ١٢٣٤٥٦٧٨٩٠ - الرموز: ! @ # $ % & *",
        exercises: ["١٢٣ ٤٥٦ ٧٨٩ !@# $%&"],
        duration: "15 دقيقة",
        completed: false,
        points: 70
    },
    {
        id: 13,
        title: "الدرس الثامن: نصوص أدبية قصيرة",
        level: "advanced",
        language: "arabic",
        description: "كتابة فقرات من الأدب العربي",
        content: "تدرب على نصوص متصلة وطويلة",
        exercises: ["إنما الأمم الأخلاق ما بقيت فإن هم ذهبت أخلاقهم ذهبوا"],
        duration: "30 دقيقة",
        completed: false,
        points: 150
    },
    {
        id: 14,
        title: "الدرس التاسع: السرعة والتركيز",
        level: "advanced",
        language: "arabic",
        description: "تحدي السرعة في كتابة كلمات متنوعة",
        content: "مزيج من الكلمات الصعبة والسهلة",
        exercises: ["استكشاف تكنولوجيا المستقبل يتطلب إرادة وعمل مستمر"],
        duration: "25 دقيقة",
        completed: false,
        points: 120
    },
    {
        id: 15,
        title: "الدرس العاشر: الاختبار الشامل",
        level: "advanced",
        language: "arabic",
        description: "اختبر مهاراتك في نص شامل",
        content: "نص يحتوي على كافة الحروف والرموز",
        exercises: ["تعلم الكتابة السريعة هو مفتاح النجاح في العصر الرقمي الحديث 2026!"],
        duration: "40 دقيقة",
        completed: false,
        points: 200
    },
    // Additional English Lessons
    {
        id: 16,
        title: "Lesson 6: Capital Letters & Punctuation",
        level: "intermediate",
        language: "english",
        description: "Use Shift key and common punctuation",
        content: "Practice: . , ? ! ' \" ( )",
        exercises: ["Does he like it? Yes, he does!"],
        duration: "20 minutes",
        completed: false,
        points: 90
    },
    {
        id: 17,
        title: "Lesson 7: Numbers & Special Symbols",
        level: "intermediate",
        language: "english",
        description: "Learn top row numbers and symbols",
        content: "Numbers: 1234567890 Symbols: @#$%^&*",
        exercises: ["Price: $19.99 @ 10% discount!"],
        duration: "15 minutes",
        completed: false,
        points: 75
    },
    {
        id: 18,
        title: "Lesson 8: Business English Phrases",
        level: "advanced",
        language: "english",
        description: "Type professional emails and phrases",
        content: "Common workplace language",
        exercises: ["Please find the attached document for your review."],
        duration: "30 minutes",
        completed: false,
        points: 140
    },
    {
        id: 19,
        title: "Lesson 9: Famous Quotes",
        level: "advanced",
        language: "english",
        description: "Type inspirational quotes by famous people",
        content: "Longer connected sentences",
        exercises: ["The best way to predict the future is to create it."],
        duration: "25 minutes",
        completed: false,
        points: 130
    },
    {
        id: 20,
        title: "Lesson 10: Final Master Challenge",
        level: "advanced",
        language: "english",
        description: "The ultimate test for English typing",
        content: "A mix of everything you've learned",
        exercises: ["Professional touch typing requires 100% focus and zero mistakes in 2026!"],
        duration: "45 minutes",
        completed: false,
        points: 250
    },
    // Programming & Coding Lessons
    {
        id: 21,
        title: "Programming: HTML Tags",
        level: "intermediate",
        language: "english",
        description: "Practice typing standard HTML tags",
        content: "<div>, <span>, <section>, <footer>",
        exercises: ["<div class='container'><p>Hello</p></div>"],
        duration: "10 min",
        completed: false,
        points: 100
    },
    {
        id: 22,
        title: "Programming: Python Print",
        level: "intermediate",
        language: "english",
        description: "Learn Python print and variables",
        content: "print, input, variables",
        exercises: ["name = input('Name: ')\nprint('Hello ' + name)"],
        duration: "10 min",
        completed: false,
        points: 100
    },
    {
        id: 23,
        title: "Programming: Java Class",
        level: "advanced",
        language: "english",
        description: "Basic Java class structure",
        content: "public class, main, System.out",
        exercises: ["public class Test {\n  public static void main(String[] args) {\n  }\n}"],
        duration: "15 min",
        completed: false,
        points: 150
    },
    {
        id: 24,
        title: "برمجة: وسوم HTML",
        level: "intermediate",
        language: "arabic",
        description: "تدرب على كتابة وسوم HTML الأساسية",
        content: "وسوم: div, p, h1, span",
        exercises: ["<div class='box'><h1>مرحباً</h1></div>"],
        duration: "10 دقيقة",
        completed: false,
        points: 100
    },
    {
        id: 25,
        title: "برمجة: لغة Python",
        level: "intermediate",
        language: "arabic",
        description: "أساسيات لغة بايثون",
        content: "print, variables, input",
        exercises: ["x = 5\ny = 10\nprint(x + y)"],
        duration: "10 دقيقة",
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
    loadBadges();
    
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
    
    if (typeof setupSpeedTest === 'function' && document.getElementById('testText')) {
        setupSpeedTest();
    }
    
    if (typeof setupTypingExercise === 'function' && document.getElementById('typingArea')) {
        setupTypingExercise();
    }
    
    // تهيئة لوحة المفاتيح ديناميكياً إذا كان الحاوي موجوداً
    if (document.querySelector('.keyboard-diagram')) {
        renderKeyboard('.keyboard-diagram');
    }
    
    // إعداد مزامنة الكيبورد الحقيقي
    setupPhysicalKeyboardSync();

    // إذا كنا في صفحة التقدم
    if (document.getElementById('speedChart')) {
        if (typeof initCharts === 'function') initCharts();
    }
    
    // نظام الحفظ التلقائي الدوري (كل دقيقة)
    setInterval(() => {
        if (currentExercise.active && currentExercise.startTime) {
            userProgress.sessions.lastPlayed = new Date().toISOString();
        }
        saveGameProgress();
    }, 60000);
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
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // إغلاق القائمة عند النقر على رابط أو التنقل
        navMenu.querySelectorAll('a').forEach(link => {
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
    let errors = 0;
    let typedChars = 0;
    const lang = userProgress.currentLanguage;
    let targetText = lang === 'arabic' 
        ? "مرحبا بكم في موقع تعليم الكتابة السريعة" 
        : "Welcome to the typing speed learning website";
    
    // عرض النص وتحديث الاتجاه
    if (testDisplay) {
        testDisplay.innerHTML = targetText;
        testDisplay.setAttribute('lang', lang === 'arabic' ? 'ar' : 'en');
        testDisplay.style.direction = lang === 'arabic' ? 'rtl' : 'ltr';
        testDisplay.classList.add('test-running');
    }
    if (input) {
        input.style.direction = lang === 'arabic' ? 'rtl' : 'ltr';
        input.setAttribute('lang', lang === 'arabic' ? 'ar' : 'en');
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
        const targetText = lang === 'arabic' 
            ? "مرحبا بكم في موقع تعليم الكتابة السريعة" 
            : "Welcome to the typing speed learning website";
        
        typedChars = userText.length;
        
        // حساب الأخطاء والسرعة والدقة
        let currentMistakes = 0;
        let highlighted = '';
        let currentGroupClass = '';
        let currentGroupText = '';

        for (let i = 0; i < targetText.length; i++) {
            let charClass = '';
            if (i < userText.length) {
                if (userText[i] === targetText[i]) {
                    charClass = 'correct-char';
                } else {
                    charClass = 'error-char';
                    currentMistakes++;
                }
            } else if (i === userText.length) {
                charClass = 'active-char';
            }

            if (charClass === currentGroupClass) {
                currentGroupText += targetText[i];
            } else {
                if (currentGroupText) {
                    highlighted += `<span class="${currentGroupClass}">${currentGroupText}</span>`;
                }
                currentGroupClass = charClass;
                currentGroupText = targetText[i];
            }
        }
        if (currentGroupText) {
            highlighted += `<span class="${currentGroupClass}">${currentGroupText}</span>`;
        }
        
        errors = currentMistakes;
        if (testDisplay) testDisplay.innerHTML = highlighted;
        
        // حساب السرعة (WPM = (chars/5) / minutes)
        const timeElapsedMinutes = (60 - timeLeft) / 60;
        const speed = timeElapsedMinutes > 0 ? Math.round((typedChars / 5) / timeElapsedMinutes) : 0;
        if (speedSpan) speedSpan.textContent = speed;
        
        // حساب الدقة
        const accuracy = typedChars > 0 ? Math.round(((typedChars - errors) / typedChars) * 100) : 100;
        if (accuracySpan) accuracySpan.textContent = Math.max(0, accuracy);
        
        // تمييز المفاتيح في الاختبار أيضاً
        if (userText.length > 0) {
            highlightKey(userText[userText.length - 1]);
        }
        highlightNextKey(targetText[userText.length]);

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
    // إزالة علامة الاختبار الجاري من عرض النص
    const testDisplay = document.querySelector('.test-text');
    if (testDisplay) testDisplay.classList.remove('test-running');
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
function updateAfterExercise(accuracy, speed, errors, lessonCompleted = false) {
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
    userProgress.stats.errors += errors;
    if (errors === 0) {
        userProgress.stats.perfectExercises += 1;
    }

    // تحديث الدروس
    if (lessonCompleted && currentExercise.lessonId) {
        if (!userProgress.lessons.completed.includes(currentExercise.lessonId)) {
            userProgress.lessons.completed.push(currentExercise.lessonId);
        }
        
        // تحديث الدرس الحالي (الدرس التالي المتاح)
        const allLessonIds = lessons.map(l => l.id).sort((a, b) => a - b);
        const nextLesson = allLessonIds.find(id => !userProgress.lessons.completed.includes(id));
        userProgress.lessons.currentLesson = nextLesson || allLessonIds[allLessonIds.length - 1];
    }

    // حفظ الوقت والتاريخ
    userProgress.sessions.lastPlayed = new Date().toISOString();
    
    // تحديث وقت التدريب (بناءً على الوقت المستغرق في التمرين)
    const timeSpentSeconds = (new Date() - currentExercise.startTime) / 1000;
    userProgress.sessions.totalPlayTime += timeSpentSeconds;

    // تحديث إجمالي الكلمات (بافتراض الكلمة 5 حروف)
    userProgress.stats.totalWords += Math.floor(currentExercise.totalKeystrokes / 5);
    userProgress.stats.correctWords += Math.floor((currentExercise.totalKeystrokes - currentExercise.errors) / 5);
    
    // التحقق من الإنجازات
    checkAchievements(accuracy, speed, errors);
    
    // إضافة التمرين للتاريخ تلقائياً (حفظ تلقائي)
    userProgress.lessons.lessonsHistory.push({
        date: new Date().toLocaleDateString(),
        accuracy: accuracy,
        speed: speed,
        lessonId: currentExercise.lessonId || null
    });

    // حفظ وعرض
    saveGameProgress();
    updateStatsUI();
    
    // تحديث واجهة الدروس فوراً إذا كانت موجودة
    if (typeof loadLessons === 'function') loadLessons();
}

function checkAchievements(accuracy, speed, errors) {
    // 1. المتابعة: إكمال 5 دروس
    if (userProgress.lessons.completed.length >= 5) {
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
    if (errors === 0) {
        unlockAchievement("الحلال");
    }

    // 5. المحترف: سرعة >= 50
    if (speed >= 50) {
        unlockAchievement("المحترف");
    }

    // 6. سريع جدا: سرعة >= 80
    if (speed >= 80) {
        unlockAchievement("سريع جدا");
    }

    // 7. منضبط: إكمال 10 دروس
    if (userProgress.lessons.completed.length >= 10) {
        unlockAchievement("منضبط");
    }

    // 8. الأسطورة: 10,000 نقطة
    if (userProgress.points >= 10000) {
        unlockAchievement("الأسطورة");
    }

    // 9. القناص: 3 تمارين متتالية بدقة 100%
    const history = userProgress.lessons.lessonsHistory;
    if (history.length >= 3) {
        const last3 = history.slice(-3);
        if (last3.every(ex => ex.accuracy === 100)) {
            unlockAchievement("القناص");
        }
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

    // تحديث كافة عناصر النقاط (بما في ذلك الموبايل)
    const pointsElements = document.querySelectorAll('.user-points-val');
    pointsElements.forEach(el => {
        animateCounter(el, parseInt(el.textContent) || 0, userProgress.points);
    });
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
    loadAchievements();
}

function loadAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    container.innerHTML = '';
    const lang = userProgress.currentLanguage;
    const displayLang = lang === 'arabic' ? 'ar' : 'en';

    achievementsData.forEach(ach => {
        const isUnlocked = userProgress.achievements[ach.id];
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
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
// كاش للعناصر المترجمة لتحسين الأداء
let i18nCache = null;

function updateUITexts() {
    const lang = userProgress.currentLanguage;
    const translations = i18n[lang];
    
    // تغيير اتجاه الصفحة
    document.documentElement.dir = lang === 'arabic' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'arabic' ? 'ar' : 'en';
    
    // تحديث عنوان الصفحة
    if (document.title.includes(' - ')) {
        const parts = document.title.split(' - ');
        document.title = `${translations["site-title"]} - ${parts[1]}`;
    }

    // استخدام الكاش لتجنب البحث المتكرر في DOM
    if (!i18nCache) {
        i18nCache = document.querySelectorAll('[data-i18n]');
    }

    i18nCache.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[key];
            } else if (el.classList.contains('preserve-icons')) {
                const icon = el.querySelector('i');
                el.textContent = translations[key];
                if (icon) el.prepend(icon);
            } else {
                el.textContent = translations[key];
            }
        }
    });

    // تحديث نص زر اللغة
    const currentLangText = document.getElementById('currentLangText');
    if (currentLangText) {
        currentLangText.textContent = lang === 'arabic' ? 'العربية' : 'English';
    }

    // تحديث نصوص الاختبار
    const testTextEl = document.getElementById('testText');
    if (testTextEl && !testTextEl.classList.contains('test-running')) {
        testTextEl.textContent = translations['test-text-default'] || 
            (lang === 'arabic' ? 'مرحبا بكم في موقع تعليم الكتابة السريعة' : 'Welcome to the typing speed learning website');
        testTextEl.style.direction = lang === 'arabic' ? 'rtl' : 'ltr';
    }
}

// ==================== توليد لوحة المفاتيح ديناميكياً ====================
const KEYBOARD_DATA = [
    [
        { k: '`', c: '#ef4444' }, { k: '1', c: '#ef4444' }, { k: '2', c: '#f97316' }, { k: '3', c: '#eab308' },
        { k: '4', c: '#22c55e' }, { k: '5', c: '#22c55e' }, { k: '6', c: '#14b8a6' }, { k: '7', c: '#14b8a6' },
        { k: '8', c: '#3b82f6' }, { k: '9', c: '#8b5cf6' }, { k: '0', c: '#ec4899' }, { k: '-', c: '#ec4899' },
        { k: '=', c: '#ec4899' }, { k: 'Back', c: '#ec4899', cls: 'wide-backspace', i18n: 'key-back' }
    ],
    [
        { k: 'Tab', cls: 'wide-tab', i18n: 'key-tab' }, { k: 'q', c: '#ef4444' }, { k: 'w', c: '#f97316' },
        { k: 'e', c: '#eab308' }, { k: 'r', c: '#22c55e' }, { k: 't', c: '#22c55e' }, { k: 'y', c: '#14b8a6' },
        { k: 'u', c: '#14b8a6' }, { k: 'i', c: '#3b82f6' }, { k: 'o', c: '#8b5cf6' }, { k: 'p', c: '#ec4899' },
        { k: '[', c: '#ec4899' }, { k: ']', c: '#ec4899' }, { k: '\\', c: '#ec4899' }
    ],
    [
        { k: 'Caps', cls: 'wide-caps', i18n: 'key-caps' }, { k: 'a', c: '#ef4444' }, { k: 's', c: '#f97316' },
        { k: 'd', c: '#eab308' }, { k: 'f', c: '#22c55e', home: true }, { k: 'g', c: '#22c55e' },
        { k: 'h', c: '#14b8a6' }, { k: 'j', c: '#14b8a6', home: true }, { k: 'k', c: '#3b82f6' },
        { k: 'l', c: '#8b5cf6' }, { k: ';', c: '#ec4899' }, { k: "'", c: '#ec4899' },
        { k: 'Enter', cls: 'wide-enter', c: '#ec4899', i18n: 'key-enter' }
    ],
    [
        { k: 'Shift', cls: 'wide-shift', i18n: 'key-shift' }, { k: 'z', c: '#ef4444' }, { k: 'x', c: '#f97316' },
        { k: 'c', c: '#eab308' }, { k: 'v', c: '#22c55e' }, { k: 'b', c: '#22c55e' }, { k: 'n', c: '#14b8a6' },
        { k: 'm', c: '#14b8a6' }, { k: ',', c: '#3b82f6' }, { k: '.', c: '#8b5cf6' }, { k: '/', c: '#ec4899' },
        { k: 'Shift', cls: 'wide-shift', i18n: 'key-shift' }
    ],
    [
        { k: 'Space', cls: 'wide-space', c: '#6366f1', i18n: 'key-space' }
    ]
];

function renderKeyboard(selector) {
    const containers = document.querySelectorAll(selector);
    if (containers.length === 0) return;

    containers.forEach(container => {
        container.innerHTML = '';
        KEYBOARD_DATA.forEach((row, index) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = `keyboard-row row-${index + 1}`;
            
            row.forEach(keyData => {
                const keyDiv = document.createElement('div');
                keyDiv.className = `key ${keyData.cls || ''}`;
                if (keyData.c) keyDiv.style.borderTop = `2px solid ${keyData.c}`;
                if (keyData.home) keyDiv.style.borderBottom = `3px solid #a78bfa`;
                if (keyData.i18n) keyDiv.setAttribute('data-i18n', keyData.i18n);
                
                keyDiv.textContent = keyData.k;
                rowDiv.appendChild(keyDiv);
            });
            container.appendChild(rowDiv);
        });
    });
    
    if (typeof updateUITexts === 'function') updateUITexts();
}

function setupPhysicalKeyboardSync() {
    const handler = (e, isDown) => {
        let key = e.key;
        if (key === ' ') key = 'Space';
        if (key === 'Backspace') key = 'Back';
        if (key === 'Enter') key = 'Enter';
        if (key === 'Tab') key = 'Tab';
        if (key === 'CapsLock') key = 'Caps';
        if (key === 'Shift') key = 'Shift';

        const virtualKeys = document.querySelectorAll(`.virtual-key, .key`);
        virtualKeys.forEach(vk => {
            const vkText = vk.textContent.trim().toLowerCase();
            const vkData = vk.getAttribute('data-key');
            if (vkText === key.toLowerCase() || vkData === key.toLowerCase()) {
                vk.classList[isDown ? 'add' : 'remove']('pressed');
            }
        });
    };

    window.addEventListener('keydown', (e) => handler(e, true));
    window.addEventListener('keyup', (e) => handler(e, false));
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
    
    // التهيئة البصرية للنص
    highlightTextState();
    highlightNextKey(currentExercise.targetText[0]);
    
    typingArea.addEventListener('input', handleTyping);
    
    document.getElementById('exerciseResults').style.display = 'none';
}

// ==================== معالجة الكتابة ====================
function handleTyping(e) {
    const userInput = e.target.value;
    const targetText = currentExercise.targetText;
    
    currentExercise.totalKeystrokes++;
    
    // حساب الأخطاء بشكل تراكمي أدق
    let currentMistakes = 0;
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== targetText[i]) {
            currentMistakes++;
        }
    }
    currentExercise.errors = currentMistakes;
    
    // تحديث الدقة: (الضغطات الصحيحة / إجمالي الضغطات)
    // أو بشكل أبسط: ((طول النص المكتوب - الأخطاء) / طول النص المكتوب)
    const accuracy = userInput.length > 0 ? 
        Math.max(0, Math.round(((userInput.length - currentMistakes) / userInput.length) * 100)) : 100;
    currentExercise.accuracy = accuracy;
    
    updateSpeed();
    updateExerciseStats();
    highlightTextState();
    
    if (userInput.length > 0) {
        highlightKey(userInput[userInput.length - 1]);
    }
    highlightNextKey(targetText[userInput.length]);

    if (userInput.length >= targetText.length) {
        completeExercise();
    }
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

// ==================== تمييز الخطأ والحرف النشط ====================
function highlightTextState(position) {
    const targetDisplay = document.getElementById('targetText');
    if (!targetDisplay) return;

    const targetText = currentExercise.targetText;
    const userInput = document.getElementById('typingArea').value;
    
    let highlighted = '';
    let currentGroupClass = '';
    let currentGroupText = '';

    for (let i = 0; i < targetText.length; i++) {
        let charClass = '';
        if (i < userInput.length) {
            charClass = userInput[i] === targetText[i] ? 'correct-char' : 'error-char';
        } else if (i === userInput.length) {
            charClass = 'active-char';
        }

        if (charClass === currentGroupClass) {
            currentGroupText += targetText[i];
        } else {
            if (currentGroupText) {
                highlighted += `<span class="${currentGroupClass}">${currentGroupText}</span>`;
            }
            currentGroupClass = charClass;
            currentGroupText = targetText[i];
        }
    }
    if (currentGroupText) {
        highlighted += `<span class="${currentGroupClass}">${currentGroupText}</span>`;
    }
    
    targetDisplay.innerHTML = highlighted;
}

// ==================== إضاءة المفتاح التالي ====================
function highlightNextKey(char) {
    // إزالة التمييز السابق
    document.querySelectorAll('.virtual-key, .key').forEach(k => k.classList.remove('next-key-highlight'));
    
    if (!char) return;

    const virtualKeys = document.querySelectorAll('.virtual-key, .key');
    const normalizedChar = char === ' ' ? 'space' : char.toLowerCase();
    
    virtualKeys.forEach(k => {
        const kText = k.textContent.trim().toLowerCase();
        const kData = k.getAttribute('data-key');
        
        if (kText === normalizedChar || kData === normalizedChar) {
            k.classList.add('next-key-highlight');
        }
    });
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
    if (timePassed <= 0) return;

    // WPM = (Total characters typed / 5) / time in minutes
    // Net WPM = ((Total - Errors) / 5) / time
    const grossWpm = (currentExercise.totalKeystrokes / 5) / timePassed;
    const netWpm = Math.max(0, ((currentExercise.totalKeystrokes - currentExercise.errors) / 5) / timePassed);
    
    currentExercise.speed = Math.round(netWpm);
    const speedEl = document.getElementById('currentSpeed');
    if (speedEl) speedEl.textContent = currentExercise.speed;
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
        currentExercise.errors || 0,
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
    updateStatsUI();
    updateProgressStats();
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
                <button class="btn lesson-btn" data-lesson-id="${lesson.id}" 
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
        if (tab.dataset.level === level) {
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

// إضافة مستمعات للأحداث للتبويبات وأزرار الدروس
document.addEventListener('click', function(e) {
    // تصفية الدروس
    if (e.target.classList.contains('level-tab')) {
        const level = e.target.dataset.level;
        if (level) filterLessons(level);
    }
    
    // بدء الدرس
    const lessonBtn = e.target.closest('.lesson-btn');
    if (lessonBtn && !lessonBtn.disabled) {
        const lessonId = parseInt(lessonBtn.dataset.lessonId);
        if (lessonId) startLesson(lessonId);
    }
});

// ==================== تهيئة الرسوم البيانية ====================
// تخزين مثيلات الرسوم البيانية لمنع تسرب الذاكرة
let chartInstances = {
    speed: null,
    accuracy: null
};

function initCharts() {
    const speedCanvas = document.getElementById('speedChart');
    const accuracyCanvas = document.getElementById('accuracyChart');
    if (!speedCanvas || !accuracyCanvas) return;
    
    // تدمير الرسوم البيانية القديمة إذا وجدت
    if (chartInstances.speed) chartInstances.speed.destroy();
    if (chartInstances.accuracy) chartInstances.accuracy.destroy();
    
    const speedCtx = speedCanvas.getContext('2d');
    const lang = userProgress.currentLanguage;
    const translations = i18n[lang];
    const labelPrefix = lang === 'arabic' ? 'تمرين' : 'Exercise';

    const history = userProgress.lessons.lessonsHistory;
    chartInstances.speed = new Chart(speedCtx, {
        type: 'line',
        data: {
            labels: history.map((item, index) => `${labelPrefix} ${index + 1}`),
            datasets: [{
                label: translations["stat-avg-speed"] + ` (${translations["unit-wpm"]})`,
                data: history.map(item => item.speed),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#94a3b8', font: { family: 'Cairo', size: 12 } }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { family: 'Cairo', size: 14 },
                    bodyFont: { family: 'Cairo', size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b', font: { family: 'Outfit' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { family: 'Outfit' } }
                }
            }
        }
    });
    
    const accuracyCtx = accuracyCanvas.getContext('2d');
    // Removed redeclaration of history
    chartInstances.accuracy = new Chart(accuracyCtx, {
        type: 'line',
        data: {
            labels: history.map((item, index) => `${labelPrefix} ${index + 1}`),
            datasets: [{
                label: translations["stat-avg-accuracy"] + " (%)",
                data: history.map(item => item.accuracy),
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointBackgroundColor: '#48bb78',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#94a3b8', font: { family: 'Cairo', size: 12 } }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { family: 'Cairo', size: 14 },
                    bodyFont: { family: 'Cairo', size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b', font: { family: 'Outfit' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { family: 'Outfit' } }
                }
            }
        }
    });
    
    updateProgressStats();
}

// ==================== تحديث إحصائيات التقدم ====================
function updateProgressStats() {
    const history = userProgress.lessons.lessonsHistory;
    let avgSpeedVal = 0;
    
    if (history.length > 0) {
        avgSpeedVal = history.reduce((sum, item) => sum + item.speed, 0) / history.length;
        const avgAccuracy = history.reduce((sum, item) => sum + item.accuracy, 0) / history.length;
        
        const avgSpeedEl = document.getElementById('avgSpeed');
        if (avgSpeedEl) avgSpeedEl.textContent = Math.round(avgSpeedVal);
        
        const avgAccuracyEl = document.getElementById('avgAccuracy');
        if (avgAccuracyEl) avgAccuracyEl.textContent = Math.round(avgAccuracy);
    } else {
        // استخدام القيم الإحصائية الأساسية إذا لم يوجد تاريخ
        avgSpeedVal = userProgress.stats.speed || userProgress.stats.bestSpeed || 0;
    }
    
    let levelKey = 'tab-beginner';
    if (avgSpeedVal > 40) levelKey = 'tab-intermediate';
    if (avgSpeedVal > 60) levelKey = 'tab-advanced';
    
    const lessonsCountElements = document.querySelectorAll('.completed-count-val');
    lessonsCountElements.forEach(el => {
        el.textContent = userProgress.lessons.completed.length;
    });
    
    const userLevel = document.getElementById('userLevel');
    if (userLevel) userLevel.textContent = i18n[userProgress.currentLanguage][levelKey];

    // تحديث وقت التدريب بالساعات
    const totalTimeEl = document.getElementById('totalTime');
    if (totalTimeEl) {
        const hours = (userProgress.sessions.totalPlayTime / 3600).toFixed(2);
        totalTimeEl.textContent = hours;
    }

    // تحديث إحصائيات إضافية
    const perfectEl = document.getElementById('perfectExercises');
    if (perfectEl) perfectEl.textContent = userProgress.stats.perfectExercises || 0;

    const wordsEl = document.getElementById('totalWords');
    if (wordsEl) wordsEl.textContent = userProgress.stats.totalWords || 0;
}

/* ======================================================
   LECO Keyboard — Dark Premium Theme
   Project developed by Mohamed Ahmed Al-Bashir
   All rights reserved © 2026
   Color Palette: Deep Navy + Indigo + Violet Accents
   ====================================================== */

console.log("LECO Keyboard System Initialized - Developed by Mohamed Ahmed Al-Bashir");

// ==================== إعادة تعيين التقدم ====================
function resetProgress() {
    const lang = userProgress.currentLanguage;
    const confirmMsg = lang === 'arabic' ? 
        "هل أنت متأكد من حذف كافة البيانات؟ لا يمكن التراجع عن هذه الخطوة." : 
        "Are you sure you want to delete all data? This action cannot be undone.";
        
    if (confirm(confirmMsg)) {
        localStorage.removeItem('leco_user_progress');
        localStorage.removeItem('typingPoints');
        localStorage.removeItem('speedHistory');
        localStorage.removeItem('accuracyHistory');
        localStorage.removeItem('achievements');
        localStorage.removeItem('completedLessons');
        location.reload();
    }
}

// تم دمج loadAchievements مع updateAchievementsUI

// ==================== تحميل الشارات ====================
function loadBadges() {
    const container = document.getElementById('badgesList');
    if (!container) return;

    container.innerHTML = '';
    const lang = userProgress.currentLanguage;
    const displayLang = lang === 'arabic' ? 'ar' : 'en';

    badgesData.forEach(badge => {
        const isEarned = userProgress.lessons.completed.length >= badge.requirement;
        const card = document.createElement('div');
        card.className = `achievement-card ${isEarned ? 'earned' : 'locked'}`;
        
        card.innerHTML = `
            <div class="achievement-icon">${badge.icon}</div>
            <div class="achievement-info">
                <h4>${badge.name[displayLang]}</h4>
                <p>${isEarned ? (lang === 'arabic' ? 'تم الحصول عليها' : 'Earned') : (lang === 'arabic' ? 'قيد التقدم' : 'In Progress')}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==================== حفظ ومتابعة ====================
function saveAndContinue() {
    // تم نقل الحفظ التلقائي لتاريخ التمارين إلى updateAfterExercise
    
    if (confirm(userProgress.currentLanguage === 'arabic' ? 
                'تم حفظ تقدمك تلقائياً. هل تريد العودة لقائمة الدروس؟' : 
                'Your progress has been saved automatically. Do you want to return to the lessons list?')) {
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
