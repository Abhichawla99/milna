// Test script to manually trigger the welcome modal
// Run this in the browser console when logged in

async function testWelcomeModal() {
  console.log('🧪 Testing welcome modal...');
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('❌ No user logged in');
    return;
  }
  
  console.log('👤 User:', user.email);
  
  // Get user profile for company name
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('company_name')
    .eq('user_id', user.id)
    .single();
  
  const companyName = profile?.company_name || 'Test Company';
  const agentName = `${companyName} AI Agent`;
  
  console.log('🤖 Agent name:', agentName);
  console.log('🏢 Company name:', companyName);
  
  // Create a mock welcome modal event
  const event = new CustomEvent('showWelcomeModal', {
    detail: {
      agentName,
      companyName
    }
  });
  
  window.dispatchEvent(event);
  
  console.log('✅ Welcome modal test event dispatched');
  console.log('Note: This is a simulation. The actual modal appears when a new user signs up and their first agent is created.');
}

// Run the test
testWelcomeModal();
