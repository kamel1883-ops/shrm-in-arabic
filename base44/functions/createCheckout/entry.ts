import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14.21.0';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"), { apiVersion: '2023-10-16' });
    const { course_id, course_title, amount, user_id } = await req.json();

    if (!course_id || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: course_title || 'SHRM Course' },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/enrollment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${course_id}`,
      cancel_url: `${origin}/courses`,
      metadata: {
        base44_app_id: secrets.get("BASE44_APP_ID"),
        user_id: user_id || '',
        course_id,
      },
    });

    if (user_id) {
      await base44.asServiceRole.entities.Enrollment.create({
        user_id,
        course_id,
        stripe_session_id: session.id,
        payment_status: 'pending',
        enrolled_at: new Date().toISOString(),
      });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}