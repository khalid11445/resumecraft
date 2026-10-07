import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#222",
    lineHeight: 1.4,
  },
  header: { marginBottom: 14, borderBottom: "1pt solid #222", paddingBottom: 8 },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold" },
  jobTitle: { fontSize: 12, color: "#555", marginTop: 2 },
  contact: { fontSize: 9, color: "#555", marginTop: 4 },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#666" },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  item: { marginBottom: 7 },
});

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, customSections } = data;

  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ]
    .filter(Boolean)
    .join("  |  ");

  return (
    <Document title={`${personal.fullName} - Resume`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName}</Text>
          {personal.jobTitle ? (
            <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
          ) : null}
          <Text style={styles.contact}>{contact}</Text>
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
                  <Text style={styles.bold}>
                    {job.role}, {job.company}
                  </Text>
                  <Text style={styles.muted}>
                    {job.startDate} - {job.endDate || "Present"}
                  </Text>
                </View>
                {job.location ? (
                  <Text style={styles.muted}>{job.location}</Text>
                ) : null}
                {job.bullets.map((b, i) => (
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
                {ed.degree ? <Text>{ed.degree}</Text> : null}
                {ed.details ? <Text style={styles.muted}>{ed.details}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{skills.join("  •  ")}</Text>
          </View>
        )}

        {/* Custom sections (licenses, certifications, projects...) */}
        {customSections.map((sec) => (
          <View key={sec.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            {sec.items.map((item, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}