# API Routes Draft

Base URL:

```txt
http://localhost:8080/api
```

## Auth

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Workspaces

```txt
GET    /workspaces
GET    /workspaces/{id}
POST   /workspaces
PUT    /workspaces/{id}
DELETE /workspaces/{id}
```

## Bookings

```txt
POST  /bookings
GET   /bookings/my
PATCH /bookings/{id}/cancel
```

## Wallet

```txt
GET  /wallet
POST /wallet/recharge
```

## Admin

```txt
GET /admin/dashboard
```
