import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GitHubStats from "@/components/github-stats";
import "@testing-library/jest-dom";
import { GitHubData } from "@/interfaces/interfaces";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("GitHubStats Component", () => {
  const mockData: GitHubData = {
    public_repos: 10,
    followers: 20,
    following: 30,
    name: "Jerome Albrecht",
    bio: "Développeur passionné",
    avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
    login: "jeromealbrecht",
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Mock fetch
    global.fetch = jest.fn();
  });

  it("affiche les statistiques après un appel API réussi", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<GitHubStats username="jeromealbrecht" />);

    // Vérifier que le chargement est affiché
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText("Jerome Albrecht")).toBeInTheDocument();
    });

    // Vérifier que toutes les données sont affichées
    expect(screen.getByText("Développeur passionné")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByAltText("Avatar de jeromealbrecht")).toBeInTheDocument();
  });

  it("gère les erreurs de l'API", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<GitHubStats username="utilisateur-inexistant" />);

    await waitFor(() => {
      expect(screen.getByText("Utilisateur introuvable")).toBeInTheDocument();
    });
  });

  it("permet de changer d'utilisateur", async () => {
    const newMockData: GitHubData = {
      public_repos: 15,
      followers: 25,
      following: 35,
      name: "Jerome Albrecht Updated",
      bio: "Bio mise à jour",
      avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
      login: "jeromealbrecht",
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => newMockData,
      });

    render(<GitHubStats username="jeromealbrecht" />);

    // Attendre le premier chargement
    await waitFor(() => {
      expect(screen.getByText("Jerome Albrecht")).toBeInTheDocument();
    });

    // Simuler le changement d'utilisateur
    const input = screen.getByPlaceholderText("Nom d'utilisateur GitHub");
    fireEvent.change(input, { target: { value: "nouveau-username" } });
    fireEvent.submit(input.closest("form")!);

    // Vérifier que les nouvelles données sont affichées
    await waitFor(() => {
      expect(screen.getByText("Jerome Albrecht Updated")).toBeInTheDocument();
      expect(screen.getByText("Bio mise à jour")).toBeInTheDocument();
    });
  });
});
