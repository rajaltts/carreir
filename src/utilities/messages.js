const deTranslate = () => import(/* webpackChunkName: "deTranslate" */ './locale/translate-de.json');
const enTranslate = () => import(/* webpackChunkName: "enTranslate" */ './locale/translate-en.json');
const esTranslate = () => import(/* webpackChunkName: "esTranslate" */ './locale/translate-es.json');
const frTranslate = () => import(/* webpackChunkName: "frTranslate" */ './locale/translate-fr.json');
const itTranslate = () => import(/* webpackChunkName: "itTranslate" */ './locale/translate-it.json');
const nlTranslate = () => import(/* webpackChunkName: "nlTranslate" */ './locale/translate-nl.json');
const plTranslate = () => import(/* webpackChunkName: "plTranslate" */ './locale/translate-pl.json');
const ruTranslate = () => import(/* webpackChunkName: "ruTranslate" */ './locale/translate-ru.json');
const trTranslate = () => import(/* webpackChunkName: "trTranslate" */ './locale/translate-tr.json');
const zhTranslate = () => import(/* webpackChunkName: "zhTranslate" */ './locale/translate-zh-CHS.json');
const zhCHTTranslate = () => import(/* webpackChunkName: "zhCHTTranslate" */ './locale/translate-zh-CHT.json');
const ptTranslate = () => import(/* webpackChunkName: "ptTranslate" */ './locale/translate-pt.json');
const svTranslate = () => import(/* webpackChunkName: "svTranslate" */ './locale/translate-sv.json');

export default {
    de: deTranslate,
    en: enTranslate,
    es: esTranslate,
    fr: frTranslate,
    it: itTranslate,
    nl: nlTranslate,
    pl: plTranslate,
    ru: ruTranslate,
    tr: trTranslate,
    zh: zhTranslate,
    zht: zhCHTTranslate,
    pt: ptTranslate,
    sv: svTranslate
}