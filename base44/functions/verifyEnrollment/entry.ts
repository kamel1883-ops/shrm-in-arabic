import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14.21.0';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"), { apiVersion: '2023-10-16' });
    const { session_id, course_id, user_id } = await req.json();

    if (!session_id || !course_id) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid' && user_id) {
      const base44 = createClientFromRequest(req);
      const enrollments = await base44.asServiceRole.entities.Enrollment.filter({
        user_id,
        course_id,
        stripe_session_id: session_id,
      });
      if (enrollments.length > 0 && enrollments[0].payment_status !== 'paid') {
        await base44.asServiceRole.entities.Enrollment.update(enrollments[0].id, {
          payment_status: 'paid',
        });
      } else if (enrollments.length === 0) {
        await base44.asServiceRole.entities.Enrollment.create({
          user_id,
          course_id,
          stripe_session_id: session_id,
          payment_status: 'paid',
          enrolled_at: new Date().toISOString(),
        });
      }
      return Response.json({ enrolled: true });
    }

    return Response.json({ enrolled: session.payment_status === 'paid' });
  } catch (error) {
    console.error('Verify enrollment error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}