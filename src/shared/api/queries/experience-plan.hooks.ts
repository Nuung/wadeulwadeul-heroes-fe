/**
 * Experience Plan TanStack Query Hooks
 */

import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  generateExperiencePlan,
  suggestMaterials,
  suggestSteps,
} from "./experience-plan.api";
import type {
  ExperienceRequest,
  ExperienceResponse,
  MaterialsSuggestionRequest,
  MaterialsSuggestionResponse,
  StepsSuggestionRequest,
  StepsSuggestionResponse,
} from "./experience-plan.types";

/**
 * Generate Experience Plan Mutation
 */
export const useGenerateExperiencePlanMutation = (
  options?: Omit<
    UseMutationOptions<ExperienceResponse, Error, ExperienceRequest>,
    "mutationFn"
  >
) => {
  return useMutation({
    ...options,
    mutationFn: generateExperiencePlan,
  });
};

/**
 * Suggest Materials Mutation
 */
export const useSuggestMaterialsMutation = (
  options?: Omit<
    UseMutationOptions<MaterialsSuggestionResponse, Error, MaterialsSuggestionRequest>,
    "mutationFn"
  >
) => {
  return useMutation({
    ...options,
    mutationFn: suggestMaterials,
  });
};

/**
 * Suggest Steps Mutation
 */
export const useSuggestStepsMutation = (
  options?: Omit<
    UseMutationOptions<StepsSuggestionResponse, Error, StepsSuggestionRequest>,
    "mutationFn"
  >
) => {
  return useMutation({
    ...options,
    mutationFn: suggestSteps,
  });
};
