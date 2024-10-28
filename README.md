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

### Treasurer

#### Get PayPal account summary

Get the PayPal account summary from September, 2024
```
deno run --allow-all --env-file main.ts treasurer as 9 2024
```

## Compiling

```
deno compile --allow-all --env-file --output=st main.ts
mv st /usr/local/bin
```
