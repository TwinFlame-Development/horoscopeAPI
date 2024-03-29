# TwinFlame - The Horoscope API

This API provides horoscope information for the given date and zodiac sign. It requires a valid token to access the API. If the token is invalid or has expired, the API returns an unauthorized response.

![GitHub release (latest by date)](https://img.shields.io/github/v/release/TwinFlame-Development/horoscopeAPI)
![GitHub top language](https://img.shields.io/github/languages/top/TwinFlame-Development/horoscopeAPI)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/TwinFlame-Development/horoscopeAPI)
![GitHub Repo stars](https://img.shields.io/github/stars/TwinFlame-Development/horoscopeAPI)

![twinflame horoscope api logo](https://firebasestorage.googleapis.com/v0/b/twinflame.appspot.com/o/github%2FhoroAPISocial.png?alt=media&token=b4b55048-d258-4b34-9a90-2d1485c9a596)

- Source code helps you build your own API & serve content
- We offer subscription access to our content using this API

## What is the TwinFlame Horoscope API?

This API provides horoscope information for the given date and zodiac sign. It requires a valid token to access the API. If the token is invalid or has expired, the API returns an unauthorized response.

The TwinFlame Horoscope API is for a developer who wants an API that provides horoscope info for zodiac signs for a recent day. The primary use-case of the API is to display daily or weekly horoscopes in an application.

Feel free to contribute on [GitHub](https://github.com/TwinFlame-Development/horoscopeAPI).

## Why TwinFlame?

We’re in the business of astrology apps and astrology content. This is what we use.

This API is used to provide the daily horoscopes used by TwinFlame’s Android and iOS applications, which have a sizable active user base. It's lightweight, fast, and stable.

## Do you offer a subscription Horoscope API?

Yes!

Are you a developer looking to add personalized horoscopes to your app or website? The TwinFlame Horoscope API subscription is the perfect solution. Our API provides daily and weekly horoscopes for all zodiac signs, so your users can get the insights they need to make the most of each day!

The API retrieves daily (or weekly) horoscopes for a specific date. The API has a rolling set of daily horoscopes. The available date range varies, but in general, the current date +/- 7 days is available in the API.

Subscription service horoscopes are written and reviewed by TwinFlame’s in-house astrologers, and the content is copyrighted by TwinFlame Development, LLC. Subscription to the API allows you to license the horoscopes in your applications.

Interested in the subscription? Feel free to contact us at partnerships@twinflamedev.com

## API Endpoint

A hosted test endpoint is available:

| Method      | URL                                                                              |
|-------------|----------------------------------------------------------------------------------|
| GET or POST | `https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test` |

Please use the testing authentication token: `mmEUtLATc8w_UNnHuR2`

Note: Query the test endpoint with the `range` parameter to understand what testing date-ranges are available.

Please contact us if you're interested in a trial production token at partnerships@twinflamedev.com

Some usage examples are here: [TwinFlame Horoscope API test endpoint usage examples](https://github.com/TwinFlame-Development/horoscopeAPI/tree/main/examples).

## Authorization

The TwinFlame Horoscope API uses authentication tokens for authorization.

The 'token' variable is set to the value of the 'token' query parameter, the 'token' field in the request body (JSON), or the 'x-auth-token' or 'authorization' headers.

Note: Remember that your authentication token is a secret! Do not share it with others or expose it in any client-side code (browsers, apps). Production requests must be routed through your own backend server where your API key can be securely loaded from an environment variable or key management service.

## Request Parameters

The Horoscope API accepts each input parameter set to either a query parameter or a field in the request body (JSON).

The API accepts the following parameters:

| Parameter   | Required | Description                                                                                                                                                       |
|-------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `date`      | Yes      | The date for which to retrieve the horoscope information. The date format should be MM-DD-YYYY (or any string conforming to the ECMAScript specification for date-time string) or ‘today’, ‘tomorrow’, ‘yesterday’ or 'this_week', 'last_week', 'next_week'. |
| `sign`      | Yes      | The zodiac sign for which to retrieve the horoscope information. The sign should be in lowercase. Alternatively, this can be 'all' to return all sign horoscopes for a given date. |
| `range`     | No       | An optional parameter that, when present, returns the earliest and latest dates for which horoscope information is available.                                       |

The API supports optional data scrubbers that change the format of the returned horoscope:

| Parameter   | Required | Description                                                                                                                                                       |
|-------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `nodate`    | No       | An optional parameter that, when present, invokes a data scrubber on the returned description. We use the scrubber in our hosted solution to strip the horoscopes of the leading date qualifier. |
| `nohistory` | No       | An optional parameter that, when present, invokes a data scrubber on the returned description. We use the scrubber in our hosted solution to strip the horoscopes of the historical event reference(s). |
| `shorthoro` | No       | An optional parameter that, when present, invokes a data scrubber on the returned description. We use the scrubber in our hosted solution to return a short horoscope, with no leading date qualifier and no historical reference(s). |

## Response Parameters

The API returns the following parameters in a JSON response:

| Parameter     | Type   | Description                                        |
|---------------|--------|----------------------------------------------------|
| `current_date`| String | The date associated with the horoscope information.|
| `lucky_time`  | String | A lucky time for the date requested.               |
| `lucky_number`| String | A lucky number for the date requested.             |
| `mood`        | String | A mood of the day for the requested date.          |
| `color`       | String | A color of the day for the requested date.         |
| `description` | String | A horoscope for the requested date and sign.       |

When called for a weekly horoscope (invoked with 'date' as 'next_week', 'last_week', or 'this_week'), the API returns the following parameters in a JSON response:

| Parameter     | Type   | Description                                                                                                               |
|---------------|--------|---------------------------------------------------------------------------------------------------------------------------|
| `current_date`| String | The date associated with the horoscope information. This is the Monday of the requested weekly horoscope.                 |
| `description` | String | A weekly horoscope for the requested week and sign.                                                                       |

If the `range` request parameter is present, the API returns the following parameters in a JSON response:

| Parameter       | Type   | Description                                                        |
|-----------------|--------|--------------------------------------------------------------------|
| `earliest_date` | String | The earliest date for which horoscope information is available.    |
| `latest_date`   | String | The latest date for which horoscope information is available.      |

## Projects using the TwinFlame Horoscope API

| Project                                                                 | Type    | Description                                                      |
|-------------------------------------------------------------------------|---------|------------------------------------------------------------------|
| [TwinFlame for Apple](https://apps.apple.com/us/app/twinflame/id1461412482?ls=1) | iOS     | TwinFlame astrology app for iOS, iPadOS, & tvOS.                 |
| [TwinFlame for Android](https://play.google.com/store/apps/details?id=com.twinflamedev.twinflame) | Android | TwinFlame astrology app for Android phones & tablets.            |
| [TwinFlame for Alexa](https://www.amazon.com/dp/B0C4FKGHTR/ref=sr_1_1?crid=52UA0KL1DG6K) | Alexa   | TwinFlame's Alexa Flash Briefing Skill.                          |
| [TwinFlame Website](https://www.twinflamedev.com/api)                  | Web     | TwinFlame Development's website (API implementation via Wix Velo 'fetch') |
