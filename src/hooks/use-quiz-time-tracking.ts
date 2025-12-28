"use client";

import { useEffect, useRef, useState } from "react";
import type { Question } from "@/types/quiz.type";

interface UseQuizTimeTrackingProps {
  questions?: Question[];
  currentQuestionIndex: number;
}

export function useQuizTimeTracking({
  questions,
  currentQuestionIndex,
}: UseQuizTimeTrackingProps) {
  const questionStartTimeRef = useRef<Record<string, number>>({});
  const questionTimeSpentRef = useRef<Record<string, number>>({});
  const [currentTimeSpent, setCurrentTimeSpent] = useState(0);

  // Track time when question changes
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      // Stop tracking previous question if exists
      const prevQuestionId = Object.keys(questionStartTimeRef.current).find(
        (id) => id !== currentQuestion.id,
      );
      if (prevQuestionId) {
        const startTime = questionStartTimeRef.current[prevQuestionId];
        if (startTime) {
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          questionTimeSpentRef.current[prevQuestionId] =
            (questionTimeSpentRef.current[prevQuestionId] || 0) + timeSpent;
          delete questionStartTimeRef.current[prevQuestionId];
        }
      }

      // Start tracking current question
      if (!questionStartTimeRef.current[currentQuestion.id]) {
        questionStartTimeRef.current[currentQuestion.id] = Date.now();
      }
    }
  }, [currentQuestionIndex, questions]);

  // Update current time spent every second
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const startTime = questionStartTimeRef.current[currentQuestion.id];
    if (!startTime) {
      setCurrentTimeSpent(0);
      return;
    }

    // Calculate initial time
    const previousTime =
      questionTimeSpentRef.current[currentQuestion.id] || 0;
    const initialTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    setCurrentTimeSpent(previousTime + initialTimeSpent);

    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const newTime = previousTime + timeSpent;
      setCurrentTimeSpent(newTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentQuestionIndex, questions]);

  // Clean up on unmount
  useEffect(() => {
    const startTimesSnapshot = questionStartTimeRef.current;
    const timeSpentSnapshot = questionTimeSpentRef.current;

    return () => {
      const startTimes = { ...startTimesSnapshot };
      const timeSpent = { ...timeSpentSnapshot };

      Object.keys(startTimes).forEach((questionId) => {
        const startTime = startTimes[questionId];
        if (startTime) {
          const spent = Math.floor((Date.now() - startTime) / 1000);
          timeSpent[questionId] = (timeSpent[questionId] || 0) + spent;
        }
      });

      questionTimeSpentRef.current = timeSpent;
    };
  }, []);

  const finalizeCurrentQuestion = (questionId: string) => {
    const startTime = questionStartTimeRef.current[questionId];
    if (startTime) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      questionTimeSpentRef.current[questionId] =
        (questionTimeSpentRef.current[questionId] || 0) + timeSpent;
      delete questionStartTimeRef.current[questionId];
    }
  };

  const getTimeSpent = (questionId: string): number => {
    return questionTimeSpentRef.current[questionId] || 0;
  };

  return {
    currentTimeSpent,
    finalizeCurrentQuestion,
    getTimeSpent,
  };
}

