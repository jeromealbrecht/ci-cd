import { render, screen } from "@testing-library/react";
import Page from "../page";

describe("Page", () => {
  it("renders without crashing", () => {
    render(<Page />);
    // Le test passe si le composant se rend sans erreur
  });
});
