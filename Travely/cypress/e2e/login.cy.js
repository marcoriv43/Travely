describe('Login Test', () => {
  it('should login successfully with valid credentials', () => {
    cy.visit('http://localhost:5173/login'); // Ajusta la ruta según tu frontend

    cy.get('input[name="email"]').type('usuario@ejemplo.com'); // Usa un usuario de prueba
    cy.get('input[name="password"]').type('password123'); // Contraseña de prueba

    cy.get('button[type="submit"]').click();

    // Esperar redirección y verificar que estamos en el dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenido').should('be.visible'); // O busca algún texto que solo aparezca en el dashboard
  });

});