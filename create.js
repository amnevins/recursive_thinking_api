import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'devs',
        // 'Item' contains the attributes of the item to be created
        // - 'userId': because users are authenticated via Cognito User Pool, we
        //             will use the User Pool sub (a UUID) of the authenticated user
        // - 'noteId': a unique uuid
        // - 'content': parsed from request body
        // - 'attachment': parsed from request body
        // - 'createdAt': current Unix timestamp
        Item: {
            userId: event.requestContext.authorizer.claims.sub,
            devId: uuid.v1(),
            bio: data.bio,
            name: data.name,
            linkedin: data.linkedin,
            github: data.github,
            website: data.website,
            occupation: data.occupation,
            resume: data.resume,
            technologies: data.technologies,
            picture: data.picture,
            createdAt: new Date().getTime(),
            email: event.requestContext.authorizer.claims.email,
        },
    };

    try {
        const result = await dynamoDbLib.call('put', params);
        callback(null, success(params.Item));
    }
    catch(e) {
        callback(null, failure({status: false}));
    }
};
