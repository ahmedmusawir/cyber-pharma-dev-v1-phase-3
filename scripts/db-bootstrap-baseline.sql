-- BIM-001 · db-bootstrap-baseline.sql — SCRATCH-ONLY baseline builder.
-- Reproduces the LIVE baseline exactly as cataloged at X0 (X0_EVIDENCE.md,
-- 2026-08-28): 2 tables, 3 policies (the live names — migration overlay, NOT
-- setup.sql's originals), handle_new_user() (smart-trigger version),
-- rls_auto_enable() + ensure_rls event trigger.
-- Authored per X0 ruling rider 3: "the chain's bootstrap path may create ALL
-- baseline objects it needs" on scratch-from-zero. NEVER run against live or
-- baseline-replica — there, 0001 asserts and this file is not involved.
-- Assembled from supabase/setup.sql + docs/migration_add_profiles.sql (the
-- DB_BASELINE.md interpretation) + the ensure_rls pair absent from disk SQL
-- (live-confirmed at X0; semantics per DATA_CONTRACT §3: auto-enable RLS on
-- newly created tables).

-- [1] app_role enum (setup.sql STEP 1)
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'member');

-- [2] user_roles + its one live policy (setup.sql STEP 2)
CREATE TABLE public.user_roles (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role       public.app_role NOT NULL DEFAULT 'member',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- [3] profiles + the two LIVE (superadmin-variant) policies
--     (migration_add_profiles.sql STEPS 1-2 — the live names; setup.sql's
--      original profile policies never went live per DB_BASELINE.md)
CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name   text,
  email       text,
  created_at  timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner or superadmins"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR
    (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'superadmin'
  );

CREATE POLICY "Profiles are updatable by owner or superadmins"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR
    (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'superadmin'
  );

-- [4] handle_new_user() — the smart-trigger version (migration STEP 4, live)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.app_role;
BEGIN
  IF NEW.raw_user_meta_data ->> 'role' IS NOT NULL THEN
    assigned_role := (NEW.raw_user_meta_data ->> 'role')::public.app_role;
  ELSE
    assigned_role := 'member'::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- [5] rls_auto_enable() + ensure_rls event trigger (live-confirmed at X0;
--     in no disk SQL — authored here from DATA_CONTRACT §3 semantics)
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN
    SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE TABLE'
  LOOP
    IF obj.schema_name = 'public' THEN
      EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', obj.object_identity);
    END IF;
  END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS ensure_rls;

CREATE EVENT TRIGGER ensure_rls
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE')
  EXECUTE FUNCTION public.rls_auto_enable();
