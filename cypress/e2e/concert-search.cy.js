describe('Tunes and Brews - Concert Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage with all required elements', () => {
    cy.get('#page-title').should('be.visible');
    cy.get('#ticketmaster-search').should('be.visible');
    cy.get('#search-button').should('be.visible');
    cy.get('#from').should('be.visible');
    cy.get('#to').should('be.visible');
  });

  it('should set date range from today to end of year', () => {
    cy.setDateRangeToEndOfYear();

    // Verify the from date is set to today
    const today = new Date();
    const expectedFromDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
    cy.get('#from').should('have.value', expectedFromDate);

    // Verify the to date is set to end of year
    cy.get('#to').should('have.value', '12/31/2026');
  });

  it('should allow selecting music genres', () => {
    cy.get('#Rap').check().should('be.checked');
    cy.get('#Rock').check().should('be.checked');
    cy.get('#Country').should('not.be.checked');
  });

  it('should perform a search with city and date range', () => {
    // Enter a city
    cy.get('#ticketmaster-search').type('San Diego');

    // Select a genre
    cy.get('#Rock').check();

    // Set the date range
    cy.setDateRangeToEndOfYear();

    // Click search
    cy.get('#search-button').click();

    // Verify the results container becomes visible
    cy.get('#ticketmaster-search-container').should('be.visible');
  });
});
