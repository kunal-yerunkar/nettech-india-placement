import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        adminUsername: String,
        action: {
            type: String,
            enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
            required: true,
        },
        resourceType: {
            type: String,
            enum: ['RECORD', 'SCHEMA', 'LEAD', 'ADMIN', 'AUTH'],
            required: true,
        },
        resourceId: String,
        resourceKey: String,
        changes: {
            before: mongoose.Schema.Types.Mixed,
            after: mongoose.Schema.Types.Mixed,
        },
        ipAddress: String,
        userAgent: String,
        status: {
            type: String,
            enum: ['SUCCESS', 'FAILED'],
            default: 'SUCCESS',
        },
        errorMessage: String,
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    { collection: 'activity_logs', timestamps: true }
);

// Index for querying
ActivityLogSchema.index({ adminId: 1, timestamp: -1 });
ActivityLogSchema.index({ action: 1, timestamp: -1 });
ActivityLogSchema.index({ resourceType: 1, timestamp: -1 });

export const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
