const request = require('supertest');
const { expect } = require('chai');
const apiUrl = 'http://localhost:4000'; 

describe('Testes External GraphQL', () => {  
it('Deve cadastrar novo usuário via GraphQL', async () => {
    const respostaEsperada = require('../fixture/respostas/quandoCadastroNovoUsuarioQueNaoExisteRetornaSucesso.json');

    const mutation = `
        mutation {
            register(name: "Andreia 10", email: "andreia10@gmail.com", password: "123456") {
                email
                name
            }
        }
    `;

    const res = await request(apiUrl)
        .post('/graphql')
        .send({ query: mutation
    });
});


it('Deve retornar erro ao tentar cadastrar usuário com email já cadastrado', async () => {
    const respostaErro = require('../fixture/respostas/quandoIndicadoEmailJaCadastradoInformaEmailJaCadastrado.json');

    const mutation = `
        mutation {
            register(name: "Andreia 10", email: "andreia10@gmail.com", password: "123456") {
                email
                name
            }
        }
    `;

    const res = await request(apiUrl)
        .post('/graphql')
        .send({ query: mutation });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('errors');
    expect(res.body.errors[0].message).to.equal(respostaErro.errors[0].message);
});

it('Deve retornar erro ao autenticar usuário com senha inválida', async () => {
    const mutation = `
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                user {
                    email
                    name
                }
            }
        }
    `;
    const variables = {
        email: "andreia10@gmail.com",
        password: "abc123"
    };

    const res = await request(apiUrl)
        .post('/graphql')
        .send({ query: mutation, variables });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('errors');
    expect(res.body.errors[0].message).to.include('Credenciais inválidas');
});

it('Deve retornar erro ao tentar autenticar email não cadastrado', async () => {
    const mutation = `
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                user {
                    email
                    name
                }
            }
        }
    `;
    const variables = {
        email: "andreia.aaa@email.com",
        password: "123456"
    };

    const res = await request(apiUrl)
        .post('/graphql')
        .send({ query: mutation, variables });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('errors');
    expect(res.body.errors[0].message).to.include('Credenciais inválidas');
});


});