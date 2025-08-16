# iStampit GitHub Action — Timestamp your releases & artifacts

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-iStampit--action-blue?logo=github)](https://github.com/marketplace/actions/istampit-timestamp)

Composite GitHub Action that:

1. Installs the [OpenTimestamps](https://opentimestamps.org/) client
2. Hashes target files
3. Produces `.ots` receipts and (optionally) upgrades them against calendars
4. Lets you upload receipts as workflow artifacts or attach them to GitHub Releases

---

## 🔧 Usage

```yaml
jobs:
  stamp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Timestamp artifacts
        id: stamp
        uses: SinAi-Inc/istampit-action@v1
        with:
          paths: "dist/**/*"
          upgrade: "true"
      - name: Show receipts
        run: |
          echo "Receipts: ${{ steps.stamp.outputs.receipts }}"
          python - <<'PY'
import json, os
receipts = json.loads(os.environ['RECEIPTS'])
print('\n'.join(receipts))
PY
        env:
          RECEIPTS: ${{ steps.stamp.outputs.receipts }}
```

## 📥 Inputs

* `paths` (**required**) — comma-separated glob(s) of files to stamp.
* `upgrade` (optional, default `false`) — attempt calendar upgrade for better attestations.

## 📤 Outputs

* `receipts` — JSON array of generated `.ots` receipt file paths.

Access with `${{ steps.stamp.outputs.receipts }}` (stringified JSON array). Parse as needed.

## 📜 License

MIT (wrapper code). OTS client is LGPL-3.0.

