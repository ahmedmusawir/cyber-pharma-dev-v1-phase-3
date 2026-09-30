"""Keep only a credential-safe Playwright action timeline, then delete raw trace."""

from pathlib import Path
import json
import sys
import zipfile

role = sys.argv[1].lower()
if role not in {"admin", "member", "member_probe"}:
    raise SystemExit("role must be admin, member, or member_probe")
raw = Path(f"/tmp/rrm003_ac107_{role}_raw.zip")
target_dir = Path(__file__).parent / "traces"
target_dir.mkdir(parents=True, exist_ok=True)
target = target_dir / f"{role}_sanitized_trace.zip"

try:
    with zipfile.ZipFile(raw) as source:
        lines = source.read("trace.trace").splitlines()
    retained = []
    for line in lines:
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        kind = event.get("type")
        if kind == "context-options":
            clean = {key: event.get(key) for key in
                     ("version", "type", "browserName", "playwrightVersion", "platform", "sdkLanguage")
                     if key in event}
        elif kind in {"before", "after"}:
            clean = {key: event.get(key) for key in
                     ("type", "callId", "startTime", "endTime", "class", "method")
                     if key in event}
        else:
            continue
        retained.append(json.dumps(clean, separators=(",", ":")))
    manifest = {
        "role": role.upper(),
        "format": "sanitized Playwright action timeline",
        "sourceEvents": len(lines),
        "retainedEvents": len(retained),
        "removed": "network, logs, input coordinates, browser state, URLs, parameters, results, DOM text",
        "credentialsOrConfigurationValuesRecorded": False,
    }
    with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("trace.trace", "\n".join(retained) + "\n")
        archive.writestr("QA_MANIFEST.json", json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"trace": str(target), "sourceEvents": len(lines),
                      "retainedEvents": len(retained)}))
finally:
    raw.unlink(missing_ok=True)
