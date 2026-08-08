-- Phase 2 — trust score: verified docs (0-40) + reviews avg (0-35)
--                 + completed bookings (0-15) + response speed (0-10)

create or replace function public.recalc_trust_score(g uuid)
returns int
language plpgsql
set search_path = public
as $$
declare
  v_docs int;
  v_reviews int;
  v_bookings int;
  v_speed int;
  v_result int;
begin
  -- verified documents: 10 points each, capped at 40
  select least(coalesce(count(*), 0) * 10, 40)
  into v_docs
  from public.guide_documents
  where guide_id = g and status = 'verified';

  -- reviews: average rating (1-5) scaled to 0-35
  select coalesce(round(avg(rating))::int * 7, 0)
  into v_reviews
  from public.reviews
  where guide_id = g;

  -- completed bookings: 1 point each, capped at 15
  select least(coalesce(count(*), 0), 15)
  into v_bookings
  from public.bookings
  where guide_id = g and status = 'completed';

  -- response speed: 10 points when response_hours <= 24, linear decay to 0 at >= 168
  select coalesce(
           least(
             greatest(
               floor(10 - ((response_hours - 24) * 10 / 144.0))::int,
               0
             ),
             10
           ),
           0
         )
  into v_speed
  from public.guides
  where id = g;

  v_result := v_docs + v_reviews + v_bookings + v_speed;

  update public.guides
  set trust_score = v_result
  where id = g;

  return v_result;
end;
$$;

-- Generic trigger: recalculates for NEW/OLD.guide_id (all three tables carry guide_id).
create or replace function public.recalc_trust_score_tg()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.recalc_trust_score(coalesce(new.guide_id, old.guide_id));
  return coalesce(new, old);
end;
$$;

create trigger guide_documents_trust_score
after insert or update or delete on public.guide_documents
for each row execute function public.recalc_trust_score_tg();

create trigger reviews_trust_score
after insert or update or delete on public.reviews
for each row execute function public.recalc_trust_score_tg();

-- Recalculate when a booking reaches (or leaves) 'completed'.
-- (INSERT triggers cannot reference OLD in WHEN, hence two triggers.)
create trigger bookings_trust_score_insert
after insert on public.bookings
for each row
when (new.status = 'completed')
execute function public.recalc_trust_score_tg();

create trigger bookings_trust_score_update
after update of status on public.bookings
for each row
when (new.status = 'completed' or old.status = 'completed')
execute function public.recalc_trust_score_tg();
