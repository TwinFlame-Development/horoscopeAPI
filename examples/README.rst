#################################
TwinFlame - The Horoscope API  
#################################

Please note that the code examples provided here are intended to serve as a starting point for your own development efforts and may need to be adapted to work within the specifics of your unique environment. 

Please use these examples at your own discretion and always test thoroughly before deploying to a production environment.

We recommend exercising the API using `Postman <https://www.postman.com/>`_ or a similar tool to become familiar with its functionality before implementing it in your application.


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

All examples referece the hosted test endpoint, and pass 'token' as a Bearer Token:

.. raw:: html

   <table> 
    <tr>
      <th>Method</th>
      <th>URL</th>
    </tr>
    <tr>
      <td>POST</td>
      <td>https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test</td>
    </tr>
     
    </table>
    

cURL
^^^^
Why did the developer refuse to use cURL?

Because she didn't want to get tangled up in the command line!

.. code-block:: python

      curl -X POST \
        -H "Authorization: Bearer mmEUtLATc8w_UNnHuR2" \
        -H "Content-Type: application/json" \
        -d '{"sign":"scorpio", "day":"04-01-2023"}' \
        https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test



Python
^^^^^^
Why do Python programmers prefer to use their own libraries?

Because they hate to 'reinvent-the-wheel'!

.. code-block:: python

   import requests
   import json

   def tfhoro(sign, day, token):
       url = 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test'
       headers = {
           'Authorization': 'Bearer ' + token
       }
       data = {
           'sign': sign,
           'day': day
       }
       response = requests.post(url, headers=headers, data=data)
       if response.status_code == 200:
           responseData = json.loads(response.content)
           return responseData
       else:
           print('Error: HTTP %d' % response.status_code)

   ObjData = tfhoro('scorpio', '04-01-2023', 'mmEUtLATc8w_UNnHuR2')
   print(ObjData)


Node.js
^^^^^^^
Why did the Node.js developer quit his job?

Because he didn't get async permission from his boss!

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
Why did the Wix Velo developer quit her job?

It didn't have the Velo-city she was looking for!


.. code-block:: javascript

   import {fetch} from 'wix-fetch';

   function getJsonData(token, date, sign) {
       const url = 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test';
       const options = {
           method: 'POST',
           headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({date, sign})
       };
       return fetch(url, options)
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

WordPress HTTP API 
^^^^^^^

Why did the WordPress developer go broke? 

Because she used up all her cache!

.. code-block:: php

      $args = array(
          'headers' => array(
              'Authorization' => 'Bearer mmEUtLATc8w_UNnHuR2',
              'Content-Type' => 'application/json'
          ),
          'body' => json_encode(array(
              'sign' => 'scorpio',
              'day' => '04-01-2023'
          ))
      );

      $response = wp_remote_post('https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test', $args);

      if (is_wp_error($response)) {
          $error_message = $response->get_error_message();
          echo "Something went wrong: $error_message";
      } else {
          $body = wp_remote_retrieve_body($response);
          echo $body;
      }


Swift
^^^^^^^

Why was the Swift developer always so calm?

Because they had Optionals!

.. code-block:: swift

      import Foundation

      let url = URL(string: "https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test")!
      var request = URLRequest(url: url)
      request.httpMethod = "POST"
      request.setValue("Bearer mmEUtLATc8w_UNnHuR2", forHTTPHeaderField: "Authorization")
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
      let parameters: [String: Any] = [
          "sign": "scorpio",
          "day": "04-01-2023"
      ]
      request.httpBody = try? JSONSerialization.data(withJSONObject: parameters)
      let session = URLSession.shared
      let task = session.dataTask(with: request) { data, response, error in
          if let error = error {
              print("Error: \(error)")
          } else {
              guard let data = data, let response = response as? HTTPURLResponse else {
                  print("Invalid response or data")
                  return
              }
              if response.statusCode == 200 {
                  do {
                      let jsonResponse = try JSONSerialization.jsonObject(with: data, options: [])
                      print(jsonResponse)
                  } catch let parsingError {
                      print("Error: \(parsingError)")
                  }
              } else {
                  print("Error: HTTP \(response.statusCode)")
              }
          }
      }
      task.resume()

Objective-C
^^^^^^^
um, no.  :)


Kotlin
^^^^^^^
Why did the Kotlin developer quit his job? 

He didn't get Nullable Types.


