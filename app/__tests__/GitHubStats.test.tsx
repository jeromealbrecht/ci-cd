import { render, screen, waitFor } from "@testing-library/react";
import GitHubStats from "../../components/github-stats";
import "@testing-library/jest-dom";
import { GitHubData } from "@/interfaces/interfaces";

// Mock de la fonction fetch
global.fetch = jest.fn();

describe("GitHubStats Component", () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("affiche un message de chargement initialement", () => {
    render(<GitHubStats username="jeromealbrecht" />);
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it("affiche les statistiques après un appel API réussi", async () => {
    // Mock de la réponse de l'API
    const mockData: GitHubData = {
      public_repos: 10,
      followers: 20,
      following: 30,
      name: "Jerome Albrecht",
      bio: "Développeur passionné",
    };

    // Configuration du mock fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<GitHubStats username="jeromealbrecht" />);

    // Vérifier que le loader est affiché
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // Attendre et vérifier que les données sont affichées
    await waitFor(() => {
      expect(screen.getByText(mockData.name)).toBeInTheDocument();
      expect(screen.getByText(mockData.bio)).toBeInTheDocument();
      expect(screen.getByText(`${mockData.public_repos}`)).toBeInTheDocument();
      expect(screen.getByText(`${mockData.followers}`)).toBeInTheDocument();
      expect(screen.getByText(`${mockData.following}`)).toBeInTheDocument();
    });

    // Vérifier que l'API a été appelée avec les bons paramètres
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/users/jeromealbrecht"
    );
  });

  it("affiche un message d'erreur en cas d'échec de l'API", async () => {
    // Mock d'une erreur API
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<GitHubStats username="jeromealbrecht" />);

    // Attendre et vérifier que le message d'erreur est affiché
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });

  it("met à jour les données quand le username change", async () => {
    const mockData1: GitHubData = {
      name: "Jerome Albrecht",
      public_repos: 10,
      followers: 0,
      following: 0,
      bio: "Bio 1",
    };

    const mockData2: GitHubData = {
      name: "Autre Utilisateur",
      public_repos: 20,
      followers: 0,
      following: 0,
      bio: "Bio 2",
    };

    // Premier appel API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData1,
    });

    const { rerender } = render(<GitHubStats username="jeromealbrecht" />);

    await waitFor(() => {
      expect(screen.getByText(mockData1.name)).toBeInTheDocument();
    });

    // Deuxième appel API avec un username différent
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData2,
    });

    rerender(<GitHubStats username="autreuser" />);

    await waitFor(() => {
      expect(screen.getByText(mockData2.name)).toBeInTheDocument();
    });
  });
});
