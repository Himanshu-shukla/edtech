// Utility to fetch Trustpilot reviews from the backend using env base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export async function getTrustpilotReviewsData() {
  const res = await fetch(`${API_BASE_URL}/trustpilot-reviews`);
  if (!res.ok) throw new Error('Failed to fetch Trustpilot reviews');
  return res.json();
}
