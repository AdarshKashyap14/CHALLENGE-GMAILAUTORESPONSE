const express = require("express");
const app = express();
const port=8000;
const path=require('path');
const fs=require('fs').promises;
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES=[
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://mail.google.com/'

];

app.get('/',async(req,res)=>{
    //Load client secrets from a local file.
    const credentials= await fs.readFile('credentials.json');

    //Authorize a client with credentials, then call the Gmail API.
    const auth = await authenticate({
        keyfilePath: path.join(__dirname,'credentials.json'),
        scopes: SCOPES,

    });

    console.log("This is AUTH = ", auth);

    const gmail = google.gmail({version: 'v1', auth});

    const response = await gmail.users.labels.list({
        userId:'me',
    });

    const LABEL_NAME='Vacation';

    //load credentials from file
    async function loadCredentials(){
        const filePath = path.join(process.cwd(),'credentials.json');
        const content = await fs.readFile(filePath,{encoding:'utf-8'});
        return JSON.parse(content);
    }

    //Get messages that have no prior replies
    async function getUnnrepliedMessages(auth){
        const gmail = google.gmail({version:'v1',auth});
        const res = await gmail.users.messages.list({
            userId:'me',
            q:'-in:chats -from:me -has:userlabels',
        });
        return res.data.messages || [];
    }

    //send reply to a message
    async function sendReply(auth,message){
        const gmail = google.gmail({version:'v1',auth});
        const res = await gmail.users.messages.get({
            userId:'me',
            id:message.id,
            format:'metadata',
            metadataHeaders:['Subject','From'],
        });

        const Subject = res.data.payload.headers.find(
            (header) => header.name === 'Subject'
        ).value;
        const from=res.data.payload.headers.find(
            (header) => header.name === 'From'
        ).value;

        const replyTo = from.match(/<(.*)>/)[1];
        const replySubject= Subject.startsWith('Re:')? Subject: `Re: ${Subject}`;
        const replyBody=`Hi,\n\nI'm currently on vacation and will get back to you soon.\n\nBest,\nYour Name`;
        const rawMessage=[
            `From :me`,
            `To: ${replyTo}`,
            `Subject: ${replySubject}`,
            `In-Reply-To:${message.id}`,
            `References:${message.id}`,
            '',
            replyBody,

        ].join('\n');

        const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/, '');
        await gmail.users.messages.send({
            userId:'me',
            requestBody:{raw:encodedMessage},
        });
    }

    //add label to a message
    async function createLabel(auth){
        const gmail = google.gmail({version:'v1',auth});
        try{
            const res = await gmail.users.labels.create({
                userId:'me',
                requestBody:{
                    name:LABEL_NAME,
                    labelListVisibility:'labelShow',
                    messageListVisibility:'show',
                },
            });
            return res.data.id;
        }
        catch(err){
            if(err.code === 409){
            //label already exists
            const res = await gmail.users.labels.list({
                userId:'me'
            });

            const label = res.data.labels.find((label) => label.name === LABEL_NAME);
            return label.id;
        }
        else{
            throw err;
        }       
    }
}

    //add label to a message and move it to the lable folder
    async function addLabel(auth,message,labelId){
        const gmail = google.gmail({version:'v1',auth});
        await gmail.users.messages.modify({
            userId:'me',
            id:message.id,
            requestBody:{
                addLabelIds:[labelId],
                removeLabelIds:['INBOX'],
    },
});
}

    //main function
    async function main(){

        //create a label for the app
        const labelId = await createLabel(auth);
        console.log(`Created or found label with id ${labelId}`);

        //Repeat the following steps in random intervals
        setInterval(async()=>{
            //get messages that have no prior replies
            const messages = await getUnnrepliedMessages(auth);
            console.log(`Found ${messages.length} messages to reply : `);

            //send a reply to each message
            for(const message of messages){
                //send reply to the message
                await sendReply(auth,message);
                console.log(`Sent reply to message with id ${message.id}`);
                //Add label to the message and move it to the label folder
                await addLabel(auth,message,labelId);
                console.log(`Added label to message with id ${message.id}`);
            }
        },Math.floor(Math.random()*(120-45+1)+45)*1000);//Random interval between 45 and 120 seconds
    }

    main().catch(console.error);

    // const labels = response.data.labels;
    res.send("You have successfully subscribed to our service.");
        });

app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
        
       
});