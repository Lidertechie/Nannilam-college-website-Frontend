import { Box, Paper, Typography, IconButton } from "@mui/material";
import { PictureAsPdf, Download } from "@mui/icons-material";
import PageHeader from "./Pageheader";

// Replace `fileUrl` with real download links from your API/storage once available.
const SYLLABUS = [
  { course: "B.Sc Computer Science", year: "2025-26", fileUrl: "#" },
  { course: "B.Com General", year: "2025-26", fileUrl: "#" },
  { course: "B.A. English", year: "2025-26", fileUrl: "#" },
  { course: "M.Sc Computer Science", year: "2025-26", fileUrl: "#" },
];

const SyllabusPage = () => (
  <Box>
    <PageHeader title="SYLLABUS" subtitle="Download course syllabus documents" />

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {SYLLABUS.map((item) => (
        <Paper
          key={item.course}
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #EDEFF3",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "#FEF2F2",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PictureAsPdf fontSize="small" />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>{item.course}</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Academic Year {item.year}
            </Typography>
          </Box>

          <IconButton
            component="a"
            href={item.fileUrl}
            download
            sx={{ color: "#3B82F6" }}
          >
            <Download />
          </IconButton>
        </Paper>
      ))}
    </Box>
  </Box>
);

export default SyllabusPage;