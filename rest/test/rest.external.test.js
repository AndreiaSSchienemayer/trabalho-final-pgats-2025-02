const request = require('supertest');
const { expect } = require('chai');
const apiUrl = 'http://localhost:3000'; // Endereço da API REST

describe('Cadastrando usuário com sucesso', () => {
    it('Cadastrando usuário com sucesso', async () => {
        const respostaEsperada = require('../fixture/respostas/quandoInformdoDadosValidosTenhoSucesso.json');
        const res = await request(apiUrl)
            .post('/api/users/register')
            .send({ name: 'Andreia', email: 'andreia.schienemayer@gmail.com', password: '123456' });

        expect(res.status).to.equal(201); // ou 200, conforme sua API
        expect(res.body).to.deep.equal(respostaEsperada);
    });
});