import deImg from './../assets/images/lang/NL.png';
import enImg from './../assets/images/lang/EN-US.png';
import frImg from './../assets/images/lang/FR.png';
import geImg from './../assets/images/lang/DE.png';
import itImg from './../assets/images/lang/IT.png';
import ruImg from './../assets/images/lang/RU.png';
import plImg from './../assets/images/lang/pl-PL.png';
import trImg from './../assets/images/lang/tr-TR.png';
import chImg from './../assets/images/lang/china.png';
import esImg from './../assets/images/lang/ES.png';
import ptImg from "./../assets/images/lang/PT.png";
import svImg from "./../assets/images/lang/SV.png";
export const LangOpt = [
    {
        name: "Dutch",
        lang: "nl",
        leafLocale: "nl",
        fullLangCode: "nl-NL",
        img: deImg,
        transKey: "nl",
    },
    {
        name: "English",
        lang: "en",
        leafLocale: "en",
        fullLangCode: "en-US",
        img: enImg,
        transKey: "en",
    },
    {
        name: "French",
        lang: "fr",
        leafLocale: "fr",
        fullLangCode: "fr-FR",
        img: frImg,
        transKey: "fr",
    },
    {
        name: "German",
        lang: "de",
        leafLocale: "de",
        fullLangCode: "de-DE",
        img: geImg,
        transKey: "de",
    },
    {
        name: "Italian",
        lang: "it",
        leafLocale: "it",
        fullLangCode: "it-IT",
        img: itImg,
        transKey: "it",
    },
    {
        name: "Russian",
        lang: "ru",
        leafLocale: "ru",
        fullLangCode: "ru-RU",
        img: ruImg,
        transKey: "ru",
    },
    {
        name: "Polish",
        lang: "pl",
        leafLocale: "pl",
        fullLangCode: "pl-PL",
        img: plImg,
        transKey: "pl",
    },
    {
        name: "Turkish",
        lang: "tr",
        leafLocale: "tr",
        fullLangCode: "tr-TR",
        img: trImg,
        transKey: "tr",
    },
    {
        name: "Simplified chinese",
        lang: "zh",
        leafLocale: "zh",
        fullLangCode: "zh-CN",
        img: chImg,
        transKey: "zh-Hans",
    },
    {
        name: "Spanish",
        lang: "es",
        leafLocale: "es",
        fullLangCode: "es-ES",
        img: esImg,
        transKey: "es",
    },
    {
        name: "traditional chinese",
        lang: "zh",
        leafLocale: "zht",
        fullLangCode: "zh-TW",
        img: chImg,
        transKey: "zh-Hant",
    },
    {
      name: "portuguese",
      lang: "pt",
      leafLocale: "pt",
      fullLangCode: "pt-PT",
      img: ptImg,
      transKey: "pt",
    },
    {
      name: "swedish",
      lang: "sv",
      leafLocale: "sv",
      fullLangCode: "sv-SV",
      img: svImg,
      transKey: "sv",
    },
];

export const getLanguageDetails = (language) => {
    let languageDetails = {};
    if (!language || (typeof language !== "string")) { return languageDetails };

    for (const opt of LangOpt) {
        if (opt.name.toUpperCase() === language.toUpperCase()) {
            languageDetails = opt;
            break;
        }
    };
    return languageDetails;
}