# Formulary Adonis fullstack application

This is the fullstack app for Formulary mobile app, it comes pre-configured with:

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup
- Add .env file to determine db settings, etc..
- Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### Console app:
- to pull into `formulary`, run: `node ace scr_ft_plan_by_state` 
- 


### Status
As of 1/17 21:18
plan2 : 5,037 records; plan2_state: 59,387
