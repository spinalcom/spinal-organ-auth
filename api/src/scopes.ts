export enum SCOPES {
	authAdmin = "authAdmin",
	selfRead = "self:read",
	selfUpdate = "self:update",
	selfPasswordUpdate = "self:password:update",
	usersCreate = "users:create",
	usersRead = "users:read",
	usersUpdate = "users:update",
	usersDelete = "users:delete",
	usersPasswordUpdate = "users:password:update",
	usersProfilesRead = "users:profiles:read",
	usersLogsRead = "users:logs:read",
	usersAdminRead = "users:admin:read",
	applicationsCreate = "applications:create",
	applicationsRead = "applications:read",
	applicationsUpdate = "applications:update",
	applicationsDelete = "applications:delete",
	applicationsLogsRead = "applications:logs:read",
	loginServersCreate = "loginservers:create",
	loginServersRead = "loginservers:read",
	loginServersUpdate = "loginservers:update",
	loginServersDelete = "loginservers:delete",
	logsRead = "logs:read",
	logsPlatformsRead = "logs:platforms:read",
	notificationsCreate = "notifications:create",
	organsCreate = "organs:create",
	organsRead = "organs:read",
	organsUpdate = "organs:update",
	platformsCreate = "platforms:create",
	platformsRead = "platforms:read",
	platformsUpdate = "platforms:update",
	platformsDelete = "platforms:delete",
	platformsLoginServersRead = "platforms:loginservers:read",
	platformsLoginServersUpdate = "platforms:loginservers:update",
	platformsProfilesRead = "platforms:profiles:read",
	platformsLogsRead = "platforms:logs:read",
	platformsTokenUpdate = "platforms:token:update",
	platformsDataUpdate = "platforms:data:update",
	registerKeyRead = "registerKey:read",
	registerKeyUpdate = "registerKey:update",
	registerWrite = "register:write",
	tokensRead = "tokens:read",
	tokensUsersRead = "tokens:users:read",
	tokensApplicationsRead = "tokens:applications:read",
	tokensProfilesRead = "tokens:profiles:read",
	tokensVerify = "tokens:verify",
	tokensRedirectCreate = "tokens:redirect:create",
	codesConsume = "codes:consume",
	codesRead = "codes:read",
	codesCreate = "codes:create",
	codesDelete = "codes:delete",
	rolesRead = "roles:read",

	// Backward compatibility with existing scopes
	ownDataRead = "ownData:read",
	ownDataWrite = "ownData:write",
	platformWrite = "platform:write",
}

/**
 * Returns the list of scopes for a given user.
 * @param user - The user object, expected to contain a `scopes` property (array of scope strings).
 * @returns An array of SCOPES for the user, or an empty array if none are found.
 */
export function getUserScopes(): SCOPES[] {
	return [SCOPES.selfPasswordUpdate, SCOPES.selfRead, SCOPES.selfUpdate];
}
