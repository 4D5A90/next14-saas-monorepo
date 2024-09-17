# SaaS Monorepo Boilerplate

> [!NOTE]
> This example is based on [dan5py monorepo](https://github.com/dan5py/turborepo-shadcn-ui) and [mmazzarolo monorepo](https://github.com/mmazzarolo/tangerine-monorepo)

Turborepo starter with shadcn/ui pre-configured.

Built for **SaaS**


## Using this example

> [!NOTE]
> This example uses `pnpm` as package manager.


Clone the repository:

```sh
git clone https://github.com/4D5A90/next14-saas-monorepo.git
```

Install dependencies:

```sh
cd next14-saas-monorepo
pnpm install
```

### Add ui components

Use the pre-made script:

```sh
pnpm ui:add <component-name>
```

> This works just like the add command in the `shadcn/ui` CLI.

### Add a new app

Turborepo offer a simple command to add a new app:

```sh
pnpm turbo gen workspace --name <app-name>
```

This will create a new empty app in the `apps` directory.

If you want, you can copy an existing app with:

```sh
pnpm turbo gen workspace --name <app-name> --copy
```

> [!NOTE]
> Remember to run `pnpm install` after copying an app.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `server`: a [Node & Typescript]([https://nextjs.org/](https://github.com/4D5A90/quickstart-node-ts)) app
- `web`: a [Next.js]([https://nextjs.org/](https://github.com/4D5A90/quickstart-nextjs-web3)) app
- `@monorepo/ui`: a stub React component library shared for `web` and future applications (🚀 powered by **shadcn/ui**)
- ~~`@monorepo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)~~ Using Biome.js instead
- `@monorepo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome.js](https://biomejs.dev/) for code linting and formatting

### Build

To build all apps and packages, run the following command:

```sh
cd next14-saas-monorepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```sh
cd next14-saas-monorepo
pnpm dev
```
