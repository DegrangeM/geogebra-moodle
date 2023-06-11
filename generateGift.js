let defaultScriptUrl;
try {
    defaultScriptUrl = new URL('geogebra-moodle.js', document.currentScript.src).href;
}
catch(e){}

function createGiftGeogebraMoodle(options = {}) {
    let { titre_exo, script_url, APP_ID, variable, maxscore, graine } = options;


    typeof variable === 'undefined' && (variable = 'grade');
    typeof maxscore === 'undefined' && (maxscore = 100);
    !graine && (graine = parseInt(Math.random()*1000 + 1)); // Si graine = 0, alors on génère une graine fixe;
    typeof script_url === 'undefined' && (script_url = defaultScriptUrl);

    const giftEscape = s => s.replace(/[~=#{}:]/g, '\\$&') // échappement des caratères spéciaux pour les GIFT

    const GIFT_VARIABLE = variable !== 'grade' ? ` variable\\="${giftEscape(variable)}"` : '';
    const GIFT_MAXSCORE = maxscore !== '100' ? ` maxscore\\="${maxscore}"` : '';
    const GIFT_GRAINE = graine !== 'auto' ? ` graine\\="${graine}"` : '';

    const download_link = document.createElement('a');
    const GIFT = `:: Geogebra - ${giftEscape(titre_exo)} ::
<scr`+ `ipt src\\="${giftEscape(script_url)}" type\\="module"></scr` + `ipt>
<geogebra-moodle app\\="${giftEscape(APP_ID)}"${GIFT_VARIABLE}${GIFT_MAXSCORE}${GIFT_GRAINE} />
{
=%100%100=%90%90=%80%80=%70%70=%60%60=%50%50=%40%40=%30%30=%20%20=%10%10=%0%0
}`
    download_link.href = 'data:text/plain;charset=UTF-8,' + encodeURI(GIFT);
    download_link.download = 'geogebra-moodle-' + titre_exo + '.gift.txt';
    download_link.click();
}
