import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import Course from "../models/frontend/course.model.js";
import Enrollment from "../models/frontend/enrollment.model.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";
import { frontendUrl, stripeCurrency } from "../constants/constants.js";

class PaymentController {
  async createCheckoutSession(req, res) {
    try {
      const studentId = req.user._id;
      const { courseId } = req.body;

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Valid course ID is required",
        });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      // Check if user is the instructor of this course
      if (course.instructor.toString() === studentId.toString()) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Instructors cannot purchase or enroll in their own course",
        });
      }

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });

      if (existingEnrollment) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "You are already enrolled in this course",
        });
      }

      // Handle Free Course (price is 0 or not set)
      const coursePrice = typeof course.price === "number" ? course.price : 0;
      if (coursePrice <= 0) {
        const enrollment = await Enrollment.create({
          student: studentId,
          course: courseId,
          pricePaid: 0,
        });

        return res.status(httpStatusCodes.OK).json({
          success: true,
          isFree: true,
          message: "Successfully enrolled in free course",
          data: enrollment,
        });
      }

      // Handle Paid Course via Stripe Checkout Session
      const originUrl = (frontendUrl || "http://localhost:3000").replace(/\/+$/, "");

      const currency = stripeCurrency.toLowerCase();
      const unitAmount = Math.round(coursePrice * 100);

      const lineItem = {
        price_data: {
          currency,
          product_data: {
            name: course.title,
            description: course.subtitle || `Enrollment for ${course.title}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      };

      if (course.thumbnail?.url && course.thumbnail.url.startsWith("http")) {
        lineItem.price_data.product_data.images = [course.thumbnail.url];
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: req.user.email || undefined,
        client_reference_id: studentId.toString(),
        line_items: [lineItem],
        metadata: {
          courseId: course._id.toString(),
          studentId: studentId.toString(),
        },
        success_url: `${originUrl}/courses/${course._id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${originUrl}/courses/${course._id}?payment=cancelled`,
      });

      return res.status(httpStatusCodes.OK).json({
        success: true,
        isFree: false,
        url: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      logger.error(`createCheckoutSession error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to create checkout session",
      });
    }
  }


  async verifySession(req, res) {
    try {
      const studentId = req.user._id.toString();
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Session ID is required",
        });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session) {
        return res.status(httpStatusCodes.NOT_FOUND).json({
          success: false,
          message: "Stripe checkout session not found",
        });
      }

      if (session.payment_status !== "paid") {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Payment has not been completed",
        });
      }

      const courseId = session.metadata?.courseId;
      const targetStudentId = session.metadata?.studentId;

      if (!courseId) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid session metadata: courseId missing",
        });
      }

      if (targetStudentId && targetStudentId !== studentId) {
        return res.status(httpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Unauthorized session access",
        });
      }

      // Check if already enrolled to avoid duplicates
      let enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });

      if (!enrollment) {
        const pricePaid = (session.amount_total || 0) / 100;
        enrollment = await Enrollment.create({
          student: studentId,
          course: courseId,
          pricePaid,
        });

        logger.info(
          `Enrollment created via Stripe: student ${studentId} in course ${courseId}`
        );
      }

      return res.status(httpStatusCodes.OK).json({
        success: true,
        message: "Payment verified and enrollment confirmed",
        data: enrollment,
      });
    } catch (error) {
      logger.error(`verifySession error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to verify payment session",
      });
    }
  }


  async handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      if (endpointSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        event = req.body;
      }
    } catch (err) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(httpStatusCodes.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    if (event?.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session?.payment_status === "paid") {
        const courseId = session.metadata?.courseId;
        const studentId = session.metadata?.studentId;

        if (courseId && studentId) {
          try {
            const existing = await Enrollment.findOne({
              student: studentId,
              course: courseId,
            });
            if (!existing) {
              await Enrollment.create({
                student: studentId,
                course: courseId,
                pricePaid: (session.amount_total || 0) / 100,
              });
              logger.info(`Webhook: Student ${studentId} enrolled in ${courseId}`);
            }
          } catch (dbErr) {
            logger.error(`Webhook enrollment DB error: ${dbErr.message}`);
          }
        }
      }
    }

    return res.status(httpStatusCodes.OK).json({ received: true });
  }
}

export default new PaymentController();
