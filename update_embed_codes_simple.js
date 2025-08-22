// Simplified script to update all existing agents' embed codes
// Run this to apply the response parsing fix to all agents

const SUPABASE_URL = 'https://fapojywavurprfbmeznj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG9qeXdhdnVycHJmYm1lem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTY2OTIsImV4cCI6MjA3MDUzMjY5Mn0.t970PnmFpE_-JwpLzCCqly-Buj6o2KaK9dtzXtABXf0';

// Function to generate the fixed embed code
function generateFixedEmbedCode(agentId, agentName, agentData = {}) {
  const agentIdClean = agentId.replace(/-/g, '_');
  const agentGoal = agentData.goal || '';
  const agentTone = agentData.tone || 'friendly';
  const agentInstructions = agentData.instructions || '';
  const agentCreatedAt = agentData.created_at || new Date().toISOString();
  const agentStatus = agentData.status || 'active';
  
  return `<!-- ${agentName} - Complete AI Search Bar with Full Agent Data -->
<!-- Agent ID: ${agentId} | Created: ${new Date().toISOString()} -->
<div id="ai-search-${agentId}" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 0 auto; position: relative;">
  <form id="ai-search-form-${agentId}" style="position: relative; display: flex; gap: 8px; align-items: center; z-index: 10;" onsubmit="return handleAISearch_${agentIdClean}(event)">
    <input id="ai-search-input-${agentId}" type="text" placeholder="Ask ${agentName} anything..." style="flex: 1; height: 48px; border: 1px solid rgba(255,255,255,0.2); border-radius: 9999px; padding: 0 16px; font-size: 16px; outline: none; transition: all 0.3s ease; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: #1f2937;" onfocus="this.style.boxShadow='0 0 0 4px rgba(79,70,229,0.2)'; this.style.borderColor='rgba(99,102,241,0.5)'; this.style.background='rgba(255,255,255,0.15)';" onblur="this.style.boxShadow='none'; this.style.borderColor='rgba(255,255,255,0.2)'; this.style.background='rgba(255,255,255,0.1)';" />
    <button type="submit" id="ai-search-submit-${agentId}" style="height: 48px; border: none; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; border-radius: 9999px; padding: 0 18px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px);" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(59,130,246,0.3)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">Ask ${agentName}</button>
  </form>
  <div style="display: flex; justify-content: flex-end; margin-top: 6px;"><span style="font-size: 12px; color: rgba(107,114,128,0.8); display: flex; align-items: center; gap: 4px;"><span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></span>Powered by Milna AI</span></div>
  <div id="ai-search-results-${agentId}" style="margin-top: 16px; display: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 20px; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); max-height: 400px; overflow-y: auto; transform: translateY(20px); opacity: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative;">
    <div id="ai-search-status-${agentId}" style="font-size: 14px; color: rgba(107,114,128,0.8); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"><div style="width: 16px; height: 16px; border: 2px solid rgba(229,231,235,0.3); border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>Thinking...</div>
    <div id="ai-search-list-${agentId}" style="display: flex; flex-direction: column; gap: 16px;"></div>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    #ai-search-input-${agentId}.fade { opacity: 0.6; transition: opacity 0.3s ease; }
    #ai-search-${agentId} * { box-sizing: border-box; }
    #ai-search-results-${agentId}.show { transform: translateY(0); opacity: 1; }
    .message-item { animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    .typing-indicator { animation: fadeIn 0.3s ease; }
  </style>
  <script>
    (function() {
      var agentConfig = { agentId: '${agentId}', agentUuid: '${agentId}', agentName: '${agentName}', agentGoal: '${agentGoal.replace(/'/g, "\\'")}', agentTone: '${agentTone.replace(/'/g, "\\'")}', agentInstructions: '${agentInstructions.replace(/'/g, "\\'")}', agentCreatedAt: '${agentCreatedAt}', supabaseUrl: 'https://fapojywavurprfbmeznj.supabase.co', webhookProxyUrl: 'https://fapojywavurprfbmeznj.supabase.co/functions/v1/webhook-proxy' };
      var agentIdClean = '${agentIdClean}';
      var visitorId = localStorage.getItem('milna_visitor_id_${agentId}');
      if (!visitorId) { visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15); localStorage.setItem('milna_visitor_id_${agentId}', visitorId); }
      var sessionToken = localStorage.getItem('milna_session_token');
      var input = document.getElementById('ai-search-input-${agentId}');
      var results = document.getElementById('ai-search-results-${agentId}');
      var status = document.getElementById('ai-search-status-${agentId}');
      var list = document.getElementById('ai-search-list-${agentId}');
      var placeholders = ["Ask ${agentName} anything...", "Get instant answers from ${agentName}...", "Chat with ${agentName}...", "How can ${agentName} help you today?"];
      var placeholderIndex = 0;
      function rotatePlaceholder() { if (document.activeElement !== input) { input.classList.add('fade'); setTimeout(function() { placeholderIndex = (placeholderIndex + 1) % placeholders.length; input.placeholder = placeholders[placeholderIndex]; input.classList.remove('fade'); }, 300); } }
      setTimeout(function() { rotatePlaceholder(); setInterval(rotatePlaceholder, 4000); }, 3000);
      function cleanResponse(response) {
        if (!response) return "Thank you for your message! I'm here to help you.";
        
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(response);
          
          // Handle array format: [{"output": "message"}]
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
            return parsed[0].output;
          }
          
          // Handle object formats
          if (parsed.output) return parsed.output;
          if (parsed.response) return parsed.response;
          if (parsed.message) return parsed.message;
          if (parsed.reply) return parsed.reply;
          if (parsed.text) return parsed.text;
          
          // If it's a string, return it
          if (typeof parsed === 'string') return parsed;
          
        } catch (e) {
          // If JSON parsing fails, treat as plain text
        }
        
        // Remove extra quotes at start and end if it's a string
        response = response.replace(/^"|"$/g, '');
        
        return response.trim() || "Thank you for your message! I'm here to help you.";
      }
      async function sendMessage(message) {
        const webhookPayload = { agent_id: agentConfig.agentId, agent_uuid: agentConfig.agentUuid, agent_name: agentConfig.agentName, agent_goal: agentConfig.agentGoal, agent_tone: agentConfig.agentTone, agent_instructions: agentConfig.agentInstructions, agent_created_at: agentConfig.agentCreatedAt, user_id: visitorId, message: message, timestamp: new Date().toISOString(), source: 'embedded_search_bar', visitor_id: visitorId, embed_type: 'hero_search_bar', agent_status: '${agentStatus}' };
        try {
          const response = await fetch(agentConfig.webhookProxyUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': sessionToken ? 'Bearer ' + sessionToken : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG9qeXdhdnVycHJmYm1lem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTY2OTIsImV4cCI6MjA3MDUzMjY5Mn0.t970PnmFpE_-JwpLzCCqly-Buj6o2KaK9dtzXtABXf0' }, body: JSON.stringify(webhookPayload) });
          if (!response.ok) { throw new Error('Webhook failed: ' + response.status); }
          const data = await response.text();
          let agentResponse = "Thank you for your message! I'm here to help you with any questions or assistance you need.";
          if (data) { 
            try { 
              const jsonData = JSON.parse(data); 
              
              // Handle array format: [{"output": "message"}]
              if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].output) {
                agentResponse = jsonData[0].output;
              }
              // Handle single object format: {"output": "message"}
              else if (jsonData.output && typeof jsonData.output === 'string') {
                agentResponse = jsonData.output;
              }
              // Handle other common response formats
              else if (jsonData.response && typeof jsonData.response === 'string') {
                agentResponse = jsonData.response;
              } else if (jsonData.message && typeof jsonData.message === 'string') {
                agentResponse = jsonData.message;
              } else if (jsonData.reply && typeof jsonData.reply === 'string') {
                agentResponse = jsonData.reply;
              } else if (jsonData.text && typeof jsonData.text === 'string') {
                agentResponse = jsonData.text;
              } else if (typeof jsonData === 'string') {
                agentResponse = jsonData;
              }
            } catch (e) { 
              agentResponse = data; 
            } 
          }
          return cleanResponse(agentResponse);
        } catch (error) {
          try { const directResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(webhookPayload) }); if (directResponse.ok) { const directData = await directResponse.text(); return cleanResponse(directData) || "Thank you for your message! I'm here to help you."; } } catch (fallbackError) { }
          return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
        }
      }
      window['handleAISearch_' + agentIdClean] = async function(event) {
        event.preventDefault(); var query = input.value.trim(); if (!query) return;
        results.style.display = 'block'; results.classList.add('show'); status.style.display = 'flex'; status.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid rgba(229,231,235,0.3); border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>Thinking...';
        var userItem = document.createElement('div'); userItem.className = 'message-item'; userItem.style.cssText = 'background: rgba(249,250,251,0.8); border: 1px solid rgba(229,231,235,0.3); border-radius: 12px; padding: 16px; font-size: 14px; color: #374151; backdrop-filter: blur(10px); margin-bottom: 8px;'; userItem.innerHTML = '<strong>You:</strong> ' + query; list.appendChild(userItem); input.value = '';
        try { const response = await sendMessage(query); status.style.display = 'none'; var agentResponse = document.createElement('div'); agentResponse.className = 'message-item'; agentResponse.style.cssText = 'background: rgba(238,242,255,0.8); border: 1px solid rgba(224,231,255,0.3); border-radius: 12px; padding: 16px; font-size: 14px; color: #1f2937; backdrop-filter: blur(10px); margin-bottom: 8px;'; agentResponse.innerHTML = '<strong>' + agentConfig.agentName + ':</strong> ' + response; list.appendChild(agentResponse); results.scrollTop = results.scrollHeight; } catch (error) { status.style.display = 'none'; var errorItem = document.createElement('div'); errorItem.className = 'message-item'; errorItem.style.cssText = 'background: rgba(254,242,242,0.8); border: 1px solid rgba(254,202,202,0.3); border-radius: 12px; padding: 16px; font-size: 14px; color: #991b1b; backdrop-filter: blur(10px); margin-bottom: 8px;'; errorItem.innerHTML = '<strong>Error:</strong> I apologize, but I\\'m having trouble processing your request right now. Please try again in a moment.'; list.appendChild(errorItem); }
      };
      console.log('🚀 AI Search Bar initialized for ' + agentConfig.agentName + ' (' + agentConfig.agentId + ')');
    })();
  </script>
</div>`;
}

