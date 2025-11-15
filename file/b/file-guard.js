(function(){

    // منع أي فرصة للعرض قبل الفحص
    document.documentElement.style.display = "none";

    // مفاتيح الجلسة (لا تحفظ خارج النافذة)
    let sessionKey = sessionStorage.getItem("tamaa_file_key") || null;
    let sessionFile = sessionStorage.getItem("tamaa_file_url") || null;

    // الحصول على الرابط الكامل الذي تم فتح الصفحة به
    let fullQuery = location.search.replace("?", "").trim();

    // إذا كان لدينا بيانات جلسة محفوظة مسبقاً (من نفس النافذة)
    if(sessionKey && sessionFile){
        document.documentElement.style.display = "block";
        window.fileKey = sessionKey;
        window.fileUrl = sessionFile;
        return;
    }

    // إذا لا يوجد أي شيء في الرابط → أغلق فوراً
    if(!fullQuery){
        location.href = "about:blank";
        return;
    }

    // تقسيم الاستعلام الأول والثاني:
    // ?[file_url]/?[key]
    let parts = fullQuery.split("/?");

    let fileUrl = parts[0] || "";
    let key = parts[1] || "";

    // ✔ التحقق من وجود المفتاح
    if(!key || key.length < 1){
        location.href = "about:blank";
        return;
    }

    // ✔ حفظ المفتاح في الجلسة الحالية فقط
    sessionStorage.setItem("tamaa_file_key", key);

    // ✔ التحقق من رابط الملف
    if(!fileUrl.startsWith("http")){
        location.href = "about:blank";
        return;
    }

    // ✔ حفظ رابط الملف في الجلسة الحالية فقط
    sessionStorage.setItem("tamaa_file_url", fileUrl);

    // إزالة المفتاح من الرابط فوراً لمنع نسخه
    let cleanURL = location.origin + location.pathname + "?" + fileUrl;
    history.replaceState(null, "", cleanURL);

    // إظهار الصفحة بعد نجاح الفحص
    document.documentElement.style.display = "block";

    // توفير القيم لباقي السكريبتات في الصفحة
    window.fileKey = key;
    window.fileUrl = fileUrl;

})();
