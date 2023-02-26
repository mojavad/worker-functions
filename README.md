# Worker Functions
Full-stack Typesafety with Cloudflare Workers 👷

An opinionated SDK to get up and running with Cloudflare Workers: 

- **Fully Typesafe**, with frontend client inheriting arguments/return types directly from function definitions. 🦺
- Just write **Simple Functions**, without requiring any manual calling and configuring of `fetch` requests. 🏃
- Virtually **no boilerplate** - simply instantiate a client and get started. 🚀

## Setup

Using your preferred package manager, install the `worker-functions` package, and `wrangler`, Cloudflare's command line tool for Workers. For example: 

```
yarn add worker-functions 
yarn add wrangler -D
```

After the installation is complete, run: 

```
npx worker-functions
```

This will generate a `wrangler.json` configuration file in your project root directory. 

And you're done!
