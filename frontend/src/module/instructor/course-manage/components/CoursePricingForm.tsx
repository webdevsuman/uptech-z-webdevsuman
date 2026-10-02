"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  MoneyOff as FreeIcon,
  MonetizationOn as PaidIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  coursePricingSchema,
  CoursePricingFormData,
} from "../zod/coursePricing.zod";
import { ICourse } from "@/typescript/interface/course.interface";
import { useUpdateCourse } from "@/hooks/react-query/useUpdateCourse";
import { sToast } from "@/components/ui/alert/stoast";

interface CoursePricingFormProps {
  course: ICourse;
  onSaved?: () => void;
  onProceedToPublish?: () => void;
}

const PRICING_TIERS = [
  { label: "Tier 1 — ₹499 ($9.99)", value: 499 },
  { label: "Tier 2 — ₹799 ($14.99)", value: 799 },
  { label: "Tier 3 — ₹999 ($19.99)", value: 999 },
  { label: "Tier 4 — ₹1,499 ($29.99)", value: 1499 },
  { label: "Tier 5 — ₹1,999 ($39.99)", value: 1999 },
  { label: "Tier 6 — ₹2,499 ($49.99)", value: 2499 },
  { label: "Tier 7 — ₹3,499 ($69.99)", value: 3499 },
];

export const CoursePricingForm: React.FC<CoursePricingFormProps> = ({
  course,
  onSaved,
  onProceedToPublish,
}) => {
  const { mutateAsync: updateCourse, isPending: isSaving } = useUpdateCourse(
    course._id || course.id || ""
  );

  const initialPrice = course.price ?? 0;
  const initialType: "free" | "paid" = initialPrice > 0 ? "paid" : "free";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CoursePricingFormData>({
    resolver: zodResolver(coursePricingSchema),
    defaultValues: {
      priceType: initialType,
      price: initialPrice,
    },
  });

  const priceType = watch("priceType");
  const currentPrice = watch("price");

  const savePricing = async (data: CoursePricingFormData, proceed: boolean = false) => {
    try {
      const finalPrice = data.priceType === "free" ? 0 : Number(data.price);
      await updateCourse({ price: finalPrice });
      sToast.success("Course pricing updated successfully!");
      if (onSaved) onSaved();
      if (proceed && onProceedToPublish) {
        onProceedToPublish();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update course pricing";
      sToast.error(message);
    }
  };

  return (
    <Paper
      elevation={0}
      component="form"
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
          Pricing & Currency
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please select the pricing tier for your course. If you offer this course for
          free, you cannot charge for it later.
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Step 3.1: Free vs Paid Radio Cards */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
          {/* Free Card */}
          <Card
            onClick={() => {
              setValue("priceType", "free");
              setValue("price", 0);
            }}
            sx={{
              flex: 1,
              cursor: "pointer",
              border: "2px solid",
              borderColor: priceType === "free" ? "primary.main" : "divider",
              bgcolor:
                priceType === "free"
                  ? (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(86, 36, 208, 0.12)"
                        : "rgba(86, 36, 208, 0.04)"
                  : "background.paper",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: priceType === "free" ? "primary.main" : "action.hover",
                    color: priceType === "free" ? "#FFFFFF" : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FreeIcon sx={{ fontSize: "1.25rem" }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Free Course
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Available to all learners for ₹0
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem", mt: 1 }}>
                Ideal for introductory tutorials, community outreach, and brand building.
              </Typography>
            </CardContent>
          </Card>

          {/* Paid Card */}
          <Card
            onClick={() => {
              setValue("priceType", "paid");
              if (currentPrice <= 0) {
                setValue("price", 999);
              }
            }}
            sx={{
              flex: 1,
              cursor: "pointer",
              border: "2px solid",
              borderColor: priceType === "paid" ? "primary.main" : "divider",
              bgcolor:
                priceType === "paid"
                  ? (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(86, 36, 208, 0.12)"
                        : "rgba(86, 36, 208, 0.04)"
                  : "background.paper",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: priceType === "paid" ? "primary.main" : "action.hover",
                    color: priceType === "paid" ? "#FFFFFF" : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PaidIcon sx={{ fontSize: "1.25rem" }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Paid Course
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Charge students for lifetime access
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem", mt: 1 }}>
                Monetize your premium content with paid enrollment and certificates.
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Step 3.2: Price Selector if Paid */}
        {priceType === "paid" && (
          <Box sx={{ p: 3, bgcolor: "action.hover", borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Select Price Tier
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Choose a standard tier or enter a custom amount.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "flex-start" }}>
              {/* Preset Tier Dropdown */}
              <TextField
                select
                size="small"
                label="Preset Tier"
                value={
                  PRICING_TIERS.some((t) => t.value === Number(currentPrice))
                    ? Number(currentPrice)
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    setValue("price", Number(e.target.value));
                  }
                }}
                sx={{ minWidth: 240 }}
              >
                <MenuItem value="" disabled>
                  <em>Custom amount</em>
                </MenuItem>
                {PRICING_TIERS.map((tier) => (
                  <MenuItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Price Numeric Input */}
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    type="number"
                    label="Price Amount"
                    error={Boolean(errors.price)}
                    helperText={errors.price?.message}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(val);
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontWeight: 700 }}>₹</Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ width: { xs: "100%", sm: 200 } }}
                  />
                )}
              />
            </Stack>
          </Box>
        )}

        {/* Action Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Current Tier: {priceType === "free" ? "Free (₹0)" : `Paid (₹${currentPrice})`}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              disabled={isSaving}
              onClick={handleSubmit((data) => savePricing(data, false))}
              sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
            >
              {isSaving ? <CircularProgress size={18} /> : "Save Pricing"}
            </Button>

            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={isSaving}
              onClick={handleSubmit((data) => savePricing(data, true))}
              endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
              sx={{ textTransform: "none", fontWeight: 700, px: 3 }}
            >
              Save & Continue to Publish
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};
