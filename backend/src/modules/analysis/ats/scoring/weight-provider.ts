import { WEIGHT_PROFILES, WeightProfile, DEFAULT_PROFILE } from '../../config/weights.config';

export function getWeightProfile(profileId: string): WeightProfile {
  return WEIGHT_PROFILES[profileId] ?? DEFAULT_PROFILE;
}
