import json, shutil, subprocess, pytest, os, sys

OTS = shutil.which("ots")

@pytest.mark.skipif(OTS is None, reason="ots not available locally")
def test_verify_json_golden(tmp_path):
    assert OTS is not None  # type: ignore
    # Create a fresh sample for deterministic run
    sample = tmp_path / "sample.txt"
    sample.write_text("golden sample")
    # Attempt to stamp; if environment lacks required native libs (SSL/bitcoin), skip gracefully.
    stamp_proc = subprocess.run([OTS, "stamp", str(sample)], capture_output=True, text=True)  # type: ignore[arg-type]
    if stamp_proc.returncode != 0:
        pytest.skip(
            "ots stamp failed in this environment (likely missing ssl/bitcoin deps); skipping golden verify test."
        )
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
