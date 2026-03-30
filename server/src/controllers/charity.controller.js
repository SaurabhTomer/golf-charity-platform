import supabase from '../config/supabase.js';

// GET /api/charities
export const getAllCharities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ charities: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/charities/:id
export const getSingleCharity = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Charity not found' });
    }

    res.json({ charity: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/charities/select
export const selectCharity = async (req, res) => {
  const { charity_id } = req.body;

  if (!charity_id) {
    return res.status(400).json({ message: 'Charity ID is required' });
  }

  try {
    // Check charity exists and is active
    const { data: charity } = await supabase
      .from('charities')
      .select('id')
      .eq('id', charity_id)
      .eq('is_active', true)
      .single();

    if (!charity) {
      return res.status(404).json({ message: 'Charity not found or inactive' });
    }

    // Update user charity selection
    const { error } = await supabase
      .from('users')
      .update({ charity_id })
      .eq('id', req.userId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Charity selected successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/charities/contribution
export const updateCharityPercent = async (req, res) => {
  const { charity_percent } = req.body;

  if (!charity_percent || charity_percent < 10) {
    return res.status(400).json({ message: 'Minimum contribution is 10%' });
  }

  if (charity_percent > 100) {
    return res.status(400).json({ message: 'Contribution cannot exceed 100%' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ charity_percent })
      .eq('id', req.userId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Contribution percentage updated' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/charities  (admin)
export const createCharity = async (req, res) => {
  const { name, description, logo_url, is_featured } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Charity name is required' });
  }

  try {
    const { data, error } = await supabase
      .from('charities')
      .insert({ name, description, logo_url, is_featured: is_featured || false })
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: 'Charity created', charity: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/charities/:id  (admin)
export const updateCharity = async (req, res) => {
  const { id } = req.params;
  const { name, description, logo_url, is_featured, is_active } = req.body;

  try {
    const { data, error } = await supabase
      .from('charities')
      .update({ name, description, logo_url, is_featured, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Charity updated', charity: data });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/charities/:id  (admin)
export const deleteCharity = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('charities')
      .update({ is_active: false })
      .eq('id', id);

    if (error) return res.status(400).json({ message: error.message });

    // soft delete — just deactivate so user data is not broken
    res.json({ message: 'Charity deactivated' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};