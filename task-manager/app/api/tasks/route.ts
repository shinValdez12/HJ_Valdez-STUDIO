import { title } from 'process';
import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { task } = await request.json();

    const { data, error } = await supabase
    .from('tasks')
    .insert({ title: task })
    .select();

    if (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { id } = await request.json();

    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
export async function GET() {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PATCH(request: Request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from('tasks')
        .update({ title: body.title, is_completed: body.is_completed })
        .eq('id', body.id)
        .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}