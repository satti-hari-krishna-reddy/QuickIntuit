import { useState, useEffect } from 'react';
import Loader from './Loader';
import { detectLanguage } from '../detect-language';
import { translateText } from '../translate';
import PropTypes from 'prop-types';
import Dragable from 'react-draggable';

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}

// Supported language pairs
const supportedPairs = {
    en: ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'th', 'tr', 'vi', 'zh'],
    ar: ['en'],
    bn: ['en'],
    de: ['en'],
    es: ['en'],
    fr: ['en'],
    hi: ['en'],
    it: ['en'],
    ja: ['en'],
    ko: ['en'],
    nl: ['en'],
    pl: ['en'],
    pt: ['en'],
    ru: ['en'],
    th: ['en'],
    tr: ['en'],
    vi: ['en'],
    zh: ['en'],
};

// Language codes mapped to names
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

// Get the language name based on code
const getLanguageName = (code) => languageMap[code] || "Unknown language";

const Translate = ({ initialText, clear }) => {
    const [text, setText] = useState(initialText);
    const [originalText] = useState(initialText); 
    const [loadingMessage, setLoadingMessage] = useState('Detecting the language...');
    const [srcLang, setSrcLang] = useState('');
    const [tgtLang, setTgtLang] = useState('');
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        injectTailwindStyles();
        detectInitialLanguage();
    }, []);

    // Detect the initial language of the input text
    const detectInitialLanguage = async () => {
        try {
            const result = await detectLanguage(text);
            setLoading(false);
            setSrcLang(result);
        } catch (error) {
            console.error("Error detecting language:", error);
            setLoadingMessage("Error detecting language. Try again later.");
            setTimeout(() => {clear();}, 3000);
        }
    };

    // Handle text translation
    const handleTranslate = async () => {
        if (!srcLang || !tgtLang) return;
        
        setLoadingMessage("Translating text...");
        setLoading(true);
        
        try {
            const translatedText = await translateText(originalText, srcLang, tgtLang); // Always translate original text
            setText(translatedText);
            setLoading(false);
        } catch (error) {
            console.error("Error translating text:", error);
            setLoadingMessage("Error translating text. Try again later.");
            setTimeout(() => {clear();}, 3000);
            setLoading(false);
        }
    };

    return (
        <Dragable>
        <div className="relative container mx-auto p-4 max-w-md rounded-lg shadow-lg z-[1000] bg-gray-50"
            style={{ backdropFilter: 'blur(18px)' }}>
            
            {loading ? (
                <Loader message={loadingMessage} />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-xs text-white bg-blue-500 rounded-full px-3 py-1 font-semibold">
                            Language Translator
                        </div>
                        <button className="cursor-pointer text-gray-500 font-semibold hover:text-red-500 transition duration-150" 
                                onClick={clear}>
                            X
                        </button>
                    </div>

                    <div className="content-box p-4 bg-white rounded-md shadow-md mb-4">
                        <div className="mb-2 text-sm font-semibold text-gray-700">
                            {srcLang && <span>Detected Language: {getLanguageName(srcLang)}</span>}
                        </div>
                        <div className="text-md font-normal text-gray-700 whitespace-pre-wrap w-full mb-4 overflow-y-auto max-h-96">
                            {text}
                        </div>

                        <div className="mb-4">
                            <label className="text-md font-semibold text-gray-700 mb-1">
                                Translate to:
                            </label>
                            <select
                                value={tgtLang}
                                onChange={(e) => setTgtLang(e.target.value)}
                                className="select-option text-sm px-2 py-1 text-gray-600 border border-gray-300 rounded-md w-full"
                            >
                                <option hidden>Select Language</option>
                                {supportedPairs[srcLang]?.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {getLanguageName(lang)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button 
                            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md w-full transition duration-200"
                            onClick={handleTranslate}>
                            Translate
                        </button>
                    </div>
                </>
            )}
        </div>
        </Dragable>
    );
};


Translate.propTypes = {
    initialText: PropTypes.string.isRequired,
};
Translate.propTypes = {
    clear: PropTypes.func.isRequired,
};

export default Translate;
