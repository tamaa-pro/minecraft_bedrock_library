(function() {
    // ***** الإعدادات *****
    const REQUIRED_KEY = "cyn"; 
    const BASE = "https://tamaa-pro.github.io/minecraft_bedrock_library/file";

    // **** دالة إغلاق النافذة فوراً ****
    function closeFast() {
        location.href = "about:blank";
    }

    // **** قراءة رابط الصفحة الأصلي ****
    let full = location.href;

    // **** منع التكرار عند إعادة التحميل ****
    if (sessionStorage.getItem("file_protect_done") === "yes") return;

    // **** استخراج الجزء بعد علامة ؟ الأولى فقط ****
    let query = full.split("?")[1] || "";

    // إذا لم يوجد شيء → أغلق
    if (!query) closeFast();

    // الآن لدينا شيء مثل:
    // https://site/file.apk/?cyn
    // أو
    // https://site/file.apk/
    // أو
    // https://site/file.apk

    // *** استخراج المفتاح إن وجد ***
    const hasKey = query.includes("/?" + REQUIRED_KEY) || query.endsWith("?" + REQUIRED_KEY);

    if (hasKey) {
        // حفظ المفتاح في الجلسة فقط
        sessionStorage.setItem("tamaa_key", REQUIRED_KEY);

        // إزالة المفتاح من الرابط
        query = query.replace("/?" + REQUIRED_KEY, "").replace("?" + REQUIRED_KEY, "");

    } else {
        // المفتاح غير موجود → أغلق فوراً
        closeFast();
    }

    // *** استخراج رابط الملف ***
    let fileUrl = query.trim();

    // يجب أن يبدأ بـ http أو https
    if (!fileUrl.startsWith("http")) closeFast();

    // حفظ رابط الملف في الجلسة
    sessionStorage.setItem("tamaa_file", fileUrl);

    // *** تنظيف رابط الصفحة ***
    // حذف كل شيء بعد /file/
    if (location.href !== BASE) {
        history.replaceState(null, "", BASE);
    }

    // منع تكرار العملية عند تحديث الصفحة
    sessionStorage.setItem("file_protect_done", "yes");
})();
