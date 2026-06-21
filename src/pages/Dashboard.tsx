import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Treemap
} from 'recharts'
import { 
  Award, 
  Flame, 
  Compass, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  History,
  AlertTriangle,
  Coins,
  Activity,
  Milestone,
  Target,
  Cpu
} from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profileState, fetchProfileState } = useUserStore()

  useEffect(() => {
    fetchProfileState()
  }, [])

  if (!profileState || !user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Booting AI Educational OS...</p>
        </div>
      </div>
    )
  }

  if (!profileState.initialized) {
    return (
      <div className="relative min-h-screen bg-[#030712] text-slate-100 grid-bg font-sans pl-76 pr-6 py-6 overflow-x-hidden">
        <Sidebar />
        <div className="max-w-7xl mx-auto flex flex-col gap-6 justify-center min-h-[80vh]">
          <EmptyState
            title="StudentAI OS Not Configured"
            subtitle="Complete onboarding to activate your ecosystem."
            buttonText="Start Onboarding"
            onClick={() => navigate('/onboarding')}
            icon={Cpu}
          />
        </div>
      </div>
    )
  }

  // Extract from unified profileState
  const basic = profileState.basicDetails
  const readiness = profileState.careerReadiness?.score || 0
  const recovery = profileState.recoveryPlan
  const completedNodeIds = profileState.completedNodes || []
  const skills = profileState.selectedSkills || []
  const schedule = profileState.availableHours || []
  const studySessions = profileState.studySessions || []
  const xpHistory = profileState.xpHistory || []
  const badges = profileState.unlockedBadges || []
  const goals = profileState.careerGoals || []
  const readinessDetail = profileState.careerReadiness || {}
  const readinessBreakdown = readinessDetail.breakdown || {}
  const readinessHistory = readinessDetail.history || []

  // Compute rank based on level
  const currentRank = basic.level >= 40 ? 'Innovator' : basic.level >= 20 ? 'Engineer' : basic.level >= 10 ? 'Builder' : 'Explorer'

  // Construct Radar Data dynamically from user skills
  const radarData = skills.map((s: any) => ({
    subject: s.skillName,
    A: s.progress,
    B: 70,
    fullMark: 100
  }))

  // Construct Area Data from study sessions
  const productivityData = studySessions.slice(0, 7).reverse().map((s: any) => ({
    name: s.date.substring(5), // MM-DD
    hours: s.hours
  }))

  // Construct Mastery Treemap Data dynamically from user skills
  const masteryData = [
    {
      name: 'User Skills',
      children: skills.map((s: any) => ({
        name: s.skillName,
        size: s.progress
      }))
    }
  ]

  // Construct Donut Chart Data
  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981']
  const distributionData = skills.map((s: any, idx: number) => ({
    name: s.skillName,
    value: s.progress,
    color: COLORS[idx % COLORS.length]
  }))

  // Compute 365-day heatmap grids from study sessions
  const heatmapDays = Array.from({ length: 371 }, (_, idx) => {
    // Check if session exists on this relative day
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (370 - idx));
    const dateStr = targetDate.toISOString().substring(0, 10);
    const daySessions = studySessions.filter((s: any) => s.date === dateStr);
    
    if (daySessions.length > 0) {
      const sum = daySessions.reduce((acc: number, cur: any) => acc + cur.hours, 0);
      return sum >= 4 ? 3 : sum >= 2 ? 2 : 1;
    }
    return 0;
  })

  // Compute Duolingo-style monthly streak calendar
  const currentMonthDays = Array.from({ length: 30 }, (_, idx) => {
    const day = idx + 1;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (29 - idx));
    const dateStr = targetDate.toISOString().substring(0, 10);
    const hasSession = studySessions.some((s: any) => s.date === dateStr);
    return { day, active: hasSession }
  })

  const renderTrackAdaptiveHUD = () => {
    const category = basic.educationCategory?.toLowerCase() || '';

    if (category.includes('medical') || category.includes('mbbs') || category.includes('bds') || category.includes('bams') || category.includes('bhms') || category.includes('pcb') || (category.includes('11th-12th') && basic.stream?.toLowerCase() === 'pcb')) {
      return (
        <div className="glass p-6 rounded-2xl border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🩺</span>
              <h3 className="font-display font-semibold text-white">Medical Speciality Diagnostics Hub</h3>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">PCB / Medical Arc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NEET countdown */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Countdown Clock</span>
                <h4 className="text-sm font-bold text-white mt-1">NEET Entrance Target</h4>
                <p className="text-xs text-rose-300 font-semibold mt-1">324 Days Remaining</p>
              </div>
              <p className="text-[10px] text-slate-500">Targeting AI suggested Medical colleges.</p>
            </div>

            {/* Biology readiness */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Biology Readiness Rating</span>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-300">Anatomy Mastery</span>
                <span className="font-bold text-emerald-400">82%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '82%' }} />
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-300">Physiology Mastery</span>
                <span className="font-bold text-emerald-400">76%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '76%' }} />
              </div>
            </div>

            {/* Mock tests */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Active Practice Tests</span>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                <li className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg">
                  <span>Anatomy diagnostic</span>
                  <span className="text-emerald-400 font-bold font-mono">Passed</span>
                </li>
                <li className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg">
                  <span>Physiology mock</span>
                  <span className="text-amber-400 font-semibold font-mono">Pending</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    if (category.includes('btech') || category.includes('engineering') || category.includes('computer') || category.includes('cse') || category.includes('it') || (category.includes('11th-12th') && basic.stream?.toLowerCase() === 'pcm')) {
      return (
        <div className="glass p-6 rounded-2xl border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💻</span>
              <h3 className="font-display font-semibold text-white">Engineering Repository HUD</h3>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">BTech / PCM Arc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GitHub */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">GitHub integration</span>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-slate-300 font-bold text-xs">mr-suraj-dev</span>
                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">CONNECTED</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">3 commits pushed to main branch today.</p>
            </div>

            {/* Projects */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Dynamic Projects Board</span>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-300">REST API Router</span>
                <span className="text-blue-400 font-bold">75% Complete</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Leetcode */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">LeetCode metrics</span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono pt-1">
                <div className="bg-white/5 p-1 rounded-lg">
                  <span className="text-emerald-400 block font-bold">Easy</span>
                  <span className="text-white">12</span>
                </div>
                <div className="bg-white/5 p-1 rounded-lg">
                  <span className="text-amber-400 block font-bold">Medium</span>
                  <span className="text-white">8</span>
                </div>
                <div className="bg-white/5 p-1 rounded-lg">
                  <span className="text-red-400 block font-bold">Hard</span>
                  <span className="text-white">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (category.includes('upsc') || category.includes('ssc') || category.includes('civil') || category.includes('ias')) {
      return (
        <div className="glass p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <h3 className="font-display font-semibold text-white">Civil Services Academy Board</h3>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">UPSC / SSC Arc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current affairs */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Current affairs analyst</span>
              <h4 className="text-xs font-bold text-white mt-1">Daily Editorial Digest</h4>
              <p className="text-[10px] text-purple-300 font-semibold leading-relaxed">Topic: Indo-Pacific Trade Agreements.</p>
            </div>

            {/* Essay tracker */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Answer-Writing Essay Tracker</span>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-300">GS Paper II essay</span>
                <span className="text-purple-400 font-bold">Grade: 62%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            {/* Revision meter */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Revision progress</span>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-300">Indian Polity</span>
                <span className="text-emerald-400 font-bold">2/3 Revisions</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '66%' }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (category.includes('law') || category.includes('llb') || category.includes('judge')) {
      return (
        <div className="glass p-6 rounded-2xl border border-indigo-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <h3 className="font-display font-semibold text-white">Jurisprudence Codex Board</h3>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">LLB / Law Arc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case studies */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Landmark Case Studies</span>
              <ul className="text-xs text-slate-300 space-y-2 pt-1">
                <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                  <div>
                    <span className="font-bold text-white block">Kesavananda Bharati v. State of Kerala</span>
                    <span className="text-[10px] text-slate-500">Basic structure doctrine review</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Analyzed</span>
                </li>
              </ul>
            </div>

            {/* Constitution mastery */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Constitution Article Mastery</span>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-300">Part III (Fundamental Rights)</span>
                <span className="text-indigo-400 font-bold">90%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (category.includes('mba') || category.includes('business') || category.includes('management') || category.includes('entrepreneur')) {
      return (
        <div className="glass p-6 rounded-2xl border border-amber-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h3 className="font-display font-semibold text-white">Business Simulations Desk</h3>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">MBA / Business Arc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business simulations */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Simulations Active</span>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-300">SaaS Market Pricing Matrix</span>
                <span className="text-amber-400 font-bold">85% Complete</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Leadership cases */}
            <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Executive Case Study Library</span>
              <p className="text-xs text-slate-300 leading-snug">Active: <span className="text-white font-semibold">Scaling Operations at Netflix (2011)</span></p>
              <p className="text-[10px] text-slate-500">Requires submitting simulated pricing proposal.</p>
            </div>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="glass p-6 rounded-2xl border border-slate-700/20 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h3 className="font-display font-semibold text-white">General Academic Progress Matrix</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">Standard Arc</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Syllabus Milestones</span>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-slate-300">Basic Syllabus Outline</span>
              <span className="text-cyan-400 font-bold">100% Complete</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Assessment status</span>
              <p className="text-xs text-slate-300 leading-snug font-medium">Diagnostic Assessment successfully finished during onboarding sync.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 grid-bg font-sans pl-76 pr-6 py-6 overflow-x-hidden">
      <Sidebar />

      {/* Main Mission Control Layout Grid */}
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* MISSION CONTROL HEADER */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass p-6 rounded-2xl relative overflow-hidden">
          <div className="scanline" />
          
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/20">
              {basic.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-white">Mission Control // {basic.username}</h1>
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  {basic.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Active Target Career:</span>
                <span className="text-purple-400 font-semibold">{profileState.targetCareer}</span>
                <span className="h-1 w-1 bg-slate-500 rounded-full" />
                <span>Rank:</span>
                <span className="text-blue-400 font-semibold">{currentRank}</span>
              </p>
            </div>
          </div>

          {/* Gamified Stat Counters */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="glass bg-white/5 border border-orange-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400">
                <Flame className="h-5 w-5 fill-orange-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Streak</p>
                <p className="text-sm font-bold text-slate-200">{basic.streak} Days</p>
              </div>
            </div>

            {/* Level */}
            <div className="glass bg-white/5 border border-blue-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Level {basic.level}</p>
                <p className="text-sm font-bold text-slate-200">
                  {basic.xp} XP
                </p>
              </div>
            </div>

            {/* Coins */}
            <div className="glass bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-400">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Coins</p>
                <p className="text-sm font-bold text-slate-200">{basic.coins}</p>
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC AI IDENTITY PERSONA CARD */}
        {basic.identityTitle && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glass-glow p-6 rounded-2xl border border-cyan-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="scanline" />
            
            {/* Left Section: Rank / Identity info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  Arc: {basic.currentArc || 'Syllabus Matrix'}
                </span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  Success Prob: {basic.successProbability || '80%'}
                </span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  Consistency: {basic.consistency || '85%'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-cyan-500/20 animate-pulse">
                  🛡️
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-white tracking-wide">{basic.identityTitle}</h2>
                  <p className="text-xs text-slate-400">
                    Student Archetype: <span className="text-cyan-300 font-semibold">{basic.personaName}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-white/5 border border-white/5 p-3 rounded-xl">
                "{basic.personaSummary}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="block text-slate-500">CURRENT QUEST</span>
                  <span className="text-slate-200 font-bold block truncate">{basic.currentQuest || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500">WEAKNESS</span>
                  <span className="text-red-400 font-bold block truncate">{basic.weakness || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500">TRAITS</span>
                  <span className="text-purple-300 font-bold block truncate">{basic.traits || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500">POWER LEVEL</span>
                  <span className="text-yellow-400 font-bold block">{basic.powerLevel || 50} / 100</span>
                </div>
              </div>
            </div>

            {/* Right Section: AI Advice Card */}
            <div className="md:w-80 p-5 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between gap-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider block">AI Strategy Coordinator</span>
                <p className="text-xs text-slate-400 mt-1">Recommended Style: <span className="text-white font-semibold">{basic.studyStrategy}</span></p>
                <p className="text-xs text-slate-400 font-mono">Burnout Risk: <span className={`font-semibold ${basic.risk === 'High' ? 'text-red-400' : basic.risk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}`}>{basic.risk || 'Low'}</span></p>
              </div>

              <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg">
                <span className="text-[9px] uppercase font-bold text-cyan-400 block mb-0.5">Advice Guidelines</span>
                <p className="text-xs text-cyan-200/90 leading-snug italic font-medium">"{basic.aiAdvice}"</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AUTOMATED RECOVERY ALERTS SECTION */}
        {recovery?.active && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-amber-500/30 bg-amber-500/5 p-6 rounded-2xl flex items-start gap-4 relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.05)]"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-500" />
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-amber-300">AI Recovery Recommendation Triggered</h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {recovery.timelineDelay}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-semibold">{recovery.headline}</p>
              <p className="text-xs text-slate-400 leading-relaxed italic">"{recovery.motivation}"</p>
              <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {recovery.suggestions?.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* WORKSPACE MAIN PANELS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Target Objective */}
          <div className="lg:col-span-2 glass p-6 rounded-2xl flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  Active Target Objective
                </h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-mono">
                  PRIORITY 1
                </span>
              </div>
              <p className="text-lg font-bold text-white leading-tight">
                {basic.activeMission || 'Complete Cognitive Diagnostics Quiz to establish skill matrix.'}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Completed nodes and assessment benchmarks generate 400 XP milestones.
              </p>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>XP Progression Progress</span>
                <span className="font-bold text-blue-400">{basic.xp} / {basic.level * 400} XP</span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(basic.xp / (basic.level * 400)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* GAUGE CHART: Career Readiness */}
          <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <h3 className="font-display font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Compass className="h-5 w-5 text-purple-400" />
              Career Readiness Index
            </h3>
            
            <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
              <svg className="w-40 h-20">
                <circle 
                  cx="80" cy="80" r="70" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="220" 
                  strokeLinecap="round"
                />
                <circle 
                  cx="80" cy="80" r="70" 
                  stroke="url(#bluePurpleGrad)" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="220" 
                  strokeDashoffset={220 - (220 * readiness) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="bluePurpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 text-center">
                <p className="text-3xl font-extrabold text-white font-display leading-none">{readiness}%</p>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1">Ready Level</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-normal max-w-[200px]">
              {readiness >= 75 ? 'Highly compatible for direct placement tracks!' : 'Complete boss fights and skill nodes to boost readiness score.'}
            </p>
          </div>
        </div>

        {/* Adaptive Track Specific Dashboard Widgets */}
        {renderTrackAdaptiveHUD()}

        {/* Readiness breakdown and timeline history */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display font-semibold text-slate-300">Career Readiness Breakdown</h3>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Score: {readinessDetail.score || 0}%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(readinessBreakdown).map(([title, value]: any) => (
              <div key={title} className="bg-slate-950/80 border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-2">{title}</p>
                <p className="text-2xl font-bold text-white">{value.score || 0}%</p>
                <p className="text-xs text-slate-400 mt-2 leading-snug">{value.description}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Recent Snapshot History</span>
                <span className="text-[10px] text-slate-400">{readinessHistory.length} entries</span>
              </div>
              <div className="space-y-3">
                {readinessHistory.length > 0 ? (
                  readinessHistory.slice(0, 4).map((entry: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{entry.date.substring(0, 10)}</span>
                        <span className="uppercase font-bold">{entry.type || 'AUTO'}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-200">
                        <span>Score {entry.score}%</span>
                        <span>Internship {entry.internshipReady}%</span>
                        <span>Interview {entry.interviewReady}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No readiness snapshots recorded yet. Progress will be captured after each major milestone.</p>
                )}
              </div>
            </div>
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Current Readiness Detail</span>
                <span className="text-[10px] text-slate-400">Confidence {readinessDetail.confidence || 0}%</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{readinessDetail.estimatedTimeline || 'Continue completing roadmap nodes and boss challenges to improve your placement readiness.'}</p>
            </div>
          </div>
        </div>

        {/* 365-DAY GITHUB HEATMAP CONTRIBUTION GRAPH */}
        <div className="glass p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-slate-300 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Study Consistency Heatmap (Past 365 Days)
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <span>Less</span>
              <span className="w-2.5 h-2.5 bg-white/5 rounded-sm" />
              <span className="w-2.5 h-2.5 bg-blue-500/20 rounded-sm" />
              <span className="w-2.5 h-2.5 bg-blue-500/50 rounded-sm" />
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
              <span>More</span>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[760px] h-28">
              {heatmapDays.map((level, idx) => {
                let colorClass = 'bg-white/5'
                if (level === 1) colorClass = 'bg-blue-500/20'
                if (level === 2) colorClass = 'bg-blue-500/50'
                if (level === 3) colorClass = 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                return (
                  <div 
                    key={idx} 
                    className={`w-2.5 h-2.5 rounded-sm transition-colors duration-300 hover:border hover:border-white/30 cursor-pointer ${colorClass}`}
                    title={`Relative Study Level #${idx}`}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* CHARTS WORKSPACE: RADAR, TREEMAP, DAILY HOURS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* RADAR CHART */}
          <div className="glass p-6 rounded-2xl flex flex-col h-96">
            <h3 className="font-display font-semibold text-slate-300 mb-4">Multi-Dimension Skills Balance</h3>
            {radarData.length > 0 ? (
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                    <Radar name="Current Skill Level" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                    <Radar name="Target Level" dataKey="B" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                    <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-500 italic text-sm">
                No active skills to plot. Save skills in Onboarding!
              </div>
            )}
          </div>

          {/* MASTER TREEMAP */}
          <div className="glass p-6 rounded-2xl flex flex-col h-96">
            <h3 className="font-display font-semibold text-slate-300 mb-4">Topic Mastery Distribution</h3>
            {skills.length > 0 ? (
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={masteryData}
                    dataKey="size"
                    stroke="#030712"
                    fill="#8B5CF6"
                    strokeWidth={2}
                  >
                    <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </Treemap>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-500 italic text-sm">
                Complete onboarding to view mastery weights.
              </div>
            )}
          </div>

          {/* AREA CHART: Productivity Trends */}
          <div className="glass p-6 rounded-2xl flex flex-col h-96">
            <h3 className="font-display font-semibold text-slate-300 mb-4">Daily Study Session trends</h3>
            {productivityData.length > 0 ? (
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productivityData}>
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="hours" stroke="#3B82F6" fill="rgba(59, 130, 246, 0.15)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-500 italic text-sm">
                No session logging. Log study events to draw chart.
              </div>
            )}
          </div>

        </div>

        {/* CALENDAR STREAK & ACHIEVEMENTS LOG */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Streak (Duolingo Style) */}
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-400 fill-orange-400" />
              <h3 className="font-display font-semibold text-slate-300">Streak Calendar (Duolingo Style)</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 mb-2 border-b border-white/5 pb-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {currentMonthDays.map((d) => (
                <div 
                  key={d.day}
                  className={`h-8 rounded-lg flex items-center justify-center font-bold text-xs relative ${
                    d.active 
                      ? 'bg-orange-500/10 border border-orange-500/40 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]' 
                      : 'bg-white/5 text-slate-600 border border-transparent'
                  }`}
                >
                  {d.day}
                  {d.active && (
                    <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* XP History activities */}
          <div className="glass p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-slate-400" />
                <h3 className="font-display font-semibold text-slate-300">Logged Console Activities</h3>
              </div>
              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
                {xpHistory.length > 0 ? (
                  xpHistory.map((log: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-2.5 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span className="text-slate-300">{log.action}: {log.metadata}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">{log.createdAt.substring(11, 16)}</span>
                        <span className="font-bold text-emerald-400 font-mono">+{log.amount} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 italic text-xs py-4">No logged achievements or activities. Start clearing skill nodes!</div>
                )}
              </div>
            </div>

            {/* Badges shelves */}
            <div className="border-t border-white/5 pt-4 mt-4">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">Unlocked Matrix Badges</h4>
              <div className="flex gap-2.5 flex-wrap">
                {badges.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">No badges unlocked yet. Complete quiz and roadmaps!</span>
                ) : (
                  badges.map((badge: string, idx: number) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[10px] flex items-center gap-1 shadow-sm"
                    >
                      🛡 {badge}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
