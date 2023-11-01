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
