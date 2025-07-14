// utils/scheduler.js  (ESM)
import cron    from 'node-cron';
import Payment from '../models/paymentModel.js';
import Motor   from '../models/motorModel.js';

/**
 * Job: tiap 15 menit cek sewa yang sudah lewat endDate
 * lalu auto-set Payment.status = "Selesai" dan
 * motor.tersedia = true
 */
cron.schedule('*/15 * * * *', async () => {
  const now = new Date();

  const expired = await Payment.find({
    status: 'Berlangsung',
    endDate: { $lte: now }
  });

  for (const p of expired) {
    p.status = 'Selesai';
    await p.save();

    await Motor.findByIdAndUpdate(
      p.motorId,
      { tersedia: true, status: 'Tersedia' }
    );

    console.log(`⏰ Auto‑close sewa ${p._id} – motor ${p.motorId}`);
  }
});
