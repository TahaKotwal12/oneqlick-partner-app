/**
 * Role Validation Utilities for OneQlick Partner App
 * Ensures only restaurant owners and delivery partners can access this application
 */

export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    DELIVERY_PARTNER = 'delivery_partner',
    RESTAURANT_OWNER = 'restaurant_owner',
}

export const ALLOWED_ROLES_PARTNER_APP: UserRole[] = [
    UserRole.RESTAURANT_OWNER,
    UserRole.DELIVERY_PARTNER,
];

/**
 * Validates if a user role is allowed in the Partner App
 * @param role - The user's role
 * @returns true if role is allowed, false otherwise
 */
export function isRoleAllowed(role: string | undefined | null): boolean {
    if (!role) return false;
    return ALLOWED_ROLES_PARTNER_APP.includes(role as UserRole);
}

/**
 * Gets a user-friendly role name
 * @param role - The user's role
 * @returns Formatted role name
 */
export function getRoleName(role: string): string {
    const roleNames: Record<string, string> = {
        [UserRole.CUSTOMER]: 'Customer',
        [UserRole.ADMIN]: 'Administrator',
        [UserRole.DELIVERY_PARTNER]: 'Delivery Partner',
        [UserRole.RESTAURANT_OWNER]: 'Restaurant Owner',
    };
    return roleNames[role] || 'Unknown';
}

/**
 * Gets the appropriate app name for a given role
 * @param role - The user's role
 * @returns App name the user should use
 */
export function getAppForRole(role: string): string {
    switch (role) {
        case UserRole.CUSTOMER:
            return 'OneQlick User App';
        case UserRole.RESTAURANT_OWNER:
        case UserRole.DELIVERY_PARTNER:
            return 'OneQlick Partner App';
        case UserRole.ADMIN:
            return 'OneQlick Admin Portal';
        default:
            return 'the appropriate app';
    }
}

/**
 * Generates an error message for unauthorized role access
 * @param userRole - The user's actual role
 * @returns Error message object with title and description
 */
export function getUnauthorizedRoleMessage(userRole: string): {
    title: string;
    message: string;
} {
    const roleName = getRoleName(userRole);
    const correctApp = getAppForRole(userRole);

    return {
        title: 'Access Denied',
        message: `This app is for restaurant owners and delivery partners only.\n\nYour account is registered as: ${roleName}\n\nPlease use the ${correctApp} to access your account.`,
    };
}
