
-- 1) Remove any duplicate user_profiles rows by user_id (keep earliest)
WITH dupes AS (
  SELECT id
  FROM (
    SELECT
      id,
      user_id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY created_at NULLS LAST, id
      ) AS rn
    FROM public.user_profiles
  ) t
  WHERE rn > 1
)
DELETE FROM public.user_profiles
WHERE id IN (SELECT id FROM dupes);

-- 2) Enforce uniqueness on user_profiles.user_id so ON CONFLICT (user_id) works
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_uidx
  ON public.user_profiles(user_id);
