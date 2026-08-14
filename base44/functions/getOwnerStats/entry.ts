import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const ownerEmail = (secrets.get("OWNER_EMAIL") || '').trim().toLowerCase();
    if (!ownerEmail || user.email.trim().toLowerCase() !== ownerEmail) {
      return Response.json({ error: 'Forbidden — owner only' }, { status: 403 });
    }

    const [enrollments, courses, users] = await Promise.all([
      base44.asServiceRole.entities.Enrollment.filter({ payment_status: 'paid' }, '-enrolled_at', 500),
      base44.asServiceRole.entities.Course.filter({}),
      base44.asServiceRole.entities.User.list(),
    ]);

    const courseMap = {};
    courses.forEach(c => { courseMap[c.id] = c; });

    const breakdown = {
      'SHRM-CP-main': 0,
      'SHRM-CP-exam_simulation': 0,
      'SHRM-SCP-main': 0,
      'SHRM-SCP-exam_simulation': 0,
    };
    const customers = {};
    enrollments.forEach(e => {
      const c = courseMap[e.course_id];
      if (!c) return;
      const key = `${c.certificate_type}-${c.course_type}`;
      if (breakdown[key] !== undefined) breakdown[key]++;
      const email = (e.customer_email || '').trim().toLowerCase();
      if (!email) return;
      if (!customers[email]) customers[email] = { email: e.customer_email, courses: [], enrollments: 0 };
      customers[email].enrollments += 1;
      customers[email].courses.push({
        title: c.title,
        type: c.course_type,
        cert: c.certificate_type,
        paid_at: e.enrolled_at,
      });
    });

    return Response.json({
      total_customers: Object.keys(customers).length,
      total_enrollments: enrollments.length,
      breakdown,
      customers: Object.values(customers),
      total_users: users.length,
    });
  } catch (error) {
    console.error('Owner stats error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}