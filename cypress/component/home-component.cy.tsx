import Home from "@/components/Home";

describe("Home Page", () => {
  beforeEach(() => {});
  it("displays the correct title", () => {
    (cy as any).mount(<Home startLink="/dashboard" />);
    cy.get('[data-cy="home-h1"]').should("contain.text", "request network");
  });
});
