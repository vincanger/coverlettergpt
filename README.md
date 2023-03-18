# CoverLetterGPT.xyz

## Running it locally

1. Install [Wasp](https://wasp-lang.dev) by running `curl -sSL https://get.wasp-lang.dev/installer.sh | sh` in your terminal.
2. Create a `.env.server` file in the root of the project
3. Copy the `env.example` file contents to `.env.server` and fill in your API keys
4. Run `wasp db migrate-dev`
5. Run `wasp start`
6. Go to `localhost:3000` in your browser (your NodeJS server will be running on port `3001`)

## How it works

[coverlettergpt.xyz](http://coverlettergpt.xyz) was built in a couple of days using a few really cool tools:

- 🐝 [Wasp](https://wasp-lang.dev) - allows you to build full-stack apps with 10x less boilerplate
- 🎨 [Chakra-ui](https://chakra-ui.com/) - UI components for React that look good and are easy to work with
- 🤖 [OpenAI](https://openai.com/) - GPT-3.5 turbo API
- 💸 [Stripe](https://stripe.com/) - for tip payments

[Wasp](https://wasp-lang.dev) as the full-stack framework allows you to describe your app’s core features in the `main.wasp` config file in the root directory. Then it builds and glues these features into a React-Express-Prisma app for you so that you can focus on writing the client and server-side logic instead of configuring. For example, I did not have to use any third-party libraries for Google Authentication. I just wrote a couple lines of code in the config file stating that I want to use Google Auth, and Wasp configures it for me. Check out the `main.wasp` file for more.

Also, [Chakra-ui](https://chakra-ui.com/) is great for building nice looking UI’s really quickly and easily. Some people are turned off by the fact that they’re React components, but I find that they’re easy to customize and configure, and get me started on designs 10x faster and with less code than tailwind.

For more info on the prompts and configuration I used for the [OpenAI](https://openai.com/) API, check out the `src/server/actions.ts` file.

[Stripe](https://stripe.com/) makes the `Buy Me a Coffee` functionality super easy. I just used their `Payment Link` feature and configured it as a donate button.

If you have any other questions, feel free to reach out to me on [Twitter](https://twitter.com/hot_town).
