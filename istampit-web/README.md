# iStampit Web (Prototype)

Browser-based OpenTimestamps verification demo. Authentication (Google OAuth via NextAuth) now lives exclusively in the separate `istampit-auth` service; this web app only consumes the remote session endpoint and no longer needs Google OAuth env vars.

## Features

- Upload a file OR paste its SHA-256.
- Load a `.ots` detached timestamp file.
- Best-effort verify & display status: `pending` | `complete` | `mismatch` | `error`.
- Show calendar URLs (if present) and Bitcoin block height/time if a block attestation is embedded.

## Limitations

- Full upgrading/verification may require contacting calendar servers and (for completeness) validating Bitcoin headers; this prototype performs only client-side parsing and heuristic attestation extraction.
- Block height/time extraction is best-effort; underlying library APIs may evolve.

## Next Steps

- Implement active upgrade calls to calendars.
- Render full attestation tree.
- Provide copyable JSON summary.

License: MIT (web UI). Underlying `opentimestamps` library retains its original license.
