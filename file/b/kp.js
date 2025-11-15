(function(){
  try{
    const ss=sessionStorage;
    const url=new URL(location.href);
    const base="https://tamaa-pro.github.io/minecraft_bedrock_library/file/";
    let full=url.href;

    // منع أي تأخير قبل تعديل الرابط
    document.documentElement.style.display="none";

    // استخراج الجزء بعد علامة ؟ الأولى
    let query=full.split("?")[1]||"";

    // المفتاح من الجلسة
    let savedKey=ss.getItem("key")||null;
    let savedFile=ss.getItem("file")||null;

    // إذا لم يتم حفظ المفتاح مسبقًا نبحث عنه في الرابط الحالي
    if(!savedKey){
      if(query.includes("?cyn")){
        ss.setItem("key","cyn");
        query=query.replace("?cyn","").replace("??","?");
      } else {
        // لا يوجد مفتاح → إغلاق فوري
        location.replace("about:blank");
        return;
      }
    }

    // بعد تأمين المفتاح نتحقق من رابط الملف
    if(!savedFile){
      if(query.startsWith("http")){
        ss.setItem("file",query);
      } else {
        // لا رابط ملف → الصفحة بلا فائدة
        location.replace("about:blank");
        return;
      }
    }

    // تنظيف الرابط من كل شيء
    history.replaceState({}, "", base);

    // إعادة إظهار الصفحة بعد الحماية
    document.documentElement.style.display="";
  }catch(e){
    location.replace("about:blank");
  }
})();
