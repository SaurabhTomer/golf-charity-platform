import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
export const register = async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) return res.status(400).json({ message: authError.message });

    // Insert into our users table
    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert({ id: authData.user.id, email, full_name })
      .select()
      .single();

    if (dbError) return res.status(400).json({ message: dbError.message });

    res.status(201).json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Sign in via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) return res.status(401).json({ message: 'Invalid credentials' });

    // Get user from our table
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (dbError) return res.status(400).json({ message: dbError.message });

    res.json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, charity_id, charity_percent, created_at')
      .eq('id', req.userId)
      .single();

    if (error) return res.status(404).json({ message: 'User not found' });

    res.json({ user });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};