import mongoose from "mongoose";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Course from "../models/frontend/course.model.js";
import Category from "../models/frontend/category.model.js";
import Enrollment from "../models/frontend/enrollment.model.js";
import ROLES from "../constants/roles.constant.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import logger from "../utils/logger.js";

class AnalyticsController {
  async getAdminDashboardAnalytics(req, res) {
    try {
      // 1. Role IDs lookup
      const [studentRole, instructorRole] = await Promise.all([
        Role.findOne({ name: ROLES.STUDENT }).select("_id"),
        Role.findOne({ name: ROLES.INSTRUCTOR }).select("_id"),
      ]);

      // 2. Overview Counts
      const [
        totalStudents,
        totalInstructors,
        totalCourses,
        activeCourses,
        draftCourses,
        underReviewCourses,
        allEnrollments,
      ] = await Promise.all([
        studentRole ? User.countDocuments({ role: studentRole._id }) : 0,
        instructorRole ? User.countDocuments({ role: instructorRole._id }) : 0,
        Course.countDocuments(),
        Course.countDocuments({ status: "published" }),
        Course.countDocuments({ status: "draft" }),
        Course.countDocuments({ status: { $in: ["under_review", "pending"] } }),
        Enrollment.find().populate("course", "price title thumbnail instructor"),
      ]);

      let totalRevenue = 0;
      const enrolledStudentIds = new Set();
      const courseRevenueMap = new Map();

      allEnrollments.forEach((e) => {
        if (e.student) enrolledStudentIds.add(e.student.toString());
        const coursePrice =
          typeof e.course === "object" && e.course !== null
            ? (e.course.price ?? 0)
            : 0;
        const paid = e.pricePaid && e.pricePaid > 0 ? e.pricePaid : coursePrice;
        totalRevenue += paid;

        if (e.course && typeof e.course === "object") {
          const cId = e.course._id.toString();
          const current = courseRevenueMap.get(cId) || {
            courseId: cId,
            title: e.course.title || "Course",
            thumbnail: e.course.thumbnail?.url || e.course.thumbnail || "",
            instructorId: e.course.instructor?.toString() || "",
            enrollmentsCount: 0,
            revenue: 0,
          };
          current.enrollmentsCount += 1;
          current.revenue += paid;
          courseRevenueMap.set(cId, current);
        }
      });

      // 3. Top Revenue Courses (Top 5)
      const topRevenueCourses = Array.from(courseRevenueMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Populate instructor names for top revenue courses
      const instructorIds = [
        ...new Set(
          topRevenueCourses.map((c) => c.instructorId).filter(Boolean)
        ),
      ];
      const instructors = await User.find({
        _id: { $in: instructorIds },
      }).select("name profilePicture");
      const instructorMap = new Map(
        instructors.map((i) => [i._id.toString(), i.name])
      );

      topRevenueCourses.forEach((c) => {
        c.instructorName = instructorMap.get(c.instructorId) || "Instructor";
      });

      // 4. Monthly Revenue & Enrollments Trend (Last 6 Months)
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const now = new Date();
      const monthlyTrends = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        const label = `${monthNames[month]} ${year}`;

        const monthEnrollments = allEnrollments.filter((e) => {
          const created = new Date(e.createdAt);
          return (
            created.getFullYear() === year && created.getMonth() === month
          );
        });

        const monthRev = monthEnrollments.reduce((sum, e) => {
          const coursePrice =
            typeof e.course === "object" && e.course !== null
              ? (e.course.price ?? 0)
              : 0;
          return sum + (e.pricePaid && e.pricePaid > 0 ? e.pricePaid : coursePrice);
        }, 0);

        monthlyTrends.push({
          month: label,
          revenue: monthRev,
          enrollments: monthEnrollments.length,
        });
      }

      // 5. Top Instructors by Courses & Enrollments
      const coursesWithInstructor = await Course.find()
        .select("instructor title price enrolledStudentsCount averageRating rating")
        .populate("instructor", "name email profilePicture");

      const instructorStatsMap = new Map();

      coursesWithInstructor.forEach((c) => {
        if (!c.instructor || typeof c.instructor !== "object") return;
        const iId = c.instructor._id.toString();
        const current = instructorStatsMap.get(iId) || {
          instructorId: iId,
          name: c.instructor.name || "Instructor",
          email: c.instructor.email || "",
          profilePicture: c.instructor.profilePicture || "",
          coursesCount: 0,
          studentsCount: 0,
          totalRevenue: 0,
        };
        current.coursesCount += 1;
        const courseRev = courseRevenueMap.get(c._id.toString());
        if (courseRev) {
          current.studentsCount += courseRev.enrollmentsCount;
          current.totalRevenue += courseRev.revenue;
        }
        instructorStatsMap.set(iId, current);
      });

      const topInstructors = Array.from(instructorStatsMap.values())
        .sort((a, b) => b.studentsCount - a.studentsCount || b.coursesCount - a.coursesCount)
        .slice(0, 5);

      // 6. Category Distribution
      const categoryCounts = await Course.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryDoc",
          },
        },
        {
          $unwind: {
            path: "$categoryDoc",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: { $ifNull: ["$categoryDoc.name", "Uncategorized"] },
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]);

      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: {
          overview: {
            totalStudents: Math.max(totalStudents, enrolledStudentIds.size),
            totalInstructors,
            totalCourses,
            activeCourses,
            draftCourses,
            underReviewCourses,
            totalRevenue,
            totalEnrollments: allEnrollments.length,
          },
          topRevenueCourses,
          monthlyTrends,
          topInstructors,
          categoryDistribution: categoryCounts,
        },
      });
    } catch (error) {
      logger.error(`getAdminDashboardAnalytics error: ${error.message}`);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch dashboard analytics",
        error: error.message,
      });
    }
  }
}

export default new AnalyticsController();
