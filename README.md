# Shrimpers Trust

## Set up

Create a `.env` file with the following content:

```
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=yyy
```

Set up the following directories:

```
mkdir -p cache
mkdir -p output
```

## Running

```
deno run --allow-all --env-file main.ts actsum 9 2024
```

## Compiling

```
deno compile --allow-all --unstable --output=st main.ts
```
