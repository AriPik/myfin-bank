describe("Customer Login E2E", () => {
  it("should show landing page", () => {
    cy.visit("/");
    cy.contains("MyFin Bank").should("be.visible");
  });

  it("should navigate to customer login page", () => {
    cy.clearLocalStorage();
    cy.visit("/login/customer");
    cy.url().should("include", "/login/customer");
  });

  it("should show error on wrong credentials", () => {
    cy.visit("/login/customer");
    cy.get("input[name='identifier']").type("wrong@gmail.com");
    cy.get("input[name='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  it("should login successfully with valid credentials", () => {
    cy.visit("/login/customer");
    cy.get("input[name='identifier']").type("arijitdas7996@gmail.com");
    cy.get("input[name='password']").type("modernnewpass123");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/customer/dashboard");
  });
});