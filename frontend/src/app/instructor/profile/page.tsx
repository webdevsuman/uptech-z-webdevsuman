"use client";

import React from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  Badge as RoleIcon,
  Event as CalendarIcon,
  VerifiedUser as VerifiedIcon,
} from "@mui/icons-material";
import { useProfile } from "@/hooks/react-query/useProfile";
import { ProfileForm } from "@/module/instructor/profile/components/ProfileForm";
import { getRoleName } from "@/utils/functions/auth.lib";

export default function InstructorProfilePage() {
  const { data: user, isLoading, isError, refetch } = useProfile();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Unable to Load Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Could not retrieve your instructor account information. Please check your session.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const roleName = getRoleName(user.role);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
          Instructor Profile
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Manage your public educator identity, headline, and bio.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Profile Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ProfileForm user={user} onSaved={() => refetch()} />
        </Grid>

        {/* Sidebar Account Overview */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Account Information
              </Typography>

              <Stack spacing={2.5}>
                {/* Role Chip */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display:"block"  }}>
                    Platform Role
                  </Typography>
                  <Chip
                    icon={<RoleIcon sx={{ fontSize: "1rem !important" }} />}
                    label={roleName?.toUpperCase() || "INSTRUCTOR"}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Divider />

                {/* Email Verification Status */}
                <Box>
                  <Typography variant="caption" color="text.secondary"  sx={{ mb: 0.5,display:"block" }}>
                    Account Status
                  </Typography>
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: "1rem !important" }} />}
                    label={user.isVerified ? "Email Verified" : "Pending Verification"}
                    color={user.isVerified ? "success" : "warning"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Divider />

                {/* Registration Date */}
                <Box>
                  <Typography variant="caption" color="text.secondary"  sx={{ mb: 0.5,display:"block" }}>
                    Instructor Since
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{alignItems:"center"}}>
                    <CalendarIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {memberSince}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
