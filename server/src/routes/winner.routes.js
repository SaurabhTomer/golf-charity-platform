import express from 'express';
import protect from '../middleware/authMiddleware.js';
import supabase from '../config/supabase.js';

const router = express.Router();

// POST /api/winners/:id/proof
router.post('/:id/proof', protect, async (req, res) => {
  const { id } = req.params;
  const file   = req.files?.proof;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    // Upload to Supabase storage
    const fileName = `proof_${id}_${Date.now()}.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('winner-proofs')
      .upload(fileName, file.data, { contentType: file.mimetype });

    if (uploadError) return res.status(400).json({ message: uploadError.message });

    // Get public URL
    const { data } = supabase.storage
      .from('winner-proofs')
      .getPublicUrl(fileName);

    // Update winner record
    await supabase
      .from('winners')
      .update({ proof_url: data.publicUrl })
      .eq('id', id)
      .eq('user_id', req.userId);

    res.json({ message: 'Proof uploaded', url: data.publicUrl });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;