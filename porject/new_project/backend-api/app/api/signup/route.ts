import bcrypt from 'bcrypt';
import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password || password.length < 6) {
            return NextResponse.json(
                { error: 'Email and password are required. Password must be at least 6 characters long.' },
                { status: 400 }
            ); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, password: hashedPassword }])
            .select();
        
        if (error) {
            const message = error.code === '23505' ? 'Email already exists' : 'Failed to register user';
            return NextResponse.json({ error: message }, { status: 400 });
        }

        return NextResponse.json(
            { message: 'User registered successfully' }, 
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 }); 
    }return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
}