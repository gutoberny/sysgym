/**
 * @typedef {Object} Exercise
 * @property {string} id - ID único do exercício
 * @property {string} name - Nome do exercício
 * @property {string} sets - Número de séries
 * @property {string} weight - Peso em kg
 * @property {string} reps - Número de repetições
 * @property {string} notes - Observações ou instruções
 * @property {string} muscleGroup - Grupo muscular
 */

/**
 * @typedef {Object} WorkoutTemplate
 * @property {number} id - ID único do modelo
 * @property {string} name - Nome do modelo de treino
 * @property {string} description - Descrição do modelo de treino
 * @property {string} type - Tipo de treino (beginner, intermediate, advanced)
 * @property {Exercise[]} exercises - Lista de exercícios
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} date - Data da entrada no formato YYYY-MM-DD
 * @property {string} action - Tipo de ação (created, updated, activated, deactivated)
 * @property {string} description - Descrição da alteração
 */

/**
 * @typedef {Object} StudentWorkout
 * @property {number} id - ID único do treino
 * @property {number} studentId - ID do aluno
 * @property {string} studentName - Nome do aluno
 * @property {string} workoutName - Nome do treino
 * @property {Exercise[]} exercises - Lista de exercícios
 * @property {HistoryEntry[]} history - Histórico do treino
 * @property {string} lastUpdated - Data da última atualização
 * @property {string} observations - Observações do treino
 * @property {boolean} active - Status do treino (ativo ou inativo)
 */

export const WorkoutType = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
};

export const MuscleGroup = {
  SHOULDERS: "shoulders",
  CHEST: "chest",
  BACK: "back",
  BICEPS: "biceps",
  TRICEPS: "triceps",
  LEGS: "legs",
  CORE: "core",
};

export const HistoryAction = {
  CREATED: "created",
  UPDATED: "updated",
  ACTIVATED: "activated",
  DEACTIVATED: "deactivated",
};
