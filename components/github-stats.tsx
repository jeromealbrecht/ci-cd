"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, RefreshCw, Star, GitFork, Users, BookOpen, ExternalLink, Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  created_at: string
}

interface GitHubRepo {
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
}

export default function GitHubStats() {
  const [username, setUsername] = useState(process.env.NEXT_PUBLIC_GITHUB_USERNAME || "")
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchUserData = async (username: string) => {
    if (!username) return

    setLoading(true)
    setError("")
    setUser(null)
    setRepos([])

    try {
      // Fetch user data
      const userRes = await fetch(`https://api.github.com/users/${username}`)

      if (!userRes.ok) {
        throw new Error(
          userRes.status === 404 ? "Utilisateur introuvable" : "Erreur lors de la récupération des données",
        )
      }

      const userData: GitHubUser = (await userRes.ok) ? await userRes.json() : null
      setUser(userData)

      // Fetch top repos
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=3`)
      const reposData: GitHubRepo[] = (await reposRes.ok) ? await reposRes.json() : []
      setRepos(reposData)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GITHUB_USERNAME) {
      fetchUserData(process.env.NEXT_PUBLIC_GITHUB_USERNAME)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUserData(username)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700 shadow-xl">
        <CardHeader className="border-b border-gray-700 pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Github className="h-6 w-6" />
            GitHub Profile Explorer
          </CardTitle>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur GitHub"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
            <Button
              type="submit"
              variant="secondary"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </form>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40 bg-gray-700" />
                    <Skeleton className="h-4 w-60 bg-gray-700" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Skeleton className="h-20 bg-gray-700 rounded-md" />
                  <Skeleton className="h-20 bg-gray-700 rounded-md" />
                  <Skeleton className="h-20 bg-gray-700 rounded-md" />
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/30 border border-red-700 p-4 rounded-lg text-center"
              >
                <p className="text-red-300">❌ {error}</p>
                <Button
                  variant="outline"
                  className="mt-2 border-red-700 text-red-300 hover:bg-red-900/50"
                  onClick={() => fetchUserData(username)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </motion.div>
            ) : user ? (
              <motion.div
                key="user"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <img
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={`Avatar de ${user.login}`}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 shadow-lg"
                    />
                  </motion.div>

                  <div className="flex-1 text-center md:text-left">
                    <motion.h2
                      className="text-2xl font-bold flex flex-col md:flex-row md:items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {user.name || user.login}
                      <span className="text-gray-400 text-sm font-normal">@{user.login}</span>
                    </motion.h2>

                    {user.bio && (
                      <motion.p
                        className="text-gray-300 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {user.bio}
                      </motion.p>
                    )}

                    <motion.div
                      className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {user.company && (
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {user.company}
                        </Badge>
                      )}
                      {user.location && (
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {user.location}
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        Membre depuis {formatDate(user.created_at)}
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 flex flex-col items-center">
                      <BookOpen className="h-8 w-8 text-blue-400 mb-2" />
                      <p className="text-2xl font-bold">{user.public_repos}</p>
                      <p className="text-gray-400">Dépôts</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 flex flex-col items-center">
                      <Users className="h-8 w-8 text-purple-400 mb-2" />
                      <p className="text-2xl font-bold">{user.followers}</p>
                      <p className="text-gray-400">Followers</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 flex flex-col items-center">
                      <Users className="h-8 w-8 text-green-400 mb-2" />
                      <p className="text-2xl font-bold">{user.following}</p>
                      <p className="text-gray-400">Following</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {repos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-xl font-semibold mt-8 mb-4">Top Repositories</h3>
                    <div className="space-y-4">
                      {repos.map((repo, index) => (
                        <motion.div
                          key={repo.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-blue-400">
                                    <a
                                      href={repo.html_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center hover:underline"
                                    >
                                      {repo.name}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </h4>
                                  {repo.description && <p className="text-sm text-gray-300 mt-1">{repo.description}</p>}
                                </div>
                                {repo.language && <Badge className="bg-gray-700">{repo.language}</Badge>}
                              </div>
                              <div className="flex gap-4 mt-3 text-sm text-gray-400">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                  {repo.stargazers_count}
                                </div>
                                <div className="flex items-center">
                                  <GitFork className="h-4 w-4 mr-1 text-blue-400" />
                                  {repo.forks_count}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Github className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Entrez un nom d'utilisateur GitHub pour afficher son profil</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="border-t border-gray-700 pt-4 text-gray-400 text-sm">
          <p>Données fournies par l'API GitHub. Certaines limites de taux peuvent s'appliquer.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
