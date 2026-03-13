#!/usr/bin/env tsx

/**
 * Test voice command fixes
 */

async function testVoiceFixes() {
  console.log('🔧 Testing voice command fixes...\n')
  
  try {
    // Import the fixed voice command processor
    const { processVoiceCommand, executeVoiceCommand } = await import('../lib/voice-commands')
    
    // Test each command type
    const testCommands = [
      'Nexus, search my notes for trading',
      'Nexus, what did I work on yesterday?',
      'Nexus, summarize my AI development progress',
      'Nexus, create note about voice testing'
    ]
    
    for (const command of testCommands) {
      console.log(`🎤 Testing: "${command}"`)
      
      // Process command
      const processed = processVoiceCommand(command)
      console.log(`✅ Processed: ${processed.type} → ${processed.action}`)
      console.log(`💬 Response: ${processed.response}`)
      
      // Execute command (should not throw errors now)
      try {
        const result = await executeVoiceCommand(processed)
        console.log(`🎯 Result:`, result)
      } catch (error) {
        console.error(`❌ Execution error:`, error)
      }
      
      console.log('---\n')
    }
    
    console.log('✅ Voice command fixes test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
if (require.main === module) {
  testVoiceFixes()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
