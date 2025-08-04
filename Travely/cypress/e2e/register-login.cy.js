describe('Registro y Login', () => {
    const user = 'Julia Abreu'
    const email = `${user}@gmail.com`;
    const password = `password${user}`;
    const sexo = 'Femenino'; //masculino, Feminino, otro


  it('Permite registrar un nuevo usuario y luego loguearse', () => {
    // Registro
    cy.visit('/register');
    cy.get('input[type="text"]').type(user);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('select[id="tipo"]').select('Conductor');
    cy.get('select[id="sexo"]').select(sexo);
    cy.get('button').contains('Registrarse').click();

    // Verifica que el registro fue exitoso
    cy.url().should('include', '/login');
    cy.contains('Iniciar Sesión').should('exist');

    // Login
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button').contains('Iniciar Sesión').click();

    // Verifica que el login fue exitoso y se accede al dashboard
    cy.url().should('include', '/dashboard');
    cy.contains(`Bienvenido, ${user}`).should('exist'); // Ajusta según tu UI
  });
});