
#################################
TwinFlame - The Horoscope API 
#################################
 This API provides horoscope information for the given date and zodiac sign. It requires a valid token to access the API. If the token is invalid or has expired, the API returns an unauthorized response.
 
 .. image:: https://img.shields.io/github/v/release/TwinFlame-Development/horoscopeAPI
   :alt: GitHub release (latest by date)
 .. image:: https://img.shields.io/github/languages/top/TwinFlame-Development/horoscopeAPI
   :alt: GitHub top language
 .. image:: https://img.shields.io/github/languages/code-size/TwinFlame-Development/horoscopeAPI
   :alt: GitHub code size in bytes
 .. image:: https://img.shields.io/github/stars/TwinFlame-Development/horoscopeAPI
   :alt: GitHub Repo stars
     
 
.. image:: https://firebasestorage.googleapis.com/v0/b/twinflame.appspot.com/o/github%2FTFhoroscopeAPIbanner.png?alt=media&token=7289276f-e1b7-46f3-8537-1962bd64c519
   :height: 412px
   :width: 898px
   :alt: twinflame horoscope api logo
   :align: center

- Source code helps you build your own API & serve content
- We offer subscription access to our content using this API

What is the TwinFlame Horoscope API?
==============
This API provides horoscope information for the given date and zodiac sign. It requires a valid token to access the API. If the token is invalid or has expired, the API returns an unauthorized response.

The TwinFlame Horoscope API is for a developer who wants an API that provides horoscope info for zodiac signs for a recent day.  The primary use-case of the API is to display daily or weekly horoscopes in an application.

Feel free to contribute on `GitHub <https://github.com/TwinFlame-Development/horoscopeAPI>`_.

Why TwinFlame?
==========
We’re in the business of astrology apps and astrology content. This is what we use. 

This API is used to provide the daily horoscopes used by TwinFlame’s Android and iOS applications, which have a sizable active user base. It's lightwight, fast, and stable.

Do you offer a subscription Horoscope API?
==============
Yes! 

Are you a developer looking to add personalized horoscopes to your app or website? The TwinFlame Horoscope API subscription is the perfect solution. Our API provides daily and weekly horoscopes for all zodiac signs, so your users can get the insights they need to make the most of each day!

The API retrieves daily (or weekly) horoscopes for a specific date.  The API has a rolling set of daily horoscopes.  The available date range varies, but in general the current date +/- 7 days is available in the API.

Subscription service horoscopes are written and reviewed by TwinFlame’s in-house astrologers and the content is copyrighted by TwinFlame Development, LLC.  Subscription to the API allows you license to use the horoscopes in your applications.

Interested in the subscription? Feel free to contact us at partnerships@twinflamedev.com

API Endpoint 
==========
A hosted test endpoint is available:

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
    
Please use the testing authentication token:
``mmEUtLATc8w_UNnHuR2``

Note: Query the test endpoint with the ``range`` parameter to understand what testing date-ranges are available.

Please contact us if you're interested in a trial production token at partnerships@twinflamedev.com

Some usage examples are here:
`TwinFlame Horoscope API test endpoint usage examples <https://github.com/TwinFlame-Development/horoscopeAPI/tree/main/examples>`_.

Request Parameters
==========
The API requires the following query parameters:

.. raw:: html

   <table> 
    <tr>
      <th>Parameter</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>‘date’</td>
      <td>Yes</td>
      <td>The date for which to retrieve the horoscope information. The date format should be MM-DD-YYYY or ‘today’, ‘tomorrow’, ‘yesterday’ or 'this_week', 'last_week', 'next_week'.</td>
    </tr>
    <tr>
      <td>‘sign’</td>
      <td>Yes</td>
      <td>The zodiac sign for which to retrieve the horoscope information. The sign should be in lowercase. Alternatively this can be 'all' to return all sign horoscopes for a given date.</td>
    </tr>
    <tr>
      <td>‘token’</td>
      <td>Yes</td>
      <td>The authentication token to access the API.</td>
    </tr>
    <tr>
      <td>‘range’</td>
      <td>No</td>
      <td>An optional parameter that, when present, returns the earliest and latest dates for which horoscope information is available.</td>
    </tr>
   
    </table>

The API supports optional data scrubbers that change the format of the returned horoscope:

.. raw:: html

   <table> 
    <tr>
      <th>Parameter</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>‘nodate’</td>
      <td>No</td>
      <td>An optional parameter that, when present, invokes a data scrubber on the returned description. We use the scrubber in our hosted solution to strip the horoscopes of the leading date qualifer.</td>
    </tr>
    <tr>
      <td>‘nohistory’</td>
      <td>No</td>
      <td>An optional parameter that, when present, invokes a data scrubber on the returned description. We use the scrubber in our hosted solution to strip the horoscopes of the historical event reference(s).</td>
    </tr>
    <tr>
      <td>‘shorthoro’</td>
      <td>No</td>
      <td>An optional parameter that, when present, invokes a data scrubber on the returned description. We use the scrubber in our hosted solution to return a short horoscope, with no leading date qualifer and no historical reference(s).</td>
    </tr>
   
    </table>

