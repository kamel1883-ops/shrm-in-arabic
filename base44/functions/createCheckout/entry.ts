import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14.21.0';
import { secrets } from 'base44:runtime';
import { createEnrollment } from '../../shared/enrollmentUtils.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"), { apiVersion: '2023-10-16' });
    const { course_id, course_title, amount, currency, customer_email, user_id, coupon_code } = await req.json();

    if (!course_id || !amount || !customer_email) {
      return Response.json({ error: 'Missing required fields (course_id, amount, customer_email)' }, { status: 400 });
    }

    // العملة وعدد الكسور العشرية (ISO 4217). افتراضياً USD بكسورين.
    const cur = (currency || 'USD').toLowerCase();
    const DECIMALS: Record<string, number> = {
      sar: 2, usd: 2, egp: 2, jod: 3, omr: 3, aed: 2, kwd: 3, bhd: 3, qar: 2,
      try: 2, gbp: 2, cad: 2, eur: 2, aud: 2, inr: 2, pkr: 2, jpy: 0, krw: 0,
    };
    const decimals = DECIMALS[cur] ?? 2;
    const minorFactor = Math.pow(10, decimals);

    const base44 = createClientFromRequest(req);
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    // التحقق من كوبون الخصم وتطبيقه إن وُجد
    let finalAmount = Number(amount);
    let appliedCoupon = null;
    let discountPct = 0;

    if (coupon_code) {
      const codes = await base44.asServiceRole.entities.DiscountCode.filter({ code: coupon_code, active: true });
      const coupon = codes[0];
      if (!coupon) {
        return Response.json({ error: 'كود الخصم غير صالح' }, { status: 400 });
      }
      if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        return Response.json({ error: 'تم استخدام كود الخصم للحد الأقصى' }, { status: 400 });
      }
      discountPct = Math.min(100, Math.max(0, Number(coupon.percentage)));
      finalAmount = Math.max(0, Number(amount) - (Number(amount) * discountPct / 100));
      appliedCoupon = coupon.code;

      // تخصيص استخدام الكوبون
      await base44.asServiceRole.entities.DiscountCode.update(coupon.id, {
        uses_count: (coupon.uses_count || 0) + 1,
      });
    }

    // خصم 100% — لا حاجة للدفع عبر Stripe، نُسجّل الاشتراك مدفوعاً مباشرة
    if (finalAmount <= 0) {
      await createEnrollment({
        base44, customer_email, course_id, user_id: user_id || null,
        payment_status: "paid",
        stripe_session_id: null,
        coupon_code: appliedCoupon,
      });

      const url = `${origin}/enrollment-success?session_id=FREE&course_id=${course_id}&email=${encodeURIComponent(customer_email)}`;
      return Response.json({ url, free: true });
    }

    // خصم جزئي أو بدون كوبون — جلسة Stripe بالمبلغ النهائي
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email,
      line_items: [{
        price_data: {
          currency: cur,
          product_data: { name: course_title || 'SHRM Course' },
          unit_amount: Math.round(Number(finalAmount) * minorFactor),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/enrollment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${course_id}&email=${encodeURIComponent(customer_email)}`,
      cancel_url: `${origin}/courses`,
      metadata: {
        base44_app_id: secrets.get("BASE44_APP_ID"),
        user_id: user_id || '',
        course_id,
        customer_email,
        coupon_code: appliedCoupon || '',
        discount_pct: String(discountPct),
      },
    });

    await createEnrollment({
      base44, customer_email, course_id, user_id: user_id || null,
      payment_status: "pending",
      stripe_session_id: session.id,
      coupon_code: appliedCoupon,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}