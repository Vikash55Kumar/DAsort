import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prismaClient';
import { asyncHandler } from '../utility/asyncHandler';
import { ApiError } from '../utility/ApiError';
import ApiResponse from '../utility/ApiResponse';
import { generateToken } from '../utility/jwt';
import { logAuth, logSecurityEvent } from '../utility/auditLogger';



// Types
interface UserCreateInput {
    name: string;
    email: string;
    password: string;
    phone?: string;
    region?: string;
    language?: string;
    role?: 'USER' | 'ADMIN';
}

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
        name,
        email, 
        password,
        phone, 
        region,
        language = "en",
        role = "USER"
    }: UserCreateInput = req.body;
    console.log("body", req.body);
    
    // Validation
    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required.");
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ApiError(400, "Invalid email format.");
    }

    // Validate password strength
    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long.");
    }

    // Validate phone format if provided
    if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
        throw new ApiError(400, "Invalid phone number format.");
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ApiError(400, "User with this email already exists.");
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                region,
                language,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                region: true,
                language: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Log successful registration
        await logAuth('REGISTER', user.id, true, req, undefined, {
            userRole: user.role,
            region: user.region,
            language: user.language
        });

        res.status(201).json(
            new ApiResponse(201, { 
                user,
                token 
            }, "User registered successfully")
        );
    } catch (error) {
        console.error("Error registering user:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during registration.");
    }
});

const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email, isActive: true },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                phone: true,
                region: true,
                language: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            // Log failed login attempt
            await logSecurityEvent('FAILED_LOGIN', null, req, 'User not found', {
                attemptedEmail: email
            });
            throw new ApiError(401, "Invalid email or password.");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Log failed login attempt
            await logSecurityEvent('FAILED_LOGIN', user.id, req, 'Invalid password', {
                attemptedEmail: email
            });
            throw new ApiError(401, "Invalid email or password.");
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Log successful login
        await logAuth('LOGIN', user.id, true, req, undefined, {
            userRole: user.role,
            region: user.region,
            language: user.language
        });

        res.status(200).json(
            new ApiResponse(200, { 
                user: userWithoutPassword,
                token 
            }, "Login successful")
        );
    } catch (error) {
        console.error("Error during login:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during login.");
    }
});

const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                region: true,
                language: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        searches: true,
                        datasets: true,
                        feedbacks: true
                    }
                }
            }
        });

        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        res.status(200).json(
            new ApiResponse(200, user, "User profile retrieved successfully")
        );
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error.");
    }
});

const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { name, phone, region, language } = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    // Validate phone format if provided
    if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
        throw new ApiError(400, "Invalid phone number format.");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(region && { region }),
                ...(language && { language }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                region: true,
                language: true,
                role: true,
                updatedAt: true
            }
        });

        res.status(200).json(
            new ApiResponse(200, updatedUser, "Profile updated successfully")
        );
    } catch (error) {
        console.error("Error updating user profile:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during profile update.");
    }
});

const getUserSearchHistory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    try {
        const skip = (Number(page) - 1) * Number(limit);

        const [searches, totalCount] = await Promise.all([
            prisma.searchHistory.findMany({
                where: { userId },
                include: {
                    results: {
                        take: 3, // Top 3 results
                        include: {
                            ncoCode: {
                                select: {
                                    ncoCode: true,
                                    title: true
                                }
                            }
                        },
                        orderBy: { rank: 'asc' }
                    },
                    feedback: {
                        select: {
                            rating: true,
                            isCorrect: true
                        }
                    }
                },
                orderBy: { searchedAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.searchHistory.count({
                where: { userId }
            })
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                searches,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            }, "Search history retrieved successfully")
        );
    } catch (error) {
        console.error("Error retrieving search history:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // Check if user is admin
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { page = 1, limit = 10, role, region, isActive } = req.query;

    try {
        const skip = (Number(page) - 1) * Number(limit);
        
        const whereClause: any = {};
        if (role) whereClause.role = role;
        if (region) whereClause.region = region;
        if (isActive !== undefined) whereClause.isActive = isActive === 'true';

        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    region: true,
                    language: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            searches: true,
                            datasets: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.user.count({ where: whereClause })
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                users,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            }, "Users retrieved successfully")
        );
    } catch (error) {
        console.error("Error retrieving users:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error.");
    }
});

const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // Check if user is admin
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { userId } = req.params;
    const { role, isActive } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required.");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(role && { role }),
                ...(isActive !== undefined && { isActive }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                updatedAt: true
            }
        });

        res.status(200).json(
            new ApiResponse(200, updatedUser, "User updated successfully")
        );
    } catch (error) {
        console.error("Error updating user:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during user update.");
    }
});

const deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // Check if user is admin
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required.");
    }

    // Prevent admin from deleting themselves
    if (userId === req.user?.id) {
        throw new ApiError(400, "Cannot delete your own account.");
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: false }
        });

        res.status(200).json(
            new ApiResponse(200, null, "User deactivated successfully")
        );
    } catch (error) {
        console.error("Error deactivating user:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during user deactivation.");
    }
});

const changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required.");
    }

    // Validate new password strength
    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long.");
    }

    try {
        // Get current user with password
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                password: true
            }
        });

        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new ApiError(400, "Current password is incorrect.");
        }

        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        res.status(200).json(
            new ApiResponse(200, null, "Password changed successfully")
        );
    } catch (error) {
        console.error("Error changing password:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during password change.");
    }
});

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUserSearchHistory,
    getAllUsers,
    updateUserRole,
    deleteUser,
    changePassword
};