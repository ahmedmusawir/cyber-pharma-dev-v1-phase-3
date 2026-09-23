A-13 and its acceptance-spec erratum are confirmed on disk. HEAD is `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4`; its changes from tested candidate `cad164d62a623a115541c0441302de01ff74da5b` are documentation/session records only, with no implementation change. Completed candidate evidence remains valid, and only AC-304 will run.

Please confirm one thing before I open the authentication browser: **use the normal local `.env.local` Supabase project where your port-3000 login succeeded—not the `RLS_REPLICA_*`/SCRATCH project.**

Reply **confirmed**. I’ll then start the local app, open `/auth`, and ask you to enter the existing ADMIN credentials in the browser first.
