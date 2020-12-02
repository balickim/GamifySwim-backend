CREATE TABLE "account" (
                        "id" SERIAL PRIMARY KEY,
                        "role_id" int,
                        "levelofadvancement_id" int,
                        "gender_id" int,
                        "usernamehash" CHARACTER(64),
                        "passwordhash" CHARACTER(64),
                        "sessionid" CHARACTER(36),
                        "name" varchar(30),
                        "secondname" varchar(30),
                        "surname" varchar(30),
                        "birthdate" date,
                        "avatarimagepath" varchar(50),
                        "createddate" timestamptz not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

CREATE TABLE "sessionhistory" (
                        "sessionid" CHARACTER(36),
                        "account_id" int,
                        "sessiondatestart" timestamptz not null default CURRENT_TIMESTAMP,
                        "sessiondatestop" timestamptz,
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
                        "account_id" int not null,
                        "title" varchar(50),
                        "amount" int,
                        "createddate" timestamptz not null default CURRENT_TIMESTAMP,
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
                        "account_id" int not null,
                        "awardeddate" timestamptz
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
                        "trainingdatestart" timestamptz,
                        "trainingdatestop" timestamptz,
                        "title" varchar(50),
                        "description" text,
                        "held" boolean,
                        "createddate" timestamptz not null default CURRENT_TIMESTAMP,
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

CREATE TABLE "user_usertrainingplan_training_usertrainingresults" (
                        "account_id" int not null,
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
                        "createddate" timestamptz not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

                    INSERT INTO public.usertrainingplan
                    (id, swimmingstyle_id, title, description, repetitions, breakseconds, length, fulfilled, createddate, createdbyaccont_id, deleted)
                    VALUES(0, 1, 'Domyślny', 'Domyślny plan treningowy', 10, 50, 50, false, CURRENT_TIMESTAMP, 1, false);

                    INSERT INTO public.usertrainingplan
                    (id, swimmingstyle_id, title, description, repetitions, breakseconds, length, fulfilled, createddate, createdbyaccont_id, deleted)
                    VALUES(0, 2, 'Domyślny', 'Domyślny plan treningowy', 5, 50, 50, false, CURRENT_TIMESTAMP, 1, false);

                    INSERT INTO public.usertrainingplan
                    (id, swimmingstyle_id, title, description, repetitions, breakseconds, length, fulfilled, createddate, createdbyaccont_id, deleted)
                    VALUES(0, 3, 'Domyślny', 'Domyślny plan treningowy', 5, 50, 50, false, CURRENT_TIMESTAMP, 1, false);

                    INSERT INTO public.usertrainingplan
                    (id, swimmingstyle_id, title, description, repetitions, breakseconds, length, fulfilled, createddate, createdbyaccont_id, deleted)
                    VALUES(0, 4, 'Domyślny', 'Domyślny plan treningowy', 15, 150, 50, false, CURRENT_TIMESTAMP, 1, false);

CREATE TABLE "swimmingstyle" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text,
                        "deleted" boolean
                    );

                    INSERT INTO swimmingstyle(title, deleted, description) VALUES('dowolny', false, 'Kraulem pływamy na brzuchu. Jest to najszybszy ze stylów pływackich. Wyprostowane nogi pracują cały czas, natomiast ręce naprzemiennie przenosimy nad wodą i zagarniamy pod siebie wodę. Praca nóg zaczyna się od ud, a stopy skierowane są do wewnątrz. W kraulu ważne jest, by praca nóg była jednostajna, ponieważ to nogi odpowiadają tutaj za naszą stabilność. Styl ten angażuje partie mięśni rąk, barków oraz nóg, bardzo dobry wybór, jeżeli chodzi o odchudzanie się. Odchudzanie przez pływanie jest bardzo korzystne dla naszego ciała, ponieważ nie obciąża tak naszych stawów, a wręcz przeciwnie, jeszcze może je rozluźnić.');
                    INSERT INTO swimmingstyle(title, deleted, description) VALUES('klasyczny', false, 'Styl klasyczny, często zwany żabką, jest jednym z najbardziej popularnych stylów, jakie zobaczymy idąc na basen. Nie oznacza to, że jest on prosty. Styl ten wymaga bardzo dobrej synchronizacji pracy rąk i nóg. Zazwyczaj na basenach, 80% procent osób pływa tym stylem błędnie ( zbyt zamaszyste ruchy rękami, oraz głowa w wodzie zadarta do góry). Pływamy na brzuchu, zanurzając i wynurzając głowę z wody. Równo z wynurzeniem, następuje odepchnięcie ramion ( dłonie zataczają łuk ) i nóg na boki. Nogi w fazie napędowej powinny być ustawione pod kątem prostym w stosunku do łydek, a w fazie gdzie przygotowujemy się do „kopnięcia”, powinny być skierowane do wewnątrz. Żabka jest wymagającym stylem, bardzo dobrze rozwija mięśnie nóg i górnych partii ciała.');
                    INSERT INTO swimmingstyle(title, deleted, description) VALUES('motylkowy', false, 'Delfin to najbardziej wymagający styl pływacki. Jest on przeznaczony dla osób zaawansowanych, a nawet profesjonalistów. By poprawnie pływać tym stylem, nasze ręce i nogi muszą być na tyle mocne, by poprawnie wykonywać ruchy. Ruch jaki wykonujemy w tym stylu kojarzy się z ruchem delfina, stąd jego nazwa. Pod wodą odbywa się charakterystyczne kopnięcie, a ręce w tym stylu odbywają równoległy ruch w momencie wynurzania głowy, po czym po zanurzeniu rąk prowadzi się je do tyłu i zaczyna się kolejny cykl. Styl jest ten trudny. Zalicza się go do jednego z szybszych stylów pływackich. Różne style pływackie są przeznaczone dla osób o różnym stopniu zaawansowania. Na początek zaleca się naukę pływania stylem grzbietowym i kraulem. Pozwolą one na odpowiednie rozwinięcie mięśni nóg i rąk oraz dobrych nawyków. Pływanie jest bardzo relaksujące, odciąża zmęczone po całym dniu stawy, dodatkowo uważa się, że jest to jedna z najlepszych form spalania tłuszczu, z uwagi na opór jaki stawia woda, bardziej się męczymy.');
                    INSERT INTO swimmingstyle(title, deleted, description) VALUES('grzbietowy', false, 'Jest to jeden z łatwiejszych stylów pływania. Styl ten odbywa się leżąc, na plecach, przez co nasza twarz nie jest zanurzona w wodzie. Tak samo jak w kraulu, odbywa się intensywna praca nóg, utrzymująca nas w równowadze. Ręce pracują naprzemiennie ( dłoń ułożona w pozycji płaskie, kciuk pierwszy wynurza się z wody, a po ruchu do wody zanurza się jako pierwszy mały palec). Nogi powinny być rozluźnione, nie za sztywne. Styl grzbietowy poprawia mięśnie nóg, oraz mięśnie odpowiadające za stabilizacje ciała ( mięśnie przy kręgosłupie). Poleca się go często osobom z dolegliwościami odcinka lędźwiowego kręgosłupa. Styl grzbietowy, to najlepszy styl jeżeli chodzi o pływanie w ciąży. Wielu ciężarnym kobietom bardzo pomaga on ukoić ból, oraz rozluźnić zmęczone po całym dniu plecy, a najbardziej odcinek lędźwiowy kręgosłupa.');

CREATE TABLE "pool" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text,
                        "width" int2,
                        "length" int2,
                        "depth" int2,
                        "createddate" timestamptz not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

                    INSERT INTO pool
                    (title, description, width, length, "depth", createddate, createdbyaccont_id, deleted)
                    VALUES('domyślny', 'Domyślny basen', 25, 50, 5, CURRENT_TIMESTAMP, 1, false);


CREATE UNIQUE INDEX ON "usertrainingresults" ("id");
-- CREATE UNIQUE INDEX ON "usertrainingplan" ("id");
ALTER TABLE "account" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");
ALTER TABLE "experienceentry" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
ALTER TABLE "condition" ADD FOREIGN KEY ("achievement_id") REFERENCES "achievement" ("id");
ALTER TABLE "user_achievement" ADD FOREIGN KEY ("achievement_id") REFERENCES "achievement" ("id");
ALTER TABLE "user_achievement" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
ALTER TABLE "account" ADD FOREIGN KEY ("levelofadvancement_id") REFERENCES "levelofadvancement" ("id");
ALTER TABLE "account" ADD FOREIGN KEY ("gender_id") REFERENCES "gender" ("id");
ALTER TABLE "training" ADD FOREIGN KEY ("pool_id") REFERENCES "pool" ("id");
ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("training_id") REFERENCES "training" ("id");
ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
ALTER TABLE "usertrainingplan" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
-- ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("usertrainingplan_id") REFERENCES "usertrainingplan" ("id");
ALTER TABLE "user_usertrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("usertrainingresults_id") REFERENCES "usertrainingresults" ("id");
ALTER TABLE "usertrainingresults" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
ALTER TABLE "training" ADD FOREIGN KEY ("coach_user_id") REFERENCES "account" ("id");
ALTER TABLE "sessionhistory" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
-- ALTER TABLE "training" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
-- ALTER TABLE "pool" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
-- ALTER TABLE "usertrainingplan" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
-- ALTER TABLE "experienceentry" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");
-- ALTER TABLE "account" ADD FOREIGN KEY ("createdbyaccont_id") REFERENCES "account" ("id");

CREATE VIEW vexperience AS 
                        SELECT account_id,
                        sum(amount) as totalamount,
                        floor(floor(25 + sqrt(625 + 100 * sum(amount))) / 50) as level,  
                        ((floor(25 + sqrt(625 + 100 * sum(amount))) / 50) - (floor(floor(25 + sqrt(625 + 100 * sum(amount))) / 50))) * 10 as barpercent
                        FROM experienceentry e
                        group by account_id;