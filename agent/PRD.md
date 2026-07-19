# Calculator CMS PRD

## Objective

Create a lightweight CMS setup for the existing calculator in `lvmr/js/calculator.js` so the admin can update pricing values without changing core JS logic.

## Scope

- Preserve current calculator UI and behavior exactly as-is.
- Keep pricing logic data-driven using a JSON or JS config file.
- Enable an admin branch for pricing changes.
- Provide a pipeline/process to merge admin pricing updates into `dev`.

## Current Calculator Features

- Location selector: `shamshi`, `mohal`
- Room type selector: values depend on location
  - `shamshi`: `single`, `premium`, `sharing`
  - `mohal`: `single`, `sharing`, `bunk`
- Bed type selector shown for `shamshi` + `single`
  - `standard`, `queen`
- Sharing type selector shown for `shamshi` + `sharing`
  - `double`, `triple`
- Duration selector: `monthly`, `two-week`, `weekly`
- Meal selector: `2`, `3`
- Price display updates based on selection
- WhatsApp booking link updates with selected options and calculated price

## CMS Requirements

- Price configuration stored outside the JS logic in a separate file, e.g. `agent/calculator-prices.json`.
- Admin can update prices using the separate branch and deploy process.
- Calculator JS will load price config from the shared file and compute results dynamically.
- No change to frontend selectors or UX.

## Branch / Deployment Workflow

- Use an admin branch for price updates, e.g. `admin/calculator-settings`
- Deploy that branch for admin editing and review.
- When updates are approved, merge price config changes into `dev`.
- The pipeline should not modify core UI files, only the pricing config.

## Admin UI

- Use `agent/admin.html` as the lightweight admin editor.
- It loads `agent/calculator-prices.json` and presents price values in editable fields.
- The admin can update values and download the updated JSON file.
- After download, replace `agent/calculator-prices.json` in the branch and commit the change.
- The main site reads the same `agent/calculator-prices.json` file, so no additional JS changes are required.

## Workflow Example

1. Create and switch to an admin branch, e.g. `admin/calculator-settings`.
2. Edit prices via `agent/admin.html` in a local hosted environment.
3. Download the updated JSON and save it as `agent/calculator-prices.json`.
4. Commit the JSON change, push the branch, and deploy for review.
5. After approval, merge the branch into `dev`.
6. Verify that `lvmr/js/calculator.js` continues to compute prices correctly from the shared JSON config.

## Deliverables

- `agent/PRD.md`
- `agent/memory.md`
- `agent/calculator-prices.json`
- `agent/admin.html`
- `agent/admin.js`
- Updated `js/calculator.js` to read from config
- Branch workflow documentation in `agent/PRD.md`
