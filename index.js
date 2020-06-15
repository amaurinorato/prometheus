const express = require('express')
const client = require('prom-client')
const register = client.register;

const app = express()

const counter = new client.Counter({name: 'aula_request_total', help: 'Contador de request', labelNames: ['statusCode']})

app.get('/', (req, resp) => {
    counter.inc();
    counter.labels('200').inc();
    return resp.status(200).send('Hello world')
})

app.get('/metrics', (req, resp) => {
    try{
        resp.set('Content-type', register.contentType);
        return resp.send(register.metrics());
    } catch (error) {
        console.log(error);
        return resp.send(resp.status(500).send({mensagem: 'Erro'}));
    }
})

app.listen(3000)