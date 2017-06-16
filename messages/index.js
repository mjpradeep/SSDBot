/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var http = require('https');
const ONEDRIVETOKEN = "EwD4Aq1DBAAUGCCXc8wU/zFu9QnLdZXy+YnElFkAAf+LW7422kwvltKA85bBXW26paonLfW6uKNC3X5SuGBApSPiGAj1D9D8DeSlKJnoF6/3bIEsvZwiRVS+uPCGF0atyGelpP8I44W12hWmJ3c6s2TyaOpKDJboMksMceezR4p7ZuIarKDXzHv5gs25X/08jO3TGWzF2yR40LsEHsW9Ej5zL4wyYYK5/IJW6lmKIc/mbCcPbnAXP6bOa5/q5Smt5S0Tnw+Jt4hvWo5wUh1YQAScwPiLdQQUPrPzkVb7A+dha3vxEDeb/acCa/olDMvUWalPSNXZOKKzFlkSEpWZmzwVynHayzt2+Z9FIRHrfp4IUAoP24aiWvnEGDTq1lcDZgAACKtEDSv3Der+yAF0Ou59EkBmdpqibdkASxcdgrZwocwXWzsl0+DE8uyvQnfWVyFok1duvkGk6PB/LzbBh4TLlAsNBpGl7bE+WMfKPi95sbOwrD8QfL6P6OaQXHwqyJYrx81W2Svyv23hmhIdyLAJi5eznm3MVjA4Pdlm42sVhFwRI7h2c0o7amPKyTSimQxBUGwTaVTxJWTm21ZF/9sVBZpg594cAatCmlwelvNmrtUUIeU7v1UPckNV+mNf3xJFmvegDlgBtns+KjLBTRo9wkBV4c1fceuV7VkK1IOajMfETyT388s/37HZFabRmospc+4jOXKpmKW0Nu2PgvaVYHkOjYVWrhFtMGJmUcbUxNn0EWv1nMVr6agCZE0XISCUCRIDB0cynhIxQ5W84I/kdoc9yM3ZhUg18kj+ljeLU9dMWm/oiGd6oBcY069cjWgFg6XYqdu++kUIKZ22iKaq6B44B6EmTpbBLsJvzEjzSZGWJ9PYJdn+CjatQKc3Xt6dmArHowbhgojk/2QnqAuQ6Cfb4Du0+mcvoBoAKLArRTYcRrEhWUfclglUALBnT0ADA42pQG8+y1C6EG8CvSEyklxkUNRHdUQKVyEJKTzHYVT4HP8JAg==";
const WASTONHOST = "azurewatsonintegration.mybluemix.net";
//const WASTONHOST = "azure-watsonintegration.mybluemix.net";
const WASTONAPATH = "/rest/WatsonService/servicenowService/";

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://ssdservicedatabase:hpSfGXkWMcb6R8Sz767gv0epXLyYBtGFZS2Rzjz9eUcwNpQ4art7Tfs3zB7jdbliG3FosdBl7VQAOoVRUJWGug==@ssdservicedatabase.documents.azure.com:10255/?ssl=true&replicaSet=globaldb", function (err, db) {
    var intentlist = [];
    if (!err) {
        console.log('MongoDB Connected Successfully!!! in server');
    }
    
    db.collection('ConnectorBot').remove({ "name": "ConnectorMongoBabu" });
    db.collection('ConnectorBot').insertOne({
        'name': 'ConnectorMongoBabu',
        'intents': [
            {
                'name': 'opengreeting',
                'text': ['Hi, I am Super Bot. Please enter your name and email id']
            },
            {
                'name': 'userdetails',
                'text': ['Hi,\'%s\'. Thanks for providing your name.<br/>Please select one of the following options for quick solution.<br/> 1. Reset Password <br/> 2. Unlock account <br/> 3. Others']
            },
            {
                'name': 'passwordreset',
                'text': ['Certainly i can help with resetting your password. Please answer the following Hint questions.', 'What is your favorite food?']
            },           
            {
                'name': 'HintA',
                'text': ['What is your date of birth?']
            },
            {
                'name': 'HintB',
                'text': ['What is your favorite sport?']
            },
            {
                'name': 'HintC',
                'text': ['Thanks for providing details. <br/>Please wait while we create the incident for Password Reset.']
            },
            {
                'name': 'accountlock',
                'text': ['Certainly i can help with unlocking your account. Please answer the following Hint questions.', 'What is your birth place?']
            },
            {
                'name': 'HintLockA',
                'text': ['What is your favourite colour?']
            },
            {
                'name': 'HintLockB',
                'text': ['What is your Mother Name?']
            },
            {
                'name': 'HintLockC',
                'text': ['Thanks for providing details. <br/>Please wait while we create the incident for Account Unlock.']
            },
            {
                'name': 'HintQA',
                'text': ['Please enter your hint answer']
            },
            {
                'name': 'closegreeting',
                'text': ['Glad to know that your issue got resolved! We will close the ticket now.']
            },
			{
                'name': 'issuestatus',
                'text': ['Glad to know that your issue got resolved! We will close the ticket now.']
            },
			{
                'name': 'IncidentStatus',
                'text': ['Please provide your incident number']
            },
			{
                'name': 'Others',
                'text': ['How may I help you?']
            },
            {
                'name': 'IssueStatusNo',
                'text': ['Thanks for the confirmation, we will keep the Ticket open untill your confirmation.']
            },
            {
                'name': 'Outlook',
                'text': ['Connect to IBM Waston']
            },
            {
                'name': 'Printer',
                'text': ['Connecting to IBM Waston to setup ']
            }]
    });

    db.collection('userdetails').insertOne(
        {
            "enterpriseid": "baskaran.varadarajan",
            "questionsAnswers": [
                {
                    "q": "what is your first school?",
                    "a": "National Hr School"
                },
                {
                    "q": "which year did you joined in your current company?",
                    "a": "2009"
                },
                {
                    "q": "what is your favourite sport?",
                    "a": "Cricket"
                },
				{
                    "q": "What is your Date of Birth?",
                    "a": "30Nov1980"
                },
                {
                    "q": "Which one is your favorite among Accenture core values?",
                    "a": "Client value creation"
                },
                {
                    "q": "What is your place of birth?",
                    "a": "Chennai"
                }
            ]
        });

    db.collection('userdetails').insertOne({
        "enterpriseid": "bala.k.subramanian",
        "questionsAnswers": [
            {
                "q": "what is your first school?",
                "a": "DBTR School"
            },
            {
                "q": "which year did you joined in your current company?",
                "a": "2011"
            },
            {
                "q": "what is your favorite sport?",
                "a": "Cricket"
            },
			{
                "q": "What is your Date of Birth?",
                "a": "2Feb1985"
            },
            {
                "q": "Which one is your favorite among Accenture core values?",
                "a": "Integrity"
            },
            {
                "q": "What is your place of birth?",
                "a": "Bangalore"
            }
        ]
    });
    
    db.collection('UserSecurity ').insertOne(
        {
            "email": "goldenbaski@gmail.com",
            "password":"jN*fB7k8"
        });                    
        db.collection('UserSecurity ').insertOne(
        {
            "email": "s.balakrishnan31@gmail.com",
            "password":"jN*fB7k8"
        }); 

    var userEnterpriseId = "";
	var newInstance = "";
    var mongodata = db.collection('ConnectorBot').find({ "name": "ConnectorMongoBabu" });
    mongodata.each(function (err, item) {
        console.log('mongodata:item: ', item);
        if (item != null && intentlist.length == 0) {
            intentlist = item.intents;
            var fs = require('fs');
            var oneDriveAPI = require('onedrive-api');
            var waitUntil = require('wait-until');
            for (var i = 0; i < intentlist.length; i++) {
                intents.matches(intentlist[i].name, (session, args) => {
                    var dialogs = getDialogByIntent(args.intent);
                    if (args.intent == 'opengreeting') {
                        userEnterpriseId = session.message.text;                       
                    }

                    if (args.intent == 'Outlook' || args.intent == 'Printer') {

                        var paramval = (args.intent == 'Outlook') ? 'outlook' : 'printer';
                        //session.send('How to setup the out look:<br/>Step 1: Click on start.<br/>Step 2: Click on Office Outlook 2010<br/>Step 3: After click on outlook one dialogue box will appear, Fill the details in the dialogue box and click next<br/>Step 4: After filling all the details, wait for some time, as per below screenshot click on finish when all three points are completed.', session.message.text);
                        /*for (var j = 0; j < dialogs.length; j++) {
                                 session.send(dialogs[j]+paramval, session.message.text);
                             }*/
                        var options = {
                            host: WASTONHOST,
                            path: '/rest/WatsonService/discoveryService/disQuery=' + args.intent
                        };

                        var callback = function (response) {
                            var str = '';

                            //another chunk of data has been recieved, so append it to `str`
                            response.on('data', function (chunk) {
                                str += chunk;
                            });

                            //the whole response has been recieved, so we just print it out here
                            response.on('end', function () {
                                console.log(str);
                                session.send(str);
                            });
                        }

                        http.request(options, callback).end();
                    } else if (args.intent == 'HintC' || args.intent == 'HintLockC') {
                        // if (checkHintQuestionAndAswers(session.message.text, userEnterpriseId) == 'Y') {
                        //     session.send('Sorry!, the answers what you providing doesnot matching in our DB data.', session.message.text);
                        // } else {
                            for (var j = 0; j < dialogs.length; j++) {
                                session.send(dialogs[j], session.message.text);
                            }

                            //var data = '';
                            //	var filesteam = fs.createReadStream('C:/shared files/test.txt');
                            //	filesteam.on('data',function(d){
                            //		data += d;
                            //	});
                            //	filesteam.on('end',function(d){

                            //	});
                            							
							var options = {
							  host: WASTONHOST,
							  path: WASTONAPATH+'create'
							};
							
							var callback = function(response) {
							  var str = '';
							
							  //another chunk of data has been recieved, so append it to `str`
							  response.on('data', function (chunk) {
								str += chunk;
							  });
							
							  //the whole response has been recieved, so we just print it out here
							  response.on('end', function () {
								console.log(str);
								if (str && str.split(":").length > 0)
								newInstance = str.split(":")[0];							    
								waitUntil().interval(10000).times(1).condition(function () {
									return (true);
								})
								.done(function (result) {
									 session.send('Your Incident number is \'%s\' ', newInstance);
									// if(args.intent == 'HintLockC'){
									// 	session.send('Please wait while we call for Automation Anyware Robot for Account Unlock.');
									// }else{
									// 	session.send('Please wait while we call for Automation Anyware Robot for Password Reset.');
									// }
								});
								
								// timer started to generate new password
								waitUntil().interval(5000).times(1).condition(function () {
									return (true);
								})
								.done(function (result) {
									 resetAndUnlock();
								});
										
							  });
							}
							
							http.request(options, callback).end();

                            function resetAndUnlock() {
								
                                if (args.intent == 'HintLockC') {

                                    fs.writeFile("D:/home/site/wwwroot/messages/AAL_PWD.txt", "http://loginpagewebapp.azurewebsites.net,", { 'flag': 'w' }, function (err) {
                                        waitUntil().interval(5000).times(1).condition(function () {
                                            return (true);
                                        })
                                            .done(function (result) {
                                                //console.log(new Date());
                                                //readINC();												
                                                uploadAALPWD();
                                            });
                                        if (err) {
                                            //session.send('fail');
                                            console.log(err);
                                        }
                                    });

									function uploadAALPWD() {
                                        
										let fileStream3 = fs.createReadStream("D:/home/site/wwwroot/messages/AAL_PWD.txt");

										oneDriveAPI.items.uploadSimple({
											accessToken: ONEDRIVETOKEN,
											filename: "AAL_PWD.txt",
											readableStream: fileStream3
										}).then((item) => {
											//session.send('Your Incident number sucessfully created.');
											
											//session.send('Please wait while we call for Automation Anyware Robot for account unlock.');
											//console.log(item);
											waitUntil().interval(40000).times(1).condition(function () {
												return (true);
											})
											.done(function (result) {
												//console.log(new Date());
												//function3();													
												session.send('Your account has been successfully unlocked. <br/>Please try logging in using your current password.');
												session.send('Please confirm if we can close the ticket by selecting Yes or No.<br/>1.Yes<br/>2.No');
											});

											//setTimeout(function3, 4000);
											// returns body of https://dev.onedrive.com/items/upload_put.htm#response
										});
							        }

                                } else {
									
                                    fs.writeFile("D:/home/site/wwwroot/messages/Reset_User_Password.txt", "http://loginpagewebapp.azurewebsites.net,", { 'flag': 'w' }, function (err) {
                                        waitUntil().interval(5000).times(1).condition(function () {
                                            return (true);
                                        })
                                            .done(function (result) {
                                                //console.log(new Date()); 
												//readINC();
                                                uploadPWD();
                                            });
                                        if (err) {
                                            //session.send('fail');
                                            console.log(err);
                                        }
                                    });

                                    function uploadPWD() {
										
										let fileStream4 = fs.createReadStream("D:/home/site/wwwroot/messages/Reset_User_Password.txt");

										oneDriveAPI.items.uploadSimple({
											accessToken: ONEDRIVETOKEN,
											filename: "Reset_User_Password.txt",
											readableStream: fileStream4
										}).then((item) => {
											//session.send('Your Incident number sucessfully created.');
										   
											//session.send('Please wait while we call for Automation Anyware Robot for Password Reset.');
											//console.log(item);
											waitUntil().interval(40000).times(1).condition(function () {
												return (true);
											})
											.done(function (result) {
												//console.log(new Date()); 
												//function3();												
                                                var mongodata = db.collection('UserSecurity').find({"email":"goldenbaski@gmail.com"}); 											
												mongodata.each(function (err, item) {
													var jsonstr = {data:item};                    
													res.end(JSON.stringify(jsonstr)); 
													var newpwd = jsonstr.password; 													                                                            
													session.send('Your password has been reset successfully and new password is '+newpwd+'. <br/>Please try logging in using this new password.');
													session.send('Please confirm if we can close the ticket by selecting Yes or No.<br/>1.Yes<br/>2.No');
													return;                              
												});
												
											});

											//setTimeout(function3, 4000);
											// returns body of https://dev.onedrive.com/items/upload_put.htm#response
										});
									}

                                }
                            }
                        //}
                    }else if(args.intent == 'issuestatus'){
						for (var j = 0; j < dialogs.length; j++) {
                            session.send(dialogs[j], session.message.text);
                        }						
						var options = {
						  host: WASTONHOST,
						  path: WASTONAPATH+'close/' + newInstance
						};						
						var callback = function(response) {
						  var str = '';
						  response.on('data', function (chunk) {
							str += chunk;
						  });
						response.on('end', function () {
							//console.log(str);
							if (str && str.split(":").length > 0)							
							var closeInstruction = str.split(":")[0];							
							waitUntil().interval(5000).times(1).condition(function () {
								return (true);
							})
							.done(function (result) {
								 session.send('Incident number for this issue \'%s\' is closed.', closeInstruction);
								 session.send('Thanks for contacting Smart Service Desk!');
								
							});
									
						  });
						}
						
						http.request(options, callback).end();
						
					}else if(args.intent == 'IssueStatusNo'){
						for (var j = 0; j < dialogs.length; j++) {
                            session.send(dialogs[j], session.message.text);	
                        }
						var userText = session.message.text;						
                        userText = userText.replace(new RegExp(" ", 'g'), "%20");                        
                        
						var options = {
						  host: WASTONHOST,
						  path: WASTONAPATH+'update/' + newInstance +'/'+userText						  
						};
                        						
						var callback = function(response) {
						  var str = '';
						  var updateInstruction = '';
						  //another chunk of data has been recieved, so append it to `str`
						  response.on('data', function (chunk) {
							str += chunk;                            
						  });						
						  //the whole response has been recieved, so we just print it out here
						  response.on('end', function () {							
							if (str && str.split(":").length > 0)							
							updateInstruction = str.split(":")[2];							
							waitUntil().interval(5000).times(1).condition(function () {
							 return (true);
							})
							.done(function (result) {
    							 session.send('Your ticket status has been updated as \'%s\'.', updateInstruction);
    							 session.send('Thanks for contacting Smart Service Desk!');								
							});									
						  });
						}						
						http.request(options, callback).end();						
					}					
					else if(args.intent == 'HintLockA'){                     
						var userText = session.message.text;
                        if (userText.indexOf('INC') === -1)
						{
						    for (var j = 0; j < dialogs.length; j++) {
                                session.send(dialogs[j], session.message.text);	
                            }
						}else {                             
                            var options = {
                            host: WASTONHOST,
                            path: WASTONAPATH+'close/' + userText
                            };                            
                            var callback = function(response) {
                            var str = '';
                            
                            //another chunk of data has been recieved, so append it to `str`
                            response.on('data', function (chunk) {
                                str += chunk;
                            });
                            
                            //the whole response has been recieved, so we just print it out here
                            response.on('end', function () {
                                //console.log(str);
                                if (str && str.split(":").length > 0)
                                //var newInstance = str.split(":")[0];
                                var updateInstruction = str.split(":")[2];
                                //session.send(str);
                                waitUntil().interval(5000).times(1).condition(function () {
                                    return (true);
                                })
                                .done(function (result) {
                                    session.send('Your ticket status has been closed.');
                                    session.send('Thanks for contacting Smart Service Desk!');
                                    
                                });									
                            });
                            }						
                            http.request(options, callback).end();	
                        }					
					}
                    else {
                        for (var j = 0; j < dialogs.length; j++) {
                            session.send(dialogs[j], session.message.text);                           
                        }
                    }

                });
            }
        }
    });

    function getDialogByIntent(intentStr) {
        for (var i = 0; i < intentlist.length; i++) {
            if (intentStr === intentlist[i].name) {
                return intentlist[i].text;
            }
        }
        if (intentStr == 'HintC')
            return 'Sorry, I did not understand \'%s\'.';
    }

    function checkHintQuestionAndAswers(answer, id) {
        var hintquestions = db.collection('userdetails').find({ "enterpriseid": id });
        hintquestions.each(function (err, item) {
            if (item !== null) {
                var a1 = item.questionsAnswers[0].a;
                if (a1 == answer) {
                    return 'Y';
                } else {
                    return 'N';
                }
            }
        });
    }
    //if (db)db.close();
});

intents.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});
bot.dialog('/', intents);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}