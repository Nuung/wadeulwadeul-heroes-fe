/**
 * Experience Plan Domain Types
 */

export interface ExperienceRequest {
  category: string;
  years_of_experience: string;
  job_description: string;
  materials: string;
  location: string;
  duration_minutes: string;
  capacity: string;
  price_per_person: string;
}

export interface ExperienceResponse {
  template: string;
}

export interface MaterialsSuggestionRequest {
  category: string;
  years_of_experience: string;
  job_description: string;
}

export interface MaterialsSuggestionResponse {
  suggestion: string;
}

export interface StepsSuggestionRequest {
  category: string;
  years_of_experience: string;
  job_description: string;
  materials: string;
}

export interface StepsSuggestionResponse {
  suggestion: string;
}
