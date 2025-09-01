/*
** The TwinFlame Horoscope API
** - returns daily horoscopes
**
** ©2023-2025 TwinFlame Development, LLC
** https://github.com/TwinFlame-Development/horoscopeAPI
*/

const moment = require('moment');

// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Instantiates a client
const translate = new Translate({<your_projectId>});

/**
 * Translates the provided text into the specified target language.
 *
 * @param {string} text - The text to translate.
 * @param {string} targetLanguage - The target language code (e.g., 'ru', 'es').
 * @returns {Promise<string>} - The translated text.
 */
async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

// Usage logging:
async function quotaManager(token, name) {
    console.log(`Logging API call from -> ${name}!`);
    
    // ...
    // add loging & quota management here

  }

exports.horoscopeAPIprod = async (req, res) => {

    //find client IP address (this assumes forwarded request; modify for your use case):
    const clientIP = req.headers['x-forwarded-for'] || req.ip;
    console.info(`Received request from ${clientIP}`);

    //simple white/blacklisting:
    // Define arrays of allowed and blocked IP addresses
    const allowedIPs = ['192.168.1.1', '10.0.0.1', '172.16.0.1'];
    const blockedIPs = ['192.168.1.2', '10.0.0.2', '172.16.0.2'];

    // Set a flag to allow all IPs on the whitelist
    const allowAll = true;

    // Check if the client IP address is in the blockedIPs array
    if (blockedIPs.includes(clientIP)) {
        // Deny the request
        console.info(`403 - Address: ${clientIP} is blacklisted.`); // Log the blocked IP
        res.status(403).send('Access denied'); // Send a 403 Forbidden response
        return;
    } else if (allowedIPs.includes(clientIP) || allowAll) {
        // Allow the request
        console.info(`Address: ${clientIP} is whitelisted.`); // Log the allowed IP
    } else {
        // Deny the request
        console.log(`403 - Address: ${clientIP} is not whitelisted.`); // Log the denied IP
        res.status(403).send('Access denied'); // Send a 403 Forbidden response
        return;
    }

    // Set CORS headers for preflight requests
    // Allows GETs/POSTs from any origin with the Content-Type header
    // and caches preflight response for 3600s

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    } 

    //load horoscope data from file:
    const horoscopeJSON = require('./config.json');

    // Define tokens & create a nested object for the subscriptions:
    const tokenJSON = {
        '2': {
            name: 'Expired Token Ex',
            expiration: '03-31-2020',
            translation_entitlement: true
        },
        'mmEUtLATc8w_UNnHuR2': {
            name: 'Github Trial',
            expiration: '05-01-2027',
            translation_entitlement: true
        },
    };
  
    console.info('Received request -> ' + req.method);

    // --- Params ---
    const qs = req.query, body = req.body || {};
    let date  = (typeof qs.date  !== 'undefined') ? qs.date  : body.date;
    let sign  = (typeof qs.sign  !== 'undefined') ? qs.sign  : body.sign;
    let range = (typeof qs.range !== 'undefined') ? qs.range : body.range;
    let noDate    = (typeof qs.nodate    !== 'undefined') ? qs.nodate    : body.nodate;
    let noHistory = (typeof qs.nohistory !== 'undefined') ? qs.nohistory : body.nohistory;
    let shorthoro = (typeof qs.shorthoro !== 'undefined') ? qs.shorthoro : body.shorthoro;
    let language  = (typeof qs.language  !== 'undefined') ? qs.language  : body.language;

    //check that parameters are not sent more than once:
    if (Array.isArray(sign) || Array.isArray(date) || Array.isArray(token)) {
        let badSign = '400 Bad Request - sign is null!';
        console.info('400 Bad Request - Duplicate parameters!');
        res.status(400).send('Bad Request - Duplicate parameters provided');
        return;
    } 
    
    //check token:
    if (token === null) {
        let badToken = '401 - Unauthorized -> Token is null: ' + token;
        console.info(badToken);
        res.status(401).send('Unauthorized');
        return;
    }

    if (typeof token === 'undefined') {
        // This will not throw a reference error and will evaluate to true
        let badToken = '401 - Unauthorized -> Token is undefined: ' + token;
        console.info(badToken);
        res.status(401).send('Unauthorized');
        return;
    }

    if (!tokenJSON[token.toString()]) {
        let badToken = '401 - Unauthorized -> Token is not authorized: ' + token;
        console.info(badToken);
        res.status(401).send('Unauthorized');
        return;
    } else {
        //check the subscription date of the token:
        // Parse the date string
        const [month, day, year] = tokenJSON[token.toString()].expiration.split('-');
        // Create a new Date object from the parsed values
        const tokenExp = new Date(year, month - 1, day);
        const now = new Date();
        if (now.getTime() > tokenExp.getTime()) {
            //Expired subscription:
            console.info('401 - Expired subscription for token: ' + token.toString() + ' (' + tokenJSON[token.toString()].name + ') -> Exp: ' + tokenExp.toLocaleDateString('en-US')  );
            res.status(401).send('Unauthorized - Token Expired');
            return;
          } else {
            //valid subscription
            console.info('Checked subscription for token: ' + token.toString() + ' (' + tokenJSON[token.toString()].name + ') -> Exp: ' + tokenExp.toLocaleDateString('en-US')  );
            quotaManager(token, tokenJSON[token.toString()].name);
          }

    }

    //check the date range of the horoscopes that the API can respond to:
    const jsonObjNames = Object.keys(horoscopeJSON.Scorpio)
        .filter(key => typeof horoscopeJSON.Scorpio[key] === 'object' && !Array.isArray(horoscopeJSON.Scorpio[key]))
        .map(key => key.toString());

    // Find the lowest & highest date value
    let lowestDate;
    let highestDate;
    jsonObjNames.forEach(date => {
        // Parse the date string
        const [month, day, year] = date.split('-');
        // Create a new Date object from the parsed values
        const dateValue = new Date(year, month - 1, day);
        if (dateValue && (!lowestDate || dateValue < lowestDate)) {
            lowestDate = dateValue;
        }
        if (dateValue && (!highestDate || dateValue > highestDate)) {
            highestDate = dateValue;
        }
    });

    if (!!range) {

        let goodToken = '200 - Success -> Range from: ' + lowestDate.toLocaleDateString('en-US') + ' -> ' +  highestDate.toLocaleDateString('en-US');
        console.info(goodToken);

        res.status(200).json({
            'earliest_date': lowestDate.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}),
            'latest_date': highestDate.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})
          });
    
        return
    }

    // Validate translation entitlement
    var performTranslation = false;

    if (!!language) {
        // Only allow specific languages
        const allowedLanguages = [
            'ab', 'ace', 'ach', 'af', 'sq', 'alz', 'am', 'ar', 'hy', 'as', 'awa', 'ay', 'az',
            'ban', 'bm', 'ba', 'eu', 'btx', 'bts', 'bbc', 'be', 'bem', 'bn', 'bew', 'bho', 'bik', 'bs', 'br', 'bg', 'bua',
            'yue', 'ca', 'ceb', 'ny', 'zh-CN', 'zh', 'zh-TW', 'cv', 'co', 'crh', 'hr', 'cs',
            'da', 'din', 'dv', 'doi', 'dov', 'nl', 'dz',
            'eo', 'et', 'ee', 
            'fj', 'fil', 'tl', 'fi', 'fr', 'fr-FR', 'fr-CA', 'fy', 'ff',
            'gaa', 'gl', 'lg', 'ka', 'de', 'el', 'gn', 'gu',
            'ht', 'cnh', 'ha', 'haw', 'iw', 'he', 'hil', 'hi', 'hmn', 'hu', 'hrx',
            'is', 'ig', 'ilo', 'id', 'ga', 'it',
            'ja', 'jw', 'jv',
            'kn', 'pam', 'kk', 'km', 'cgg', 'rw', 'ktu', 'gom', 'ko', 'kri', 'ku', 'ckb', 'ky',
            'lo', 'ltg', 'la', 'lv', 'lij', 'li', 'ln', 'lt', 'lmo', 'luo', 'lb',
            'mk', 'mai', 'mak', 'mg', 'ms', 'ms-Arab', 'ml', 'mt', 'mi', 'mr', 'chm', 'mni-Mtei', 'min', 'lus', 'mn', 'my',
            'nr', 'new', 'ne', 'nso', 'no', 'nus',
            'oc', 'or', 'om',
            'pag', 'pap', 'ps', 'fa', 'pl', 'pt', 'pt-PT', 'pt-BR', 'pa', 'pa-Arab', 
            'qu', 
            'rom', 'ro', 'rn', 'ru',
            'sm', 'sg', 'sa', 'gd', 'sr', 'st', 'crs', 'shn', 'sn', 'scn', 'szl', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'ss', 'sv',
            'tg', 'ta', 'tt', 'te', 'tet', 'th', 'ti', 'ts', 'tn', 'tr', 'tk', 'ak',
            'uk', 'ur', 'ug', 'uz', 
            'vi',
            'cy', 
            'xh',
            'yi', 'yo', 'yua', 
            'zu'
        ];
        if (!allowedLanguages.includes(language)) {
            console.info(`400 - Bad Request -> Unsupported language: ${language}`);
            res.status(400).send('Unsupported translation language');
            return;
        }

        // Check if token is entitled to translation
        if (!tokenJSON[token.toString()].translation_entitlement) {
            let badToken = '401 - Unauthorized -> Token is not authorized for translation: ' + token;
            console.info(badToken);
            res.status(401).send('Translation Unauthorized');
            return;
        } else {
            performTranslation = true;
            console.info("User: ", tokenJSON[token.toString()].name," requests translation to -> ", language); // log translation request
        }
    }
    
    //validate sign:
    if (sign === null ) {
        let badSign = '400 Bad Request - sign is null!';
        console.info(badSign);
        res.status(400).send('Bad Request - No sign provided');
        return;
    }

    if (typeof sign === 'undefined') {
        // This will not throw a reference error and will evaluate to true
        let badSign = '400 Bad Request - sign is undefined!';
        console.info(badSign);
        res.status(400).send('Bad Request - No sign provided');
        return;
    }

    //validate date:
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (date === null) {
        let badDate = '400 Bad Request - date is null!';
        console.info(badDate);
        res.status(400).send('Bad Request - No date provided');
        return;
    }

    if (typeof date === 'undefined') {
        // This will not throw a reference error and will evaluate to true
        let badDate = '400 Bad Request - date is undefined!';
        console.info(badDate);
        res.status(400).send('Bad Request - No date provided');
        return;
    }

    const parsedDate = Date.parse(date); // parse the input date into milliseconds since Unix epoch

    if (isNaN(parsedDate)) { // check if the parsed date is NaN
        console.info("Invalid date input -> ", date); // log an error message if the date is invalid
    } else { // check if the parsed date is different from the formatted date
        const formattedDate = new Date(parsedDate).toLocaleDateString("en-US", { // create a new Date object with the parsed date and format it to "mm-dd-yyyy" format
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        }).replace(/\//g, "-"); // replace all occurrences of "/" with "-" to get "mm-dd-yyyy" format
        if (formattedDate != date ) {
            console.info("Date input converted from -> ", date, ' to ->', formattedDate); // log a message indicating that the input date was converted
            date = formattedDate; // update the date variable with the formatted date
        }
    }
    
    if (dateRegex.test(date)) {
        //date string was in the valid format
        
    } else {
        //date string was not in the valid format, so check for today, yesterday, or today:
        date = date.toLowerCase();
        
        switch (date) {
            case "today":
                const today = new Date();
                const tddateString = today.toLocaleDateString('en-US');
    
                // To get date in mm-dd-yyyy format
                const tddateArray = tddateString.split('/');
                const tdformattedDateString = `${tddateArray[0].padStart(2, '0')}-${tddateArray[1].padStart(2, '0')}-${tddateArray[2]}`;
    
                date = tdformattedDateString;
                console.info('Requested TODAY so using date -> ' + date);
                break;
            case "yesterday":
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const ytdateString = yesterday.toLocaleDateString('en-US');
    
                // To get date in mm-dd-yyyy format
                const ytdateArray = ytdateString.split('/');
                const ytformattedDateString = `${ytdateArray[0].padStart(2, '0')}-${ytdateArray[1].padStart(2, '0')}-${ytdateArray[2]}`;
    
                date = ytformattedDateString;
                console.info('Requested YESTERDAY so using date -> ' + date);
                break;
            case "tomorrow":
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tmdateString = tomorrow.toLocaleDateString('en-US');
    
                // To get date in mm-dd-yyyy format
                const tmdateArray = tmdateString.split('/');
                const tmformattedDateString = `${tmdateArray[0].padStart(2, '0')}-${tmdateArray[1].padStart(2, '0')}-${tmdateArray[2]}`;
    
                date = tmformattedDateString;
                console.info('Requested TOMORROW so using date -> ' + date);
                break;
            case "this_week":
            case "next_week":
            case "last_week":
                console.info('Requested weekly horoscope so using -> ' + date);

                //format the Sign
                let searchSign = sign.toLowerCase();
                searchSign = searchSign.charAt(0).toUpperCase() + searchSign.slice(1);

                // check for valid sign:
                const zodiacSigns = ["Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"];

                if (zodiacSigns.includes(searchSign)) {
                    //valid
                    let weeklyDateFormatted = ''
                    switch (date) {
                        case "this_week":
                            // get Monday of current week
                            const monday = moment().locale('en-gb').startOf('week');
                            
                            // format Monday as "mm-dd-yyyy"
                            weeklyDateFormatted = monday.format('MM-DD-YYYY');
                            break;
                        case "next_week":
                            // get Monday of next week
                            const mondayNextWeek = moment().locale('en-gb').add(1, 'weeks').startOf('week');

                            // format Monday as "mm-dd-yyyy"
                            weeklyDateFormatted = mondayNextWeek.format('MM-DD-YYYY');
                            break;
                        case "last_week":
                            // get Monday of last week
                            const mondayLastWeek = moment().locale('en-gb').subtract(1, 'weeks').startOf('week');

                            // format Monday as "mm-dd-yyyy"
                            weeklyDateFormatted = mondayLastWeek.format('MM-DD-YYYY');
                            break;
                        default:
                            break;   
                    }
                    
                    //check range:
                    // Parse the date string
                    const [month, day, year] = weeklyDateFormatted.split('-');

                    // Create a new Date object from the parsed values
                    const requestedDate = new Date(year, month - 1, day);

                    if (requestedDate.getTime() > highestDate.getTime()) {
                        //newer than available horoscope range:
                        console.info('404 - Requested weekly date newer than range -> ' + date);
                        res.status(404).send('Not Found - date out of range');
                        return;
                    } else if (requestedDate.getTime() < lowestDate.getTime()) {
                        //older than available horoscope range:
                        console.info('404 - Requested weekly date older than range -> ' + date);
                        res.status(404).send('Not Found - date out of range');
                        return;
                    }
                    
                    let description = performTranslation
                        ? await translateText(horoscopeJSON["weekly"][searchSign][weeklyDateFormatted]["description"], language)
                        : horoscopeJSON["weekly"][searchSign][weeklyDateFormatted]["description"];
              
                    console.info('200 - Success -> Token : ' + token + ' -> Weekly horoscope for - ', weeklyDateFormatted); 

                    res.status(200).json({
                        'current_date': weeklyDateFormatted,
                        'description': description
                    });    
                    return;
                } else if (searchSign == 'All') {
                    //call for all of the signs for the requested date:
                    console.info('400 Bad Request - Invalid Zodiac Sign for Weekly -> ' + searchSign);
                    res.status(400).send('Bad Request - Invalid sign provided');
                    return;

                } else {
                    //not a valid sign:
                    console.info('400 Bad Request - Invalid Zodiac Sign -> ' + searchSign);
                    res.status(400).send('Bad Request - Invalid sign provided');
                    return;
                }

                return;  
            default:
                console.info('400 Bad Request - Invalid date string -> ' + date);
                res.status(400).send('Bad Request - Invalide date provided');
                return;
                break;
        }
        
    }

    //check range:
    // Parse the date string
    const [month, day, year] = date.split('-');

    // Create a new Date object from the parsed values
    const requestedDate = new Date(year, month - 1, day);

    if (requestedDate.getTime() > highestDate.getTime()) {
        //newer than available horoscope range:
        console.info('404 - Requested date newer than range -> ' + date);
        res.status(404).send('Not Found - date out of range');
        return;
    } else if (requestedDate.getTime() < lowestDate.getTime()) {
        //older than available horoscope range:
        console.info('404 - Requested date older than range -> ' + date);
        res.status(404).send('Not Found - date out of range');
        return;
    }

    /*
        Following are some example data scrubbers.  
        They can be modified based on the content you serve to provide different versions of output on the return
        In our use-case, we provide the ability to:
        - strip the date prefix from the horoscope
        - strip a historical reference from the horoscope
        - strip both (a short horoscope)
    */

    // Regex to match and remove various date formats and timestamps from a string
    const stripDateRegex = /((^([A-Za-z]+,\s)?[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}:\s)|(\b[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}[ :\-]*\s*\-\s*|[A-Z][a-z]+day,\s|^[A-Za-z]+\s\d{1,2}[a-z]{0,2},\s\d{4}\s\([A-Za-z]+\):\s|\b[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}\b\s\([A-Za-z]+\):\s))|\b[A-Za-z]+\s\d{1,2}(?:th|st|nd|rd)?\s\([^)]*\):\s|\b[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}\s\([^)]*\):\s/g;
   
    // Regex to strip historical event references from the horoscope:
    //const stripEventRegex = /((?:^|[.?!])\s*|(?:In\s+((?:the\s+)?past|the\s+)?|On\s+this\s+day\s*,?\s*)|(?:This|Today)\s+day\s+in\s+)\d{4}\s*,?\s*.*?$/i;
    const stripEventRegex = /((?:^|[.?!])\s*|(?:In\s+((?:the\s+)?past|the\s+)?|On\s+this\s+day\s*,?\s*|On\s+this\s+day\s+in\s+history\s*,?\s*)|(?:This|Today)\s+day\s+in\s+)\d{4}\s*,?\s*.*?$/i;

    // Regex to strip any incomplete sentences from the horoscope after removing the historical event:
    const incompleteSentenceRegex = /(?<=\.|\?|\!)\s*[^\.\?!]+[^\.\?!]*$/s;
    
    let searchSign = sign.toLowerCase();
    searchSign = searchSign.charAt(0).toUpperCase() + searchSign.slice(1);

    // check for valid sign:
    const zodiacSigns = ["Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"];

    if (zodiacSigns.includes(searchSign)) {
        //valid
    } else if (searchSign == 'All') {
        //call for all of the signs for the requested date:
        const allSignObj = []; 
        
        
        zodiacSigns.forEach((sign) => {
            const data = horoscopeJSON[sign][date];
            let modifiedDescription = data.description;

            // ✂️ Modify description based on flags
            if (shorthoro) {
                modifiedDescription = modifiedDescription
                .replace(stripDateRegex, '')
                .replace(stripEventRegex, '$1')
                .replace(incompleteSentenceRegex, '');
            } else {
                if (noDate) {
                modifiedDescription = modifiedDescription.replace(stripDateRegex, '');
                }
                if (noHistory) {
                modifiedDescription = modifiedDescription
                    .replace(stripEventRegex, '')
                    .replace(incompleteSentenceRegex, '');
                }
            }

            if (performTranslation) {
                modifiedDescription = await translateText(modifiedDescription, language);
            }

            // 📦 Push modified object
            allSignObj.push({
                [sign]: {
                current_date: date,
                compatibility: data.compatibility,
                lucky_time: data.lucky_time,
                lucky_number: data.lucky_number,
                mood: data.mood,
                description: modifiedDescription,
                color: data.color,
                },
            });
        });
                      
        let goodToken = '200 - Success -> Token : ' + token + ' -> for ALL on '  + date;
        console.info(goodToken);

        res.status(200).json(allSignObj);

        return

    } else {
        //not a valid sign:
        console.info('400 Bad Request - Invalid Zodiac Sign -> ' + searchSign);
        res.status(400).send('Bad Request - Invalid sign provided');
        return;
    }

    let current_date = date
    let compatibility = horoscopeJSON[searchSign][date]["compatibility"];
    let lucky_time = horoscopeJSON[searchSign][date]["lucky_time"];
    let lucky_number = horoscopeJSON[searchSign][date]["lucky_number"];
    let mood = horoscopeJSON[searchSign][date]["mood"];
    let description = horoscopeJSON[searchSign][date]["description"];
    let color = horoscopeJSON[searchSign][date]["color"];
    
    if (!!shorthoro) {
        //user wants a shoter horoscope; strip date prefix & historical event references:

        // Replace the date portion with an empty string
        // Replace the event reference portion with an empty string
        // Replace any incomplete sentences:

        description = description.replace(stripDateRegex, '')
                         .replace(stripEventRegex, '$1')
                         .replace(incompleteSentenceRegex, '');

        console.info('SHORTHORO requested, modifed description is ->' + description);
    } else {
        //check for unique date or event scrubbing:
        if (!!noDate) {
            //strip the date from the description if requested:
            let result = description.match(stripDateRegex);
            if (result) {
                result = result[0];
            } else {
                result = 'No matches found.';
            };
            // Replace the date portion with an empty string
            description = description.replace(stripDateRegex, '');

            console.info('NODATE requested, matched -> ' + result);
            console.info('NODATE requested, modifed description is ->' + description);
        };
    
        if (!!noHistory) {
            // Remove the event reference portion and incomplete sentences
            const resultEvent = description.match(stripEventRegex);
            if (resultEvent) {
                console.info('NOHISTORY requested, event matched -> ' + resultEvent[0]);
            } else {
                console.info('NOHISTORY requested, event matched -> No matches found.');
            };
            description = description.replace(stripEventRegex, '');
            // Remove incomplete sentences that may be left around after the preceeding REGEX
            const incompleteEvent = description.match(incompleteSentenceRegex);
            if (incompleteEvent) {
                console.info('NOHISTORY requested, incompleteSentenceRegex matched -> ' + incompleteEvent[0]);
            } else {
                console.info('NOHISTORY requested, incompleteSentenceRegex matched -> No matches found.');
            };
            description = description.replace(incompleteSentenceRegex, '');

            console.info('NOHISTORY requested, modifed description is ->' + description);
        };

    };

    if (performTranslation) {
        description = await translateText(description, language);
    }
    
    let goodToken = '200 - Success -> Token : ' + token + ' -> for ' + searchSign + ' on '  + date;
    console.info(goodToken);

    res.status(200).json({
        'current_date': current_date,
        'compatibility': compatibility,
        'lucky_time': lucky_time,
        'lucky_number': lucky_number,
        'mood': mood,
        'color': color,
        'description': description
      });

    return
    
};

