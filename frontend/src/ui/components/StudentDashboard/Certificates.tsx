"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";
import jsPDF from "jspdf";

interface Certificate {
  id: string;
  course_id: string;
  issued_at: string;
  courses: {
    title: string;
  };
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      // console.log("Certified user data:", user);

      setUserName(user.user_metadata?.display_name || "Student");

      // Fetch certificates with course info
      const { data, error } = await supabase
        .from("certificates")
        .select("id, course_id, issued_at, courses(title)")
        .eq("user_id", user.id);

      if (!error && data) {
        setCertificates(data as unknown as Certificate[]);
      } else {
        console.error("Error fetching certificates:", error);
      }
    };
    fetchData();
  }, []);

  const generateCertificate = (courseTitle: string, issuedAt: string) => {
    const doc = new jsPDF("landscape", "pt", "a4"); // landscape A4

    // Colors
    const primaryColor = "#2E86C1";
    const borderColor = "#000000";

    // Page size
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 🖼️ Border
    doc.setDrawColor(borderColor);
    doc.setLineWidth(4);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40); // outer border

    // 🏫 Title
    doc.setFont("times", "bold");
    doc.setFontSize(30);
    doc.setTextColor(primaryColor);
    doc.text("Certificate of Completion", pageWidth / 2, 100, {
      align: "center",
    });

    // Subtitle
    doc.setFontSize(18);
    doc.setTextColor("#000");
    doc.text("This is proudly presented to", pageWidth / 2, 160, {
      align: "center",
    });

    // 👤 Student name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(26);
    doc.setTextColor("#111");
    doc.text(userName, pageWidth / 2, 210, { align: "center" });

    // Course line
    doc.setFont("times", "normal");
    doc.setFontSize(18);
    doc.text("for successfully completing the course", pageWidth / 2, 260, {
      align: "center",
    });

    // 📚 Course name
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text(courseTitle, pageWidth / 2, 300, { align: "center" });

    // 📅 Issue date
    doc.setFontSize(14);
    doc.text(
      `Issued on: ${new Date(issuedAt).toDateString()}`,
      pageWidth / 2,
      350,
      { align: "center" }
    );

    // ✍️ Signature
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.text("Instructor Signature", pageWidth - 180, pageHeight - 100, {
      align: "center",
    });
    doc.line(
      pageWidth - 280,
      pageHeight - 110,
      pageWidth - 80,
      pageHeight - 110
    ); // signature line

    // 🏅 Logo (optional)
    // If you have a logo image: (must be base64 or public URL)
    // doc.addImage("/logo.png", "PNG", 40, 40, 100, 100);

    // Save
    doc.save(`${courseTitle}_certificate.pdf`);
  };

  return (
    <Box className="grid grid-cols-2 gap-4">
      {certificates.length > 0 ? (
        certificates.map((c) => (
          <Card key={c.id}>
            <CardContent>
              <Typography variant="h6">{c.courses.title}</Typography>
              <Typography color="text.secondary">
                Issued on: {new Date(c.issued_at).toDateString()}
              </Typography>
              <Button
                onClick={() =>
                  generateCertificate(c.courses.title, c.issued_at)
                }
                variant="contained"
              >
                Download Certificate
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No certificates yet.</Typography>
      )}
    </Box>
  );
}
