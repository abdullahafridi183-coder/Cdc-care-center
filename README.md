# CDC CARE DIAGNOSTIC CENTRE — Google Sheets Backend

The website is connected to:

- Spreadsheet ID: `13zVKCXrodzmp7GjpuM55BeKonBDUd7w7yFVhVpSloj4`
- Sheet/tab: `Leads`
- Apps Script Web App: the `/exec` URL configured in `script.js`

## Required setup

1. Open the Google Sheet.
2. Open **Extensions → Apps Script** (or open the Apps Script project that will be used).
3. Replace the entire `Code.gs` with the supplied `google-apps-script/Code.gs`.
4. Save.
5. In Apps Script, run `testConnection()` once.
6. Approve the Google authorization request.
7. Run `testAppointment()` once. A test row should appear in `Leads`.
8. Deploy:
   - **Deploy → Manage deployments**
   - Type: **Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
9. After every Code.gs change, create/select a new deployment version and deploy it.
10. The website `script.js` is already configured with the supplied `/exec` URL.

## Leads columns

Timestamp | Form Type | Name | Email | Phone | Preferred Date | Preferred Time | Service | Inquiry Type | Message | Source | Status

## What the two website forms store

### Appointment
Stores:
- Form Type = Appointment
- Name
- Email
- Phone
- Preferred Date
- Preferred Time
- Service
- Message
- Source
- Status = New

### Contact / Inquiry
Stores:
- Form Type = Contact
- Name
- Email
- Phone
- Inquiry Type
- Message
- Source
- Status = New

The unused fields remain blank.

## Important

The backend now uses `SpreadsheetApp.openById()` instead of `getActiveSpreadsheet()`. This means it works even if the Apps Script project is not bound directly to the spreadsheet.
