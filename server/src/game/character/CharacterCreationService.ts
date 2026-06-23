import type { CharacterProfile } from "../types/gameTypes";
import type { CharacterCreationInput } from "./CharacterTypes";
import { CharacterCreationValidator } from "./CharacterCreationValidator";
import { StartingProfileService } from "./StartingProfileService";

export type CharacterCreationResult = {
  playerName: string;
  profile: CharacterProfile;
};

export class CharacterCreationService {
  constructor(
    private readonly validator = new CharacterCreationValidator(),
    private readonly startingProfile = new StartingProfileService()
  ) {}

  createProfile(input: CharacterCreationInput): CharacterCreationResult {
    this.validator.validate(input);
    const profile = this.startingProfile.buildProfile(input);
    return { playerName: profile.displayName, profile };
  }
}
