// ***********************************************
// Custom Commands for Tunes and Brews E2E Tests
// ***********************************************

/**
 * Sets the date range from today to end of year (12/31/2026)
 * Works with jQuery UI datepicker inputs
 */
Cypress.Commands.add('setDateRangeToEndOfYear', () => {
  // Get today's date formatted as MM/DD/YYYY
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  const todayFormatted = `${month}/${day}/${year}`;

  // End of year date
  const endOfYear = '12/31/2026';

  // Set the "from" date to today
  cy.get('#from')
    .clear()
    .type(todayFormatted)
    .blur();

  // Set the "to" date to end of year
  cy.get('#to')
    .clear()
    .type(endOfYear)
    .blur();
})