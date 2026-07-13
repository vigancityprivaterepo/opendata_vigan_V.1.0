'use client'

import { useMemo, useState } from 'react'
import { Play, Terminal } from 'lucide-react'

type Language = 'curl' | 'python' | 'javascript'

interface Props {
  baseEndpoint: string
}

function buildCodeExamples(baseEndpoint: string): Record<Language, string> {
  return {
    curl: `curl "${baseEndpoint}/package_search?q=tourism&rows=5"`,
    python: `import requests

url = "${baseEndpoint}/package_search"
params = {"q": "tourism", "rows": 5}

response = requests.get(url, params=params, timeout=15)
data = response.json()

if data["success"]:
    for dataset in data["result"]["results"]:
        print(dataset["title"])`,
    javascript: `const url = new URL('/api/3/action/package_search', window.location.origin)
url.searchParams.set('q', 'tourism')
url.searchParams.set('rows', '5')

const response = await fetch(url)
const data = await response.json()

if (data.success) {
  data.result.results.forEach((dataset) => {
    console.log(dataset.title)
  })
}`,
  }
}

const fallbackResponse = `{
  "success": true,
  "result": {
    "count": 2,
    "results": [
      {
        "title": "Tourism Sites",
        "organization": {
          "title": "Vigan City Tourism Office"
        }
      }
    ]
  }
}`

export default function APITestConsole({ baseEndpoint }: Props) {
  const [language, setLanguage] = useState<Language>('curl')
  const [responseText, setResponseText] = useState(fallbackResponse)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const codeExamples = useMemo(() => buildCodeExamples(baseEndpoint), [baseEndpoint])
  const code = useMemo(() => codeExamples[language], [codeExamples, language])

  async function testRequest() {
    setStatus('loading')
    try {
      const res = await fetch('/api/3/action/package_search?q=tourism&rows=2')
      const json = await res.json()
      setResponseText(JSON.stringify(json, null, 2))
      setStatus(res.ok && json.success ? 'success' : 'error')
    } catch (error) {
      setResponseText(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
      }, null, 2))
      setStatus('error')
    }
  }

  return (
    <aside className="space-y-4" aria-label="API test console">
      <div className="bg-[#1f1f1f] rounded overflow-hidden border border-gray-800">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sky-400 text-xs font-bold">GET</span>
            <code className="text-xs text-gray-400 truncate">/api/3/action/package_search</code>
          </div>
          <label className="sr-only" htmlFor="api-language">Example language</label>
          <select
            id="api-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="bg-transparent text-gray-300 text-xs font-medium border border-white/10 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-vigan-secondary"
          >
            <option value="curl">Shell Curl</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto">
          <pre className="font-mono text-xs leading-relaxed text-gray-200 whitespace-pre-wrap break-words">
            <code>{code}</code>
          </pre>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Terminal size={14} />
            {status === 'loading' ? 'Running request...' : 'Public read endpoint'}
          </div>
          <button
            type="button"
            onClick={testRequest}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 rounded border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={14} fill="currentColor" />
            Test Request
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className={status === 'error' ? 'text-red-600 font-bold' : 'text-gray-800 font-bold'}>
              {status === 'error' ? 'ERROR' : '200'}
            </span>
            <span className="text-xs font-semibold text-gray-400 uppercase">Response</span>
          </div>
          <span className="text-xs text-gray-400">JSON</span>
        </div>
        <div className="max-h-[520px] overflow-y-auto bg-gray-50 p-4">
          <pre className="font-mono text-xs leading-relaxed text-gray-700 whitespace-pre-wrap break-words">
            <code>{responseText}</code>
          </pre>
        </div>
      </div>
    </aside>
  )
}
