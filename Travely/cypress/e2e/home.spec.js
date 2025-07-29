describe('Página principal', () => {
  it('carga correctamente', () => {
    cy.visit('/');
    cy.contains('h1', 'Bienvenido a Vue.js');
  });
});
