const mongoCliente = require('mongodb').MongoClient;
const assert = require('assert');
const object = require('mongodb').ObjectID;
const url = 'mongodb://dpspcollections:k2st2dEcAHLzyDTPq52rY6bT99hcC0Gn15C6C4rmk8yT93l4MOC0MpjGkw9HuMn9azs5rMqbfUN3tOw9YZHEvA%3D%3D@dpspcollections.mongo.cosmos.azure.com:10255/?ssl=true';

module.exports = async function (context, req) {
    context.log('Disparador via HTTP com resposta em JSON.');

    const tablename = (req.query.tablename || (req.body && req.body.tablename));

    mongoCliente.connect(url, function (err, client) {
        //assert.equal(null, err);
        const db = client.db('switcher');

        db.collection('tableaction').updateOne(
            { "_id": object('607b1a6f4698800ba21efc6c') },
            {
                $set: { "tablename": tablename || 'STG_CARROSSEL_APP' },
                $currentDate: { "lastModified": true }
            }, function (err, results) {
                const tableaction = db.collection('tableaction').find(
                    { "_id": object('607b1a6f4698800ba21efc6c') }
                );
                tableaction.each(function (err, doc) {
                    if (doc != null)
                        console.log(doc);
                });
            }
        );
    });

    const responseMessage = tablename
        ? `Sucesso! A tabela, ${tablename} foi habilitada com sucesso.`
        : "O disparador HTTP acessado com sucesso. Passe o valor da tabela que deseja habilitar.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}