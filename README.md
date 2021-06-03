JWTING
======

This is the authentication and authorization manager. Here is where we create clients and users. Clients are other apps, users are final users.

The following enpoints are (or will be) supplied:

```
/auth/signup
/auth/signin
/auth/roles
/roles
/myRoles
/hasRole
```

No one should be able to create a user with `admin` rights for this app. 

Only the admin will be able to create clients, and it will be able to perform all actionas a client can perform.

Clients will be able to create users, assign and remove roles for them, and disable, enable or mark them as deleted. It will also be able to get all cient roles and verify if a user has a specific role.

Users will only be able to get their own roles.

**Note: The above means that any one app can create roles that work in other apps, so watch out for that!**
