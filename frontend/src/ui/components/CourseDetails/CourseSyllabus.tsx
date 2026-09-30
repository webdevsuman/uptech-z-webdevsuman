import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface SyllabusItem {
  id: string;
  title: string;
  content: string;
}

export default function CourseSyllabus({
  syllabus,
}: {
  syllabus: SyllabusItem[];
}) {
  return (
    <div className="md:px-30 px-5">
      <Card sx={{ mt: 4 }} elevation={0} className="border-1 border-gray-400 px-10">
        <CardContent>
          <Typography className="!font-semibold !mb-2" variant="h6">Course Syllabus</Typography>
          {syllabus.map((item, idx) => (
            <Accordion key={item.id} className="border-1 border-gray-200">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1">
                  {idx + 1}. {item.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="gray">{item.content}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
