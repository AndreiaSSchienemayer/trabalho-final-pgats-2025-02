const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
const userService = require('../../src/services/userService');
const checkoutController = require('../controllers/checkoutController');
const checkoutService = require('../../src/services/checkoutService');

describe('Usando Mocks no UserController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('Validando Registros', () => {
        it('Usando Mock: Deve autenticar usuário com sucesso', async () => {
            sinon.stub(userService, 'authenticate').returns({ token: 'validtoken' });

            const resposta = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'andreia@email.com',
                    password: '123456'
                });

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('token', 'validtoken');
        });

        it('Usando Mock: Deve retornar erro se credenciais inválidas', async () => {
            sinon.stub(userService, 'authenticate').returns(null);

            const resposta = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'andreia@email.com',
                    password: '12ABC'
                });

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('error', 'Credenciais inválidas');
        });
    });
});

    describe('Usando Mocks no CheckoutController', () => {
    let token = 'token';

    afterEach(() => {
        sinon.restore();
    });

        it('Deve retornar sucesso no checkout com token válido', async () => {
            sinon.stub(userService, 'verifyToken').returns({ id: 1 });
            sinon.stub(checkoutService, 'checkout').returns({ total: 100 });

            const resposta = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [{ productId: 1, quantity: 2 }],
                    freight: 0,
                    paymentMethod: 'boleto',
                    cardData: null
                });

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.include({ valorFinal: 100, total: 100 });
        });

        it('Deve retornar erro de autenticação se token for inválido', async () => {
            sinon.stub(userService, 'verifyToken').returns(null);

            const resposta = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer tokeninvalido`)
                .send({
                    items: [{ productId: 1, quantity: 2 }],
                    freight: 0,
                    paymentMethod: 'boleto',
                    cardData: null
                });

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('error', 'Token inválido');
        });

        it('Deve retornar erro se checkoutService lançar exceção', async () => {
            sinon.stub(userService, 'verifyToken').returns({ id: 1 });
            sinon.stub(checkoutService, 'checkout').throws(new Error('Produto não encontrado'));

            const resposta = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [{ productId: 1, quantity: 2 }],
                    freight: 0,
                    paymentMethod: 'boleto',
                    cardData: null
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Produto não encontrado');
        });
});


