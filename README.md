# React Native Interview

This project uses pnpm workspaces - `/apps` and `/packages` as listed in `./pnpm-workspace.yaml`. The configuration file `./.npmrc` has `node-linker=hoisted` which essentially prevents pnpm from using symlinks in `node_modules` since those aren't supported by expo yet.

## Root Scripts

- `format` - runs prettier to format all `src` folders
- `clean` - remove all node_modules everywhere
- `lint` - recursively run `lint` script (if present) in every project
- `lint:fix` - same as `lint` but with the `--fix` option

> Note:
> 
> It's recommended to run lint:fix before format, since lint fixes may change formatting of files.

## Structure
```
         api
          ↓
      api-client
      ↙        ↘
primitives → composites
```

---

## Building & Running Apps

First, ensure you're in the root directory of the app you want to work on:

`cd apps/community`

Install node modules:

`pnpm install`

### Web
Run `pnpm run:web`

---

## Directions

This interview is designed to simulate the kind of work you'll be doing at Communiful. We will be working on the community app, adding a new field `bio` to the user profile and making it editable.

Once you have the app up and running, log in with the username and password provided to you. Familiarize yourself with the different screens (home, profile).

1. Regenerate the api functions using the generate script in `packages/api`, because the profile service has been updated to support the new `bio` field.
2. On the profile screen, add a section to display the bio below the headshot/name/social links and above the event cards.
3. On the edit profile screen, add an editable bio input field below the headline input and above the social links. Prepopulate this field with the existing `bio` text, if present. The bio field is not required, but add validation to ensure the length is not longer than 2500 characters.
4. On save, include the bio field in the request to the profile service so that changes persist and are reflected on the profile screen.

When you're ready to submit, raise a pull request with your changes.
