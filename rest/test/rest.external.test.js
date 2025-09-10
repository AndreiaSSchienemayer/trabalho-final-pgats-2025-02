const request = require('supertest');
const { expect } = require('chai');
const apiUrl = 'http://localhost:3000'; // Endereço da API REST

describe('Cadastrando de Usuários', () => {
    it('Cadastro falha quando email já existe', async () => {    
    await request(apiUrl)
        .post('/api/users/register')
        .send({ name: 'Andreia', email: 'andreia2.schienemayer@gmail.com', password: '123456' });

    const respostaErro = require('../fixture/respostas/quandoInformoEmailJaCadastradoRetorna400.json');
    const res = await request(apiUrl)
        .post('/api/users/register')
        .send({ name: 'Andreia', email: 'andreia2.schienemayer@gmail.com', password: '123456' });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal(respostaErro);
    });

}); 



describe('Login no sistema', () => {
    it('Deve autenticar usuário válido e retornar o token JWT', async () => {
    await request(apiUrl)
        .post('/api/users/register')
        .send({ name: 'Andreia', email: 'andreia2.schienemayer@gmail.com', password: '123456' });

    const res = await request(apiUrl)
        .post('/api/users/login')
        .send({ email: 'andreia2.schienemayer@gmail.com', password: '123456' });
    //console.log('Retorno do login:', res.body); 

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.token).to.be.a('string');
});

    it('Quando informar login inválido deve retornar Credenciais Inválidas', async () => {
    await request(apiUrl)
        .post('/api/users/register')
        .send({ name: 'Andreia', email: 'andreia2.schienemayer@gmail.com', password: '1234567' });

    const respostaErro = require('../fixture/respostas/quandoInformoLoginInvalidoNaoAcessa.json');
    const res = await request(apiUrl)
        .post('/api/users/login')
        .send({ email: 'andreia2.schienemayer@gmail.com', password: '1234567' });

    expect(res.status).to.equal(401); 
    expect(res.body).to.deep.equal(respostaErro);
    });
});


describe('Checkout', () => {
    it('Deve realizar checkout com token válido usando boleto', async () => {
    const respostaEsperada = require('../fixture/respostas/quandoUsoTokenValidoComBoletoRetornaCheckoutRealizado.json');

    const loginRes = await request(apiUrl)
        .post('/api/users/login')
        .send({ email: 'andreia@gmail.com', password: '123456' });

    const token = loginRes.body.token;

    const res = await request(apiUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({
            items: [
                { productId: 1, quantity: 2 }
            ],
            paymentMethod: 'boleto',
            freight: 0 
        });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(respostaEsperada);
    });

it('Deve realizar checkout com token válido usando cartão de crédito', async () => {
    const respostaEsperada = require('../fixture/respostas/quandoUsoTokenValidoComCartaoRetornaCheckoutRealizado.json');

    const loginRes = await request(apiUrl)
        .post('/api/users/login')
        .send({ email: 'andreia@gmail.com', password: '123456' });

    const token = loginRes.body.token;

    const res = await request(apiUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({
            items: [
                { productId: 2, quantity: 2 }
            ],
            paymentMethod: 'cartao',
            freight: 10 
        });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(respostaEsperada);
    });

it('Deve retornar erro de autenticação ao tentar checkout sem token', async () => {
    const respostaErro = require('../fixture/respostas/quandoNaoInformoTokenReceboTokenInvalidoAoFazerCheckout.json');

    const res = await request(apiUrl)
        .post('/api/checkout')        
        .send({
            items: [
                { productId: 1, quantity: 2 }
            ],
            paymentMethod: 'boleto',
            freight: 0
        });

    expect(res.status).to.equal(401); 
    expect(res.body).to.deep.equal(respostaErro);
    });

});


