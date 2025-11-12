import { UserProfile, DietRecommendation } from "../types";

export async function getDietRecommendation(profile: UserProfile): Promise<DietRecommendation> {
  try {
    const response = await fetch('/api/diet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: DietRecommendation = await response.json();
    
    if (!result || !result.planTitle || !result.details) {
        throw new Error("Invalid data structure received from the server.");
    }
    
    return result;

  } catch (error) {
    console.error("Error in getDietRecommendation flow:", error);
    if (error instanceof Error) {
        throw new Error(`Could not fetch diet recommendation. ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the diet recommendation.");
  }
}
