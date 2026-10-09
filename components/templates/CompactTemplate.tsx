import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";

const ACCENT = "#2d3748";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 36,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    lineHeight: 1.4,
  },
  header: { alignItems: "center", marginBottom: 14 },
  name: {
    fontSize: 20,
    lineHeight: 1.2,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: ACCENT,
  },
  jobTitle: { fontSize: 10.5, lineHeight: 1.2, color: "#555", marginTop: 6 },
  contact: { fontSize: 8.5, color: "#555", marginTop: 8, textAlign: "center" },
  section: { marginBottom: 13 },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: ACCENT,
    borderBottom: `0.75pt solid ${ACCENT}`,
    paddingBottom: 2,
    marginBottom: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold" },
  italic: { fontFamily: "Helvetica-Oblique", color: "#555" },
  muted: { color: "#666" },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 9 },
  bulletText: { flex: 1 },
  item: { marginBottom: 8 },
});

export default function CompactTemplate({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, customSections } = data;

  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ]
    .filter(Boolean)
    .join("  •  ");

  const cleanSkills = skills.map((s) => s.trim()).filter(Boolean);

  return (
    <Document title={`${personal.fullName} - Resume`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName}</Text>
          {personal.jobTitle ? (
            <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
          ) : null}
          {contact ? <Text style={styles.contact}>{contact}</Text> : null}
        </View>

        {/* Summary */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{summary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((job) => (
              <View key={job.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{job.company}</Text>
                  <Text style={styles.muted}>
                    {job.startDate} - {job.endDate || "Present"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.italic}>{job.role}</Text>
                  {job.location ? (
                    <Text style={styles.muted}>{job.location}</Text>
                  ) : null}
                </View>
                {job.bullets.filter(Boolean).map((b, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((ed) => (
              <View key={ed.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{ed.school}</Text>
                  <Text style={styles.muted}>
                    {[ed.startDate, ed.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {ed.degree ? <Text style={styles.italic}>{ed.degree}</Text> : null}
                {ed.details ? <Text style={styles.muted}>{ed.details}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {cleanSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{cleanSkills.join("  |  ")}</Text>
          </View>
        )}

        {/* Custom sections */}
        {customSections.map((sec) => {
          const items = sec.items.filter(Boolean);
          if (items.length === 0) return null;
          return (
            <View key={sec.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {items.map((item, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}