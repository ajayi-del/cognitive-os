'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, Brain, Database, Shield, Bell, Palette, Zap, Globe, Key, Save, RotateCcw,
  Cpu, Cloud, Server, Bot
} from 'lucide-react'
import { AI_PROVIDERS, AIProvider, AIProviderConfig } from '@/lib/ai-providers'

interface UserPreferences {
  defaultAutonomyLevel: number
  preferredOutputStyle: 'concise' | 'detailed' | 'strategic'
  theme: 'dark' | 'light'
  notifications: boolean
  autoCompression: boolean
  phaseDetection: boolean
  driftAlerts: boolean
  voiceTranscription: boolean
  cognitiveMapUpdates: boolean
}

interface APIKeys {
  provider: AIProvider
  deepseek: string
  kimik2: string
  ollamaBaseUrl: string
  customBaseUrl: string
  customApiKey: string
  openai: string
  anthropic: string
  database: string
  redis: string
}

interface SystemSettings {
  maxFileSize: number
  compressionInterval: number
  retentionDays: number
  backupEnabled: boolean
  analyticsEnabled: boolean
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultAutonomyLevel: 1,
    preferredOutputStyle: 'strategic',
    theme: 'dark',
    notifications: true,
    autoCompression: true,
    phaseDetection: true,
    driftAlerts: true,
    voiceTranscription: false,
    cognitiveMapUpdates: true
  })

  const [apiKeys, setApiKeys] = useState<APIKeys>({
    provider: 'openai',
    deepseek: '',
    kimik2: '',
    ollamaBaseUrl: 'http://localhost:11434',
    customBaseUrl: '',
    customApiKey: '',
    openai: '',
    anthropic: '',
    database: '',
    redis: ''
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maxFileSize: 10,
    compressionInterval: 24,
    retentionDays: 365,
    backupEnabled: true,
    analyticsEnabled: false
  })

  const [activeTab, setActiveTab] = useState<'preferences' | 'api' | 'system'>('preferences')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // Mock loading settings from localStorage or API
    const savedPreferences = localStorage.getItem('cognitive-os-preferences')
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      // Save to localStorage (in production, save to API)
      localStorage.setItem('cognitive-os-preferences', JSON.stringify(preferences))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveStatus('success')
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleSaveApiKeys = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      // Save to localStorage (in production, save to secure storage)
      localStorage.setItem('cognitive-os-api-keys', JSON.stringify(apiKeys))
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveStatus('success')
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleSaveSystemSettings = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      localStorage.setItem('cognitive-os-system-settings', JSON.stringify(systemSettings))
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveStatus('success')
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleReset = (type: 'preferences' | 'api' | 'system') => {
    if (type === 'preferences') {
      setPreferences({
        defaultAutonomyLevel: 1,
        preferredOutputStyle: 'strategic',
        theme: 'dark',
        notifications: true,
        autoCompression: true,
        phaseDetection: true,
        driftAlerts: true,
        voiceTranscription: false,
        cognitiveMapUpdates: true
      })
    } else if (type === 'api') {
      setApiKeys({
        provider: 'openai',
        deepseek: '',
        kimik2: '',
        ollamaBaseUrl: 'http://localhost:11434',
        customBaseUrl: '',
        customApiKey: '',
        openai: '',
        anthropic: '',
        database: '',
        redis: ''
      })
    } else {
      setSystemSettings({
        maxFileSize: 10,
        compressionInterval: 24,
        retentionDays: 365,
        backupEnabled: true,
        analyticsEnabled: false
      })
    }
  }

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'success': return 'Settings saved successfully!'
      case 'error': return 'Error saving settings'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
                <p className="text-gray-300 text-sm">Configure your Cognitive OS experience</p>
              </div>
            </div>
            
            {saveStatus !== 'idle' && (
              <div className={`text-sm ${getSaveStatusColor()}`}>
                {getSaveStatusText()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
            {[
              { id: 'preferences', label: 'Preferences', icon: <Brain className="w-4 h-4" /> },
              { id: 'api', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
              { id: 'system', label: 'System', icon: <Database className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* AI Preferences */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                AI Preferences
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Autonomy Level</label>
                  <select
                    value={preferences.defaultAutonomyLevel}
                    onChange={(e) => setPreferences(prev => ({ ...prev, defaultAutonomyLevel: parseInt(e.target.value) }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value={0}>Level 0 - Manual Only</option>
                    <option value={1}>Level 1 - Suggestions</option>
                    <option value={2}>Level 2 - Semi-Autonomous</option>
                    <option value={3}>Level 3 - Fully Autonomous</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Output Style</label>
                  <select
                    value={preferences.preferredOutputStyle}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferredOutputStyle: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="concise">Concise</option>
                    <option value="detailed">Detailed</option>
                    <option value="strategic">Strategic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Features
              </h3>
              
              <div className="space-y-4">
                {[
                  { key: 'autoCompression', label: 'Auto Memory Compression', description: 'Automatically compress notes into knowledge' },
                  { key: 'phaseDetection', label: 'Phase Detection', description: 'Detect and track cognitive phases' },
                  { key: 'driftAlerts', label: 'Drift Alerts', description: 'Alert when attention drifts from goals' },
                  { key: 'voiceTranscription', label: 'Voice Transcription', description: 'Transcribe voice notes automatically' },
                  { key: 'cognitiveMapUpdates', label: 'Cognitive Map Updates', description: 'Update cognitive map automatically' },
                  { key: 'notifications', label: 'Notifications', description: 'Enable system notifications' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-gray-400 text-sm">{description}</div>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof UserPreferences] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences[key as keyof UserPreferences] ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences[key as keyof UserPreferences] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => handleReset('preferences')}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Bot className="w-5 h-5 mr-2 text-purple-400" />
                AI Provider Selection
              </h3>
              
              {/* Provider Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Select AI Provider</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                    <button
                      key={key}
                      onClick={() => setApiKeys(prev => ({ ...prev, provider: key as AIProvider }))}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        apiKeys.provider === key
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white capitalize">{key}</span>
                        {provider.isFree && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Free</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {provider.models[0]} + {provider.models.length - 1} more
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider-specific fields */}
              <div className="space-y-4">
                {apiKeys.provider === 'openai' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
                    <input
                      type="password"
                      value={apiKeys.openai}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                      placeholder="sk-..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Get your key from platform.openai.com</p>
                  </div>
                )}

                {apiKeys.provider === 'deepseek' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">DeepSeek API Key</label>
                    <input
                      type="password"
                      value={apiKeys.deepseek}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, deepseek: e.target.value }))}
                      placeholder="sk-..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Get your key from platform.deepseek.com - Very affordable pricing!</p>
                  </div>
                )}

                {apiKeys.provider === 'kimik2' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Kimi K2 API Key</label>
                    <input
                      type="password"
                      value={apiKeys.kimik2}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, kimik2: e.target.value }))}
                      placeholder="sk-..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Get your key from platform.moonshot.cn</p>
                  </div>
                )}

                {apiKeys.provider === 'ollama' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ollama Base URL</label>
                    <input
                      type="text"
                      value={apiKeys.ollamaBaseUrl}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, ollamaBaseUrl: e.target.value }))}
                      placeholder="http://localhost:11434"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Install Ollama locally for completely free AI. Run: ollama run llama3.2</p>
                  </div>
                )}

                {apiKeys.provider === 'custom' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Custom Base URL</label>
                      <input
                        type="text"
                        value={apiKeys.customBaseUrl}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, customBaseUrl: e.target.value }))}
                        placeholder="https://api.your-provider.com/v1"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Custom API Key</label>
                      <input
                        type="password"
                        value={apiKeys.customApiKey}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, customApiKey: e.target.value }))}
                        placeholder="Your API key..."
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Use any OpenAI-compatible API endpoint</p>
                  </div>
                )}
              </div>
            </div>

            {/* Database & Redis Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-400" />
                Database Configuration
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Database URL</label>
                  <input
                    type="password"
                    value={apiKeys.database}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, database: e.target.value }))}
                    placeholder="postgresql://..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Redis URL</label>
                  <input
                    type="password"
                    value={apiKeys.redis}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, redis: e.target.value }))}
                    placeholder="redis://..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => handleReset('api')}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </button>
              <button
                onClick={handleSaveApiKeys}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save API Keys'}</span>
              </button>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-400" />
                System Configuration
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Compression Interval (hours)</label>
                  <input
                    type="number"
                    value={systemSettings.compressionInterval}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, compressionInterval: parseInt(e.target.value) }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data Retention (days)</label>
                  <input
                    type="number"
                    value={systemSettings.retentionDays}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Privacy & Security
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Enable Backups</div>
                    <div className="text-gray-400 text-sm">Automatically backup your data</div>
                  </div>
                  <button
                    onClick={() => setSystemSettings(prev => ({ ...prev, backupEnabled: !prev.backupEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      systemSettings.backupEnabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.backupEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Analytics</div>
                    <div className="text-gray-400 text-sm">Share anonymous usage data</div>
                  </div>
                  <button
                    onClick={() => setSystemSettings(prev => ({ ...prev, analyticsEnabled: !prev.analyticsEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      systemSettings.analyticsEnabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => handleReset('system')}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSaveSystemSettings}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save System Settings'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
