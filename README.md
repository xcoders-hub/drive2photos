# Drive 2 Photos
Utility to move pictures from Google Drive to Google Photos without the hassle of downloading all of them and reuploading again.

## Running Instance
A working version of the latest release can be found at the following link.

https://drive2photos.herokuapp.com

## Upload Quality

**TL;DR** All images are uploaded in original quality. No compression.

Unfortunately, Google Photos does not have a separate API  and the usage is through [Picasa Web Albums Data API](https://developers.google.com/picasa-web/). The API is quite restricted and does not provide great control over the photos being uploaded. 

All photos being uploaded right now are uploaded with original quality. There is no automatic compression flag kind of a feature. So, it is necessary to make sure that you have enough free space your Google Photos account before starting the export. 

Once the export completes, the uploaded pictures can be compressed from the [settings](https://photos.google.com/settings) in Google Photos

## Local Installation

Installing locally is quite easy, just clone/fork the repo into your local drive and run npm install from your command line

```
npm install
```

Create a file environment file `.env` under `server` folder and set the following properties.

```
CLIENT_ID=<<Oauth client ID>>
CLIENT_SECRET=<<Oauth Client Secret>>
OAUTH_CALLBACK=http://localhost:3000/oauthcallback
``` 

You would need to create a project in Google Developers Console to get the oauth client id and secret. Following APIs should be enabled.

1. Google Drive API
2. Google Plus API

## Known Issues

1. In case the storage left in Google Photos gets exhausted. The utility is not stopping or letting the user know that some of the photos will not be pushed anymore. Files uploaded until the exhaustion are uploaded successfully. Rest of the photos will have to be uploaded again
