import prisma from '../prismaClient';
import { Request } from 'express';

interface AuditLogData {
    userId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    method?: string;
    endpoint?: string;
    userAgent?: string;
    ipAddress?: string;
    metadata?: Record<string, any>;
    success?: boolean;
    errorMessage?: string;
    duration?: number;
}

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

/**
 * Centralized audit logging utility
 * 
 * SELECTIVE LOGGING STRATEGY:
 * - Logs important security and business actions (authentication, user management, data modifications)
 * - Excludes routine read operations (get all users, dashboard stats, search history, etc.)
 * - Focuses on compliance and security monitoring rather than general API usage
 * 
 * LOGGED ACTIONS:
 * ✅ Authentication events (login, logout, registration, password changes)
 * ✅ User management (create, update, delete users, role changes)
 * ✅ Admin operations (NCO code management, system config changes)
 * ✅ Data modifications (POST, PUT, DELETE, PATCH requests)
 * ✅ Security events (failed logins, unauthorized access)
 * 
 * NOT LOGGED (to reduce noise):
 * ❌ Routine data fetching (GET requests to lists, dashboards, search history)
 * ❌ Health checks and system status requests
 * ❌ Static file requests
 * ❌ Frequent polling operations
 */
class AuditLogger {
    /**
     * Log an audit event
     */
    static async log(data: AuditLogData): Promise<void> {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    resourceType: data.resourceType,
                    resourceId: data.resourceId,
                    method: data.method,
                    endpoint: data.endpoint,
                    userAgent: data.userAgent,
                    ipAddress: data.ipAddress,
                    metadata: data.metadata,
                    success: data.success ?? true,
                    errorMessage: data.errorMessage,
                    duration: data.duration,
                }
            });
        } catch (error) {
            // Don't throw errors from audit logging to avoid breaking main operations
            if (process.env.NODE_ENV !== 'production') {
                console.error('Failed to create audit log:', error);
            }
        }
    }

    /**
     * Log a successful action from an Express request
     */
    static async logSuccess(
        req: AuthRequest,
        action: string,
        resourceType: string,
        resourceId?: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        try {
            await this.log({
                userId: req.user?.id,
                action,
                resourceType,
                resourceId,
                method: req.method,
                endpoint: req.originalUrl,
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip || req.connection.remoteAddress,
                metadata,
                success: true
            });
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Audit logging failed:', error);
            }
        }
    }

    /**
     * Log a failed action from an Express request
     */
    static async logFailure(
        req: AuthRequest,
        action: string,
        resourceType: string,
        error: string,
        resourceId?: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        try {
            await this.log({
                userId: req.user?.id,
                action,
                resourceType,
                resourceId,
                method: req.method,
                endpoint: req.originalUrl,
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip || req.connection.remoteAddress,
                metadata,
                success: false,
                errorMessage: error
            });
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Audit logging failed:', err);
            }
        }
    }

    /**
     * Log authentication events
     */
    static async logAuth(
        action: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'PASSWORD_CHANGE' | 'PROFILE_UPDATE',
        userId: string,
        success: boolean,
        req: Request,
        error?: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        try {
            await this.log({
                userId,
                action,
                resourceType: 'Authentication',
                method: req.method,
                endpoint: req.originalUrl,
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip || req.connection.remoteAddress,
                metadata,
                success,
                errorMessage: error
            });
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Audit logging failed:', err);
            }
        }
    }

    /**
     * Log user management actions
     */
    static async logUserAction(
        req: AuthRequest,
        action: 'CREATE_USER' | 'UPDATE_USER' | 'DELETE_USER' | 'CHANGE_ROLE',
        targetUserId: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        await this.logSuccess(
            req,
            action,
            'User',
            targetUserId,
            metadata
        );
    }

    /**
     * Log NCO code management actions
     */
    static async logNCOAction(
        req: AuthRequest,
        action: 'CREATE_NCO' | 'UPDATE_NCO' | 'DELETE_NCO' | 'VERIFY_NCO',
        ncoCodeId: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        await this.logSuccess(
            req,
            action,
            'NCO Code',
            ncoCodeId,
            metadata
        );
    }

    /**
     * Log system configuration changes
     */
    static async logConfigAction(
        req: AuthRequest,
        action: 'UPDATE_CONFIG' | 'DELETE_CONFIG',
        configKey: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        await this.logSuccess(
            req,
            action,
            'System Configuration',
            configKey,
            metadata
        );
    }

    /**
     * Log dataset operations
     */
    static async logDatasetAction(
        req: AuthRequest,
        action: 'CREATE_DATASET' | 'UPDATE_DATASET' | 'DELETE_DATASET' | 'PROCESS_DATASET',
        datasetId: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        await this.logSuccess(
            req,
            action,
            'Dataset',
            datasetId,
            metadata
        );
    }

    /**
     * Log search activities
     */
    static async logSearchAction(
        req: AuthRequest,
        action: 'SEARCH_NCO' | 'VIEW_RESULT' | 'PROVIDE_FEEDBACK',
        searchId: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        await this.logSuccess(
            req,
            action,
            'Search',
            searchId,
            metadata
        );
    }

    /**
     * Log security events
     */
    static async logSecurityEvent(
        action: 'FAILED_LOGIN' | 'SUSPICIOUS_ACTIVITY' | 'UNAUTHORIZED_ACCESS',
        userId: string | null,
        req: Request,
        details: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        try {
            await this.log({
                userId: userId || undefined,
                action,
                resourceType: 'Security',
                method: req.method,
                endpoint: req.originalUrl,
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip || req.connection.remoteAddress,
                metadata,
                success: false,
                errorMessage: details
            });
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Audit logging failed:', err);
            }
        }
    }

    /**
     * Check if an endpoint should be logged based on significance
     */
    static shouldLogEndpoint(method: string, endpoint: string): boolean {
        // Always log authentication and security-related actions
        if (endpoint.includes('/login') || 
            endpoint.includes('/register') || 
            endpoint.includes('/logout') ||
            endpoint.includes('/change-password')) {
            return true;
        }

        // Always log admin actions
        if (endpoint.includes('/admin/') && method !== 'GET') {
            return true;
        }

        // Log user management actions (non-GET)
        if (endpoint.includes('/users/') && method !== 'GET') {
            return true;
        }

        // Log data modification operations
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            return true;
        }

        // Skip routine GET requests that happen frequently
        const routineGetEndpoints = [
            '/users/get-allUsers',
            '/admin/dashboard',
            '/admin/audit-logs',
            '/jobs/nco-codes',
            '/datasets',
            '/search-history',
            '/analytics',
            '/utility/health',
            '/utility/status'
        ];

        for (const routineEndpoint of routineGetEndpoints) {
            if (endpoint.includes(routineEndpoint)) {
                return false;
            }
        }

        // Log other GET requests to sensitive endpoints
        if (method === 'GET' && (
            endpoint.includes('/admin/') ||
            endpoint.includes('/system-config') ||
            endpoint.includes('/api-requests')
        )) {
            return true;
        }

        return false;
    }

    /**
     * Middleware to automatically log API requests (selective logging)
     */
    static middleware() {
        return (req: AuthRequest, res: any, next: any) => {
            const start = Date.now();
            
            res.on('finish', () => {
                // Skip logging for health checks and static assets
                if (req.originalUrl.includes('/health') || 
                    req.originalUrl.includes('/static') ||
                    req.originalUrl.includes('/favicon')) {
                    return;
                }

                // Only log significant endpoints
                if (!this.shouldLogEndpoint(req.method, req.originalUrl)) {
                    return;
                }

                const duration = Date.now() - start;
                const success = res.statusCode < 400;
                
                // Determine action based on method and endpoint
                let action = `${req.method}_REQUEST`;
                let resourceType = 'API';

                // Make actions more descriptive for important operations
                if (req.originalUrl.includes('/login')) {
                    action = success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED';
                    resourceType = 'Authentication';
                } else if (req.originalUrl.includes('/register')) {
                    action = success ? 'USER_REGISTERED' : 'REGISTRATION_FAILED';
                    resourceType = 'Authentication';
                } else if (req.originalUrl.includes('/logout')) {
                    action = 'LOGOUT';
                    resourceType = 'Authentication';
                } else if (req.originalUrl.includes('/change-password')) {
                    action = success ? 'PASSWORD_CHANGED' : 'PASSWORD_CHANGE_FAILED';
                    resourceType = 'Security';
                } else if (req.originalUrl.includes('/users/') && req.method !== 'GET') {
                    if (req.method === 'POST') action = 'USER_CREATED';
                    else if (req.method === 'PUT') action = 'USER_UPDATED';
                    else if (req.method === 'DELETE') action = 'USER_DELETED';
                    resourceType = 'User Management';
                } else if (req.originalUrl.includes('/admin/nco-codes')) {
                    if (req.method === 'POST') action = 'NCO_CODE_CREATED';
                    else if (req.method === 'PUT') action = 'NCO_CODE_UPDATED';
                    else if (req.method === 'DELETE') action = 'NCO_CODE_DELETED';
                    resourceType = 'NCO Management';
                } else if (req.originalUrl.includes('/admin/system-config')) {
                    action = req.method === 'PUT' ? 'SYSTEM_CONFIG_UPDATED' : action;
                    resourceType = 'System Configuration';
                }

                this.log({
                    userId: req.user?.id,
                    action,
                    resourceType,
                    method: req.method,
                    endpoint: req.originalUrl,
                    userAgent: req.get('User-Agent'),
                    ipAddress: req.ip || req.connection.remoteAddress,
                    metadata: {
                        statusCode: res.statusCode,
                        responseTime: duration
                    },
                    success,
                    duration
                }).catch(error => {
                    // Silently handle audit logging errors
                    if (process.env.NODE_ENV !== 'production') {
                        console.warn('Audit logging failed:', error);
                    }
                });
            });
            
            next();
        };
    }
}

// Export helper functions for common audit patterns
export const auditLog = AuditLogger.log;
export const logSuccess = AuditLogger.logSuccess;
export const logFailure = AuditLogger.logFailure;
export const logAuth = AuditLogger.logAuth;
export const logUserAction = AuditLogger.logUserAction;
export const logNCOAction = AuditLogger.logNCOAction;
export const logConfigAction = AuditLogger.logConfigAction;
export const logDatasetAction = AuditLogger.logDatasetAction;
export const logSearchAction = AuditLogger.logSearchAction;
export const logSecurityEvent = AuditLogger.logSecurityEvent;

export default AuditLogger;
