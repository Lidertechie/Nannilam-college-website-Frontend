import { Box, Paper, Typography, Chip } from "@mui/material";
import { School } from "@mui/icons-material";
import PageHeader from "./Pageheader";

// Replace with real data from your API once available.
const COURSES = [
  { name: "B.Sc Computer Science", duration: "3 Years", seats: 60 },
  { name: "B.Com General", duration: "3 Years", seats: 80 },
  { name: "B.A. English", duration: "3 Years", seats: 50 },
  { name: "M.Sc Computer Science", duration: "2 Years", seats: 30 },
];

const CoursePage = () => (
  <Box>
    <PageHeader title="COURSE" subtitle="Courses offered by the college" />

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 2,
      }}
    >
      {COURSES.map((course) => (
        <Paper
          key={course.name}
          elevation={0}
          sx={{ p: 3, borderRadius: 3, border: "1px solid #EDEFF3" }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#EEF2FF",
              color: "#3B82F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <School fontSize="small" />
          </Box>

          <Typography sx={{ fontWeight: 700, mb: 1 }}>{course.name}</Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip label={course.duration} size="small" />
            <Chip label={`${course.seats} seats`} size="small" variant="outlined" />
          </Box>
        </Paper>
      ))}
    </Box>
  </Box>
);

export default CoursePage;