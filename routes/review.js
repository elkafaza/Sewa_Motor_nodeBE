import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

console.log('🔑 API KEY:', GOOGLE_API_KEY);
console.log('📍 PLACE ID:', PLACE_ID);


router.get('/', async (req, res) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,reviews&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    const result = response.data.result; // ✅ Define result dulu
    if (!result) {
      return res.status(500).json({ error: 'Result tidak ditemukan dalam response Google API' });
    }

    const reviews = result.reviews?.map(r => ({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      profile_photo_url: r.profile_photo_url
    })) || [];

    res.json({
      rating: result.rating || null,
      reviews
    });
  } catch (error) {
    console.error('❌ Error Google API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gagal mengambil review Google' });
  }
});

export default router;
