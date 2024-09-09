<script setup lang="js">
import Token from "./CharacterToken.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { computed, watch, onMounted, ref } from "vue";
import dataManager from "@/services/dataManager";
import { useGameStore } from "@/stores/game";
import { useStoryTellerStore } from "@/stores/storyTeller";

const gameStore = useGameStore();
const storyTellerStore = useStoryTellerStore();

const selectedRoles = ref(storyTellerStore.selectedRoles);
const availableRoles = ref(
  dataManager.getNormalRolesByEditionId(gameStore.script),
);

const setupRoles = () => {
  storyTellerStore.selectedRoles = selectedRoles.value;
  storyTellerStore.assignCharacters();
};

const toggleRole = (roleId) => {
  let hasRoleBeenAdded = selectedRoles.value.find((role) => role.id === roleId);

  if (hasRoleBeenAdded)
    selectedRoles.value = selectedRoles.value.filter(
      (role) => role.id !== roleId,
    );
  else
    selectedRoles.value.push(
      availableRoles.value.find((role) => role.id === roleId),
    );
};

const teamOrder = ["townsfolk", "outsider", "minion", "demon"];

const groupedRoles = computed(() => {
  const rolesByTeam = availableRoles.value.reduce((groups, role) => {
    if (!groups[role.team]) {
      groups[role.team] = [];
    }
    groups[role.team].push(role);
    return groups;
  }, {});

  const sortedTeamKeys = Object.keys(rolesByTeam).sort((a, b) => {
    return teamOrder.indexOf(a) - teamOrder.indexOf(b);
  });

  return sortedTeamKeys.reduce((sortedGroups, team) => {
    sortedGroups[team] = rolesByTeam[team];
    return sortedGroups;
  }, {});
});

onMounted(() => {
  watch(
    () => gameStore.script,
    (newValue) => {
      availableRoles.value = dataManager.getNormalRolesByEditionId(newValue);
    },
  );
});
</script>

<template>
  <Dialog
    @update:open="
      (open) => {
        if (!open) setupRoles();
      }
    "
  >
    <DialogTrigger as-child>
      <Button>Setup Roles</Button>
    </DialogTrigger>
    <DialogContent class="dialog-content">
      <DialogHeader>
        <DialogTitle>Choose your roles</DialogTitle>
        <DialogDescription>
          These are the roles that will be in play during your game
        </DialogDescription>
      </DialogHeader>
      <div class="dialog-body">
        <ul class="teams-list">
          <li
            v-for="(roles, team) in groupedRoles"
            :key="team"
            class="team-group"
          >
            <!-- <div class="team-header">{{ team.charAt(0).toUpperCase() + team.slice(1) }}</div> -->
            <div class="roles-grid">
              <div
                v-for="role in roles"
                :key="role.id"
                @click="toggleRole(role.id)"
                :class="{
                  selected: selectedRoles.some(
                    (selectedRole) => selectedRole.id === role.id,
                  ),
                  'greyed-out': !selectedRoles.some(
                    (selectedRole) => selectedRole.id === role.id,
                  ),
                }"
                class="role-item"
              >
                <Token class="token" :role="role"></Token>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <DialogFooter>
        <DialogTrigger as-child>
          <Button variant="outline">Cancel</Button>
        </DialogTrigger>
        <DialogTrigger as-child>
          <Button>Finish setup</Button>
        </DialogTrigger>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.dialog-content {
  max-width: 70vw;
  max-height: 80vh;
  width: auto;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
}

.dialog-body {
  max-width: 70vw;
  max-height: 80vh;
  width: auto;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.team-group {
  margin-bottom: 0.2em;
}

.roles-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2em;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
}

.role-item {
  flex: 1 1 calc((100% - 6 * 0.5em) / 7);
  max-width: calc((100% - 6 * 0.5em) / 7);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.icon-container {
  position: relative;
  margin-bottom: 0.2em;
}

.background-icon {
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.role-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border-radius: 50%;
}

.role-name {
  text-align: center;
  font-weight: bold;
}

.greyed-out {
  color: grey;
  opacity: 0.55;
}
</style>
