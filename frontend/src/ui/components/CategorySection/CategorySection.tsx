import { Box, Grid, Paper, Typography } from "@mui/material";
import { useCategories } from "@/hooks/react-query/useCategories";
import {
  Code,
  Palette,
  BusinessCenter,
  Campaign,
  AccountBalance,
  FitnessCenter,
  AspectRatio,
  Psychology,
  MusicNote,
  Camera,
} from "@mui/icons-material";
import { JSX } from "react";
import { TitleSubheading } from "../TitleSubheading";

const iconMap: Record<string, JSX.Element> = {
  Code: <Code fontSize="large" color="primary" />,
  Palette: <Palette fontSize="large" color="primary" />,
  BusinessCenter: <BusinessCenter fontSize="large" color="primary" />,
  Campaign: <Campaign fontSize="large" color="primary" />,
  AccountBalance: <AccountBalance fontSize="large" color="primary" />,
  FitnessCenter: <FitnessCenter fontSize="large" color="primary" />,
  AspectRatio: <AspectRatio fontSize="large" color="primary" />,
  Psychology: <Psychology fontSize="large" color="primary" />,
  MusicNote: <MusicNote fontSize="large" color="primary" />,
  Camera: <Camera fontSize="large" color="primary" />,
};

const CategorySection = ({ onSelect }: { onSelect?: (id: string) => void }) => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) return <Typography>Loading categories...</Typography>;
  if (error)
    return <Typography color="error">Failed to load categories</Typography>;

  return (
    <Box sx={{ my: 6 }}>
      <TitleSubheading
        title="Explore Categories"
        subheading="All the skills you need in one place. From critical skills to technical topics, UpTech-Z supports your professional development."
      />
      <Grid container spacing={3} className="mt-5">
        {categories?.map((cat) => (
          <Grid key={cat.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              className="flex items-center justify-center gap-2"
              onClick={() => {
                onSelect?.(String(cat.id)); //Scroll to course list part
                const targetElement = document.getElementById("courses");
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
              sx={{
                py: 2,
                textAlign: "center",
                borderRadius: 2,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              }}
              elevation={2}
            >
              {/* Later replace with Supabase Storage icon if available */}
              {iconMap[cat.icon] || <Code fontSize="large" color="primary" />}

              <Typography variant="h6">{cat.name}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
