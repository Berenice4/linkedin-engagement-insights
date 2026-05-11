import { useState, useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController
)

const MOCK_DATA = [
  { id: 1, impressions: 12500, clicks: 342, reactions: 189, comments: 45, shares: 23, type: 'Personal', date: '2024-01-15' },
  { id: 2, impressions: 8700, clicks: 156, reactions: 98, comments: 28, shares: 12, type: 'Company', date: '2024-01-18' },
  { id: 3, impressions: 15200, clicks: 521, reactions: 287, comments: 67, shares: 41, type: 'Personal', date: '2024-01-22' },
  { id: 4, impressions: 9800, clicks: 189, reactions: 134, comments: 31, shares: 18, type: 'Company', date: '2024-01-25' },
  { id: 5, impressions: 18400, clicks: 634, reactions: 412, comments: 89, shares: 56, type: 'Personal', date: '2024-02-01' },
]

const BENCHMARKS = {
  personal: { poor: 1.5, average: 3.5, great: 6 },
  company: { poor: 1, average: 2.5, great: 5 }
}

const calculateEngagementRate = (data) => {
  const { impressions, clicks, reactions, comments, shares } = data
  if (!impressions || impressions === 0) return 0
  return ((clicks + reactions + comments + shares) / impressions) * 100
}

const getEngagementLevel = (rate, type) => {
  const benchmark = BENCHMARKS[type.toLowerCase()] || BENCHMARKS.personal
  if (rate >= benchmark.great) return 'great'
  if (rate >= benchmark.average) return 'average'
  return 'poor'
}

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

function LinkedInIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0a66c2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function LikeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  )
}

function ClickIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function TrendUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}

function TrendDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function ChevronIcon({ direction = 'left' }) {
  const rotation = direction === 'left' ? 0 : 180
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: `rotate(${rotation}deg)` }}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function EngagementGauge({ rate, type }) {
  const [animatedRate, setAnimatedRate] = useState(0)
  const level = getEngagementLevel(rate, type)
  const maxRate = 10
  const percentage = Math.min((rate / maxRate) * 100, 100)

  const colors = {
    poor: '#cc1016',
    average: '#b46900',
    great: '#057642'
  }

  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedRate(rate * eased)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [rate])

  const animatedPercentage = Math.min((animatedRate / maxRate) * 100, 100)

  return (
    <div className="gauge-container enhanced">
      <div className="bar-gauge">
        <div className="bar-gauge-labels">
          <span>0%</span>
          <span>2.5%</span>
          <span>5%</span>
          <span>7.5%</span>
          <span>10%</span>
        </div>
        <div className="bar-track">
          <div 
            className={`bar-fill ${level}`}
            style={{ width: `${animatedPercentage}%` }}
          />
          <div 
            className="bar-marker"
            style={{ left: `${animatedPercentage}%` }}
          >
            <div className="marker-tooltip">{animatedRate.toFixed(2)}%</div>
          </div>
        </div>
        <div className="bar-zones">
          <div className="zone poor"><span>Poor</span></div>
          <div className="zone average"><span>Average</span></div>
          <div className="zone great"><span>Great</span></div>
        </div>
      </div>
      <div className="gauge-result">
        <div className={`gauge-value ${level}`}>{rate.toFixed(2)}%</div>
        <div className="gauge-level-badge" data-level={level}>
          {level === 'poor' ? 'Needs Improvement' : level === 'average' ? 'Good' : 'Excellent'}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [posts, setPosts] = useState(MOCK_DATA)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [benchmarkType, setBenchmarkType] = useState('personal')
  const [showHelp, setShowHelp] = useState(false)
  const [formData, setFormData] = useState({
    impressions: '',
    clicks: '',
    reactions: '',
    comments: '',
    shares: '',
    type: 'Personal'
  })
  const insightsRef = useRef(null)

  const latestPost = posts[posts.length - 1] || {}
  const avgEngagement = posts.length > 0 
    ? posts.reduce((sum, p) => sum + calculateEngagementRate(p), 0) / posts.length 
    : 0
  const latestER = calculateEngagementRate(latestPost)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newPost = {
      id: Date.now(),
      impressions: parseInt(formData.impressions) || 0,
      clicks: parseInt(formData.clicks) || 0,
      reactions: parseInt(formData.reactions) || 0,
      comments: parseInt(formData.comments) || 0,
      shares: parseInt(formData.shares) || 0,
      type: formData.type,
      date: new Date().toISOString().split('T')[0]
    }
    setPosts(prev => [...prev, newPost])
    setFormData({
      impressions: '',
      clicks: '',
      reactions: '',
      comments: '',
      shares: '',
      type: 'Personal'
    })
  }

  const loadMockData = (index) => {
    const mock = MOCK_DATA[index]
    setFormData({
      impressions: mock.impressions.toString(),
      clicks: mock.clicks.toString(),
      reactions: mock.reactions.toString(),
      comments: mock.comments.toString(),
      shares: mock.shares.toString(),
      type: mock.type
    })
  }

  const handleGenerateReport = async () => {
    if (!insightsRef.current) return
    
    const canvas = await html2canvas(insightsRef.current, {
      scale: 2,
      backgroundColor: '#f3f6f8',
      useCORS: true,
      allowTaint: true,
      logging: false
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('l', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('LinkedIn-Engagement-Report.pdf')
  }

  const chartData = {
    labels: posts.map(p => p.date.slice(5)),
    datasets: [
      {
        label: 'Engagement Rate %',
        data: posts.map(p => calculateEngagementRate(p)),
        backgroundColor: '#0a66c2',
        borderRadius: 4,
        barThickness: 20
      },
      {
        label: `${benchmarkType.charAt(0).toUpperCase() + benchmarkType.slice(1)} Benchmark`,
        data: posts.map(() => BENCHMARKS[benchmarkType].average),
        borderColor: '#b46900',
        borderWidth: 2,
        type: 'line',
        pointRadius: 0,
        borderDash: [5, 5]
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: 'Source Sans 3', size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e0e0e0' },
        ticks: { font: { family: 'Source Sans 3' } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Source Sans 3' } }
      }
    }
  }

  return (
    <div className="app-container">
      <div className={`input-panel ${panelCollapsed ? 'collapsed' : ''}`}>
        <div className="panel-header">
          <h2>
            <LinkedInIcon size={28} />
            <span>Add Post Data</span>
          </h2>
          <button className="collapse-btn" onClick={() => setPanelCollapsed(!panelCollapsed)}>
            <ChevronIcon direction={panelCollapsed ? 'right' : 'left'} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Impressions <span className="required">*</span>
              <span className="tooltip-icon" data-tooltip="Total times your post was displayed">?</span>
            </label>
            <input
              type="number"
              name="impressions"
              className="form-input"
              placeholder="e.g., 10000"
              value={formData.impressions}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>
              Clicks
              <span className="tooltip-icon" data-tooltip="Number of clicks on your post">?</span>
            </label>
            <input
              type="number"
              name="clicks"
              className="form-input"
              placeholder="e.g., 250"
              value={formData.clicks}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>
              Reactions
              <span className="tooltip-icon" data-tooltip="Likes, loves, celebrate, etc.">?</span>
            </label>
            <input
              type="number"
              name="reactions"
              className="form-input"
              placeholder="e.g., 150"
              value={formData.reactions}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>
              Comments
              <span className="tooltip-icon" data-tooltip="Total comments on your post">?</span>
            </label>
            <input
              type="number"
              name="comments"
              className="form-input"
              placeholder="e.g., 25"
              value={formData.comments}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>
              Shares
              <span className="tooltip-icon" data-tooltip="Times your post was shared">?</span>
            </label>
            <input
              type="number"
              name="shares"
              className="form-input"
              placeholder="e.g., 10"
              value={formData.shares}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Profile Type</label>
            <select
              name="type"
              className="form-input"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="Personal">Personal Profile</option>
              <option value="Company">Company Page</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Post</button>
            <button type="button" className="btn btn-secondary" onClick={() => setPosts([])}>Clear</button>
          </div>
        </form>

        <div className="info-section">
          <h4>Come Funziona</h4>
          <p className="info-text">
            L'<strong>Engagement Rate</strong> misura quanto il tuo post coinvolge il pubblico:
          </p>
          <div className="formula-box">
            <code>ER = (Clic + Reazioni + Commenti + Condivisioni) / Impressioni × 100</code>
          </div>
          <p className="info-text">
            Più alto è il valore, più il tuo post sta performando.
          </p>
        </div>

        <div className="examples-section">
          <h4>Esempi Pratici</h4>
          <p className="examples-desc">Clicca per vedere come funziona</p>
          
          <div className="example-card great">
            <div className="example-header">
              <span className="example-badge great">Ottimo</span>
              <span className="example-er">5.54% ER</span>
            </div>
            <div className="example-name">Post Virale</div>
            <div className="example-desc">50.000 impressioni con alto engagement organico</div>
            <button className="example-btn" onClick={() => setFormData({ impressions: '50000', clicks: '2500', reactions: '1800', comments: '450', shares: '320', type: 'Personal' })}>
              Prova
            </button>
          </div>

          <div className="example-card average">
            <div className="example-header">
              <span className="example-badge average">Medio</span>
              <span className="example-er">5.13% ER</span>
            </div>
            <div className="example-name">Post Standard</div>
            <div className="example-desc">15.000 impressioni, performance nella media</div>
            <button className="example-btn" onClick={() => setFormData({ impressions: '15000', clicks: '400', reactions: '280', comments: '60', shares: '30', type: 'Company' })}>
              Prova
            </button>
          </div>

          <div className="example-card poor">
            <div className="example-header">
              <span className="example-badge poor">Da Migliorare</span>
              <span className="example-er">1.25% ER</span>
            </div>
            <div className="example-name">Post Debole</div>
            <div className="example-desc">20.000 impressioni ma basso coinvolgimento</div>
            <button className="example-btn" onClick={() => setFormData({ impressions: '20000', clicks: '150', reactions: '80', comments: '15', shares: '5', type: 'Company' })}>
              Prova
            </button>
          </div>
        </div>

        <div className="benchmarks-section">
          <h4>Valori di Riferimento</h4>
          <div className="benchmark-table">
            <div className="benchmark-row">
              <span>Profilo Personale</span>
              <span><span className="benchmark poor">&lt;1.5%</span> <span className="benchmark avg">1.5-3.5%</span> <span className="benchmark great">&gt;3.5%</span></span>
            </div>
            <div className="benchmark-row">
              <span>Pagina Aziendale</span>
              <span><span className="benchmark poor">&lt;1%</span> <span className="benchmark avg">1-2.5%</span> <span className="benchmark great">&gt;2.5%</span></span>
            </div>
          </div>
        </div>

        <div className="mock-data-section">
          <h4>Quick Load Mock Data</h4>
          <div className="mock-buttons">
            {MOCK_DATA.map((mock, idx) => (
              <button
                key={mock.id}
                className="mock-btn"
                onClick={() => loadMockData(idx)}
              >
                {mock.type} Post - {formatNumber(mock.impressions)} imp
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="insights-panel" ref={insightsRef}>
        <div className="insights-header">
          <h1>LinkedIn <span>Engagement Insights</span></h1>
          <div className="header-actions">
            <button className="help-btn" onClick={() => setShowHelp(true)}>
              <HelpIcon />
              Help Me
            </button>
            <button className="generate-report-btn" onClick={handleGenerateReport}>
              <DownloadIcon />
              Generate Report
            </button>
          </div>
        </div>

        {showHelp && (
          <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
              <button className="help-close" onClick={() => setShowHelp(false)}>×</button>
              
              <div className="help-hero">
                <div className="help-hero-icon">?</div>
                <h2>Help Me Understand</h2>
                <p>Your complete guide to LinkedIn metrics</p>
              </div>

              <div className="help-grid">
                <div className="help-card">
                  <div className="help-card-icon">👁</div>
                  <h3>Impressions</h3>
                  <p>How many times your post was displayed. Higher = better reach.</p>
                </div>
                <div className="help-card">
                  <div className="help-card-icon">👆</div>
                  <h3>Clicks</h3>
                  <p>Users who clicked to learn more. Shows interest level.</p>
                </div>
                <div className="help-card">
                  <div className="help-card-icon">❤️</div>
                  <h3>Reactions</h3>
                  <p>Likes, loves, celebrates. Indicates content approval.</p>
                </div>
                <div className="help-card">
                  <div className="help-card-icon">💬</div>
                  <h3>Comments</h3>
                  <p>Active engagement. Shows real conversation.</p>
                </div>
                <div className="help-card">
                  <div className="help-card-icon">🔄</div>
                  <h3>Shares</h3>
                  <p>Content virality. Higher = more reach.</p>
                </div>
              </div>

              <div className="help-section highlighted">
                <h3>📐 The Magic Formula</h3>
                <div className="help-formula">
                  <code>Engagement Rate = (Clicks + Reactions + Comments + Shares) ÷ Impressions × 100</code>
                </div>
                <p>Measures how much your audience interacts with your content relative to views.</p>
              </div>

              <div className="help-benchmarks">
                <h3>🎯 Performance Benchmarks</h3>
                <div className="benchmark-cards">
                  <div className="benchmark-card personal">
                    <span className="benchmark-type">Personal Profile</span>
                    <span className="benchmark-value">3.5% avg</span>
                  </div>
                  <div className="benchmark-card company">
                    <span className="benchmark-type">Company Page</span>
                    <span className="benchmark-value">2.5% avg</span>
                  </div>
                </div>
              </div>

              <div className="help-rating-scale">
                <h3>📊 Rating Scale</h3>
                <div className="rating-bar">
                  <div className="rating-section poor">
                    <span>&lt;1.5%</span>
                    <strong>Poor</strong>
                  </div>
                  <div className="rating-section average">
                    <span>1.5-3.5%</span>
                    <strong>Average</strong>
                  </div>
                  <div className="rating-section great">
                    <span>&gt;3.5%</span>
                    <strong>Great</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="kpi-cards">
          <div className="kpi-card">
            <div className="kpi-label"><EyeIcon /> Impressions</div>
            <div className="kpi-value">{formatNumber(latestPost.impressions || 0)}</div>
            <div className="kpi-trend positive">
              <TrendUpIcon /> +12.5% vs avg
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label"><ClickIcon /> Clicks</div>
            <div className="kpi-value">{formatNumber(latestPost.clicks || 0)}</div>
            <div className="kpi-trend positive">
              <TrendUpIcon /> +8.3% vs avg
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label"><LikeIcon /> Reactions</div>
            <div className="kpi-value">{formatNumber(latestPost.reactions || 0)}</div>
            <div className="kpi-trend negative">
              <TrendDownIcon /> -2.1% vs avg
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Engagement Rate</div>
            <div className="kpi-value highlight">{latestER.toFixed(2)}%</div>
            <div className="kpi-trend positive">
              <TrendUpIcon /> Above benchmark
            </div>
          </div>
        </div>

        <div className="main-visualization">
          <div className="gauge-card">
            <h3><LikeIcon /> Engagement Rate Gauge</h3>
            <EngagementGauge rate={avgEngagement} type={latestPost.type || 'personal'} />
          </div>
          
          <div className="charts-card">
            <h3><ShareIcon /> Trends & Benchmarks</h3>
            <div className="benchmark-toggle">
              <button 
                className={`benchmark-btn ${benchmarkType === 'personal' ? 'active' : ''}`}
                onClick={() => setBenchmarkType('personal')}
              >
                Personal Profile
              </button>
              <button 
                className={`benchmark-btn ${benchmarkType === 'company' ? 'active' : ''}`}
                onClick={() => setBenchmarkType('company')}
              >
                Company Page
              </button>
            </div>
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="recent-posts">
          <h3><CommentIcon /> Recent Posts Performance</h3>
          {posts.length === 0 ? (
            <div className="empty-state">
              <LinkedInIcon size={80} />
              <h3>No Data Yet</h3>
              <p>Add post data using the form or load mock data to get started.</p>
            </div>
          ) : (
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>Reactions</th>
                  <th>Comments</th>
                  <th>Shares</th>
                  <th>Eng. Rate</th>
                </tr>
              </thead>
              <tbody>
                {posts.slice(-10).reverse().map(post => {
                  const er = calculateEngagementRate(post)
                  const level = getEngagementLevel(er, post.type)
                  return (
                    <tr key={post.id}>
                      <td>{post.date}</td>
                      <td>{post.type}</td>
                      <td>{formatNumber(post.impressions)}</td>
                      <td>{formatNumber(post.clicks)}</td>
                      <td>{formatNumber(post.reactions)}</td>
                      <td>{formatNumber(post.comments)}</td>
                      <td>{formatNumber(post.shares)}</td>
                      <td>
                        <span className={`engagement-badge ${level}`}>
                          {er.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <footer className="app-footer">
          <p>&copy;2026 STREET REPORTER S.R.L</p>
        </footer>
      </div>
    </div>
  )
}

export default App