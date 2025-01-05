import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Récupérer tous les utilisateurs avec leur email
    const { data: { users }, error: usersError } = await supabaseClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000, // Ajustez selon vos besoins
    })
    
    if (usersError) throw usersError

    // Créer un mapping id -> email
    const userEmails = users.reduce((acc, user) => {
      if (user.email) {
        acc[user.id] = user.email
      }
      return acc
    }, {} as Record<string, string>)

    // Log pour debug
    console.log(`Retrieved ${Object.keys(userEmails).length} user emails`)

    return new Response(
      JSON.stringify({ userEmails }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache' // Désactiver le cache
        } 
      }
    )
  } catch (error) {
    console.error('Error in get-user-emails:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})