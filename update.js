import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'devs',
        // 'Key' defines the partition key and sort key of the time to be updated
        // - 'userId': User Pool sub of the authenticated user
        // - 'noteId': path parameter
        Key: {
            userId: event.requestContext.authorizer.claims.sub,
            devId: event.pathParameters.id,
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: 'SET bio = :bio, resume = :resume, github = :github, occupation = :occupation, linkedin = :linkedin, website = :website, technologies = :technologies, picture = :picture',
        ExpressionAttributeValues: {
            ':bio': data.bio ? data.bio : null,
            ':resume': data.resume ? data.resume : null,
            ':github': data.github ? data.github : null,
            ':occupation': data.occupation ? data.occupation : null,
            ':linkedin': data.linkedin ? data.linkedin : null,
            ':website': data.website ? data.website : null,
            ':technologies': data.technologies ? data.technologies : null,
            ':picture': data.picture ? data.picture : null,
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const result = await dynamoDbLib.call('update', params);
        callback(null, success({status: true}));
    }
    catch(e) {
        callback(null, failure({status: false}));
    }
};