Note: data scrubbers are implemented on daily horoscope calls for a single sign (not 'all', and not on weekly horoscopes).

Response Parameters
==========
The API returns the following parameters in a JSON response:

.. raw:: html

   <table> 
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>‘current_date’</td>
      <td>String</td>
      <td>The date associated with the horoscope information.</td>
    </tr>
     <tr>
      <td>‘lucky_time’</td>
      <td>String</td>
      <td>A lucky time for the date requested.</td>
    </tr>
    <tr>
      <td>‘lucky_number’</td>
      <td>String</td>
      <td>A lucky number for the date requested.</td>
    </tr>
     <tr>
      <td>‘mood’</td>
      <td>String</td>
      <td>A mood of the day for the requested date.</td>
    </tr>
    <tr>
      <td>‘color’</td>
      <td>String</td>
      <td>A color of the day for the requested date.</td>
    </tr>
    <tr>
      <td>‘description’</td>
      <td>String</td>
      <td>A horoscope for the requested date and sign.</td>
    </tr>
   </table>

When called for a weekly horoscope (invoked with 'date' as 'next_week', 'last_week', or 'this_week'), the API returns the following parameters in a JSON response:

.. raw:: html

   <table> 
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>‘current_date’</td>
      <td>String</td>
      <td>The date associated with the horoscope information. This is the Monday of the requested weekly horoscope.</td>
    </tr>
    <tr>
      <td>‘description’</td>
      <td>String</td>
      <td>A weekly horoscope for the requested week and sign.</td>
    </tr>
   </table>
   
If the ‘range’ request parameter is present, the API returns the following parameters in a JSON response:

.. raw:: html

   <table> 
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>‘earliest_date’</td>
      <td>String</td>
      <td>The earliest date for which horoscope information is available.</td>
    </tr>
    <tr>
      <td>‘latest_date’</td>
      <td>String</td>
      <td>The latest date for which horoscope information is available.</td>
    </tr>
   
   </table>

Response JSON Examples
^^^^^^
The API returns the following JSON response (example):

.. code-block:: json

    {
      "current_date": "04-07-2023",
      "compatibility": "Scorpio",
      "lucky_time": "16:30",
      "lucky_number": "65",
      "mood": "Neutral",
      "color": "Burgundy",
      "description": "Friday, April 7th, 2023: Scorpios may feel a bit emotionally sensitive today. Take time for self-care and prioritize your own needs. On this day in 1994, the genocide in Rwanda began, reminding us of the importance of empathy and understanding towards others."
    }

With the 'nodate' option, the API returns the following JSON response (example):

.. code-block:: json

    {
      "current_date": "04-07-2023",
      "compatibility": "Scorpio",
      "lucky_time": "16:30",
      "lucky_number": "65",
      "mood": "Neutral",
      "color": "Burgundy",
      "description": "Scorpios may feel a bit emotionally sensitive today. Take time for self-care and prioritize your own needs. On this day in 1994, the genocide in Rwanda began, reminding us of the importance of empathy and understanding towards others."
    }


With the 'this_week' date (requesting a weekly horoscope), the API returns the following JSON response (example):

.. code-block:: json

   {
       "current_date": "04-03-2023",
       "description": "Gemini individuals may find that communication is key during this week, as their natural talent for networking and connecting with others may be highlighted. This may be a good time to focus on strengthening relationships with loved ones and colleagues, as well as networking with new acquaintances. However, it may also be important to balance social activities with alone time to recharge and reflect."
   }

If the ‘range’ request parameter is present, the API returns the following JSON response (example):

.. code-block:: json

    {
      "earliest_date": "03/27/2023",
      "latest_date": "04/16/2023"
    }

Projects using the TwinFlame Horoscope API
========================

.. raw:: html

   <table> 
    <tr>
      <th>Project</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>
        <a href="https://apps.apple.com/us/app/twinflame/id1461412482?ls=1">TwinFlame for Apple</a>
      </td>
      <td>iOS</td>
      <td>TwinFlame astrology app for iOS, iPadOS, & tvOS.</td>
    </tr>
    <tr>
      <td>
        <a href="https://play.google.com/store/apps/details?id=com.twinflamedev.twinflame">TwinFlame for Android</a>
      </td>
      <td>Android</td>
      <td>TwinFlame astrology app for Android phones & tablets.</td>
    </tr>
    
    
    </table>






