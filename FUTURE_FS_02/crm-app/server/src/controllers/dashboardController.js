
const Lead = require("../models/Lead");
const Activity = require("../models/Activity");
const FollowUp = require("../models/FollowUp");

const TIME_ZONE = "Asia/Kolkata";

// Get a YYYY-MM-DD date in India, regardless of server timezone.
const getIndiaDate = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
};

// Add or subtract calendar days from a YYYY-MM-DD date.
const addDays = (dateString, amount) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
};

const isValidDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const getDateRange = (period, startDate, endDate, today) => {
  let start;
  let endExclusive;

  if (period === "custom" || startDate || endDate) {
    if (
      !isValidDateString(startDate) ||
      !isValidDateString(endDate) ||
      startDate > endDate
    ) {
      throw new Error(
        "Provide valid startDate and endDate in YYYY-MM-DD format. The start date must not be after the end date."
      );
    }

    start = startDate;
    endExclusive = addDays(endDate, 1);
  } else if (period === "day") {
    start = today;
    endExclusive = addDays(today, 1);
  } else if (period === "week") {
    const [year, month, day] = today.split("-").map(Number);
    const weekday = new Date(
      Date.UTC(year, month - 1, day)
    ).getUTCDay();

    // Monday is the first day of the week.
    start = addDays(today, weekday === 0 ? -6 : 1 - weekday);
    endExclusive = addDays(start, 7);
  } else if (period === "month") {
    const [year, month] = today.split("-").map(Number);

    start = `${year}-${String(month).padStart(2, "0")}-01`;

    const nextMonth =
      month === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 1).padStart(2, "0")}-01`;

    endExclusive = nextMonth;
  } else {
    throw new Error("Invalid period. Use day, week, month, or custom.");
  }

  return {
    startDate: start,
    endDate: addDays(endExclusive, -1),
    start: new Date(`${start}T00:00:00+05:30`),
    endExclusive: new Date(`${endExclusive}T00:00:00+05:30`),
  };
};

const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const today = getIndiaDate(now);

    const {
      period = "month",
      startDate,
      endDate,
    } = req.query;

    let range;

    try {
      range = getDateRange(period, startDate, endDate, today);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const { start, endExclusive } = range;

    const leadDateFilter = {
      createdAt: { $gte: start, $lt: endExclusive },
    };

    const activityDateFilter = {
      createdAt: { $gte: start, $lt: endExclusive },
    };

    const completedDateFilter = {
      completedAt: { $gte: start, $lt: endExclusive },
    };

    // Current-day reminder boundaries in India.
    const startOfToday = new Date(`${today}T00:00:00+05:30`);
    const startOfTomorrow = new Date(
      `${addDays(today, 1)}T00:00:00+05:30`
    );

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      lostLeads,
      totalActivities,
      recentActivities,
      overdueFollowUps,
      dueTodayFollowUps,
      upcomingFollowUps,
      completedFollowUps,
      leadTrend,
      activityTrend,
      completedFollowUpTrend,
    ] = await Promise.all([
      Lead.countDocuments(leadDateFilter),
      Lead.countDocuments({ ...leadDateFilter, status: "new" }),
      Lead.countDocuments({ ...leadDateFilter, status: "contacted" }),
      Lead.countDocuments({ ...leadDateFilter, status: "converted" }),
      Lead.countDocuments({ ...leadDateFilter, status: "lost" }),

      Activity.countDocuments(activityDateFilter),

      Activity.find(activityDateFilter)
        .populate("lead", "name email status")
        .populate("admin", "name email")
        .sort({ createdAt: -1 })
        .limit(10),

      // Live reminders: these are not limited by the selected period.
      FollowUp.countDocuments({
        status: "pending",
        followUpDate: { $lt: startOfToday },
      }),

      FollowUp.countDocuments({
        status: "pending",
        followUpDate: {
          $gte: startOfToday,
          $lt: startOfTomorrow,
        },
      }),

      FollowUp.countDocuments({
        status: "pending",
        followUpDate: { $gte: startOfTomorrow },
      }),

      // Historical completions use completedAt, not followUpDate.
      FollowUp.countDocuments({
        status: "completed",
        ...completedDateFilter,
      }),

      Lead.aggregate([
        { $match: leadDateFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: TIME_ZONE,
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),

      Activity.aggregate([
        { $match: activityDateFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: TIME_ZONE,
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),

      FollowUp.aggregate([
        {
          $match: {
            status: "completed",
            ...completedDateFilter,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$completedAt",
                timezone: TIME_ZONE,
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusDistribution = {
      new: newLeads,
      contacted: contactedLeads,
      converted: convertedLeads,
      lost: lostLeads,
    };

    const conversionRate = totalLeads
      ? Number(((convertedLeads / totalLeads) * 100).toFixed(2))
      : 0;

    // Combine daily database counts into chart-ready records.
    const leadsByDate = Object.fromEntries(
      leadTrend.map((item) => [item._id, item.count])
    );

    const activitiesByDate = Object.fromEntries(
      activityTrend.map((item) => [item._id, item.count])
    );

    const completedByDate = Object.fromEntries(
      completedFollowUpTrend.map((item) => [item._id, item.count])
    );

    const chartData = [];

    for (
      let date = range.startDate;
      date <= range.endDate;
      date = addDays(date, 1)
    ) {
      chartData.push({
        date,
        leadsCreated: leadsByDate[date] || 0,
        activities: activitiesByDate[date] || 0,
        completedFollowUps: completedByDate[date] || 0,
      });
    }

    return res.status(200).json({
      generatedAt: now,
      filters: {
        period: startDate || endDate ? "custom" : period,
        startDate: range.startDate,
        endDate: range.endDate,
      },
      leads: {
        total: totalLeads,
        byStatus: statusDistribution,
        conversionRate,
      },
      activities: {
        total: totalActivities,
        recent: recentActivities,
      },
      followUps: {
        overdue: overdueFollowUps,
        dueToday: dueTodayFollowUps,
        upcoming: upcomingFollowUps,
        completed: completedFollowUps,
      },
      charts: {
        daily: chartData,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      message: "Failed to load dashboard summary",
      error: error.message,
    });
  }
};

module.exports = { getDashboardSummary };
