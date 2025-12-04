/**
 * Experience Plan API Functions
 */

import { apiPost } from "..";
import type {
  ExperienceRequest,
  ExperienceResponse,
  MaterialsSuggestionRequest,
  MaterialsSuggestionResponse,
  StepsSuggestionRequest,
  StepsSuggestionResponse,
} from "./experience-plan.types";

/**
 * Generate Experience Plan
 */
export const generateExperiencePlan = async (data: ExperienceRequest) => {
  return apiPost<ExperienceResponse, ExperienceRequest>({
    endpoint: "/api/v1/experience-plan/",
    data,
  });
};

/**
 * Suggest Materials
 */
export const suggestMaterials = async (data: MaterialsSuggestionRequest) => {
  return apiPost<MaterialsSuggestionResponse, MaterialsSuggestionRequest>({
    endpoint: "/api/v1/experience-plan/materials-suggestion",
    data,
  });
};

/**
 * Suggest Steps
 */
export const suggestSteps = async (data: StepsSuggestionRequest) => {
  return apiPost<StepsSuggestionResponse, StepsSuggestionRequest>({
    endpoint: "/api/v1/experience-plan/steps-suggestion",
    data,
  });
};
