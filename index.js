const express = require('express')
const client = require('prom-client')
const register = client.register;

const app = express()

const counter = new client.Counter({name: 'aula_request_total', help: 'Contador de request', labelNames: ['statusCode']})
const gauge = new client.Gauge({name: 'aula_free_bytes', help: 'Exemplo de gauge'})
const histogram = new client.Histogram({name: 'aula_request_time_seconds', help: 'Tempo de resposta da API', buckets: [0.1, 0.2, 0.3, 0.4, 0.5]})
const summary = new client.Summary({name: 'aula_summary_request_time_seconds', help: 'Tempo de resposta da API', percentiles: [0.1, 0.9, 0.99]})

function setMetrics() {
    const tempo = Math.random();
    counter.inc();
    counter.labels('200').inc();
    gauge.set(100 * tempo)
    histogram.observe(tempo)
    summary.observe(tempo)
}

app.get('/', (req, resp) => {
    setMetrics();
    return resp.status(200).send({mensagem: 'Hello world'})
})

app.get('/metrics', (req, resp) => {
    try {
        resp.set('Content-type', register.contentType);
        return resp.send(register.metrics());
    } catch (error) {
        console.log(error);
        return resp.send(resp.status(500).send({mensagem: 'Erro'}));
    }
})

app.listen(process.env.port || 3001)