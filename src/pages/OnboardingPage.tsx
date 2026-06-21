import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../api'
import { useUserStore } from '../store/useUserStore'
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Stopwatch,
  Target,
  Trophy,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Rocket,
  Compass,
  CheckCircle,
  Coins,
  Shield,
  Activity,
  Flame,
  User as UserIcon
} from 'lucide-react'
import confetti from 'canvas-confetti'

const stepLabels = [
  'Academic Profile',
  'Dream Careers',
  'Skills Selection',
  'Skill Assessment',
  'Study Availability',
  'Learning Styles',
  'Timeline Deadline',
  'AI Persona Activation'
]

const educationCategories = [
  'Middle School',
  '10th Grade',
  '11th-12th',
  'Diploma',
  'BTech',
  'MBBS',
  'BDS',
  'BAMS',
  'BHMS',
  'LLB',
  'BA LLB',
  'MBA',
  'CA',
  'UPSC',
  'SSC',
  'Research Scholar',
  'Working Professional',
  'Freelancer',
  'Entrepreneur',
  'Other'
]

const learningStyles = [
  'Videos',
  'Books',
  'Projects',
  'Articles',
  'Challenges',
  'Interactive Labs'
]

const deadlineOptions = ['3 months', '6 months', '1 year']

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, setUser, fetchProfileState } = useUserStore()

  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Terminal Loading State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [progressPercent, setProgressPercent] = useState(0)

  // Step 1: Academic Profile
  const [basicDetails, setBasicDetails] = useState({
    name: '',
    age: '',
    country: '',
    education: '',
    semester: ''
  })
  
  // Dynamic fields
  const [board, setBoard] = useState('')
  const [stream, setStream] = useState('')
  const [currentClass, setCurrentClass] = useState('')
  const [branch, setBranch] = useState('')
  const [semesterVal, setSemesterVal] = useState('')
  const [yearVal, setYearVal] = useState('')
  const [medicalTrack, setMedicalTrack] = useState('')
  const [lawTrack, setLawTrack] = useState('')
  const [targetExam, setTargetExam] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [experience, setExperience] = useState('')
  const [otherDescription, setOtherDescription] = useState('')

  // Step 2: AI Suggested Careers
  const [careerSuggestions, setCareerSuggestions] = useState<any[]>([])
  const [careerLoading, setCareerLoading] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [customGoal, setCustomGoal] = useState('')

  // Step 3: Skills
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState('')

  // Step 4: Levels
  const [skillLevels, setSkillLevels] = useState<Record<string, string>>({})

  // Step 5: Availability
  const [availability, setAvailability] = useState(
    days.map((day) => ({ day, hours: day === 'Saturday' || day === 'Sunday' ? 3 : 2 }))
  )
  const [weeklyPreset, setWeeklyPreset] = useState('15 hours')

  // Step 6: Learning Preferences
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  // Step 7: Deadline
  const [deadline, setDeadline] = useState('6 months')
  const [customDeadline, setCustomDeadline] = useState('')

  // Step 8: AI Preview Card Details
  const [generatedPersona, setGeneratedPersona] = useState<any>(null)
  const [generatingPersona, setGeneratingPersona] = useState(false)

  // Sync skill default values when skills list updates
  useEffect(() => {
    const nextLevels = { ...skillLevels }
    selectedSkills.forEach((skill) => {
      if (!nextLevels[skill]) {
        nextLevels[skill] = 'Beginner'
      }
    })
    // Remove unused skills
    Object.keys(nextLevels).forEach((k) => {
      if (!selectedSkills.includes(k)) {
        delete nextLevels[k]
      }
    })
    setSkillLevels(nextLevels)
  }, [selectedSkills])

  // Load from local storage if available
  useEffect(() => {
    const stored = localStorage.getItem('student_profile')
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      if (parsed.profile) {
        setBasicDetails(parsed.profile)
        if (parsed.profile.board) setBoard(parsed.profile.board)
        if (parsed.profile.stream) setStream(parsed.profile.stream)
        if (parsed.profile.className) setCurrentClass(parsed.profile.className)
        if (parsed.profile.branch) setBranch(parsed.profile.branch)
        if (parsed.profile.semester) setSemesterVal(parsed.profile.semester)
        if (parsed.profile.year) setYearVal(parsed.profile.year)
        if (parsed.profile.medicalTrack) setMedicalTrack(parsed.profile.medicalTrack)
        if (parsed.profile.lawTrack) setLawTrack(parsed.profile.lawTrack)
        if (parsed.profile.targetExam) setTargetExam(parsed.profile.targetExam)
        if (parsed.profile.fieldOfStudy) setFieldOfStudy(parsed.profile.fieldOfStudy)
        if (parsed.profile.currentRole) setCurrentRole(parsed.profile.currentRole)
        if (parsed.profile.experience) setExperience(parsed.profile.experience)
      }
      if (parsed.goals && parsed.goals.length > 0) setSelectedGoal(parsed.goals[0])
      if (parsed.skills) setSelectedSkills(parsed.skills.map((s: any) => s.skillName))
      if (parsed.availability) {
        setAvailability(parsed.availability.map((a: any) => ({ day: a.day, hours: a.availableHours })))
      }
      if (parsed.learningPreferences) setSelectedStyles(parsed.learningPreferences)
      if (parsed.deadline) {
        if (deadlineOptions.includes(parsed.deadline)) {
          setDeadline(parsed.deadline)
        } else {
          setDeadline('Custom')
          setCustomDeadline(parsed.deadline)
        }
      }
    } catch (e) {
      console.warn('Could not parse cached onboarding data', e)
    }
  }, [])

  // Presets mapping
  const applyPreset = (preset: string) => {
    setWeeklyPreset(preset)
    const hours = preset === '10 hours' ? 10 : preset === '15 hours' ? 15 : 25
    const base = Math.floor(hours / 7)
    const remainder = hours % 7
    setAvailability((current) =>
      current.map((entry, index) => ({
        ...entry,
        hours: base + (index < remainder ? 1 : 0)
      }))
    )
  }

  const toggleValue = (value: string, currentList: string[], setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentList.includes(value)) {
      setFn(currentList.filter((item) => item !== value))
    } else {
      setFn([...currentList, value])
    }
  }

  const addCustomItem = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, setArray: React.Dispatch<React.SetStateAction<string[]>>, array: string[]) => {
    const trimmed = value.trim()
    if (!trimmed || array.includes(trimmed)) return
    setArray([...array, trimmed])
    setter('')
  }

  const getBackendErrorMessage = (err: any) => {
    if (err?.response?.data) {
      if (typeof err.response.data === 'string') return err.response.data
      return err.response.data.message || err.response.data.error || JSON.stringify(err.response.data)
    }
    return err.message || 'Unknown error'
  }

  const buildAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // API Trigger: Recommend Careers
  const fetchCareerRecommendations = async () => {
    setCareerLoading(true)
    setError('')
    try {
      const payload = {
        name: basicDetails.name,
        age: basicDetails.age,
        country: basicDetails.country,
        education: basicDetails.education,
        semester: semesterVal || basicDetails.semester,
        board,
        stream,
        className: currentClass,
        branch,
        year: yearVal,
        medicalTrack,
        lawTrack,
        targetExam,
        fieldOfStudy,
        currentRole,
        experience,
        otherDescription
      }
      const res = await api.post('/api/career/recommend-careers', payload, {
        headers: buildAuthHeaders()
      })
      setCareerSuggestions(res.data.recommendedCareers || [])
    } catch (err: any) {
      console.error('Failed fetching career recommendations:', err)
      const errMsg = getBackendErrorMessage(err)
      setError(`Unable to fetch career suggestions: ${errMsg}`)
    } finally {
      setCareerLoading(false)
    }
  }

  // API Trigger: Suggest Skills
  const fetchSkillSuggestions = async (career: string) => {
    setSkillsLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await api.get(`/api/career/suggest-skills?career=${encodeURIComponent(career)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const skills = res.data.suggestedSkills || []
      setSuggestedSkills(skills)
      // Auto pre-populate selected skills
      setSelectedSkills(skills)
    } catch (err: any) {
      console.error('Failed fetching skill suggestions:', err)
      // Fallback
      setSuggestedSkills(['Core Knowledge', 'Practical Labs', 'Revision Exercises'])
    } finally {
      setSkillsLoading(false)
    }
  }

  // Input Validation per step
  const validateStep = (): boolean => {
    setError('')
    switch (step) {
      case 0:
        if (!basicDetails.name.trim()) return failValidation('Full name is required.')
        if (!basicDetails.age.trim() || Number(basicDetails.age) < 10) return failValidation('Please enter a valid age (10+).')
        if (!basicDetails.country.trim()) return failValidation('Country is required.')
        if (!basicDetails.education) return failValidation('Please select your current education stage.')
        
        // Stage validations
        if ((basicDetails.education === '12th Grade' || basicDetails.education === '11th-12th') && (!stream || !board || !currentClass)) {
          return failValidation('Please fill out Class, Stream, and Board for 11th-12th.')
        }
        if (basicDetails.education === 'BTech' && (!branch || !semesterVal)) {
          return failValidation('Please select your BTech branch and semester.')
        }
        if (['MBBS', 'BDS', 'BAMS', 'BHMS'].includes(basicDetails.education) && !yearVal) {
          return failValidation('Please enter your current year of medical school.')
        }
        if (['LLB', 'BA LLB'].includes(basicDetails.education) && !semesterVal) {
          return failValidation('Please select your current law school semester.')
        }
        if (basicDetails.education === 'MBA' && !semesterVal) {
          return failValidation('Please select your current MBA semester.')
        }
        if (['UPSC', 'SSC'].includes(basicDetails.education) && !targetExam) {
          return failValidation('Please select your target civil service exam.')
        }
        if (basicDetails.education === 'Research Scholar' && !fieldOfStudy.trim()) {
          return failValidation('Field of Study is required for researchers.')
        }
        if (['Working Professional', 'Freelancer', 'Entrepreneur'].includes(basicDetails.education) && (!currentRole.trim() || !experience.trim())) {
          return failValidation('Please specify your current role and years of experience.')
        }
        return true
      case 1:
        if (!selectedGoal && !customGoal.trim()) return failValidation('Select a career path or enter a custom career target.')
        return true
      case 2:
        if (selectedSkills.length === 0) return failValidation('Please select at least one skill to build.')
        return true
      case 3:
        return true
      case 4:
        const totalHours = availability.reduce((acc, curr) => acc + curr.hours, 0)
        if (totalHours <= 0) return failValidation('Weekly hours must be greater than zero. Setup study blocks.')
        return true
      case 5:
        if (selectedStyles.length === 0) return failValidation('Please select at least one learning style.')
        return true
      case 6:
        if (deadline === 'Custom' && !customDeadline) return failValidation('Please pick a target completion date.')
        return true
      default:
        return true
    }
  }

  const failValidation = (msg: string): boolean => {
    setError(msg)
    return false
  }

  const handleNext = async () => {
    if (validateStep()) {
      const nextStep = step + 1
      setStep(nextStep)
      
      // Post-step triggers
      if (nextStep === 1 && careerSuggestions.length === 0) {
        fetchCareerRecommendations()
      }
    }
  }

  const handleBack = () => {
    setError('')
    if (step > 0) {
      setStep((curr) => curr - 1)
    }
  }

  // Triggers the orchestrator API endpoint to compile profile state
  const handleCompileOnboarding = async () => {
    setError('')
    setGeneratingPersona(true)
    setTerminalLogs([])
    setProgressPercent(5)

    const finalGoal = selectedGoal || customGoal

    const payload = {
      goals: [finalGoal],
      skills: selectedSkills.map((skill) => ({
        skillName: skill,
        currentLevel: skillLevels[skill] ?? 'Beginner',
        targetLevel: 'Advanced',
        status: 'Planned'
      })),
      availability: availability.map((a) => ({ day: a.day, availableHours: a.hours })),
      learningPreferences: selectedStyles,
      deadline: deadline === 'Custom' ? customDeadline : deadline,
      profile: {
        name: basicDetails.name,
        age: basicDetails.age,
        country: basicDetails.country,
        education: basicDetails.education,
        semester: semesterVal || basicDetails.semester,
        board,
        stream,
        className: currentClass,
        branch,
        year: yearVal,
        medicalTrack: ['MBBS', 'BDS', 'BAMS', 'BHMS'].includes(basicDetails.education) ? basicDetails.education : medicalTrack,
        lawTrack: ['LLB', 'BA LLB'].includes(basicDetails.education) ? basicDetails.education : lawTrack,
        targetExam,
        fieldOfStudy,
        currentRole,
        experience,
        otherDescription,
        preferredLearningTime: 'Night',
        deadlineType: deadline === 'Custom' ? 'Custom' : 'Preset'
      }
    }

    console.log('[OnboardingPage] Submitting single-orchestration payload:', payload)

    // Animated console log simulator
    const logMessages = [
      'Establishing connection with LLama-3.3 Core Daemon...',
      'Mapping embedded academic profile parameters...',
      'Initiating single-orchestration AI call...',
      'Generating Student Identity Persona Card...',
      'Synthesizing RPG bosses from roadmap milestones...',
      'Creating calendar task schedule segments...',
      'Synchronizing profile state inside central MySQL DB...',
      'Refreshed universal operating system state successfully!'
    ]

    let logCounter = 0
    const logInterval = setInterval(() => {
      if (logCounter < logMessages.length) {
        setTerminalLogs((prev) => [...prev, `[PROCESS] ${logMessages[logCounter]}`])
        logCounter++
        setProgressPercent(Math.floor((logCounter / logMessages.length) * 98))
      } else {
        clearInterval(logInterval)
      }
    }, 600)

    try {
      const res = await api.post(
        '/api/planner/orchestrate-onboarding',
        payload,
        { headers: buildAuthHeaders() }
      )

      console.log('[OnboardingPage] Orchestration complete:', res.data)

      // Sleep a bit to ensure smooth logs
      const elapsed = logCounter * 600
      const remaining = Math.max(0, 5200 - elapsed)
      await new Promise((resolve) => setTimeout(resolve, remaining))

      // Finished successfully
      setTerminalLogs((prev) => [...prev, '[SUCCESS] System profile synchronized successfully. Loading Persona Preview...'])
      setProgressPercent(100)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Now fetch state to populate store and fetch the generated persona card
      await fetchProfileState()

      // Fetch the generated persona details from store/local storage profileState
      const tokenUpdated = localStorage.getItem('token')
      const profileStateRes = await api.get('/api/profile/state', {
        headers: { Authorization: `Bearer ${tokenUpdated}` }
      })
      
      const updatedDetails = profileStateRes.data.basicDetails || {}
      setGeneratedPersona(updatedDetails)
      setGeneratingPersona(false)

    } catch (err: any) {
      clearInterval(logInterval)
      console.error('[OnboardingPage] Orchestrator error:', err)
      const errMsg = getBackendErrorMessage(err) || 'Orchestration compile error.'
      setTerminalLogs((prev) => [...prev, `[CRITICAL ERROR] Compiler aborted: ${errMsg}`])
      setError(errMsg)
      setGeneratingPersona(false)
    }
  }

  const handleFinishOnboarding = () => {
    // Save cache indicators
    const finalGoal = selectedGoal || customGoal
    const cachePayload = {
      profile: {
        name: basicDetails.name,
        age: basicDetails.age,
        country: basicDetails.country,
        education: basicDetails.education,
        board,
        stream,
        className: currentClass,
        branch,
        semester: semesterVal,
        year: yearVal,
        medicalTrack,
        lawTrack,
        targetExam,
        fieldOfStudy,
        currentRole,
        experience
      },
      goals: [finalGoal],
      skills: selectedSkills.map((s) => ({ skillName: s })),
      availability: availability.map((a) => ({ day: a.day, availableHours: a.hours })),
      learningPreferences: selectedStyles,
      deadline: deadline === 'Custom' ? customDeadline : deadline
    }
    localStorage.setItem('student_profile', JSON.stringify(cachePayload))

    setIsSuccess(true)
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#06b6d4', '#8b5cf6', '#EC4899', '#10b981']
    })
  }

  // Render Wizard Forms
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Academic Base</span>
              <h2 className="text-3xl font-bold text-white mt-1">Tell us your story</h2>
              <p className="text-sm text-slate-400 mt-1">Configure your education track to generate a customized curriculum matrix.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">Full Name</span>
                <input
                  type="text"
                  placeholder="Alice Vance"
                  value={basicDetails.name}
                  onChange={(e) => setBasicDetails({ ...basicDetails, name: e.target.value })}
                  className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">Age</span>
                <input
                  type="number"
                  placeholder="21"
                  min={10}
                  value={basicDetails.age}
                  onChange={(e) => setBasicDetails({ ...basicDetails, age: e.target.value })}
                  className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">Country</span>
                <input
                  type="text"
                  placeholder="India"
                  value={basicDetails.country}
                  onChange={(e) => setBasicDetails({ ...basicDetails, country: e.target.value })}
                  className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </label>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">Academic Level / Stage</span>
                <select
                  value={basicDetails.education}
                  onChange={(e) => {
                    setBasicDetails({ ...basicDetails, education: e.target.value })
                    // Reset dynamic stage variables
                    setBoard('')
                    setStream('')
                    setCurrentClass('')
                    setBranch('')
                    setSemesterVal('')
                    setYearVal('')
                    setMedicalTrack('')
                    setLawTrack('')
                    setTargetExam('')
                    setFieldOfStudy('')
                    setCurrentRole('')
                    setExperience('')
                  }}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">-- Select Stage --</option>
                  {educationCategories.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DYNAMIC EXTRA FIELDS CONTAINER */}
            {basicDetails.education && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4"
              >
                <div className="flex items-center gap-2 mb-2 text-cyan-400">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Configure Track Details</span>
                </div>

                {/* 11th - 12th details */}
                {['11th-12th', '10th Grade', 'Middle School'].includes(basicDetails.education) && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Board</span>
                      <select value={board} onChange={(e) => setBoard(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Board --</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Stream</span>
                      <select value={stream} onChange={(e) => setStream(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Stream --</option>
                        <option value="PCM">PCM (Science)</option>
                        <option value="PCB">PCB (Science)</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                        <option value="Humanities">Humanities</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Current Class</span>
                      <select value={currentClass} onChange={(e) => setCurrentClass(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Class --</option>
                        <option value="11th">11th</option>
                        <option value="12th">12th</option>
                      </select>
                    </label>
                  </div>
                )}

                {/* BTech details */}
                {basicDetails.education === 'BTech' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Branch / Domain</span>
                      <select value={branch} onChange={(e) => setBranch(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Branch --</option>
                        <option value="CSE">CSE (Computer Science)</option>
                        <option value="IT">IT (Information Tech)</option>
                        <option value="AI">AI / Data Science</option>
                        <option value="ECE">ECE</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Other">Other Branch</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Current Semester</span>
                      <select value={semesterVal} onChange={(e) => setSemesterVal(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Semester --</option>
                        {['1', '2', '3', '4', '5', '6', '7', '8'].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                {/* Medical tracks */}
                {['MBBS', 'BDS', 'BAMS', 'BHMS'].includes(basicDetails.education) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Medical Specialisation Target</span>
                      <div className="p-3 bg-slate-900/50 border border-white/5 rounded-xl text-xs font-semibold text-slate-300">
                        {basicDetails.education} Course Track
                      </div>
                    </div>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Current Year</span>
                      <select value={yearVal} onChange={(e) => setYearVal(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Year --</option>
                        {['1', '2', '3', '4', '5'].map((y) => (
                          <option key={y} value={y}>Year {y}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                {/* Law Tracks */}
                {['LLB', 'BA LLB'].includes(basicDetails.education) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Law Track Format</span>
                      <select value={lawTrack} onChange={(e) => setLawTrack(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Format --</option>
                        <option value="LLB">3-Year LLB</option>
                        <option value="BA LLB">5-Year BA LLB</option>
                        <option value="BBA LLB">5-Year BBA LLB</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Current Semester</span>
                      <select value={semesterVal} onChange={(e) => setSemesterVal(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Semester --</option>
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                {/* MBA Tracks */}
                {basicDetails.education === 'MBA' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Management Track</span>
                      <div className="p-3 bg-slate-900/50 border border-white/5 rounded-xl text-xs font-semibold text-slate-300">
                        General Business Administration
                      </div>
                    </div>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Current Semester</span>
                      <select value={semesterVal} onChange={(e) => setSemesterVal(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                        <option value="">-- Select Semester --</option>
                        {['1', '2', '3', '4'].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                {/* Civil service tracks */}
                {['UPSC', 'SSC'].includes(basicDetails.education) && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Target Competitive Exam</span>
                    <select value={targetExam} onChange={(e) => setTargetExam(e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white">
                      <option value="">-- Select Exam --</option>
                      {basicDetails.education === 'UPSC' ? (
                        <>
                          <option value="UPSC CSE">UPSC Civil Services Examination (CSE)</option>
                          <option value="UPSC IFS">UPSC Indian Forest Service (IFS)</option>
                          <option value="UPSC NDA">UPSC NDA / CDS</option>
                        </>
                      ) : (
                        <>
                          <option value="SSC CGL">SSC Combined Graduate Level (CGL)</option>
                          <option value="SSC CHSL">SSC Combined Higher Secondary Level (CHSL)</option>
                          <option value="SSC MTS">SSC MTS</option>
                        </>
                      )}
                    </select>
                  </label>
                )}

                {/* Research Scholar */}
                {basicDetails.education === 'Research Scholar' && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Research Field / Speciality</span>
                    <input
                      type="text"
                      placeholder="e.g. Molecular Biology, Quantum Cryptography"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </label>
                )}

                {/* Working Professional / Freelancer / Entrepreneur */}
                {['Working Professional', 'Freelancer', 'Entrepreneur'].includes(basicDetails.education) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Current Designation / Role</span>
                      <input
                        type="text"
                        placeholder="e.g. Product Manager, Backend Engineer"
                        value={currentRole}
                        onChange={(e) => setCurrentRole(e.target.value)}
                        className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Professional Experience (Years)</span>
                      <input
                        type="text"
                        placeholder="e.g. 2 years, 6 months"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </label>
                  </div>
                )}

                {/* Other Stage */}
                {basicDetails.education === 'Other' && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Describe Your Current Profile</span>
                    <textarea
                      placeholder="Describe your current studies, track, or primary targets..."
                      value={otherDescription}
                      onChange={(e) => setOtherDescription(e.target.value)}
                      className="bg-slate-900 border border-white/5 rounded-xl p-3 text-xs text-white h-20 focus:border-cyan-500 focus:outline-none"
                    />
                  </label>
                )}

              </motion.div>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Dream Career</span>
              <h2 className="text-3xl font-bold text-white mt-1">Select your target career</h2>
              <p className="text-sm text-slate-400 mt-1">Here are dynamic career tracks suggested by AI based on your academic profile.</p>
            </div>

            {careerLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-cyan-400">Interrogating AI Career Matrix...</p>
              </div>
            ) : (
              <div className="grid gap-4 max-h-[320px] overflow-y-auto pr-2">
                {careerSuggestions.map((item: any) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(item.title)
                      fetchSkillSuggestions(item.title)
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      selectedGoal === item.title
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-100 shadow-lg shadow-cyan-500/5'
                        : 'border-white/5 bg-slate-900/40 text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.title}</span>
                        <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                          {item.compatibility}% Compatibility
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{item.whySuggested}</p>
                      {item.competitiveExams && item.competitiveExams.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap pt-1">
                          {item.competitiveExams.map((ex: string) => (
                            <span key={ex} className="text-[9px] bg-slate-950 text-slate-400 border border-white/5 px-2 py-0.5 rounded-full uppercase">
                              Exam: {ex}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                      <div>
                        <span className="text-[9px] block text-slate-500">Salaries</span>
                        <span className="text-white font-bold">{item.salary || 'Varies'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] block text-slate-500">Duration</span>
                        <span className="text-white font-bold">{item.yearsNeeded || 'N/A'}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 items-end">
              <label className="flex-1 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">Custom Career Goal</span>
                <input
                  type="text"
                  placeholder="e.g. Cardiologist, IAS Officer, Spring API Developer"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setSelectedGoal(customGoal)
                      fetchSkillSuggestions(customGoal)
                    }
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSelectedGoal(customGoal)
                  fetchSkillSuggestions(customGoal)
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl text-sm font-bold border border-white/5"
              >
                Set Target
              </button>
            </div>

            {selectedGoal && (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Goal Selection</span>
                  <span className="text-sm font-bold text-cyan-300">{selectedGoal}</span>
                </div>
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Roadmap Modules</span>
              <h2 className="text-3xl font-bold text-white mt-1">Select key skills</h2>
              <p className="text-sm text-slate-400 mt-1">Select the core domains suggested by AI for: <span className="text-cyan-300 font-semibold">{selectedGoal}</span></p>
            </div>

            {skillsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-indigo-400">Compiling Skill Indexes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleValue(skill, selectedSkills, setSelectedSkills)}
                    className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all relative overflow-hidden ${
                      selectedSkills.includes(skill)
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-100 shadow-lg shadow-indigo-500/5'
                        : 'border-white/5 bg-slate-900/40 text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{skill}</span>
                      {selectedSkills.includes(skill) && (
                        <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-glow" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 items-end">
              <label className="flex-1 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">Custom Skill</span>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Organic Chemistry, Constitution Law"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomItem(customSkill, setCustomSkill, setSelectedSkills, selectedSkills)
                    }
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => addCustomItem(customSkill, setCustomSkill, setSelectedSkills, selectedSkills)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl text-sm font-bold border border-white/5"
              >
                Add Skill
              </button>
            </div>

            {selectedSkills.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex flex-wrap gap-2">
                {selectedSkills.map((s) => (
                  <span
                    key={s}
                    className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Competency Rank</span>
              <h2 className="text-3xl font-bold text-white mt-1">Rate your level</h2>
              <p className="text-sm text-slate-400 mt-1">Your generated nodes scale complexity based on your initial levels.</p>
            </div>

            {selectedSkills.length === 0 ? (
              <div className="p-6 rounded-2xl border border-amber-500/10 bg-amber-500/5 text-amber-300 text-sm flex gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p>No skills wishlisted. Go back and select some skills.</p>
              </div>
            ) : (
              <div className="max-h-[320px] overflow-y-auto pr-2 space-y-4">
                {selectedSkills.map((skill) => (
                  <div key={skill} className="p-4 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-md font-bold text-white">{skill}</h4>
                      <p className="text-xs text-slate-500 font-mono">Choose current proficiency</p>
                    </div>

                    <div className="flex gap-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSkillLevels({ ...skillLevels, [skill]: lvl })}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            skillLevels[skill] === lvl
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : 'bg-slate-950/60 border border-white/5 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Weekly Allocation</span>
              <h2 className="text-3xl font-bold text-white mt-1">Study availability</h2>
              <p className="text-sm text-slate-400 mt-1">How many hours can you dedicate to study sessions per day?</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {['10 hours', '15 hours', '25 hours'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                    weeklyPreset === preset
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                      : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                  }`}
                >
                  {preset} / week
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3">
              {availability.map((dayObj) => (
                <div key={dayObj.day} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-300">{dayObj.day}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={12}
                      value={dayObj.hours}
                      onChange={(e) => {
                        setWeeklyPreset('')
                        setAvailability(
                          availability.map((a) =>
                            a.day === dayObj.day ? { ...a, hours: Number(e.target.value) } : a
                          )
                        )
                      }}
                      className="w-32 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <span className="text-xs font-bold text-white font-mono w-12 text-right">
                      {dayObj.hours} hrs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Learning Style</span>
              <h2 className="text-3xl font-bold text-white mt-1">Preferred study styles</h2>
              <p className="text-sm text-slate-400 mt-1">Select the formats that help you learn most efficiently.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {learningStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleValue(style, selectedStyles, setSelectedStyles)}
                  className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all relative overflow-hidden ${
                    selectedStyles.includes(style)
                      ? 'border-violet-500 bg-violet-500/15 text-violet-100'
                      : 'border-white/5 bg-slate-900/40 text-slate-300 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{style}</span>
                    {selectedStyles.includes(style) && (
                      <div className="h-2 w-2 rounded-full bg-violet-400 shadow-glow" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Milestone Target</span>
              <h2 className="text-3xl font-bold text-white mt-1">Timeframe deadline</h2>
              <p className="text-sm text-slate-400 mt-1">Choose target date guidelines for curriculum completion.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {deadlineOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setDeadline(opt)
                    setCustomDeadline('')
                  }}
                  className={`p-4 rounded-2xl border text-center text-sm font-semibold transition-all ${
                    deadline === opt
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                      : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setDeadline('Custom')}
              className={`w-full p-4 rounded-2xl border text-center text-sm font-semibold transition-all ${
                deadline === 'Custom'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                  : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10'
              }`}
            >
              Select Custom Target Date
            </button>

            {deadline === 'Custom' && (
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">Target Date Selection</span>
                <input
                  type="date"
                  value={customDeadline}
                  onChange={(e) => setCustomDeadline(e.target.value)}
                  className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 focus:outline-none"
                />
              </label>
            )}
          </div>
        )

      case 7:
        // Synthesis Phase
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Synthesis Terminal</span>
              <h2 className="text-3xl font-bold text-white mt-1">Compile AI educational OS</h2>
              <p className="text-sm text-slate-400 mt-1">Review parameters and initialize the Groq Neural Orchestration engine.</p>
            </div>

            {!generatedPersona ? (
              <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 flex flex-col items-center justify-center text-center gap-6">
                <div className="h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">System Synthesis Required</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">Click the compilation button below to generate your Student Identity card, adaptive roadmap nodes, recovery setups, and daily study calendar.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCompileOnboarding}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-8 py-3.5 rounded-2xl text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Start AI OS Compilation</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Generated Student Persona Card */}
                <div className="glass p-6 rounded-3xl relative overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5 flex flex-col justify-between min-h-[300px]">
                  <div className="scanline" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-mono font-bold">
                        Arc: {generatedPersona.currentArc || 'Syllabus Mastery'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">POWER LEVEL: {generatedPersona.powerLevel || 70}</span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black text-lg">
                        {generatedPersona.username?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">{generatedPersona.identityTitle || 'The Silent Strategist'}</h3>
                        <p className="text-xs text-slate-500">Category: {generatedPersona.educationCategory}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs leading-relaxed text-slate-300">
                      {generatedPersona.personaSummary || 'Your adaptive path has been initialized and compiled.'}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                      <div>
                        <span className="block text-slate-500">QUEST</span>
                        <span className="text-slate-200 truncate block font-bold">{generatedPersona.currentQuest}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500">WEAKNESS</span>
                        <span className="text-slate-200 truncate block font-bold">{generatedPersona.weakness}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 flex items-center gap-1.5">
                    <UserIcon className="h-3 w-3 text-cyan-400" />
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Traits: {generatedPersona.traits}</span>
                  </div>
                </div>

                {/* AI Analysis Metrics */}
                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-slate-900/40 border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-400" />
                      AI Diagnostics Assessment
                    </h4>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] text-slate-500 uppercase block font-mono">Success Prob</span>
                        <span className="text-lg font-bold text-emerald-400">{generatedPersona.successProbability || '82%'}</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] text-slate-500 uppercase block font-mono">Burnout Risk</span>
                        <span className="text-lg font-bold text-amber-400">{generatedPersona.risk || 'Low'}</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] text-slate-500 uppercase block font-mono">Consistency</span>
                        <span className="text-lg font-bold text-indigo-400">{generatedPersona.consistency || '80%'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Recommended Strategy</span>
                      <p className="text-xs text-slate-300 leading-snug font-medium">{generatedPersona.studyStrategy || 'Pomodoro, Active Recall'}</p>
                    </div>

                    <div className="space-y-1 border-t border-white/5 pt-3">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">AI Advice</span>
                      <p className="text-xs text-cyan-300 leading-snug italic">"{generatedPersona.aiAdvice || 'Keep daily goals consistent to avoid decay.'}"</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Activate LifeGPS OS</span>
                    <Rocket className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03060f] text-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Background Matrix overlays */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500/20 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 8 + 4}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <AnimatePresence mode="wait">
          {/* 1. Loading AI Compiler screen */}
          {generatingPersona && (
            <motion.div
              key="loading-terminal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass glass-glow rounded-3xl p-6 sm:p-10 w-full max-w-2xl mx-auto space-y-6 border border-cyan-500/20"
            >
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-cyan-400 animate-pulse" />
                <h3 className="text-xl font-bold font-mono text-white tracking-wide uppercase">
                  AI Profile Synthesis Active
                </h3>
              </div>

              {/* Progress HUD */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-cyan-400">
                  <span>[LLAMA-3.3-70B ORCHESTRATOR]</span>
                  <span>{progressPercent}% COMPLETE</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Logger console */}
              <div className="bg-black/80 rounded-2xl p-5 border border-white/5 h-64 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 shadow-inner">
                {terminalLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      log.includes('[SUCCESS]')
                        ? 'text-emerald-400 font-bold'
                        : log.includes('[CRITICAL ERROR]')
                        ? 'text-red-400 font-bold'
                        : 'text-cyan-300/90'
                    }`}
                  >
                    {log}
                  </div>
                ))}
                {terminalLogs.length < 8 && (
                  <div className="text-cyan-500 animate-pulse flex items-center gap-1">
                    <span>[COMPILING MATRIX MODULES]</span>
                    <span className="h-3 w-1.5 bg-cyan-400 inline-block animate-ping" />
                  </div>
                )}
              </div>

              <div className="text-[10px] text-center text-slate-500 font-mono">
                COMPUTING NEURAL EMBEDDINGS • ROADMAP GRAPHS • ACTIVE DATA PIPELINE
              </div>
            </motion.div>
          )}

          {/* 2. Success screen */}
          {isSuccess && !generatingPersona && (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="glass glass-glow rounded-[32px] p-8 sm:p-12 w-full max-w-lg mx-auto text-center space-y-8 border border-emerald-500/20"
            >
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle className="h-10 w-10 text-emerald-400 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">System Synthesis Complete</h2>
                <p className="text-sm text-slate-400">
                  Your StudentAI OS instance is prepared, validated, and ready for deployment.
                </p>
              </div>

              {/* Output validation checklist */}
              <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-5 text-left space-y-3">
                {[
                  'Student Profile Created',
                  'Roadmap Generated',
                  'Schedule Generated',
                  'Dashboard Ready',
                  'Career Simulator Ready'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-md cursor-pointer hover:scale-[1.01]"
              >
                <span>Launch StudentAI OS</span>
                <Rocket className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* 3. Progressive Wizard Form */}
          {!generatingPersona && !isSuccess && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="glass rounded-[32px] overflow-hidden grid md:grid-cols-[280px_1fr] border border-white/10 shadow-2xl shadow-black/80 w-full"
            >
              {/* Left Steps Sidebar */}
              <div className="bg-slate-950/80 border-r border-white/5 p-6 space-y-8 flex flex-col justify-between hidden md:flex">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-cyan-400" />
                    <span className="font-bold text-xs uppercase tracking-wider font-mono text-white">
                      LifeGPS Architect
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stepLabels.map((lbl, idx) => (
                      <div
                        key={lbl}
                        className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                          idx === step
                            ? 'bg-white/5 text-cyan-400'
                            : idx < step
                            ? 'text-slate-400'
                            : 'text-slate-600'
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            idx === step
                              ? 'bg-cyan-500 text-slate-950 font-extrabold'
                              : idx < step
                              ? 'bg-slate-800 text-slate-200'
                              : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-xs font-medium truncate">{lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 space-y-2">
                  <div className="flex gap-2 items-center text-cyan-300">
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-xs font-bold font-mono">Compiler Alert</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    The compiler uses actual context data to optimize your calendar matrices and roadmap nodes.
                  </p>
                </div>
              </div>

              {/* Right Content Panel */}
              <div className="p-6 sm:p-10 flex flex-col justify-between min-h-[460px] md:min-h-[520px]">
                {/* Progress Indicators for Mobile */}
                <div className="md:hidden flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Step {step + 1} of {stepLabels.length}
                  </span>
                  <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Form contents */}
                <div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2 items-center font-medium"
                    >
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Actions */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={step === 0}
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-300 hover:text-white bg-slate-900/40 border border-white/5 hover:border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  {step < stepLabels.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md shadow-cyan-500/10 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!generatedPersona}
                      onClick={handleFinishOnboarding}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-7 py-3.5 rounded-2xl text-sm shadow-md shadow-emerald-500/10 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <span>Finish & Activate</span>
                      <Sparkles className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