.. code-block:: kotlin

      import com.fasterxml.jackson.databind.ObjectMapper
      import okhttp3.*
      import java.io.IOException

      val client = OkHttpClient()
      val mapper = ObjectMapper()

      fun tfhoro(sign: String, day: String, token: String): HoroscopeResponse? {
          val url = "https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test"
          val json = mapper.writeValueAsString(mapOf("sign" to sign, "day" to day))
          val body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json)
          val request = Request.Builder()
              .url(url)
              .addHeader("Authorization", "Bearer $token")
              .post(body)
              .build()

          try {
              val response = client.newCall(request).execute()
              if (response.isSuccessful) {
                  val responseData = mapper.readValue(response.body()?.string(), HoroscopeResponse::class.java)
                  return responseData
              } else {
                  println("Error: HTTP ${response.code()}")
              }
          } catch (e: IOException) {
              e.printStackTrace()
          }
          return null
      }

      data class HoroscopeResponse(val sign: String, val day: String, val horoscope: String)

      fun main() {
          val objData = tfhoro("scorpio", "04-01-2023", "mmEUtLATc8w_UNnHuR2")
          println(objData)
      }

C#
^^^^^^^
Why do C# developers keep breaking their keyboards?

Because they keep trying to use the null key.

.. code-block:: csharp

      using System;
      using System.Net.Http;
      using System.Net.Http.Headers;
      using System.Text;
      using System.Threading.Tasks;

      public class Program
      {
          static async Task Main(string[] args)
          {
              string token = "mmEUtLATc8w_UNnHuR2";
              string sign = "scorpio";
              string day = "04-01-2023";
              string url = "https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test";
              var requestBody = "{\"sign\":\"" + sign + "\", \"day\":\"" + day + "\"}";

              using (var httpClient = new HttpClient())
              {
                  httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                  httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                  var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                  var response = await httpClient.PostAsync(url, content);
                  var responseContent = await response.Content.ReadAsStringAsync();

                  Console.WriteLine(responseContent);
              }
          }
      }

React Native
^^^^^^^
Why do React Native developers prefer iPhones over Android phones?

Because iPhones have a better React-ion time!

.. code-block:: javascript

      import React, { useState, useEffect } from 'react';
      import { View, Text } from 'react-native';
      import axios from 'axios';

      const HoroscopeAPI = () => {
        const [data, setData] = useState(null);

        useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await axios.post(
                'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test',
                {
                  sign: 'scorpio',
                  day: '04-01-2023'
                },
                {
                  headers: {
                    Authorization: 'Bearer mmEUtLATc8w_UNnHuR2',
                    'Content-Type': 'application/json'
                  }
                }
              );

              setData(response.data);
            } catch (error) {
              console.error(error);
            }
          };

          fetchData();
        }, []);

        if (!data) {
          return (
            <View>
              <Text>Loading...</Text>
            </View>
          );
        }

        return (
          <View>
            <Text>{data.horoscope}</Text>
          </View>
        );
      };

      export default HoroscopeAPI;



PHP
^^^
Why do programmers prefer dark mode?

Because light attracts bugs, and PHP has enough of those already.

.. code-block:: php

    <?php

      function tfhoro($sign, $day, $token) {
          $url = 'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test';
          $data = array(
              'sign' => $sign,
              'day' => $day,
          );
          $headers = array(
              'Authorization: Bearer ' . $token,
              'Content-Type: application/json',
          );
          $options = array(
              'http' => array(
                  'header' => $headers,
                  'method' => 'POST',
                  'content' => json_encode($data),
              ),
          );
          $context = stream_context_create($options);
          $response = file_get_contents($url, false, $context);
          $responseData = json_decode($response, TRUE);
          return $responseData;
      }

      $ObjData = tfhoro('scorpio', '04-01-2023', 'mmEUtLATc8w_UNnHuR2');
      var_dump($ObjData);

    ?>

  
jQuery Ajax
^^^^^^
Why did the jQuery Ajax request cross the road?

To get to the server-side!

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


Z/Architecture Assembler
^^^^^^

Mainframe horoscopes is a thing.  We don't make the rules.

.. code-block:: z/Architecture

      * Define the required variables
      L R15,=V(TOKEN)      * bearer token
      LA R14,URL           * URL
      LA R13,DATA          * request data

      * Set up the headers
      PUT HTTP-HEADER
      XC C'Authorization: Bearer '
      PUTTOKEN TOKEN
      PUT HTTP-HEADER
      XC C'Content-Type: application/json'
      PUT HTTP-HEADER
      XC X'0A'

      * Set up the request body
      PUT HTTP-BODY
      XC DATALEN           * length of the request data
      PUT HTTP-BODY
      XR R1,R13            * address of the request data
      PUT HTTP-BODY
      XC X'0A'

      * Set up the URL and invoke the request
      PUT HTTP-URL
      XR R1,R14            * address of the URL
      PUT HTTP-URL
      XC X'0A'
      PUT HTTP-REQUEST

      * Define the request data
      DATALEN DC AL4 LENGTH(DATA)
      DATA DC CL24'{"sign":"scorpio","day":"04-01-2023"}'

      * Define the URL
      URL DC CL100'https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test'
      TOKEN DC CL50'mmEUtLATc8w_UNnHuR2'

