describe('Registro, login y funciones de un Pajero', () => {
    const user = 'Marco Rivero 43'
    const email = `${user}@gmail.com`;
    const password = `password${user}`;
    const sexo = 'Femenino'; //masculino, Feminino, otro


  it('Permite registrar un nuevo usuario y luego loguearse', () => {
    // Registro
    cy.visit('/register');
    cy.get('input[type="text"]').type(user);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('select[id="tipo"]').select('Pasajero');
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
    cy.contains(`Bienvenido, ${user}`).should('exist'); 
  
    // Buscamos un viaje
    cy.contains('button', 'Buscar Viajes').click();

    cy.get('select').eq(0).select(1);
    cy.get('input[id="asientos"]').clear().type('3');
    cy.get('input[type="date"]').type('2025-08-01');
    cy.wait(2500);
    cy.contains('button', 'Buscar').click();
    cy.wait(2500);
    cy.contains('button', 'Viajar').click();

    //Verifica que te redirecciones al dashboard, ademas cer el historial y luego cancelar el viaje 
    cy.url().should('include', '/dashboard');
    cy.contains(`Bienvenido, ${user}`).should('exist');
    cy.wait(2500);
    cy.contains('button', 'Ver Viajes').click();
    cy.wait(2500);
    cy.contains('button', 'Regresar').click();
    cy.wait(2500);
    cy.contains('Viaje de prueba').parent().find('button').contains('Cancelar').click();
    cy.wait(2500);
    cy.contains('button', 'Cerrar Sesión').click();
  });
});