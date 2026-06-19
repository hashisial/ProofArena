/**
 * The client is JavaScript, so auth contracts are expressed with JSDoc rather
 * than introducing an isolated TypeScript build path.
 */

/**
 * @typedef {"admin" | "client" | "provider" | "support"} UserRole
 */

/**
 * @typedef {"active" | "banned" | "deleted" | "pending" | "suspended"} AccountStatus
 */

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} username
 * @property {UserRole} role
 * @property {AccountStatus} accountStatus
 * @property {string} [avatar]
 * @property {boolean} emailVerified
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} fullName
 * @property {string} email
 * @property {string} password
 * @property {"client" | "provider"} role
 * @property {string} [username]
 * @property {"individual" | "agency"} [accountType]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} accessToken
 * @property {AuthUser | null} user
 */

/**
 * @typedef {Object} AuthState
 * @property {AuthUser | null} user
 * @property {string | null} accessToken
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {Object | null} error
 * @property {"authenticated" | "checking" | "error" | "unauthenticated"} authStatus
 */

export {};
