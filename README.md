# Kimathi Space

A small owner-published personal blog page.

## Run locally

1. Install Node.js LTS.
2. Install dependencies:

   ```powershell
   npm install
   ```

3. Set the owner password for the current PowerShell session:

   ```powershell
   $env:OWNER_PASSWORD = "kimathi254"
   $env:SESSION_SECRET = "use-a-long-random-secret"
   ```

4. Start the server:

   ```powershell
   npm start
   ```

5. Open `http://localhost:3000`.
6. Select **Owner login**, unlock the page, edit the writing fields, choose an image, and select **Publish changes**.

Readers who visit the page without the owner cookie receive the published content in read-only mode. Published text is stored in `data/content.json` and uploaded images are stored in `uploads/`; both are excluded from Git.

For public hosting, deploy the Node server with HTTPS, persistent storage, and environment variables for `OWNER_PASSWORD` and `SESSION_SECRET`.
