# RCS Business Messaging: Your first agent

This sample RBM agent demonstrates how to use the RBM Python SDK to
send and receive messages to an RCS-enabled device.


## Prerequisites

You must have the following software installed on your development machine:

* [Python](https://www.python.org/downloads/) - version 3 or above


## Setup

Prepare credentials:

1. Open the RBM Developer Console (https://business-communications.cloud.google.com/console/partner-console/)
with your RBM Platform Google account and create a new RBM agent.

2. When the agent is available, click the agent's card.

3. In the left navigation, click **Service account**.

4. Click **Create key**, then click **Create**. Your browser downloads a service account key for your agent. You need this key to make RBM API calls as your agent.

5. Rename the service account key "rbm-agent-service-account-credentials.json" and move it into the ```/resources``` directory.

Set your agent id:

1. Open `constants.py`.

2. Update the `AGENT_ID` parameter with your agent id (the part before `@rbm.goog`).

Prepare the sample:

1. In a terminal, navigate to this sample's root directory.

2. Run the following commands:

```
   python3 -m venv env
   source env/bin/activate
   python -m pip install -r requirements.txt
```

## Setup your tester device
1. In a terminal, navigate to this sample's root directory.

2. Run the following command:

   `python main.py -p TEST_DEVICE_PHONE_NUMBER -m invite`

The "invite" text at the end of this command will send TEST_DEVICE_PHONE_NUMBER an invite to
become a tester for your agent. Make sure your TEST_DEVICE_PHONE_NUMBER is in the format
+12223334444.


## Run the sample

1. In a terminal, navigate to this sample's root directory.

2. Run the following command:

   `python main.py -p TEST_DEVICE_PHONE_NUMBER -m chat`

Make sure your TEST_DEVICE_PHONE_NUMBER is in the format +12223334444.