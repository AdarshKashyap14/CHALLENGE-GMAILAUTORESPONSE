# Listed Challenge - Gmail Auto Response App
This Node.js application allows you to automate email responses while you're on vacation using the Gmail API. It checks for new emails in a specified Gmail mailbox, sends auto-replies to emails that have no prior replies, adds a label to the replied email, and moves it to the labeled folder. The app runs at random intervals between 45 to 120 seconds.

## Features

- Login with Google API to access Gmail mailbox
- Send auto-replies to emails without prior replies
- Add a label to replied emails and move them to the labeled folder
- Random interval scheduling for automatic email checking and replying

## Prerequisites

Before running the app, make sure you have the following:

- Node.js (v12 or higher) installed on your machine
- A Gmail account to use for testing
- Access to the Google Cloud Platform (GCP) Console to set up the Gmail API

## Installation

1. Clone the repository or download the source code:

2. Install the dependencies using npm:


3. Set up the environment variables:
- Create a `.env` file in the root directory of the project.
- Add the following environment variables to the `.env` file:
  ```
  CLIENT_ID=<your-client-id>
  CLIENT_SECRET=<your-client-secret>
  REDIRECT_URI=http://localhost:3000/oauth2callback
  REFRESH_TOKEN=<your-refresh-token>
  GMAIL_USER=<your-gmail-email-address>
  ```
  Replace the placeholder values with your actual credentials. The `REDIRECT_URI` should match the authorized redirect URI configured in the GCP project.

## Configuration

To configure the app, you need to set up the Gmail API and obtain the necessary credentials:

1. Create a new project on the Google Cloud Platform (GCP) Console.
2. Enable the Gmail API for the project.
3. Create OAuth 2.0 credentials (client ID and client secret) for the project.
4. Obtain a refresh token by following the authorization process outlined in the app's code.

## Usage

1. Run the app using the following command:

2. After running the app, it will prompt you to visit a URL for authorization. Open the URL in a web browser, authorize the app using your Gmail account, and then grant the necessary permissions.

3. Once authorized, the app will start checking for new emails in the specified Gmail account and send auto-replies to any new email thread that has not been previously replied to. It will also apply the label "Vacation" to the replied email with the subject as "RE". You can check the progress in the output of your VS Code Output Panel. 

## Testing

To test the app:

1. Send an email to the Gmail account specified in the `GMAIL_USER` environment variable.

2. The app will check for new emails and automatically send an auto-reply to the first-time email threads.

3. Verify that the auto-reply is sent and the email is labeled and moved to the "Vacation" folder.

## Contributing

No one is perfect. All your Contributions are welcomed! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.


## Acknowledgments

This app was built using the Google Cloud Google APIs, Node JS

