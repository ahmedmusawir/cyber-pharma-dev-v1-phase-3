# AC-304 logout destination — static evidence, not a runtime result

Compared with read-only git show at baseline 5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9 and candidate cad164d62a623a115541c0441302de01ff74da5b.

| File | Baseline line(s) | Candidate line(s) | Observed source |
|---|---|---|---|
| src/components/auth/Logout.tsx | 14 | 14 | router.push("/auth") after logout |
| src/components/global/Navbar.tsx | 104 | 100 | router.push("/auth") in handleLogout |
| src/components/global/Navbar.tsx | 63 | 59 | router.push("/auth") in SIGNED_OUT subscription |
| src/components/global/MobileNav.tsx | 35 | 35 | router.push("/auth") after logout |

Frozen AC-304 expects logout returns to /. The navigation code is inherited from baseline; no runtime logout was executed in this follow-up. Do not rewrite the AC, classify the module or repair the source. SOL must adjudicate the source/contract discrepancy alongside the eventual live evidence.
