## Gitleaks install instruction (not installed; awaiting Tony)

**This machine:** Ubuntu 24.04.5 LTS, Linux 7.0.0-28 kernel, **x86_64**.
- `snap` and `apt` are present. `brew`, `docker` and `go` are not.
- `~/.local/bin` exists and is already on PATH.

**Recommended method:** the **official pre-built release binary**. The Gitleaks README lists "Binary Releases" alongside Homebrew, Docker and building from source. Homebrew, Docker and Go aren't installed here, so the release binary is the only official method that needs nothing else first.
- The latest release is **v8.30.1**, published 2026-03-21. Its Linux x86_64 asset is `gitleaks_8.30.1_linux_x64.tar.gz`, and it ships with `gitleaks_8.30.1_checksums.txt`.
- I'm not recommending Ubuntu's `apt` package because it isn't one of the methods in the official docs.

**What it installs:** one self-contained `gitleaks` executable, copied to `~/.local/bin/gitleaks`.
- No `sudo`, no system package and no background service.
- Nothing else on the system changes.
- The commands download the tarball and its checksum file into a temporary folder and check the SHA-256 before extracting. If the check fails, nothing is installed.
- To uninstall, delete that one file.

**Install commands** (run them yourself; I haven't run them):

```bash
V=8.30.1; T=$(mktemp -d) && cd "$T" \
&& curl -fsSLO "https://github.com/gitleaks/gitleaks/releases/download/v${V}/gitleaks_${V}_linux_x64.tar.gz" \
&& curl -fsSLO "https://github.com/gitleaks/gitleaks/releases/download/v${V}/gitleaks_${V}_checksums.txt" \
&& grep " gitleaks_${V}_linux_x64.tar.gz\$" "gitleaks_${V}_checksums.txt" | sha256sum -c - \
&& tar -xzf "gitleaks_${V}_linux_x64.tar.gz" gitleaks \
&& install -m 0755 gitleaks ~/.local/bin/gitleaks \
&& cd ~ && rm -rf "$T" && gitleaks version
```

The checksum line should print `gitleaks_8.30.1_linux_x64.tar.gz: OK`, and the last line should print `8.30.1`.

**Scan flags to use afterwards:** in the docs as I read them, `gitleaks git` scans history through `git log -p`, and `--log-opts="--all"` covers every ref. `--redact` (default 100%) hides secret values in logs and stdout. `--report-format json --report-path <file>` writes the report. On exit codes, 0 means nothing was found, 1 means leaks or errors, and 126 means an unknown flag.

**The JSON report itself still contains the redacted `Secret` and `Match` fields.** So the scan plan will keep the raw report in a scratch folder outside the repo. Only safe metadata goes into the repo report: rule ID, commit, file and line, plus the counts. I'll check the exact flags against `gitleaks --help` once it's installed.

→ Stopped. Nothing is installed, and no repo, app or database file was touched.
