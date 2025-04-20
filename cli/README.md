# Shrimpers Trust

## Requirements

- Deno installed
- PayPal client ID and secret
- Zettle client ID and secret

## Set up

Creates directories and files needed for the project:

```
deno task setup
```

Create a `.env` file with the following content:

```
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=yyy

ZETTLE_CLIENT_ID=zzz
ZETTLE_SECRET=123
```

## Compiling

```
deno compile --allow-all --env-file --output=st main.ts
mv st /usr/local/bin
```

## Clean up

```
deno task clean
```

## Usage

### Treasurer

#### Get PayPal account summary

Get the PayPal account summary from September, 2024

```
deno run --allow-all --env-file main.ts treasurer as 9 2024
```

#### Checking PayPal sumamry

Once you've run the summary, the output will be saved in
`output/total-9-2024.csv`.

In an Excel spreadsheet:

- Copy the contents from the `output/total-9-2024.csv` file.
- Open Excel, right click A1 and select `Paste Special` -> `Values only`.
- In the menu in the bottom right corner, select `Split Text to Columns`.
- Select comman only and click `Apply`.
- Add any missing categories.
- Select all the cells and then Insert -> Pivot Table.
- Choose Existing Worksheet and select a cell to place the pivot table.
- Drag Category into Rows and Value into Values.
- Check the Grand Total matches the bright green `Total` from the summary.

### Start API

```
deno run --allow-all --env-file main.ts api start
```