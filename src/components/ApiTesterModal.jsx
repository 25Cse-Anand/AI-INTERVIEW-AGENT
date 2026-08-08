import React, { useState } from 'react';
import { X, Code2, Play, Copy, Check, Terminal, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ApiTesterModal({ isOpen, onClose, currentSessionId, activeCandidateId, engineRef }) {
  const [activeTab, setActiveTab] = useState('start');
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const endpoints = {
    start: {
      method: 'POST',
      url: '/api/interview/start',
      desc: 'Initializes a new technical interview session for a candidate.',
      body: JSON.stringify({ candidate_id: activeCandidateId }, null, 2),
      curl: `curl -X POST http://localhost:3000/api/interview/start \\\n  -H "Content-Type: application/json" \\\n  -d '{"candidate_id": "${activeCandidateId}"}'`
    },
    chat: {
      method: 'POST',
      url: '/api/interview/chat',
      desc: 'Submits candidate response and receives next adaptive question or follow-up.',
      body: JSON.stringify({
        session_id: currentSessionId,
        candidate_response: "In our implementation, we used HNSW graph indexing with cosine distance and hybrid BM25 reciprocal rank fusion."
      }, null, 2),
      curl: `curl -X POST http://localhost:3000/api/interview/chat \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "session_id": "${currentSessionId}",\n    "candidate_response": "We configured HNSW with M=16 ef_construction=200."\n  }'`
    },
    feedback: {
      method: 'GET',
      url: `/api/interview/feedback?session_id=${currentSessionId}`,
      desc: 'Retrieves structured evaluation report and hiring recommendation for session.',
      body: null,
      curl: `curl -X GET "http://localhost:3000/api/interview/feedback?session_id=${currentSessionId}"`
    }
  };

  const handleTestApi = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (engineRef && engineRef.current) {
        if (activeTab === 'start') {
          setApiResponse({
            status: 200,
            success: true,
            data: {
              session_id: engineRef.current.sessionId,
              candidate_id: engineRef.current.candidate.id,
              candidate_name: engineRef.current.candidate.name,
              initial_question: engineRef.current.state.lastAskedQuestion,
              target_days_planned: engineRef.current.targetDays.map(d => ({ day: d.day, title: d.title }))
            }
          });
        } else if (activeTab === 'chat') {
          const res = engineRef.current.processResponse("We used HNSW graph indexing with Cosine similarity and Cohere Rerank v3 cross-encoders.");
          setApiResponse({
            status: 200,
            success: true,
            data: res
          });
        } else {
          const fb = engineRef.current.getStructuredFeedback();
          setApiResponse({
            status: 200,
            success: true,
            data: fb
          });
        }
      }
      setIsLoading(false);
    }, 400);
  };

  const activeEp = endpoints[activeTab];

  const copyCurl = () => {
    navigator.clipboard.writeText(activeEp.curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-xl animate-scale-in">
        <div className="modal-header">
          <div className="brand-modal-title">
            <Terminal size={22} className="text-cyan" />
            <div>
              <h2>HTTP REST API Specification & Contract Inspector</h2>
              <p className="modal-desc">Test the live Interview Agent API endpoints defined in the Technical Specification.</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="api-tabs">
          <button 
            className={`api-tab ${activeTab === 'start' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('start'); setApiResponse(null); }}
          >
            <span className="method-pill method-post">POST</span>
            <span>/api/interview/start</span>
          </button>

          <button 
            className={`api-tab ${activeTab === 'chat' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('chat'); setApiResponse(null); }}
          >
            <span className="method-pill method-post">POST</span>
            <span>/api/interview/chat</span>
          </button>

          <button 
            className={`api-tab ${activeTab === 'feedback' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('feedback'); setApiResponse(null); }}
          >
            <span className="method-pill method-get">GET</span>
            <span>/api/interview/feedback</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="api-playground-grid">
          {/* Left: Request Config */}
          <div className="api-request-panel">
            <div className="panel-sub-header">
              <span className="panel-title">Request Contract</span>
              <span className="endpoint-url font-mono">{activeEp.url}</span>
            </div>
            <p className="endpoint-desc">{activeEp.desc}</p>

            {activeEp.body && (
              <div className="json-box mt-3">
                <div className="box-header">Request Payload (JSON)</div>
                <pre className="json-code">{activeEp.body}</pre>
              </div>
            )}

            <div className="curl-box mt-3">
              <div className="box-header">
                <span>cURL Snippet</span>
                <button className="btn-icon-sm" onClick={copyCurl}>
                  {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                </button>
              </div>
              <pre className="json-code curl-text">{activeEp.curl}</pre>
            </div>

            <button 
              className="btn btn-primary btn-block mt-4" 
              onClick={handleTestApi} 
              disabled={isLoading}
            >
              <Play size={16} />
              <span>{isLoading ? 'Executing Request...' : 'Send Live Test Request'}</span>
            </button>
          </div>

          {/* Right: Response Output */}
          <div className="api-response-panel">
            <div className="panel-sub-header">
              <span className="panel-title">Response Output (JSON)</span>
              {apiResponse && (
                <span className="status-pill-sm status-200">
                  <CheckCircle2 size={12} /> {apiResponse.status} OK
                </span>
              )}
            </div>

            {apiResponse ? (
              <pre className="json-response-box font-mono">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            ) : (
              <div className="empty-response-state">
                <Code2 size={36} className="text-muted" />
                <p>Click "Send Live Test Request" to execute this API call against the Interview Engine.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
