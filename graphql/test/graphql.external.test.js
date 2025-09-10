const request = require('supertest');
const apiUrl = 'http://localhost:4000'; // Endereço da API GraphQL

describe('Testes External GraphQL', () => {
  it('deve registrar usuário via mutation', async () => {
    const mutation = `
      mutation {
        register(name: "Teste", email: "teste@email.com", password: "123456") {
          email
          name
        }
      }
    `;
    const res = await request(apiUrl)
      .post('/graphql')
      .send({ query: mutation });
    // ...asserts...
  });
});