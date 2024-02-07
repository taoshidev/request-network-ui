-- Create a table for consumers
create table consumers (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,

  constraint username_length check (char_length(username) >= 3)
);

-- Create a table for validators
create table validators (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  end_point text,

  constraint username_length check (char_length(username) >= 3)
);

alter table consumers
  enable row level security;

alter table validators
  enable row level security;

create policy "Public consumer profiles are viewable by everyone." on consumers
  for select using (true);

create policy "Public validator profiles are viewable by everyone." on validators
  for select using (true);

create policy "Consumers can insert their own profile." on consumers
  for insert with check (auth.uid() = id);

create policy "Validators can insert their own profile." on validators
  for insert with check (auth.uid() = id);

create policy "Consumers can update own profile." on consumers
  for update using (auth.uid() = id);

create policy "Validators can update own profile." on validators
  for update using (auth.uid() = id);


