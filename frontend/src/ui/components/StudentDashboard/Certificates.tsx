"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { useMyEnrollments, IMyEnrollment } from "@/hooks/react-query/useEnrollment";
import { useAuth } from "@/context/AuthContext";

export default function Certificates() {
  const { data: enrollments = [], isLoading, isError } = useMyEnrollments();
  const { user } = useAuth();
  const [selectedEnrollment, setSelectedEnrollment] = useState<IMyEnrollment | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const studentName = user?.name || "Student Learner";

  const renderCertificateOnCanvas = (courseTitle: string, dateStr: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas size (16:9 high resolution)
    canvas.width = 1600;
    canvas.height = 900;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1600, 900);
    bgGradient.addColorStop(0, "#ffffff");
    bgGradient.addColorStop(1, "#f9fafb");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1600, 900);

    // Decorative Borders
    ctx.strokeStyle = "#5624D0";
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1540, 840);

    ctx.strokeStyle = "#b4690e";
    ctx.lineWidth = 4;
    ctx.strokeRect(46, 46, 1508, 808);

    // Header Badge
    ctx.fillStyle = "#5624D0";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("UPTECH-Z ACADEMY", 800, 140);

    // Certificate Title
    ctx.fillStyle = "#1c1d1f";
    ctx.font = "bold 56px serif";
    ctx.fillText("CERTIFICATE OF COMPLETION", 800, 220);

    // Subtitle
    ctx.fillStyle = "#6a6f73";
    ctx.font = "italic 24px serif";
    ctx.fillText("This is proudly presented to", 800, 290);

    // Student Name
    ctx.fillStyle = "#5624D0";
    ctx.font = "bold 64px serif";
    ctx.fillText(studentName, 800, 380);

    // Underline below name
    ctx.strokeStyle = "#b4690e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(500, 410);
    ctx.lineTo(1100, 410);
    ctx.stroke();

    // Body text
    ctx.fillStyle = "#4b5563";
    ctx.font = "24px sans-serif";
    ctx.fillText("for successfully completing the comprehensive online curriculum for", 800, 480);

    // Course Title
    ctx.fillStyle = "#111827";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(courseTitle, 800, 560);

    // Date & Signatures
    ctx.fillStyle = "#374151";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Issued Date: ${dateStr}`, 200, 750);

    ctx.textAlign = "right";
    ctx.fillText("Authorized Signature", 1400, 750);

    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(1180, 720);
    ctx.lineTo(1400, 720);
    ctx.stroke();

    ctx.font = "italic 26px serif";
    ctx.fillStyle = "#5624D0";
    ctx.fillText("UpTech-Z Team", 1360, 705);
  };

  const handleOpenCertificate = (enrollment: IMyEnrollment) => {
    setSelectedEnrollment(enrollment);
    const dateFormatted = new Date(enrollment.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setTimeout(() => {
      renderCertificateOnCanvas(enrollment.course.title, dateFormatted);
    }, 150);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedEnrollment) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${selectedEnrollment.course.title.replace(/\s+/g, "_")}_Certificate.png`;
    link.click();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={40} sx={{ color: "#5624D0" }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="error" variant="body1">
          Failed to load certificates.
        </Typography>
      </Box>
    );
  }

  if (enrollments.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 4,
          borderRadius: 3,
          border: "1px dashed",
          borderColor: "grey.300",
          bgcolor: "grey.50",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <WorkspacePremiumIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          No certificates earned yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enroll in and complete courses to earn official certificates of completion!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {enrollments.map((item) => {
          const course = item.course;
          if (!course) return null;
          const issuedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <Card
              key={item._id}
              elevation={2}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                p: 2,
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <WorkspacePremiumIcon sx={{ color: "#b4690e", fontSize: 32 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1c1d1f" }}>
                      {course.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Issued: {issuedDate}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WorkspacePremiumIcon />}
                    onClick={() => handleOpenCertificate(item)}
                    sx={{
                      bgcolor: "#5624D0",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#401b9c" },
                    }}
                  >
                    View & Download Certificate
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Certificate Modal Dialog */}
      <Dialog
        open={Boolean(selectedEnrollment)}
        onClose={() => setSelectedEnrollment(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Certificate of Completion
          </Typography>
          <IconButton onClick={() => setSelectedEnrollment(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: "center", p: 2 }}>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                bgcolor: "#5624D0",
                fontWeight: 700,
                textTransform: "none",
                px: 4,
                "&:hover": { bgcolor: "#401b9c" },
              }}
            >
              Download High-Res Certificate
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
