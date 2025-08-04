describe('Registro, login y funciones de un coductor', () => {
    const user = 'Mireya Del carmen'
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
    cy.contains(`Bienvenido, ${user}`).should('exist'); 
  
    cy.contains('button', 'Publicar Viaje').click();
    
    // Abre el modal para agregar un vehículo
    cy.contains('button', 'Agregar vehículo').click();

    cy.get('input[type="Tipo"]').type('Carro');
    cy.get('input[type="Modelo"]').type('Yaris');
    cy.get('input[type="Marca"]').type('Toyota');
    cy.get('input[type="Col"]').type('Vinotinto');
    cy.get('.modal-vista input[type="number"]').clear().type('4', { force: true });
    cy.get('.modal-vista button').contains('Guardar').should('be.visible').click();

    // Crear un nuevo viaje
    cy.get('input[id="descripcion"]').type('Viaje de prueba');
    cy.get('select').eq(0).select(1); 
    cy.get('select').eq(1).select(1); 
    cy.get('input[type="date"]').type('2025-08-01');
    cy.get('input[type="time"]').type('10:00');
    cy.get('input[type="number"]').type('1');
    // Publica el viaje
    cy.get('button[type="submit"]').contains('Publicar').click();


    // Verifica que se regreso al dashboard y el viaje fue publicado
    cy.url().should('include', '/dashboard');
    cy.contains('Viaje de prueba').should('exist');

    // Iniciar el viaje
    cy.contains('Viaje de prueba').parent().find('button').contains('Iniciar').click();
    cy.contains('en proceso').should('exist');

    // Finalizar el viaje
    cy.contains('Viaje de prueba').parent().find('button').contains('Finalizar').click();

    // Ir al historial de viajes y regresar
    cy.contains('button', 'Ver Viajes').click();
    cy.wait(3000);
    cy.contains('button', 'Regresar').click();
    cy.wait(3000);
    //Cerrar sesion
    cy.contains('button', 'Cerrar Sesión').click();
  });
});