"use client";
import { Box, TextField, MenuItem, Grid, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { TitleSubheading } from "../TitleSubheading";

interface SearchFilters {
  search: string;
  categoryId: string | undefined;
  category: string;
  rating: string;
  price: string;
  level: string;
}

export default function SearchBar({
  onSearch,
}: {
  onSearch: (filters: SearchFilters) => void;
}) {
  const categories = ["All", "Development", "Design", "Marketing", "Business"];
  const ratings = ["Any", "4★ & above", "3★ & above"];
  const prices = ["All", "Free", "Paid"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const { control, handleSubmit, reset } = useForm<SearchFilters>({
    defaultValues: {
      search: "",
      category: "All",
      rating: "Any",
      price: "All",
      level: "All",
    },
  });

  const onSubmit = (data: SearchFilters) => {
    onSearch(data); // send filters to parent
    //Scroll to course list part
    const targetElement = document.getElementById("courses");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        bgcolor: "background.paper",
        p: 2,
        borderRadius: 2,
        boxShadow: 4,
        maxWidth: "100%",
        my: 4,
      }}
    >
      <div className="mb-8">

      <TitleSubheading title="Looking something specific?" subheading="Search your favourite courses here." />
      </div>
      <Grid container spacing={2}>
        {/* Search Input */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Search courses"
                variant="outlined"
                size="small"
              />
            )}
          />
        </Grid>

        {/* Category */}
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Category"
                variant="outlined"
                size="small"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Rating */}
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Rating"
                variant="outlined"
                size="small"
              >
                {ratings.map((rate) => (
                  <MenuItem key={rate} value={rate}>
                    {rate}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Price */}
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Price"
                variant="outlined"
                size="small"
              >
                {prices.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Level */}
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Level"
                variant="outlined"
                size="small"
              >
                {levels.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Buttons */}
        <Grid
          size={{ xs: 12 }}
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              reset({
                search: "",
                category: "All",
                rating: "Any",
                price: "All",
                level: "All",
              })
            }
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
