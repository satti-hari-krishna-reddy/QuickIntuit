import React, { useState } from 'react';

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}

const Translate = () => {
    const [text, setText] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Detecting the language...');

    const handleTranslate = () => {
        // Add your translation logic here
        setTranslatedText(`Translated: ${text}`);
    };

    return (
        <div className="relative container mx-auto p-4 max-w-md rounded-md shadow-2xl z-[1000]"
        style={{
            backdropFilter: 'blur(18px)', 
        }}>
};
const languageMap = {
    af: "Afrikaans",
    ca: "Catalan",
    eo: "Esperanto",
    gd: "Scottish Gaelic",
    hu: "Hungarian",
    ka: "Georgian",
    lt: "Lithuanian",
    my: "Burmese",
    ru: "Russian",
    sr: "Serbian",
    uk: "Ukrainian",
    am: "Amharic",
    ceb: "Cebuano",
    es: "Spanish",
    gl: "Galician",
    hy: "Armenian",
    kk: "Kazakh",
    lv: "Latvian",
    ne: "Nepali",
    st: "Southern Sotho",
    ur: "Urdu",
    ar: "Arabic",
    co: "Corsican",
    et: "Estonian",
    gu: "Gujarati",
    id: "Indonesian",
    km: "Khmer",
    mg: "Malagasy",
    nl: "Dutch",
    sd: "Sindhi",
    su: "Sundanese",
    uz: "Uzbek",
    cs: "Czech",
    eu: "Basque",
    ha: "Hausa",
    ig: "Igbo",
    kn: "Kannada",
    mi: "Māori",
    no: "Norwegian",
    si: "Sinhala",
    sv: "Swedish",
    vi: "Vietnamese",
    az: "Azerbaijani",
    cy: "Welsh",
    fa: "Persian",
    haw: "Hawaiian",
    is: "Icelandic",
    ko: "Korean",
    mk: "Macedonian",
    ny: "Chichewa",
    sk: "Slovak",
    sw: "Swahili",
    xh: "Xhosa",
    be: "Belarusian",
    da: "Danish",
    fi: "Finnish",
    hi: "Hindi",
    it: "Italian",
    ku: "Kurdish",
    ml: "Malayalam",
    pa: "Punjabi",
    sl: "Slovenian",
    ta: "Tamil",
    yi: "Yiddish",
    bg: "Bulgarian",
    de: "German",
    fil: "Filipino",
    iw: "Hebrew",
    ky: "Kyrgyz",
    mn: "Mongolian",
    pl: "Polish",
    sm: "Samoan",
    te: "Telugu",
    yo: "Yoruba",
    el: "Greek",
    fr: "French",
    hmn: "Hmong",
    ja: "Japanese",
    la: "Latin",
    mr: "Marathi",
    ps: "Pashto",
    sn: "Shona",
    tg: "Tajik",
    zh: "Chinese",
    bn: "Bengali",
    fy: "Frisian",
    hr: "Croatian",
    lb: "Luxembourgish",
    ms: "Malay",
    pt: "Portuguese",
    so: "Somali",
    th: "Thai",
    bs: "Bosnian",
    en: "English",
    ga: "Irish",
    ht: "Haitian Creole",
    jv: "Javanese",
    lo: "Lao",
    mt: "Maltese",
    ro: "Romanian",
    sq: "Albanian",
    tr: "Turkish",
    zu: "Zulu",
};

const getLanguageName = (code) => languageMap[code] || "Unknown language";

export default Translate