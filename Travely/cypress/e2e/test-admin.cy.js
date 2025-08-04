describe('Registro, login y funciones de un coductor', () => {
    const user = `admin`
    const email = `${user}@travely.com`;
    const password = `${user}Clave`;

  it('Permite registrar un nuevo usuario y luego loguearse', () => {
    // Login
    cy.visit('/');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button').contains('Iniciar Sesión').click();

    // Verifica que el login fue exitoso y se accede al dashboard
    cy.url().should('include', '/dashboard');
    cy.contains(`Bienvenido, ${user}`).should('exist'); 
  
    // Busca un usario y lo bloquear, luego lo vuelve a desbloquear
    cy.get('input[type="text"]').type('pasajero');
    cy.contains('button', 'Buscar').click();
    cy.contains('button', 'Bloquear').click();
    cy.get('input[type="text"]').type('pasajero');
    cy.contains('button', 'Buscar').click();
    cy.contains('button', 'Activar').click();
 
    // Compruba el funcionamineto del panel de usuarios
    cy.contains('button', 'Ir al panel de Viajes').click();
    cy.contains('Me dirijo a la UVM sede estovacuy').parent().find('button').contains('Cancelar').click();
    cy.contains('Me dirijo a la UVM sede estovacuy').parent().find('button').contains('Reactivar').click();
    
    cy.contains('button', 'Cerrar Sesión').click();
});
});