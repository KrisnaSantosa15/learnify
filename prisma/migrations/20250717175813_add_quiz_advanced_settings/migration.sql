-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "allowRetakes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "certificateEligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instantFeedback" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "randomizeQuestions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showExplanations" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showProgress" BOOLEAN NOT NULL DEFAULT true;
