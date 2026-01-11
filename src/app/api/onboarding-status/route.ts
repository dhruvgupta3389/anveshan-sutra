import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering since this route uses request.headers
export const dynamic = 'force-dynamic';

// Initialize Supabase client with SERVICE ROLE KEY (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not configured - onboarding status API will not work');
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;

export async function GET(request: NextRequest) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured - missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
        }

        // Get session from authorization header
        const authHeader = request.headers.get('authorization');
        let userId: string | null = null;

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
            if (!error && user) {
                userId = user.id;
            }
        }

        // If no auth header, try to get from session
        if (!userId) {
            const { data: { session } } = await supabaseAdmin.auth.getSession();
            userId = session?.user?.id || null;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user profile (with service role, bypasses RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .select('name, phone, user_role, onboarding_step, interest_areas')
            .eq('id', userId)
            .single();

        // Check if user has an organization (with service role, bypasses RLS)
        const { data: orgLink, error: orgError } = await supabaseAdmin
            .from('user_organizations')
            .select('organization_id')
            .eq('user_id', userId)
            .limit(1)
            .single();

        const hasOrganization = !orgError && !!orgLink;

        return NextResponse.json({
            step: profile?.onboarding_step || 'personal_info',
            name: profile?.name || null,
            phone: profile?.phone || null,
            role: profile?.user_role || null,
            interestAreas: profile?.interest_areas || [],
            hasOrganization,
        });
    } catch (error: any) {
        console.error('Onboarding status error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
