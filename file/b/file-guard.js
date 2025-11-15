(function() {
    const KEY_NAME = "tps_key";
    const FILE_NAME = "tps_file";

    const qs = location.search.replace("?", "");

    if (!qs) {
        sessionStorage.removeItem(KEY_NAME);
        sessionStorage.removeItem(FILE_NAME);
        location.replace("about:blank");
        return;
    }

    const parts = qs.split("?");
    const mainUrl = parts[0] || "";
    const key = parts[1] || null;

    let storedKey = sessionStorage.getItem(KEY_NAME);
    let storedFile = sessionStorage.getItem(FILE_NAME);

    if (key) {
        sessionStorage.setItem(KEY_NAME, key);
        storedKey = key;
    }

    if (!storedKey) {
        sessionStorage.removeItem(FILE_NAME);
        location.replace("about:blank");
        return;
    }

    if (mainUrl && mainUrl.startsWith("http")) {
        sessionStorage.setItem(FILE_NAME, mainUrl);
        storedFile = mainUrl;
    }

    if (location.search !== "?") {
        history.replaceState(null, "", location.pathname + "?");
    }
})();
