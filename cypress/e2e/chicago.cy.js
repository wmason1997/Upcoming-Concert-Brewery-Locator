describe('Chicago Concert Search', () => {
  beforeEach(() => {
    // Intercept Ticketmaster API calls
    cy.intercept('GET', 'https://app.ticketmaster.com/discovery/v2/events.json*').as('ticketmasterApi');

    cy.visit('/');
    cy.get('#ticketmaster-search').type('Chicago');
    cy.setDateRangeToEndOfYear();
  });

  it('should return Hip-Hop concert results', () => {
    cy.get('#Rap').check().should('be.checked');
    cy.get('#search-button').click();

    // Wait for API response and verify it was successful
    cy.wait('@ticketmasterApi').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);

      const responseBody = interception.response.body;

      if (responseBody._embedded && responseBody._embedded.events && responseBody._embedded.events.length > 0) {
        // Results found - verify event buttons are rendered
        cy.get('#ticketmaster-api-results-container .event-button')
          .should('have.length.greaterThan', 0);
      } else {
        // No results - API returned 200 but no events for this genre/city/date
        cy.log('No Hip-Hop events found in Chicago for the selected date range');
        expect(responseBody.page.totalElements).to.equal(0);
      }
    });

    // Wait to allow visual inspection of results in headed mode
    cy.wait(2000);
  });

  it('should return Rock concert results', () => {
    cy.get('#Rock').check().should('be.checked');
    cy.get('#search-button').click();

    cy.wait('@ticketmasterApi').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);

      const responseBody = interception.response.body;

      if (responseBody._embedded && responseBody._embedded.events && responseBody._embedded.events.length > 0) {
        cy.get('#ticketmaster-api-results-container .event-button')
          .should('have.length.greaterThan', 0);
      } else {
        cy.log('No Rock events found in Chicago for the selected date range');
        expect(responseBody.page.totalElements).to.equal(0);
      }
    });

    // Wait to allow visual inspection of results in headed mode
    cy.wait(2000);
  });

  it('should return Country concert results', () => {
    cy.get('#Country').check().should('be.checked');
    cy.get('#search-button').click();

    cy.wait('@ticketmasterApi').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);

      const responseBody = interception.response.body;

      if (responseBody._embedded && responseBody._embedded.events && responseBody._embedded.events.length > 0) {
        cy.get('#ticketmaster-api-results-container .event-button')
          .should('have.length.greaterThan', 0);
      } else {
        cy.log('No Country events found in Chicago for the selected date range');
        expect(responseBody.page.totalElements).to.equal(0);
      }
    });

    // Wait to allow visual inspection of results in headed mode
    cy.wait(2000);
  });

  it('should return Pop concert results', () => {
    cy.get('#Pop').check().should('be.checked');
    cy.get('#search-button').click();

    cy.wait('@ticketmasterApi').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);

      const responseBody = interception.response.body;

      if (responseBody._embedded && responseBody._embedded.events && responseBody._embedded.events.length > 0) {
        cy.get('#ticketmaster-api-results-container .event-button')
          .should('have.length.greaterThan', 0);
      } else {
        cy.log('No Pop events found in Chicago for the selected date range');
        expect(responseBody.page.totalElements).to.equal(0);
      }
    });

    // Wait to allow visual inspection of results in headed mode
    cy.wait(2000);
  });

  it('should return Metal concert results', () => {
    cy.get('#Metal').check().should('be.checked');
    cy.get('#search-button').click();

    cy.wait('@ticketmasterApi').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);

      const responseBody = interception.response.body;

      if (responseBody._embedded && responseBody._embedded.events && responseBody._embedded.events.length > 0) {
        cy.get('#ticketmaster-api-results-container .event-button')
          .should('have.length.greaterThan', 0);
      } else {
        cy.log('No Metal events found in Chicago for the selected date range');
        expect(responseBody.page.totalElements).to.equal(0);
      }
    });

    // Wait to allow visual inspection of results in headed mode
    cy.wait(2000);
  });
});
