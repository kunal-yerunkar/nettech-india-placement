import { ActivityLog } from '../models/ActivityLog.js';

/**
 * Middleware to log admin activities
 * Attach to routes that need logging
 */
export const logActivity = (resourceType, action) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = async function (data) {
            // Only log if response was successful (2xx status)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const adminId = req.user?.id;
                    const adminUsername = req.user?.username;

                    let resourceId = null;
                    let resourceKey = null;
                    let changes = null;

                    // Extract resource info from request
                    if (req.body?.mongo_id) {
                        resourceId = req.body.mongo_id;
                    } else if (req.params?.id) {
                        resourceId = req.params.id;
                    }

                    if (req.params?.key) {
                        resourceKey = req.params.key;
                    }

                    // For UPDATE/DELETE, track changes
                    if (action === 'UPDATE' && req.body) {
                        changes = {
                            after: req.body,
                        };
                    }

                    await ActivityLog.create({
                        adminId,
                        adminUsername,
                        action,
                        resourceType,
                        resourceId,
                        resourceKey,
                        changes,
                        ipAddress: req.ip || req.connection.remoteAddress,
                        userAgent: req.get('user-agent'),
                        status: 'SUCCESS',
                    });
                } catch (error) {
                    console.error('Failed to log activity:', error);
                    // Don't fail the request if logging fails
                }
            }

            res.send = originalSend;
            return res.send(data);
        };

        next();
    };
};

/**
 * Utility function to manually log activities
 */
export const createActivityLog = async (logData) => {
    try {
        await ActivityLog.create({
            ...logData,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Failed to create activity log:', error);
    }
};

/**
 * Get activity logs with filtering and pagination
 */
export const getActivityLogs = async (query = {}) => {
    try {
        const {
            adminId,
            action,
            resourceType,
            startDate,
            endDate,
            page = 1,
            limit = 50,
        } = query;

        const filter = {};
        if (adminId) filter.adminId = adminId;
        if (action) filter.action = action;
        if (resourceType) filter.resourceType = resourceType;

        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;
        const logs = await ActivityLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await ActivityLog.countDocuments(filter);

        return {
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('Failed to get activity logs:', error);
        return { logs: [], pagination: {} };
    }
};
