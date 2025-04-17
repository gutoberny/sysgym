import React from "react";
import { Box } from "@mui/material";
import StudentForm from "./StudentForm";
import ExerciseTable from "./ExerciseTable";
import Observations from "./Observations";

function WorkoutView({
  studentData,
  setStudentData,
  exercises,
  setExercises,
  observations,
  setObservations,
}) {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Formulário de informações do aluno */}
      <StudentForm studentData={studentData} setStudentData={setStudentData} />

      {/* Tabela de exercícios com abas para grupos musculares */}
      <ExerciseTable exercises={exercises} setExercises={setExercises} />

      {/* Seção de observações */}
      <Observations
        observations={observations}
        setObservations={setObservations}
      />
    </Box>
  );
}

export default WorkoutView;
