import json, shutil, subprocess, pytest, os, sys

OTS = shutil.which("ots")

@pytest.mark.skipif(OTS is None, reason="ots not available locally")
def test_verify_json_golden(tmp_path):
    assert OTS is not None  # type: ignore
    # Create a fresh sample for deterministic run
    sample = tmp_path / "sample.txt"
    sample.write_text("golden sample")
    subprocess.check_call([OTS, "stamp", str(sample)])  # type: ignore[arg-type]
    receipt = str(sample) + ".ots"
    # Attempt upgrade (non-fatal)
    subprocess.call([OTS, "upgrade", receipt])  # type: ignore[arg-type]
    proc = subprocess.run([
        sys.executable, "-m", "istampit_cli.__main__", "verify", "--json", receipt
    ], check=True, capture_output=True, text=True)
    data = json.loads(proc.stdout)
    assert data["status"] in ("pending", "confirmed")
    if data["status"] == "confirmed":
        assert data.get("bitcoin") is not None
        assert "blockHeight" in data["bitcoin"]
