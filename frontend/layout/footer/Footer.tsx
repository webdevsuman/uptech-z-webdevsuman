"use client";
import { Container, Typography, Link, Grid } from "@mui/material";
import { useHomeAssets } from "@/hooks/react-query/useHomeAssets";

export default function Footer() {
  const { data } = useHomeAssets();
  const footerData = data?.find((item) => item.section === "footer");

  const title = footerData?.title || "UpTech-Z";
  const description = footerData?.description || "Learn anything, anytime, anywhere.";

  return (
    <footer id="footer" className="bg-gray-900 text-gray-300 py-8 mt-12">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2">
              {description}
            </Typography>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              Explore
            </Typography>
            <ul className="space-y-1">
              <li>
                <Link href="#" color="inherit" underline="hover">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit" underline="hover">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit" underline="hover">
                  About Us
                </Link>
              </li>
            </ul>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              Support
            </Typography>
            <ul className="space-y-1">
              <li>
                <Link href="#" color="inherit" underline="hover">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit" underline="hover">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit" underline="hover">
                  FAQs
                </Link>
              </li>
            </ul>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              Legal
            </Typography>
            <ul className="space-y-1">
              <li>
                <Link href="#" color="inherit" underline="hover">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>

        <Typography variant="body2" align="center" className="!mt-6">
          © {new Date().getFullYear()} UpTech-Z. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}
