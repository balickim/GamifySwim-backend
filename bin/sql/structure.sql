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
                        "title" varchar(250),
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
                        "claimed" boolean,
                        "claimeddate" timestamptz not null default CURRENT_TIMESTAMP
                    );

CREATE TABLE "achievement" (
                        "id" SERIAL PRIMARY KEY,
                        "badgeid" int,
                        "exppoints" int,
                        "title" varchar(50),
                        "description" text,
                        "condition" int,
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

CREATE TABLE "user_accounttrainingplan_training_usertrainingresults" (
                        "account_id" int,
                        "present" boolean,
                        "account_trainingplan_id" int,
                        "fulfilled" boolean,
                        "training_id" int,
                        "usertrainingresults_id" int
                    );

CREATE TABLE "account_trainingplan" (
                        "id" SERIAL PRIMARY KEY,
                        "title" varchar(50),
                        "description" text,
                        "createddate" timestamptz not null default CURRENT_TIMESTAMP,
                        "createdbyaccont_id" int,
                        "deleted" boolean
                    );

CREATE TABLE "trainingplanentry" (
                        "id" int,
                        "swimmingstyle_id" int,
                        "repetitions" int2,
                        "breakseconds" int2,
                        "length" int2,
                        "order" int2
                    );

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

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(0, 100, 'Początkujący wymoczek', 'Przepłyń łącznie 5000m', 5000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(0, 1000, 'Uczeń', 'Przepłyń łącznie 30 000m', 30000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(0, 5000, 'Mistz', 'Przepłyń łącznie 100 000m', 100000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(0, 20000, 'Wielki mistrz', 'Przepłyń łącznie 200 000m', 200000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(0, 50000, 'Jak to w ogóle możliwe??', 'Przepłyń łącznie 500 000m', 500000, '');

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(1, 100, 'Będzie lepiej', 'Weź udział w swoim pierwszym treningu', 1, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(1, 500, 'Widzisz? Mamy postęp', 'Weź udział w pięciu treningach', 5, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(1, 2000, 'No popatrz.. dałeś radę', 'Weź udział w dwudziestu treningach', 20, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(1, 10000, 'Tyle to już chyba przesada!', 'Weź udział w stu treningach', 100, '');

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(2, 100, 'Party starter', 'Wykonaj swój pierwszy plan treningowy', 1, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(2, 500, 'Całkiem nieźle', 'Wykonaj pięc planów treningowych', 5, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(2, 2000, 'Czujesz poprawę formy?', 'Wykonaj dwadzieścia planów treningowych', 20, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(2, 10000, 'Forma nie do zdarcia', 'Wykonaj sto planów treningowych', 100, '');

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(3, 10, 'Normalka', 'Użyj jednego stylu pływania w treningu', 1, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(3, 200, 'Trochę lepiej..', 'Wykorzystaj dwa style w treningu', 2, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(3, 3000, 'No już nieźle', 'Wykorzystaj trzy style w treningu', 3, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(3, 10000, 'Człowiek orkiestra', 'Wykorzystaj pięć stylów w treningu', 5, '');

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(4, 500, 'Dobry początek', 'Loguj się do aplikacji 2 dni pod rząd', 2, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(4, 2000, 'Bardzo dobrze', 'Loguj się do aplikacji 5 dni pod rząd', 5, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(4, 10000, 'Niezwykłe', 'Loguj się do aplikacji 15 dni pod rząd', 15, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(4, 30000, 'Pilny uczeń', 'Loguj się do aplikacji 30 dni pod rząd', 30, '');

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(5, 500, 'Wymoczek', 'Przepłyń przynajmniej 100m na treningu', 100, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(5, 1500, 'Uczeń', 'Przepłyń przynajmniej 500m na treningu', 500, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(5, 4000, 'Kozak', 'Przepłyń przynajmniej 1000m na treningu', 1000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(5, 10000, 'Mistrz', 'Przepłyń przynajmniej 2000m na treningu', 2000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(5, 30000, 'Posejdon', 'Przepłyń przynajmniej 3000m na treningu', 3000, '');

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(7, 500, 'Tygodniowy Pelias', 'Przepłyń przynajmniej 1000m w tygodniu', 1000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(7, 2500, 'Tygodniowy Orion', 'Przepłyń przynajmniej 3000m w tygodniu', 3000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(7, 5000, 'Tygodniowy Rode', 'Przepłyń przynajmniej 6000m w tygodniu', 6000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(7, 15000, 'Tygodniowy Tryton', 'Przepłyń przynajmniej 10 000m w tygodniu', 10000, '');

INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(8, 500, 'Miesięczny Pelias', 'Przepłyń przynajmniej 5000m w miesiącu', 5000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(8, 2500, 'Miesięczny Orion', 'Przepłyń przynajmniej 15 000m w miesiącu', 15000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(8, 5000, 'Miesięczny Rode', 'Przepłyń przynajmniej 30 000m w miesiącu', 30000, '');
INSERT INTO public.achievement (badgeid, exppoints, title, description, "condition", imagepath) VALUES(8, 15000, 'Miesięczny Tryton', 'Przepłyń przynajmniej 50 000m w miesiącu', 50000, '');

CREATE UNIQUE INDEX ON "usertrainingresults" ("id");

ALTER TABLE "account" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");
ALTER TABLE "experienceentry" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
ALTER TABLE "user_achievement" ADD FOREIGN KEY ("achievement_id") REFERENCES "achievement" ("id");
ALTER TABLE "user_achievement" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
ALTER TABLE "account" ADD FOREIGN KEY ("levelofadvancement_id") REFERENCES "levelofadvancement" ("id");
ALTER TABLE "account" ADD FOREIGN KEY ("gender_id") REFERENCES "gender" ("id");
ALTER TABLE "training" ADD FOREIGN KEY ("pool_id") REFERENCES "pool" ("id");
ALTER TABLE "user_accounttrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("training_id") REFERENCES "training" ("id");
ALTER TABLE "user_accounttrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");
ALTER TABLE "trainingplanentry" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
ALTER TABLE "user_accounttrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("account_trainingplan_id") REFERENCES "account_trainingplan" ("id");
ALTER TABLE "trainingplanentry" ADD FOREIGN KEY ("id") REFERENCES "account_trainingplan" ("id");
-- ALTER TABLE "user_accounttrainingplan_training_usertrainingresults" ADD FOREIGN KEY ("usertrainingresults_id") REFERENCES "usertrainingresults" ("id");
ALTER TABLE "usertrainingresults" ADD FOREIGN KEY ("swimmingstyle_id") REFERENCES "swimmingstyle" ("id");
ALTER TABLE "training" ADD FOREIGN KEY ("coach_user_id") REFERENCES "account" ("id");
ALTER TABLE "sessionhistory" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("id");

CREATE VIEW vexperience AS 
    SELECT account_id,
    sum(amount) as totalamount,
    floor(floor(25 + sqrt(625 + 100 * sum(amount))) / 50) as level,  
    ((floor(25 + sqrt(625 + 100 * sum(amount))) / 50) - (floor(floor(25 + sqrt(625 + 100 * sum(amount))) / 50))) * 10 as barpercent
    FROM experienceentry e
    group by account_id;

CREATE VIEW vaccount AS
    select a.id, r.title as role, l.title as levelofadvancement, g.gendername, a."name", a.secondname, a.surname, a.birthdate, a.avatarimagepath, createddate, a.createdbyaccont_id, a.deleted  
    from "account" a
    left join "role" r on a.role_id = r.id 
    left join levelofadvancement l on a.levelofadvancement_id = l.id 
    left join gender g on a.gender_id = g.id;

CREATE VIEW vtraining AS
	select t.id, p.title as pooltitle, t.coach_user_id as trainerid, CONCAT (a.name, ' ', a.surname) as trainerfullname, t.trainingdatestart, t.trainingdatestop, t.title, t.description, t.held, CONCAT (a2.name, ' ', a2.surname) as createdby, t.createddate, t.deleted 
	from training t
	left join pool p on t.pool_id = p.id
	join account a on t.coach_user_id = a.id 
	join account a2 on t.createdbyaccont_id = a2.id;