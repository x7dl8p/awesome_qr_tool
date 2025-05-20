import { Github } from "lucide-react"
import Link from "next/link"

export default function GitHubLink() {
  return (
    <Link
      href="https://mohammad.is-a.dev/"
      target="_blank"
      rel="noopener noreferrer"
      className="neo-brutalist-input flex gap-2 items-center bg-white text-black hover:bg-gray-100 px-3 py-2 h-10"
      aria-label="View source code on GitHub"
    >
      <Github className="h-4 w-4" />
      <span className="font-medium">GitHub</span>
    </Link>
  )
}