// Function to update all agents
async function updateAllAgents() {
  console.log('🔄 Updating all agents\' embed codes with new liquid glass design...\n');

  try {
    // First, get all agents
    const response = await fetch(`${SUPABASE_URL}/rest/v1/agents?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status}`);
    }

    const agents = await response.json();
    console.log(`Found ${agents.length} agents to update\n`);

    let updated = 0;
    let failed = 0;

    for (const agent of agents) {
      try {
        console.log(`Updating agent: ${agent.name} (${agent.id})`);
        
        const newEmbedCode = generateFixedEmbedCode(agent.id, agent.name, agent);
        
        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/agents?id=eq.${agent.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ embed_code: newEmbedCode })
        });

        if (updateResponse.ok) {
          console.log(`✅ Updated: ${agent.name}`);
          updated++;
        } else {
          console.log(`❌ Failed to update: ${agent.name} (${updateResponse.status})`);
          failed++;
        }
      } catch (error) {
        console.log(`❌ Error updating ${agent.name}: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Update Results:`);
    console.log(`✅ Successfully updated: ${updated} agents`);
    console.log(`❌ Failed to update: ${failed} agents`);
    
    if (failed === 0) {
      console.log('\n🎉 All agents updated successfully!');
      console.log('✨ New features applied:');
      console.log('   • Liquid glass background with backdrop blur');
      console.log('   • Smooth upward expansion animations');
      console.log('   • Improved response parsing (no more JSON brackets)');
      console.log('   • Enhanced visual design with better spacing');
    } else {
      console.log('\n⚠️  Some agents failed to update. Please check the errors above.');
    }

  } catch (error) {
    console.error('❌ Error updating agents:', error.message);
  }
}

// Run the update
updateAllAgents();
