import Link from "next/link";
import {
  ShieldAlert,
  Terminal,
  Database,
  ServerCrash,
  Link as LinkIcon,
  UserX,
  Puzzle,
  Bot,
  SearchCheck,
  Copy,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const vulnerabilities = [
  {
    name: "Prompt Injection",
    description: "Manipulating LLM input to bypass safety filters or execute unauthorized actions.",
    href: "/prompt-injection",
    icon: Terminal,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    name: "Insecure Output Handling",
    description: "Failing to validate LLM output, leading to XSS, CSRF, or code execution.",
    href: "/insecure-output-handling",
    icon: ShieldAlert,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    name: "Training Data Poisoning",
    description: "Manipulating training data to introduce biases or backdoors into the model.",
    href: "/training-data-poisoning",
    icon: Database,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    name: "Model Denial of Service",
    description: "Overloading the model with expensive requests to cause resource exhaustion.",
    href: "/model-dos",
    icon: ServerCrash,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    name: "Supply Chain Vulnerabilities",
    description: "Compromised third-party datasets, models, or plugins.",
    href: "/supply-chain",
    icon: LinkIcon,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    name: "Sensitive Information Disclosure",
    description: "LLM revealing PII or confidential data in its responses.",
    href: "/sensitive-info",
    icon: UserX,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    name: "Insecure Plugin Design",
    description: "Plugins executing unsafe actions without proper validation.",
    href: "/insecure-plugin",
    icon: Puzzle,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    name: "Excessive Agency",
    description: "Granting LLMs too much autonomy to perform damaging actions.",
    href: "/excessive-agency",
    icon: Bot,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    name: "Overreliance",
    description: "Users blindly trusting LLM output without verification.",
    href: "/overreliance",
    icon: SearchCheck,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    name: "Model Theft",
    description: "Unauthorized extraction or copying of the model's weights or architecture.",
    href: "/model-theft",
    icon: Copy,
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            OWASP Top 10 for <span className="text-emerald-500">LLM</span> 2025
          </h1>
          <meta name="google-adsense-account" content="ca-pub-1343911699290276"></meta>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 px-4">
            Interactive demonstrations and educational resources for Large Language Model security. <br className="hidden sm:block" /> <span style={{ color: "#00e676", fontWeight: "bold" }}>Project By <a href="https://linktr.ee/darshanhackz" target="_blank" style={{ fontWeight: "bold", textDecoration: "underline" }}>darshanhackz.</a></span>
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {vulnerabilities.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6 transition-all hover:border-emerald-500/50 hover:bg-zinc-900"
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-2.5 sm:p-3 ${item.bg} ${item.color}`}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 -translate-x-2 opacity-0 transition-all text-zinc-500 group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-zinc-100">
                {item.name}
              </h3>
              <p className="text-sm text-zinc-400">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <a
        href="https://medium.com/@darshannnaik1234/list/ai-llm-hacking-series-631e118084ea"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 sm:px-6 sm:py-4 sm:text-base"
        aria-label="Read LLM Articles on Medium"
      >
        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
        <span>LLM Articles</span>
      </a>
    </div>
  );
}
