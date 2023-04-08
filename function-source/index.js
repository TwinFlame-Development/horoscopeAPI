/*
** The TwinFlame Horoscope API
** - returns daily horoscopes
**
** ©2023 TwinFlame Development, LLC
** https://github.com/TwinFlame-Development/horoscopeAPI
*/

const moment = require('moment');

// Usage logging:
async function quotaManager(token, name) {
    console.log(`Logging API cal from -> ${name}!`);
    
    // ...
    // add loging & quota management here

  }

exports.horoscopeAPIprod = async (req, res) => {

    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    } 

    //load horoscope data from file:
    const horoscopeJSON = require('./config.json');

    // Define tokens & create a nested object for the subscriptions:
    const validTokens = ['2', 'mmEUtLATc8w_UNnHuR2'];
    const tokenData = {
        '2': {
            name: 'Expired Token Ex',
            expiration: '03-31-2020'
        },
        'mmEUtLATc8w_UNnHuR2': {
            name: 'Github Trial',
            expiration: '05-01-2027'
        },
    };
  
    // Convert the object to a JSON object
    const tokenJSONStr = JSON.stringify(tokenData);
    const tokenJSON = JSON.parse(tokenJSONStr);
    
    let date = req.query.date;
    let sign = req.query.sign;
    let token = req.query.token;
    let range = req.query.range;
    let noDate = req.query.nodate;
    
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

    if (!validTokens.includes(token.toString())) {
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
                    
                    let description = horoscopeJSON["weekly"][searchSign][weeklyDateFormatted]["description"];
                            
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
            let signObject = {
                [sign]: {
                    'current_date': date,
                    'compatibility': horoscopeJSON[sign][date]["compatibility"],
                    'lucky_time': horoscopeJSON[sign][date]["lucky_time"],
                    'lucky_number': horoscopeJSON[sign][date]["lucky_number"],
                    'mood': horoscopeJSON[sign][date]["mood"],
                    'description': horoscopeJSON[sign][date]["description"],
                    'color': horoscopeJSON[sign][date]["color"],
                }
              };
              
              allSignObj.push(signObject);
          });

        //const allSignJsonString = JSON.stringify(allSignObj);
                      
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

    //strip the date from the description if requested:
    if (!!noDate) {
        // Regex to match the date format with either '-' or ':' as the separator
        // Modify to filter your hosted content as appropriate:
        const regex = /((^([A-Za-z]+,\s)?[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}:\s)|(\b[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}[ :\-]*\s*\-\s*|[A-Z][a-z]+day,\s|^[A-Za-z]+\s\d{1,2}[a-z]{0,2},\s\d{4}\s\([A-Za-z]+\):\s|\b[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}\b\s\([A-Za-z]+\):\s))|\b[A-Za-z]+\s\d{1,2}(?:th|st|nd|rd)?\s\([^)]*\):\s|\b[A-Za-z]+\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}\s\([^)]*\):\s/g;

        // Replace the date portion with an empty string
        description = description.replace(regex, '');

        console.info('NODATE requested, modifed description is ->' + description);

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

