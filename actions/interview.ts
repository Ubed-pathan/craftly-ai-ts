"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type QuestionResult = {
  question: string;
  answer: string; // correct answer
  userAnswer: string | null;
  isCorrect: boolean;
  explanation: string;
};

export type AssessmentResult = {
  id: string;
  userId: string;
  quizScore: number;
  questions: QuestionResult[];
  category: string;
  improvementTip: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateQuiz(): Promise<QuizQuestion[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry ?? ""
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText) as { questions: QuizQuestion[] };

    return quiz.questions;
  } catch (error) {
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(
  questions: QuizQuestion[],
  answers: Array<string | null>,
  score: number
): Promise<AssessmentResult> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults: QuestionResult[] = questions.map((q, index) => {
    const userAnswer = answers[index] ?? null;
    return {
      question: q.question,
      answer: q.correctAnswer,
      userAnswer,
      isCorrect: userAnswer != null && q.correctAnswer === userAnswer,
      explanation: q.explanation,
    };
  });

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  let improvementTip: string | null = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer ?? ""}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry ?? ""} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);
      improvementTip = tipResult.response.text().trim();
    } catch (_error) {
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults as unknown as any, // Prisma Json[]
        category: "Technical",
        improvementTip,
      },
    });

    // Coerce to typed result shape
    return assessment as unknown as AssessmentResult;
  } catch (_error) {
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments(): Promise<AssessmentResult[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments as unknown as AssessmentResult[];
  } catch (_error) {
    throw new Error("Failed to fetch assessments");
  }
}
