require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  console.log("Setting up categories...");
  
  const categories = [
    { name: 'Consultation', status: 'active', display_order: 1 },
    { name: 'Diagnostics', status: 'active', display_order: 2 },
    { name: 'Mental Health', status: 'active', display_order: 3 },
    { name: 'Wellness', status: 'active', display_order: 4 },
    { name: 'Free Eye Checkup', status: 'active', display_order: 5 },
    { name: 'Free Dental Cleaning and Scaling', status: 'active', display_order: 6 },
    { name: 'Round Glass Subscription', status: 'active', display_order: 7 },
  ];

  for (const cat of categories) {
    const { data, error } = await supabase.from('plan_categories').insert(cat);
    if (error) {
       console.error(`Error inserting ${cat.name}:`, error.message);
    } else {
       console.log(`Inserted ${cat.name}`);
    }
  }
}

run();
