import editionsData from "../data/editions.json";
import rolesData from "../data/roles.json";

class DataManager {
  constructor() {
    this.editions = editionsData;
    this.roles = rolesData;
  }

  getEditionFromEditionId(editionId) {
    return this.editions.find((edition) => edition.id === editionId);
  }

  getRolesByEditionId(editionId) {
    return this.roles.filter((role) => role.edition === editionId);
  }

  getNormalRolesByEditionId(editionId) {
    return this.roles.filter(
      (role) => role.edition === editionId && role.team !== "traveler",
    );
  }
}

const dataManager = new DataManager();

export default dataManager;
