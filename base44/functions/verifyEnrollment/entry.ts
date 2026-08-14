import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14.21.0';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"), { apiVersion: '2023-10-16' });
    const { session_id, course_id } = await req.json();

    if (!session_id || !course_id) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.metadata?.customer_email || session.customer_email || session.customer_details?.email || '';

    if (session.payment_status === 'paid') {
      const base44 = createClientFromRequest(req);
      const enrollments = await base44.asServiceRole.entities.Enrollment.filter({
        stripe_session_id: session_id,
      });
      if (enrollments.length > 0) {
        if (enrollments[0].payment_status !== 'paid') {
          await base44.asServiceRole.entities.Enrollment.update(enrollments[0].id, {
            payment_status: 'paid',
            customer_email: email || enrollments[0].customer_email,
          });
        }
        return Response.json({ enrolled: true, customer_email: email || enrollments[0].customer_email });
      }
      await base44.asServiceRole.entities.Enrollment.create({
        course_id,
        stripe_session_id: session_id,
        customer_email: email,
        payment_status: 'paid',
        enrolled_at: new Date().toISOString(),
      });
      return Response.json({ enrolled: true, customer_email: email });
    }

    return Response.json({ enrolled: false });
  } catch (error) {
    console.error('Verify enrollment error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}