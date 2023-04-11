#################################
TwinFlame - The Horoscope API  
#################################

The following examples use these parameters: 

.. raw:: html

   <table> 
    <tr>
      <th>Parameter</th>
      <th>Required</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>‘date’</td>
      <td>Yes</td>
      <td>04-01-2023</td>
    </tr>
    <tr>
      <td>‘sign’</td>
      <td>Yes</td>
      <td>scorpio</td>
    </tr>
    <tr>
      <td>‘token’</td>
      <td>Yes</td>
      <td>mmEUtLATc8w_UNnHuR2</td>
    </tr>
   
    </table>

All examples referece the hosted test endpoint:

.. raw:: html

   <table> 
    <tr>
      <th>Method</th>
      <th>URL</th>
    </tr>
    <tr>
      <td>GET</td>
      <td>https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test</td>
    </tr>
     
    </table>
    

cURL
^^^^
.. code-block:: python

    curl 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?sign=scorpio&day=04-01-2023&token=mmEUtLATc8w_UNnHuR2'



Python
^^^^^^
.. code-block:: python

   import requests
   import json

   def tfhoro(sign, day, token):
       url = 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test'
       params = {
           'sign': sign,
           'day': day,
           'token': token
       }
       response = requests.get(url, params=params)
       if response.status_code == 200:
           responseData = json.loads(response.content)
           return responseData
       else:
           print('Error: HTTP %d' % response.status_code)

   ObjData = tfhoro('scorpio', '04-01-2023', 'mmEUtLATc8w_UNnHuR2')
   print(ObjData)




Node.js
^^^^^^^
.. code-block:: javascript

    var request = require('request');

    var options = {
      url: 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?token=mmEUtLATc8w_UNnHuR2&sign=scorpio&date=04-01-2023',
      method: 'GET'
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body);
      }
    }

    request(options, callback);

Wix Velo
^^^^^^^

.. code-block:: javascript

   import {fetch} from 'wix-fetch';

   function getJsonData(token, date, sign) {
       const url = `https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?token=${token}&date=${date}&sign=${sign}`;
       return fetch(url)
           .then(response => response.json())
           .then(jsonData => {
               console.log(jsonData);
               return jsonData;
           })
           .catch(err => {
               console.error('Error fetching JSON data:', err);
           });
   }

   getJsonData('mmEUtLATc8w_UNnHuR2', '04-01-2023', 'scorpio')
       .then(jsonData => {
           console.log(jsonData);
           // Do something with the jsonData object here
       })
       .catch(err => {
           console.error('Error getting JSON data:', err);
       });


PHP
^^^
.. code-block:: php

    <?php

      function tfhoro($sign, $day, $token) {
         $url = 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?sign='.$sign.'&day='.$day.'&token='.$token;
         $response = file_get_contents($url);
         $responseData = json_decode($response, TRUE);
         return $responseData;
       }

      $ObjData = tfhoro('scorpio', '04-01-2023', 'mmEUtLATc8w_UNnHuR2');
      var_dump($ObjData);


    ?>
  
jQuery Ajax
^^^^^^
.. code-block:: javascript

 function tfhoro(sign, day, token) {
  return $.ajax({
    url: 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test',
    method: 'GET',
    data: {
      sign: sign,
      day: day,
      token: token
    },
    dataType: 'json'
  });
 }

 tfhoro('scorpio', '04-01-2023', 'mmEUtLATc8w_UNnHuR2')
  .done(function(responseData) {
    console.log(responseData);
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.error(errorThrown);
  });



