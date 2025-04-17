// Dados de exercícios organizados por grupos musculares
const exerciseData = {
  // Exercícios para ombro
  shoulders: [
    { id: "s1", key: "lateralRaise" },
    { id: "s2", key: "frontalRaise" },
    { id: "s3", key: "developmentMachine" },
    { id: "s4", key: "shoulderPress" },
    { id: "s5", key: "facePull" },
    { id: "s6", key: "reverseFlyes" },
  ],

  // Exercícios para peito
  chest: [
    { id: "c1", key: "benchPress" },
    { id: "c2", key: "inclineBenchPress" },
    { id: "c3", key: "declineBenchPress" },
    { id: "c4", key: "chestPress" },
    { id: "c5", key: "chestFlyes" },
    { id: "c6", key: "pushups" },
  ],

  // Exercícios para costas
  back: [
    { id: "b1", key: "pullUp" },
    { id: "b2", key: "latPulldown" },
    { id: "b3", key: "seatedRow" },
    { id: "b4", key: "deadlift" },
    { id: "b5", key: "backExtension" },
    { id: "b6", key: "tBar" },
  ],

  // Exercícios para bíceps
  biceps: [
    { id: "bi1", key: "bicepsCurl" },
    { id: "bi2", key: "hammerCurl" },
    { id: "bi3", key: "concentrationCurl" },
    { id: "bi4", key: "preacherCurl" },
    { id: "bi5", key: "cableCurl" },
  ],

  // Exercícios para tríceps
  triceps: [
    { id: "t1", key: "tricepsExtension" },
    { id: "t2", key: "tricepsPushdown" },
    { id: "t3", key: "closeGripBenchPress" },
    { id: "t4", key: "skullCrushers" },
    { id: "t5", key: "dips" },
  ],

  // Exercícios para pernas
  legs: [
    { id: "l1", key: "squat" },
    { id: "l2", key: "legPress" },
    { id: "l3", key: "legExtension" },
    { id: "l4", key: "legCurl" },
    { id: "l5", key: "calfRaise" },
    { id: "l6", key: "lunges" },
  ],

  // Exercícios para abdômen
  core: [
    { id: "a1", key: "crunches" },
    { id: "a2", key: "legRaises" },
    { id: "a3", key: "plank" },
    { id: "a4", key: "russianTwist" },
    { id: "a5", key: "mountainClimbers" },
  ],
};

export default exerciseData;
