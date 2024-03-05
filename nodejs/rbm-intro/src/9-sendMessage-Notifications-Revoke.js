// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the License);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an AS IS BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const config = require('./config');
const rbmApiHelper = require('@google/rcsbusinessmessaging');
const RbmWebhookClient = require('@google/rbmwebhookclient');

// location of service account credentials file
const privateKeyFile =
	'../resources/rbm-agent-service-account-credentials.json';

// service account credentials for Pub/Sub
const privatekey = require(privateKeyFile);

let sentMessageId = '';
let revokeTimer = null;

function handleMessage(userEvent) {
	if ((userEvent.messageId === sentMessageId) &&
		(userEvent.eventType === 'DELIVERED')) {
		console.log('Message delivered!');
		clearTimeout(revokeTimer);
	}

	if (userEvent.senderPhoneNumber != undefined) {
		// get the sender's phone number
		const msisdn = userEvent.senderPhoneNumber;

		// parse the response text
		const message = getMessageBody(userEvent);

		// get the message id
		const messageId = userEvent.messageId;

		// check to see that we have a message to process
		if (message) {
			// send a read receipt
			rbmApiHelper.sendReadMessage(msisdn, messageId);
		}
	}
}


function getMessageBody(userEvent) {
	if (userEvent.text != undefined) {
		return userEvent.text;
	} else if (userEvent.suggestionResponse != undefined) {
		return userEvent.suggestionResponse.postbackData;
	}

	return false;
}


function revokeMessage(phoneNumber, messageId) {
	console.log('timeout - revoking message');
	rbmApiHelper.revokeMessage(phoneNumber, messageId, function(response, err) {
		console.log(response);
	});
}


// Start listening for notifications.
new RbmWebhookClient(handleMessage);

rbmApiHelper.initRbmApi(privatekey);
rbmApiHelper.setAgentId(config.agentId);

const params = {
	messageText: 'Hello, world!',
	msisdn: config.phoneNumber,
};

rbmApiHelper.sendMessage(params,
	function(response, err) {
		if (response) {
			sentMessageId = response.config.params.messageId;

			console.log('id of sent message: ' + sentMessageId);

			// cancel the message if it is not delivered in 5 seconds
			revokeTimer =
				setTimeout(revokeMessage, 5000, config.phoneNumber, sentMessageId);
		}
	}
);