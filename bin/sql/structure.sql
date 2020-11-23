CREATE TABLE "account" (
                        "id" SERIAL PRIMARY KEY,
                        "role_id" int,
                        "user_id" int,
                        "usernamehash" CHARACTER(64),
                        "passwordhash" CHARACTER(64),
                        "sessionid" CHARACTER(36),
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

CREATE TABLE "sessionhistory" (
                        "id" SERIAL PRIMARY KEY,
                        "account_id" int,
                        "sessiondatestart" timestamp,
                        "sessiondatestop" timestamp,
                        "deviceinfo" text
                    );

CREATE TABLE "role" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50)
                    );
                    INSERT INTO public.role(
                        title)
                        VALUES ('admin');
                    INSERT INTO public.role(
                        title)
                        VALUES ('zawodnik');
                    INSERT INTO public.role(
                        title)
                        VALUES ('trener');

CREATE TABLE "experienceentry" (
                        "id" SERIAL PRIMARY KEY,
                        "user_id" int not null,
                        "title" varchar(50),
                        "amount" int,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int
                    );

CREATE TABLE "levelofadvancement" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text
                    );
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('niemowle', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('średnio-początkujący', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('początkujący', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('średnio-zaawansowany', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('zaawansowany', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('mistrz', '');
                    INSERT INTO public.levelofadvancement(
                        title, description)
                        VALUES ('wielki mistrz', '');

CREATE TABLE "gender" (
                        "id" SERIAL PRIMARY KEY,
                        "gendername" text
                    );
                    INSERT INTO gender(gendername)
	                    VALUES ('mężczyzna');
                    INSERT INTO gender(gendername)
	                    VALUES ('kobieta');

CREATE TABLE "user_achievement" (
                        "id" SERIAL PRIMARY KEY,
                        "achievement_id" int,
                        "user_id" int not null,
                        "awardeddate" timestamp
                    );

CREATE TABLE "condition" (
                        "id" SERIAL PRIMARY KEY,
                        "achievement_id" int,
                        "condition" text,
                        "fulfilled" boolean
                    );

CREATE TABLE "achievement" (
                        "id" SERIAL PRIMARY KEY,
                        "name" varchar(50),
                        "imagepath" varchar(50)
                    );

CREATE TABLE "training" (
                        "id" SERIAL PRIMARY KEY,
                        "pool_id" int,
                        "coach_user_id" int,
                        "trainingdatestart" timestamp,
                        "trainingdatestop" timestamp,
                        "title" varchar(50),
                        "description" text,
                        "held" boolean,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

CREATE TABLE "usertrainingresults" (
                        "id" int,
                        "swimmingstyle_id" int,
                        "title" varchar(50),
                        "description" text,
                        "actualrepetitions" int2,
                        "actuallength" int2,
                        "caloriesburnt" int2,
                        "totaltimemiliseconds" bigint
                    );

CREATE TABLE "user" (
                        "id" SERIAL PRIMARY KEY,
                        "levelofadvancement_id" int,
                        "gender_id" int,
                        "name" varchar(30),
                        "secondname" varchar(30),
                        "surname" varchar(30),
                        "birthdate" date,
                        "avatarimagepath" varchar(50)
                    );

CREATE TABLE "user_usertrainingplan_training_usertrainingresults" (
                        "user_id" int not null,
                        "usertrainingplan_id" int,
                        "training_id" int,
                        "usertrainingresults_id" int
                    );

CREATE TABLE "usertrainingplan" (
                        "id" int,
                        "swimmingstyle_id" int,
                        "title" varchar(50),
                        "description" text,
                        "repetitions" int2,
                        "breakseconds" int2,
                        "length" int2,
                        "fulfilled" boolean,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

CREATE TABLE "swimmingstyle" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text
                    );

CREATE TABLE "pool" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text,
                        "width" int2,
                        "length" int2,
                        "depth" int2,
                        "createddate" timestamp not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

CREATE UNIQUE INDEX ON "account" ("user_id");
CREATE UNIQUE INDEX ON "usertrainingresults" ("id");
CREATE UNIQUE INDEX ON "usertrainingplan" ("id");
ALTER TABLE "account" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");
ALTER TABLE "experienceentry" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "condition" ADD FOREIGN KEY ("achievement_id") REFERENCES "achievement" ("id");
ALTER TABLE "user_achievement" ADD FOREIGN KEY ("achievement_id") REFERENCES "achievement" ("id");
ALTER TABLE "user_achievement" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user" ADD FOREIGN KEY ("levelofadvancement_id") REFERENCES "levelofadvancement" ("id");
ALTER TABLE "user" ADD FOREIGN KEY ("gender_id") REFERENCES "gender" ("id");
ALTER TABLE "training" ADD FOREIGN KEY ("pool_id") REFERENCES "pool" ("id");
ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("training_id") REFERENCES "training" ("id");
ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "usertrainingplan" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("usertrainingplan_id") REFERENCES "usertrainingplan" ("id");
ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("usertrainingresults_id") REFERENCES "usertrainingresults" ("id");
ALTER TABLE "usertrainingresults" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
ALTER TABLE "training" ADD FOREIGN KEY ("coach_user_id") REFERENCES "user" ("id");
ALTER TABLE "sessionhistory" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
ALTER TABLE "training" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
ALTER TABLE "pool" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
ALTER TABLE "usertrainingplan" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
ALTER TABLE "experienceentry" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
ALTER TABLE "account" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");