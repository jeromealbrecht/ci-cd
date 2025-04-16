import GitHubStats from "@/components/github-stats"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-white mb-8">GitHub Profile Explorer</h1>
        <GitHubStats />
      </div>
    </main>
  )
}
