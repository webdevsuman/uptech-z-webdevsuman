"use client";
import { Button, Container, Typography } from "@mui/material";
import styles from "./styles/hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <section className={`${styles.hero} py-20 text-white`}>
      <Container
        maxWidth="lg"
        className="p-10 text-center bg-blend-overlay bg-black/30 rounded-2xl"
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Learn Without Limits
        </Typography>
        <Typography variant="h6" className="!mb-6">
          Explore thousands of courses from industry experts and level up your
          career.
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
