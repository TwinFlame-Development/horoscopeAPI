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

    curl -X POST \
    'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?token=mmEUtLATc8w_UNnHuR2&sign=scorpio&date=04-01-2023'


Python
^^^^^^
.. code-block:: python

    import requests

    params = (
      ('sign', 'scorpio'),
      ('day', '04-01-2023'),
      ('token', 'mmEUtLATc8w_UNnHuR2')
    )

    requests.post('https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test', params=params)



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

PHP
^^^
.. code-block:: php

    <?php

        //This function can be used in a PHP framework.

        function tfhoro($sign, $day, $token) {
            $tfhoro = curl_init('https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?sign='.$sign.'&day='.$day.'&token='.$token);
            curl_setopt_array($tfhoro, array(
                CURLOPT_POST => TRUE,
                CURLOPT_RETURNTRANSFER => TRUE,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json'
                )
            ));
            $response = curl_exec($tfhoro);
            if($response === FALSE){
                die(curl_error($tfhoro));
            }
            $responseData = json_decode($response, TRUE);
            return $responseData;
        }

        $ObjData = tfhoro('scorpio', '04-01-2023', 'mmEUtLATc8w_UNnHuR2');
        var_dump($ObjData);

    ?>
  
jQuery Ajax
^^^^^^
.. code-block:: javascript

    $.ajax({
      type:'GET',
      url:'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test?sign=aries&day=today&token=mmEUtLATc8w_UNnHuR2',
      success:function(data){
      console.log(data);
      }
    });


