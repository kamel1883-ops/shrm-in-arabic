import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14.21.0';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"), { apiVersion: '2023-10-16' });
    const webhookSecret = secrets.get("STRIPE_WEBHOOK_SECRET");
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature error:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { course_id } = session.metadata || {};
      const email = session.metadata?.customer_email || session.customer_email || session.customer_details?.email;
      if (course_id) {
        const base44 = createClientFromRequest(req);
        const enrollments = await base44.asServiceRole.entities.Enrollment.filter({
          stripe_session_id: session.id,
        });
        if (enrollments.length > 0) {
          await base44.asServiceRole.entities.Enrollment.update(enrollments[0].id, {
            payment_status: 'paid',
            customer_email: email || enrollments[0].customer_email,
          });
        } else if (email) {
          await base44.asServiceRole.entities.Enrollment.create({
            course_id,
            stripe_session_id: session.id,
            customer_email: email,
            payment_status: 'paid',
            enrolled_at: new Date().toISOString(),
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}