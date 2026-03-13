#!/usr/bin/env tsx

/**
 * NEXUS VOICE TEST
 * Test voice commands and responses
 */

async function testVoiceCommands() {
  console.log('🎤 Testing Nexus Voice Commands...\n')

  // Test commands
  const testCommands = [
    'Nexus, search my notes for trading',
    'Nexus, what did I work on yesterday?',
    'Nexus, summarize my AI development progress',
    'Nexus, find my German learning notes',
    'Nexus, create note about voice integration'
  ]

  for (const command of testCommands) {
    console.log(`🎤 Testing: "${command}"`)
    
    // Import and process command
    const { processVoiceCommand } = await import('../lib/voice-commands')
    const result = processVoiceCommand(command)
    
    console.log(`📝 Type: ${result.type}`)
    console.log(`⚡ Action: ${result.action}`)
    console.log(`🔧 Parameters:`, result.parameters)
    console.log(`💬 Response: ${result.response}`)
    console.log('---\n')
  }

  console.log('✅ Voice command test completed!')
}

// Run the test
if (require.main === module) {
  testVoiceCommands()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
