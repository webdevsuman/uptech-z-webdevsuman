"use client";
import { Button, Container, Typography } from "@mui/material";
import styles from "./styles/hero.module.css";
import Link from "next/link";

interface HeroProps {
  title?: string;
  description?: string;
}

export default function Hero({
  title = "Learn Without Limits",
  description = "Explore thousands of courses from industry experts and level up your career.",
}: HeroProps) {
  return (
    <section className={`${styles.hero} py-20 text-white`}>
      <Container
        maxWidth="lg"
        className="p-10 text-center bg-blend-overlay bg-black/30 rounded-2xl"
      >
        <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" className="mb-6!">
          {description}
        </Typography>
        <Link href="/courses">
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: "white", color: "black", fontWeight: "bold" }}
          >
            Browse Courses
          </Button>
        </Link>
      </Container>
    </section>
  );
}
