# Bank Account Manager (Express / XianFire)

Rewrite of the PHP "SQL CRUD" bank app on the XianFire starter (Express + Handlebars `.xian` views + Sequelize/MySQL).

## Run it
1. `npm install`
2. Start MySQL (Laragon/XAMPP). Defaults: host `127.0.0.1`, user `root`, empty password, database `bank_app`.
   Change with env vars: `DB_HOST DB_PORT DB_NAME DB_USER DB_PASS`.
3. Pick ONE:
   - **Keep your old data:** import `database/bank_app_full.sql` into a database named `bank_app`. Your old logins work as before.
   - **Start fresh:** `npm run migrate -- --demo` (creates tables, sample accounts, and users `admin/admin123`, `user1/user123`, `guest/guest123`).
4. `npm run dev` → http://localhost:3000

Edited a view and used a new Tailwind class? Run `npm run build:css` (or `npm run watch:css`). CSS is compiled, so no internet is needed.

## Structure (routes → controllers → services → models)
```
config/       permissions.js (roles), security.js (lockout, limits)
models/       one file per table + index.js (relationships)
services/     business logic: account, transaction, holder, auth, user, audit
controllers/  thin HTTP handlers per feature
routes/       index.js, auth.js, accounts.js
middleware/   auth.js (login + role checks), errorHandler.js
utils/        validators, password ($2y$ support), helpers, labels
views/        pages + partials (shell, flash, chips)
```

## PHP → Express
| PHP | Express |
|---|---|
| `api.php?action=select/search/filter` | `GET /accounts?keyword=&status=` |
| `insert` / `update` / `soft_delete` | `POST /accounts`, `/accounts/:id/update`, `/accounts/:id/delete` |
| `add_transaction`, `transactions`, `all_transactions` | `POST /accounts/:id/transactions`, `GET /transactions` |
| `get_holder` / `save_holder` | shown on `GET /accounts/:id`, `POST /accounts/:id/holder` |
| `dashboard`, `group` | `/dashboard`, `/summary` |
| `audit`, `login_attempts`, `export_csv` | `/audit`, `/security`, `/accounts/export` (admin) |
| `change_password` | `POST /profile/password` |
| `Auth::can()` | `config/permissions.js` + `requireCan()` |
| `DbHelper` / `QueryBuilder` | Sequelize (parameterised queries) |

## Behaviour changes
- Pages are server-rendered; no more single-page fetch + `innerHTML` (output is HTML-escaped).
- Deposits/withdrawals run in a locked database transaction (no double-spend) and money maths uses cents.
- Duplicate account numbers are refused; an expired lockout resets the attempt counter.
- Guests can't see holder contact details. Logout is a POST.
