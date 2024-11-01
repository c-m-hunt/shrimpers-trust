# Shrimpers Trust

## Requirements
* Deno installed
* PayPal client ID and secret

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

## Compiling

```
deno compile --allow-all --env-file --output=st main.ts
mv st /usr/local/bin
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
`output/paypal-summary-9-2024.csv`.

In an Excel spreadsheet:

- Copy the contents from the `output/paypal-summary-9-2024.csv` file.
- Open Excel, right click A1 and select `Paste Special` -> `Values only`.
- In the menu in the bottom right corner, select `Split Text to Columns`.
- Select comman only and click `Apply`.
- Add any missing categories.
- Select all the cells and then Insert -> Pivot Table.
- Choose Existing Worksheet and select a cell to place the pivot table.
- Drag Category into Rows and Value into Values.
- Check the Grand Total matches the `Items value minus refunds minus fees` from
  the summary.
