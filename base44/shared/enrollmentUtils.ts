/**
 * أدوات مشتركة لإنشاء سجل اشتراك (Enrollment) — يُستخدم في createCheckout وغيرها.
 * موضعها base44/shared/ لأنها منطق يُعاد استخدامه عبر أكثر من دالة خلفية.
 */

export async function createEnrollment(input) {
  return input.base44.asServiceRole.entities.Enrollment.create({
    user_id: input.user_id ?? null,
    customer_email: input.customer_email,
    course_id: input.course_id,
    stripe_session_id: input.stripe_session_id ?? null,
    payment_status: input.payment_status ?? "pending",
    enrolled_at: new Date().toISOString(),
    coupon_code: input.coupon_code ?? null,
  });
}