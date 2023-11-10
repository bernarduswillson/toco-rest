-- CreateTable
CREATE TABLE "admin" (
    "admin_id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "profile_img" VARCHAR(255),
    "desc" TEXT,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "exercise_id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "exe_name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255),
    "difficulty" VARCHAR(255),

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("exercise_id")
);

-- CreateTable
CREATE TABLE "question" (
    "question_id" SERIAL NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "option" (
    "option_id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "option" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "option_pkey" PRIMARY KEY ("option_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "username" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "exe_name" ON "exercise"("exe_name");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("exercise_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- INJECT DATA
INSERT INTO "admin" ("email", "username", "password", "profile_img", "desc") VALUES ('bw@gmail.com', 'bw', '$2b$10$Yvq54vRFzIm..Wylqh/kauSQetp38pj6bq7MOkQj6SxhPGYoJgOrO', '', 'I am a developer');

INSERT INTO "exercise" ("language_id", "exe_name", "category", "difficulty") VALUES (1, 'Hello World', 'Basic', 'Easy');
INSERT INTO "exercise" ("language_id", "exe_name", "category", "difficulty") VALUES (2, 'FizzBuzz', 'Basic', 'Easy');
INSERT INTO "exercise" ("language_id", "exe_name", "category", "difficulty") VALUES (2, 'Factorial', 'Basic', 'Easy');
INSERT INTO "exercise" ("language_id", "exe_name", "category", "difficulty") VALUES (2, 'Palindrome', 'Basic', 'Easy');
INSERT INTO "exercise" ("language_id", "exe_name", "category", "difficulty") VALUES (3, 'Reverse String', 'Basic', 'Easy');
INSERT INTO "exercise" ("language_id", "exe_name", "category", "difficulty") VALUES (3, 'Reverse Integer', 'Basic', 'Easy');

INSERT INTO "question" ("exercise_id", "question") VALUES (1, 'Apakah Ditra jago memancing?');
INSERT INTO "question" ("exercise_id", "question") VALUES (1, 'Rod apa yang dipakai oleh Ditra?');
INSERT INTO "question" ("exercise_id", "question") VALUES (2, 'Rod apa yang dipakai oleh Bewe?');

INSERT INTO "option" ("question_id", "option") VALUES (1, 'Yes');
INSERT INTO "option" ("question_id", "option", "is_correct") VALUES (1, 'No', true);
INSERT INTO "option" ("question_id", "option") VALUES (2, 'Spinning');
INSERT INTO "option" ("question_id", "option") VALUES (2, 'Feeder');
INSERT INTO "option" ("question_id", "option") VALUES (2, 'Floater');
INSERT INTO "option" ("question_id", "option", "is_correct") VALUES (2, 'Semua Benar', true);
INSERT INTO "option" ("question_id", "option") VALUES (2, 'Tidak ada yang benar');
INSERT INTO "option" ("question_id", "option") VALUES (3, 'Spinning');
INSERT INTO "option" ("question_id", "option") VALUES (3, 'Feeder');
INSERT INTO "option" ("question_id", "option") VALUES (3, 'Floater');
INSERT INTO "option" ("question_id", "option", "is_correct") VALUES (3, 'Semua Benar', true);
INSERT INTO "option" ("question_id", "option") VALUES (3, 'Tidak ada yang benar');

